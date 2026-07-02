import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { createOrder } from "@/lib/printful";

export async function POST(req: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !webhookSecret) {
    console.log("[stripe webhook] no stripe or webhook secret — mocked");
    return NextResponse.json({ received: true, mocked: true });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    console.error("[stripe webhook] missing stripe-signature header");
    return NextResponse.json(
      { error: "missing stripe-signature header" },
      { status: 400 },
    );
  }

  const body = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const msg = (err as Error).message;
    console.error("[stripe webhook] signature verification failed:", msg);
    return NextResponse.json(
      { error: `signature verification failed: ${msg}` },
      { status: 400 },
    );
  }

  console.log(`[stripe webhook] received ${event.type} (${event.id})`);

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true, type: event.type });
  }

  try {
    const sessionSummary = event.data.object;
    const session = await stripe.checkout.sessions.retrieve(sessionSummary.id, {
      expand: [
        "line_items.data.price.product",
        "shipping_details",
        "customer_details",
      ],
    });
    const lineItems = session.line_items ?? { data: [] };

    const items = lineItems.data
      .map((li) => {
        const product = li.price?.product as Stripe.Product | undefined;
        const variantId = product?.metadata?.variantId;
        if (!variantId) return null;
        return { variantId, quantity: li.quantity ?? 1 };
      })
      .filter((i): i is { variantId: string; quantity: number } => i !== null);

    console.log(
      `[stripe webhook] session ${session.id} has ${items.length} items`,
    );

    if (items.length === 0) {
      console.warn(
        "[stripe webhook] no items with variantId metadata — skipping Printful order",
      );
      return NextResponse.json({
        received: true,
        skipped: "no items with variantId metadata",
      });
    }

    const ship =
      (
        session as Stripe.Checkout.Session & {
          shipping_details?: {
            name?: string | null;
            address?: {
              line1?: string | null;
              city?: string | null;
              state?: string | null;
              postal_code?: string | null;
              country?: string | null;
            } | null;
          };
        }
      ).shipping_details ?? null;
    const email = session.customer_details?.email ?? session.customer_email;

    if (!ship?.address || !email) {
      console.warn(
        `[stripe webhook] missing shipping or email — ship=${!!ship?.address} email=${!!email}`,
      );
      return NextResponse.json({
        received: true,
        skipped: "missing shipping or email",
      });
    }

    try {
      const result = await createOrder({
        email,
        items,
        shipping: {
          name: ship.name ?? "",
          address1: ship.address.line1 ?? "",
          city: ship.address.city ?? "",
          state: ship.address.state ?? "",
          zip: ship.address.postal_code ?? "",
          country: ship.address.country ?? "US",
        },
      });
      console.log(`[stripe webhook] printful order created: ${result.orderId}`);
      return NextResponse.json({ received: true, printful: result });
    } catch (err) {
      const msg = (err as Error).message;
      console.error("[stripe webhook] printful order failed:", msg);
      return NextResponse.json(
        { error: `printful order failed: ${msg}` },
        { status: 500 },
      );
    }
  } catch (err) {
    const msg = (err as Error).message;
    console.error("[stripe webhook] unexpected error:", msg);
    return NextResponse.json(
      { error: `unexpected error: ${msg}` },
      { status: 500 },
    );
  }
}

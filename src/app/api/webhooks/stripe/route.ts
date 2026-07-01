import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { createOrder } from "@/lib/printful";

export async function POST(req: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !webhookSecret) {
    return NextResponse.json({ received: true, mocked: true });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "no signature" }, { status: 400 });
  }

  const body = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    return NextResponse.json(
      { error: `webhook verification failed: ${(err as Error).message}` },
      { status: 400 },
    );
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true });
  }

  const sessionSummary = event.data.object;
  const session = await stripe.checkout.sessions.retrieve(sessionSummary.id, {
    expand: ["line_items.data.price.product", "shipping_details", "customer_details"],
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

  const ship =
    (session as Stripe.Checkout.Session & {
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
    }).shipping_details ?? null;
  const email = session.customer_details?.email ?? session.customer_email;

  if (!ship?.address || !email) {
    return NextResponse.json({ received: true, skipped: "missing shipping" });
  }

  await createOrder({
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

  return NextResponse.json({ received: true });
}

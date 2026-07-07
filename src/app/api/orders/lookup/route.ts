import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";

type Body = {
  email: string;
  reference: string;
};

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const email = (body.email ?? "").trim().toLowerCase();
  const reference = (body.reference ?? "").trim();

  if (!email || !reference) {
    return NextResponse.json(
      { error: "Enter both your email address and the order reference." },
      { status: 400 },
    );
  }

  if (!reference.startsWith("cs_")) {
    return NextResponse.json(
      {
        error:
          "That doesn't look like an order reference. It should start with cs_ and come from your Stripe receipt email.",
      },
      { status: 400 },
    );
  }

  if (!stripe) {
    return NextResponse.json(
      { error: "Order lookup is not available right now." },
      { status: 503 },
    );
  }

  let session: Stripe.Checkout.Session;
  try {
    session = await stripe.checkout.sessions.retrieve(reference, {
      expand: ["line_items.data.price.product"],
    });
  } catch {
    // Return a generic message so we don't reveal whether the ID exists.
    return NextResponse.json(
      { error: "No order matches that email and reference." },
      { status: 404 },
    );
  }

  const sessionEmail = (
    session.customer_details?.email ??
    session.customer_email ??
    (session.metadata?.customer_email as string | undefined) ??
    ""
  )
    .trim()
    .toLowerCase();

  if (!sessionEmail || sessionEmail !== email) {
    return NextResponse.json(
      { error: "No order matches that email and reference." },
      { status: 404 },
    );
  }

  if (session.status !== "complete") {
    return NextResponse.json(
      { error: "This order hasn't been fully placed yet." },
      { status: 409 },
    );
  }

  const lineItems = session.line_items?.data ?? [];
  const items = lineItems.map((li) => {
    const product = li.price?.product as Stripe.Product | undefined;
    return {
      name: li.description || product?.name || "Item",
      quantity: li.quantity ?? 1,
      amountTotal: li.amount_total ?? 0,
      thumbnail: product?.images?.[0] ?? null,
    };
  });

  const md = session.metadata ?? {};
  const shipping = md.ship_address1
    ? {
        name: md.ship_name ?? "",
        line1: md.ship_address1 ?? "",
        city: md.ship_city ?? "",
        state: md.ship_state ?? "",
        zip: md.ship_zip ?? "",
        country: md.ship_country ?? "",
      }
    : null;

  return NextResponse.json({
    reference: session.id,
    email: sessionEmail,
    placedAt: session.created,
    status: session.payment_status === "paid" ? "paid" : session.payment_status,
    currency: session.currency,
    amountTotal: session.amount_total ?? 0,
    amountShipping: session.total_details?.amount_shipping ?? 0,
    items,
    shipping,
  });
}

import { NextResponse } from "next/server";
import type { CartItem } from "@/lib/cart-store";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  const { items } = (await req.json()) as { items: CartItem[] };

  if (!items || items.length === 0) {
    return NextResponse.json({ error: "empty cart" }, { status: 400 });
  }

  if (!stripe) {
    const url = new URL("/order-confirmation?mock=1", req.url);
    return NextResponse.json({ url: url.toString() });
  }

  const origin = new URL(req.url).origin;
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: items.map((i) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: `${i.name} · ${i.color} · ${i.size}`,
          metadata: { variantId: i.variantId, slug: i.slug },
        },
        unit_amount: Math.round(i.price * 100),
      },
      quantity: i.quantity,
    })),
    shipping_address_collection: { allowed_countries: ["US"] },
    success_url: `${origin}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/shop`,
    automatic_tax: { enabled: false },
  });

  return NextResponse.json({ url: session.url });
}

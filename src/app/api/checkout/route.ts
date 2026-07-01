import { NextResponse } from "next/server";
import type { CartItem } from "@/lib/cart-store";

export async function POST(req: Request) {
  const { items } = (await req.json()) as { items: CartItem[] };

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    // Mocked checkout — redirect to confirmation with fake session id.
    const url = new URL("/order-confirmation?mock=1", req.url);
    return NextResponse.json({ url: url.toString() });
  }

  // Real Stripe flow — uncomment once STRIPE_SECRET_KEY is set:
  //
  // const stripe = new Stripe(stripeKey);
  // const session = await stripe.checkout.sessions.create({
  //   mode: "payment",
  //   line_items: items.map((i) => ({
  //     price_data: {
  //       currency: "usd",
  //       product_data: { name: `${i.name} · ${i.color} · ${i.size}` },
  //       unit_amount: Math.round(i.price * 100),
  //     },
  //     quantity: i.quantity,
  //   })),
  //   success_url: `${new URL(req.url).origin}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
  //   cancel_url: `${new URL(req.url).origin}/shop`,
  // });
  // return NextResponse.json({ url: session.url });

  return NextResponse.json({ url: "/order-confirmation?mock=1" });
}

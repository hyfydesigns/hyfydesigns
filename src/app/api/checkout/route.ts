import { NextResponse } from "next/server";
import type Stripe from "stripe";
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
          ...(i.image ? { images: [i.image] } : {}),
        },
        unit_amount: Math.round(i.price * 100),
      },
      quantity: i.quantity,
    })),
    shipping_address_collection: { allowed_countries: ["US"] },
    shipping_options: buildShippingOptions(items),
    success_url: `${origin}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/shop`,
    automatic_tax: { enabled: false },
  });

  return NextResponse.json({ url: session.url });
}

function buildShippingOptions(
  items: CartItem[],
): Stripe.Checkout.SessionCreateParams.ShippingOption[] {
  const totalCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const { amountCents, label } = shippingTier(totalCount);
  return [
    {
      shipping_rate_data: {
        type: "fixed_amount",
        fixed_amount: { amount: amountCents, currency: "usd" },
        display_name: label,
        delivery_estimate: {
          minimum: { unit: "business_day", value: 3 },
          maximum: { unit: "business_day", value: 7 },
        },
      },
    },
  ];
}

function shippingTier(itemCount: number): {
  amountCents: number;
  label: string;
} {
  if (itemCount >= 6) {
    return { amountCents: 1099, label: "Standard shipping (6+ items)" };
  }
  if (itemCount >= 3) {
    return { amountCents: 799, label: "Standard shipping (3–5 items)" };
  }
  return { amountCents: 499, label: "Standard shipping (1–2 items)" };
}

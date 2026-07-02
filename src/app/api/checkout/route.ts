import { NextResponse } from "next/server";
import type Stripe from "stripe";
import type { CartItem } from "@/lib/cart-store";
import type { ShippingAddress, ShippingRate } from "@/lib/printful";
import { stripe } from "@/lib/stripe";

type Body = {
  items: CartItem[];
  email?: string;
  address?: ShippingAddress;
  rate?: ShippingRate;
};

export async function POST(req: Request) {
  const { items, email, address, rate } = (await req.json()) as Body;

  if (!items || items.length === 0) {
    return NextResponse.json({ error: "empty cart" }, { status: 400 });
  }

  if (!stripe) {
    const url = new URL("/order-confirmation?mock=1", req.url);
    return NextResponse.json({ url: url.toString() });
  }

  const origin = new URL(req.url).origin;

  const shippingOptions: Stripe.Checkout.SessionCreateParams.ShippingOption[] =
    rate
      ? [
          {
            shipping_rate_data: {
              type: "fixed_amount",
              fixed_amount: {
                amount: Math.round(rate.rate * 100),
                currency: rate.currency.toLowerCase() || "usd",
              },
              display_name: rate.name,
              delivery_estimate: {
                minimum: { unit: "business_day", value: rate.minDays },
                maximum: { unit: "business_day", value: rate.maxDays },
              },
            },
          },
        ]
      : [];

  const metadata: Record<string, string> = {};
  if (address) {
    metadata.ship_name = address.name ?? "";
    metadata.ship_address1 = address.address1;
    metadata.ship_city = address.city;
    metadata.ship_state = address.state;
    metadata.ship_zip = address.zip;
    metadata.ship_country = address.country;
  }
  if (email) metadata.customer_email = email;

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
    // Only collect shipping on Stripe when we don't already have it
    ...(address
      ? { customer_email: email }
      : {
          shipping_address_collection: { allowed_countries: ["US"] },
        }),
    shipping_options: shippingOptions,
    metadata,
    success_url: `${origin}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/checkout`,
    automatic_tax: { enabled: false },
  });

  return NextResponse.json({ url: session.url });
}

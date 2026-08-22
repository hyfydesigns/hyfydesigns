import { NextResponse } from "next/server";
import type Stripe from "stripe";
import type { CartItem } from "@/lib/cart-store";
import type { ShippingAddress, ShippingRate } from "@/lib/printful";
import { stripe } from "@/lib/stripe";
import { getProductsWithContent } from "@/lib/products";

type Body = {
  items: CartItem[];
  email?: string;
  address?: ShippingAddress;
  rate?: ShippingRate;
};

const MAX_QUANTITY_PER_ITEM = 50;

type VerifiedItem = {
  variantId: string;
  slug: string;
  name: string;
  color: string;
  size: string;
  price: number;
  quantity: number;
  image?: string;
};

export async function POST(req: Request) {
  const { items, email, address, rate } = (await req.json()) as Body;

  if (!items || items.length === 0) {
    return NextResponse.json({ error: "empty cart" }, { status: 400 });
  }

  // Re-derive every line item's price and name from the live Printful
  // catalog. Client-submitted prices are never trusted for billing —
  // without this, anyone can POST an arbitrary price for any variantId
  // and get a real, payable checkout session at that price.
  const catalog = await getProductsWithContent();
  const variantIndex = new Map<
    string,
    { name: string; color: string; size: string; price: number; slug: string }
  >();
  for (const product of catalog) {
    for (const variant of product.variants) {
      variantIndex.set(variant.id, {
        name: product.name,
        color: variant.color,
        size: variant.size,
        price: variant.price,
        slug: product.slug,
      });
    }
  }

  const verifiedItems: VerifiedItem[] = [];
  for (const item of items) {
    const authoritative = variantIndex.get(item.variantId);
    if (!authoritative) {
      return NextResponse.json(
        {
          error: `"${item.name || "An item"}" in your cart is no longer available. Please remove it and try again.`,
        },
        { status: 409 },
      );
    }
    const quantity = Math.min(
      Math.max(1, Math.floor(Number(item.quantity) || 0)),
      MAX_QUANTITY_PER_ITEM,
    );
    verifiedItems.push({
      variantId: item.variantId,
      slug: authoritative.slug,
      name: authoritative.name,
      color: authoritative.color,
      size: authoritative.size,
      price: authoritative.price,
      quantity,
      image: item.image,
    });
  }

  const isProduction = process.env.VERCEL_ENV === "production";

  if (!stripe) {
    if (isProduction) {
      // Never fake a successful order in production — a missing/invalid
      // key here means no payment can actually be collected. Mock mode is
      // strictly a local/preview development convenience.
      return NextResponse.json(
        {
          error:
            "Checkout is temporarily unavailable. Please contact us to place your order.",
        },
        { status: 503 },
      );
    }
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

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: verifiedItems.map((i) => ({
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
  } catch (err) {
    // Covers a dead/cancelled Stripe account, revoked key, etc. — the key
    // is present so the `!stripe` branch above never triggers, but the API
    // call itself fails. Fail loudly to us, quietly (but honestly) to the
    // customer.
    console.error("[checkout] Stripe session creation failed:", err);
    return NextResponse.json(
      {
        error:
          "We're unable to process payments right now. Please contact us to place your order.",
      },
      { status: 503 },
    );
  }
}

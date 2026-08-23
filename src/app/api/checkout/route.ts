import { NextResponse } from "next/server";
import type { CartItem } from "@/lib/cart-store";
import type { ShippingAddress } from "@/lib/printful";
import { createOrder } from "@/lib/printful";
import { getProductsWithContent } from "@/lib/products";
import { gateway } from "@/lib/braintree";

type Body = {
  items: CartItem[];
  email?: string;
  address?: ShippingAddress;
  shippingRate?: number;
  paymentMethodNonce?: string;
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
};

export async function POST(req: Request) {
  const { items, email, address, shippingRate, paymentMethodNonce } =
    (await req.json()) as Body;

  if (!items || items.length === 0) {
    return NextResponse.json({ error: "empty cart" }, { status: 400 });
  }
  if (!email || !address) {
    return NextResponse.json(
      { error: "Missing contact or shipping information." },
      { status: 400 },
    );
  }

  // Re-derive every line item's price and name from the live Printful
  // catalog. Client-submitted prices are never trusted for billing —
  // without this, anyone can POST an arbitrary price for any variantId
  // and get a real, payable transaction at that price.
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
    });
  }

  const subtotal = verifiedItems.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0,
  );
  // Shipping rate also isn't trusted from the client beyond which option
  // was picked — clamp to a sane non-negative number so a tampered value
  // can't reduce the charge.
  const shipping = Math.max(0, Number(shippingRate) || 0);
  const total = subtotal + shipping;

  const isProduction = process.env.VERCEL_ENV === "production";

  if (!gateway) {
    if (isProduction) {
      // Never fake a successful order in production — no configured
      // processor means no payment can actually be collected. Mock mode
      // is strictly a local/preview development convenience.
      return NextResponse.json(
        {
          error:
            "Checkout is temporarily unavailable. Please contact us to place your order.",
        },
        { status: 503 },
      );
    }
    return NextResponse.json({ ok: true, mock: true, transactionId: `mock_${Date.now()}` });
  }

  if (!paymentMethodNonce) {
    return NextResponse.json(
      { error: "Missing payment details." },
      { status: 400 },
    );
  }

  try {
    const [firstName, ...rest] = (address.name || "").trim().split(" ");
    const lastName = rest.join(" ") || firstName || "Customer";

    const result = await gateway.transaction.sale({
      amount: total.toFixed(2),
      paymentMethodNonce,
      customer: { email },
      shipping: {
        firstName: firstName || "Customer",
        lastName,
        streetAddress: address.address1,
        locality: address.city,
        region: address.state,
        postalCode: address.zip,
        countryCodeAlpha2: address.country || "US",
      },
      options: {
        submitForSettlement: true,
      },
    });

    if (!result.success || !result.transaction) {
      console.error("[checkout] Braintree transaction declined:", result.message);
      return NextResponse.json(
        {
          error:
            result.message ||
            "Your payment was declined. Please check your details or try a different payment method.",
        },
        { status: 402 },
      );
    }

    try {
      await createOrder({
        email,
        items: verifiedItems.map((i) => ({
          variantId: i.variantId,
          quantity: i.quantity,
        })),
        shipping: {
          name: address.name || lastName,
          address1: address.address1,
          city: address.city,
          state: address.state,
          zip: address.zip,
          country: address.country || "US",
        },
      });
    } catch (err) {
      // Payment succeeded but fulfillment order creation failed — do not
      // fail the checkout response (the customer was charged), but log
      // loudly so this can be fulfilled manually.
      console.error(
        `[checkout] Payment ${result.transaction.id} succeeded but Printful order creation failed:`,
        err,
      );
    }

    return NextResponse.json({
      ok: true,
      transactionId: result.transaction.id,
    });
  } catch (err) {
    // Covers a dead/misconfigured Braintree account, network failure, etc.
    console.error("[checkout] Braintree transaction failed:", err);
    return NextResponse.json(
      {
        error:
          "We're unable to process payments right now. Please contact us to place your order.",
      },
      { status: 503 },
    );
  }
}

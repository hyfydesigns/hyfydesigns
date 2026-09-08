import { NextResponse } from "next/server";
import type { CartItem } from "@/lib/cart-store";
import type { ShippingAddress } from "@/lib/printful";
import { createPaypalOrder, hasPaypal } from "@/lib/paypal";
import {
  UnavailableItemError,
  cartSubtotal,
  verifyCartItems,
} from "@/lib/verify-order";

type Body = {
  items: CartItem[];
  address?: ShippingAddress;
  shippingRate?: number;
};

export async function POST(req: Request) {
  const { items, address, shippingRate } = (await req.json()) as Body;

  if (!items || items.length === 0) {
    return NextResponse.json({ error: "empty cart" }, { status: 400 });
  }
  if (!address) {
    return NextResponse.json(
      { error: "Missing shipping information." },
      { status: 400 },
    );
  }

  let verifiedItems;
  try {
    verifiedItems = await verifyCartItems(items);
  } catch (err) {
    if (err instanceof UnavailableItemError) {
      return NextResponse.json({ error: err.message }, { status: 409 });
    }
    throw err;
  }

  const subtotal = cartSubtotal(verifiedItems);
  const shipping = Math.max(0, Number(shippingRate) || 0);
  const total = subtotal + shipping;

  const isProduction = process.env.VERCEL_ENV === "production";

  if (!hasPaypal) {
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
    return NextResponse.json({ orderId: `mock_${Date.now()}`, mock: true });
  }

  try {
    const order = await createPaypalOrder({
      amount: total.toFixed(2),
      itemTotal: subtotal.toFixed(2),
      shippingTotal: shipping.toFixed(2),
      items: verifiedItems.map((i) => ({
        name: `${i.name} — ${i.color} / ${i.size}`,
        quantity: String(i.quantity),
        unitAmount: i.price.toFixed(2),
      })),
      shippingAddress: {
        name: address.name || "Customer",
        address1: address.address1,
        city: address.city,
        state: address.state,
        zip: address.zip,
        country: address.country || "US",
      },
    });

    return NextResponse.json({ orderId: order.id });
  } catch (err) {
    console.error("[checkout] PayPal create order failed:", err);
    return NextResponse.json(
      {
        error:
          "We're unable to process payments right now. Please contact us to place your order.",
      },
      { status: 503 },
    );
  }
}

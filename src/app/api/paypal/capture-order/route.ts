import { NextResponse } from "next/server";
import type { CartItem } from "@/lib/cart-store";
import type { ShippingAddress } from "@/lib/printful";
import { createOrder } from "@/lib/printful";
import { capturePaypalOrder, hasPaypal } from "@/lib/paypal";
import {
  UnavailableItemError,
  verifyCartItems,
  type VerifiedItem,
} from "@/lib/verify-order";

type Body = {
  orderId: string;
  items: CartItem[];
  email?: string;
  address?: ShippingAddress;
  mock?: boolean;
};

export async function POST(req: Request) {
  const { orderId, items, email, address, mock } = (await req.json()) as Body;

  if (!orderId) {
    return NextResponse.json({ error: "Missing order id." }, { status: 400 });
  }
  if (!items || items.length === 0) {
    return NextResponse.json({ error: "empty cart" }, { status: 400 });
  }
  if (!email || !address) {
    return NextResponse.json(
      { error: "Missing contact or shipping information." },
      { status: 400 },
    );
  }

  let verifiedItems: VerifiedItem[];
  try {
    verifiedItems = await verifyCartItems(items);
  } catch (err) {
    if (err instanceof UnavailableItemError) {
      return NextResponse.json({ error: err.message }, { status: 409 });
    }
    throw err;
  }

  const [firstName, ...rest] = (address.name || "").trim().split(" ");
  const lastName = rest.join(" ") || firstName || "Customer";

  async function fulfillWithPrintful(transactionId: string) {
    try {
      await createOrder({
        email: email!,
        items: verifiedItems.map((i) => ({
          variantId: i.variantId,
          quantity: i.quantity,
        })),
        shipping: {
          name: address!.name || lastName,
          address1: address!.address1,
          city: address!.city,
          state: address!.state,
          zip: address!.zip,
          country: address!.country || "US",
        },
      });
    } catch (err) {
      // Payment succeeded but fulfillment order creation failed — do not
      // fail the checkout response (the customer was charged), but log
      // loudly so this can be fulfilled manually.
      console.error(
        `[checkout] Payment ${transactionId} succeeded but Printful order creation failed:`,
        err,
      );
    }
  }

  const isProduction = process.env.VERCEL_ENV === "production";

  if (!hasPaypal || mock) {
    if (isProduction) {
      return NextResponse.json(
        {
          error:
            "Checkout is temporarily unavailable. Please contact us to place your order.",
        },
        { status: 503 },
      );
    }
    await fulfillWithPrintful(orderId);
    return NextResponse.json({ ok: true, mock: true, transactionId: orderId });
  }

  try {
    const captured = await capturePaypalOrder(orderId);

    const captureId =
      captured.purchase_units?.[0]?.payments?.captures?.[0]?.id ?? captured.id;
    const captureStatus = captured.purchase_units?.[0]?.payments?.captures?.[0]
      ?.status;

    if (captured.status !== "COMPLETED" || captureStatus === "DECLINED") {
      console.error("[checkout] PayPal capture not completed:", captured);
      return NextResponse.json(
        {
          error:
            "Your payment couldn't be completed. Please check your PayPal account or try a different payment method.",
        },
        { status: 402 },
      );
    }

    await fulfillWithPrintful(captureId);

    return NextResponse.json({ ok: true, transactionId: captureId });
  } catch (err) {
    console.error("[checkout] PayPal capture failed:", err);
    return NextResponse.json(
      {
        error:
          "We're unable to process payments right now. Please contact us to place your order.",
      },
      { status: 503 },
    );
  }
}

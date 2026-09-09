import { NextResponse } from "next/server";
import type { CartItem } from "@/lib/cart-store";
import type { ShippingAddress } from "@/lib/printful";
import { createOrder } from "@/lib/printful";
import { capturePaypalOrder, hasPaypal, type PaypalOrder } from "@/lib/paypal";
import { sendOrderConfirmationEmail } from "@/lib/email";
import {
  UnavailableItemError,
  cartSubtotal,
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

  // This is the customer's only practical way to learn their order
  // reference for later lookup on /account — PayPal's own receipt email
  // is generic and doesn't point back to our lookup page.
  async function sendConfirmationEmail(
    reference: string,
    subtotal: number,
    shippingCost: number,
    total: number,
  ) {
    try {
      await sendOrderConfirmationEmail({
        email: email!,
        reference,
        items: verifiedItems.map((i) => ({
          name: i.name,
          color: i.color,
          size: i.size,
          price: i.price,
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
        subtotal,
        shippingCost,
        total,
      });
    } catch (err) {
      console.error(
        `[checkout] Order confirmation email failed for ${reference}:`,
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
    const subtotal = cartSubtotal(verifiedItems);
    await fulfillWithPrintful(orderId);
    await sendConfirmationEmail(orderId, subtotal, 0, subtotal);
    return NextResponse.json({ ok: true, mock: true, transactionId: orderId });
  }

  try {
    const captured = await capturePaypalOrder(orderId);

    // The order ID and the capture ID are different identifiers in
    // PayPal's system. The capture ID is more specific for our own logs
    // (it's what you'd search for in the PayPal dashboard to manually
    // fulfill a failed order), but everything customer-facing — the
    // confirmation URL, the email, and /account lookup — uses the order
    // ID, because that's the only one GET /v2/checkout/orders/{id}
    // (what lookup calls) actually accepts.
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

    const { subtotal, shipping, total } = extractAmounts(captured, verifiedItems);
    await sendConfirmationEmail(captured.id, subtotal, shipping, total);

    return NextResponse.json({ ok: true, transactionId: captured.id });
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

// The captured order echoes back the exact amount breakdown PayPal
// actually charged — using that (rather than recomputing from
// verifiedItems) means the confirmation email always matches the real
// charge, even if something upstream disagreed. Falls back to our own
// subtotal calculation only if PayPal's response is missing the
// breakdown for some reason.
function extractAmounts(
  order: PaypalOrder,
  verifiedItems: VerifiedItem[],
): { subtotal: number; shipping: number; total: number } {
  const amount = order.purchase_units?.[0]?.amount;
  const fallbackSubtotal = cartSubtotal(verifiedItems);
  if (!amount) {
    return { subtotal: fallbackSubtotal, shipping: 0, total: fallbackSubtotal };
  }
  const total = parseFloat(amount.value);
  const subtotal = amount.breakdown?.item_total
    ? parseFloat(amount.breakdown.item_total.value)
    : fallbackSubtotal;
  const shipping = amount.breakdown?.shipping
    ? parseFloat(amount.breakdown.shipping.value)
    : Math.max(0, total - subtotal);
  return { subtotal, shipping, total: Number.isFinite(total) ? total : subtotal + shipping };
}

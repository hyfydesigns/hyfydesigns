import { NextResponse } from "next/server";
import { getPaypalOrder, hasPaypal } from "@/lib/paypal";

type Body = {
  email?: string;
  reference?: string;
};

// Generic, constant-shaped error for anything that isn't a clean match —
// wrong reference, wrong email, an order that never completed, or a
// reference that doesn't exist at all. Distinguishing these to the caller
// would let someone probe for valid order IDs or confirm a stranger's
// email address; a single message leaks nothing.
const NOT_FOUND_MESSAGE =
  "We couldn't find an order matching that email and reference. Double-check both and try again, or contact us for help.";

export async function POST(req: Request) {
  const { email, reference } = (await req.json()) as Body;

  if (!email || !reference) {
    return NextResponse.json(
      { error: "Enter both your email and order reference." },
      { status: 400 },
    );
  }

  if (!hasPaypal) {
    return NextResponse.json(
      {
        error:
          "Order lookup is temporarily unavailable. Contact us with your name and order date and we'll look it up right away.",
      },
      { status: 503 },
    );
  }

  let order;
  try {
    order = await getPaypalOrder(reference.trim());
  } catch {
    // Covers "not found" (PayPal 404s an unknown/malformed order id) and
    // any transient API failure alike — both present the same way to the
    // customer.
    return NextResponse.json({ error: NOT_FOUND_MESSAGE }, { status: 404 });
  }

  const payerEmail = order.payer?.email_address;
  if (
    order.status !== "COMPLETED" ||
    !payerEmail ||
    payerEmail.toLowerCase() !== email.trim().toLowerCase()
  ) {
    return NextResponse.json({ error: NOT_FOUND_MESSAGE }, { status: 404 });
  }

  const unit = order.purchase_units?.[0];
  const amount = unit?.amount;
  const shippingAddr = unit?.shipping?.address;
  const toCents = (value: string | undefined) =>
    Math.round(parseFloat(value ?? "0") * 100);

  return NextResponse.json({
    reference: order.id,
    email: payerEmail,
    placedAt: order.create_time
      ? Math.floor(new Date(order.create_time).getTime() / 1000)
      : Math.floor(Date.now() / 1000),
    status: "paid",
    currency: amount?.currency_code ?? "USD",
    amountTotal: toCents(amount?.value),
    amountShipping: toCents(amount?.breakdown?.shipping?.value),
    items: (unit?.items ?? []).map((item) => {
      const quantity = parseInt(item.quantity, 10) || 1;
      return {
        name: item.name,
        quantity,
        amountTotal: toCents(item.unit_amount.value) * quantity,
        thumbnail: null,
      };
    }),
    shipping: shippingAddr
      ? {
          name: unit?.shipping?.name?.full_name ?? "",
          line1: shippingAddr.address_line_1 ?? "",
          city: shippingAddr.admin_area_2 ?? "",
          state: shippingAddr.admin_area_1 ?? "",
          zip: shippingAddr.postal_code ?? "",
          country: shippingAddr.country_code ?? "",
        }
      : null,
  });
}

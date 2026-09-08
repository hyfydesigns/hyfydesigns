import { NextResponse } from "next/server";

// Order lookup was built against Stripe Checkout sessions and never
// rebuilt through the Braintree migration. Now on PayPal — whose Orders
// API (GET /v2/checkout/orders/{id}) does carry itemized purchase_units,
// unlike Braintree's core transaction API — a proper rebuild is more
// straightforward than it was, but still not done. Customers are pointed
// to Contact in the meantime.
export async function POST() {
  return NextResponse.json(
    {
      error:
        "Order lookup is temporarily unavailable while we switch payment providers. Contact us with your name and order date and we'll look it up right away.",
    },
    { status: 503 },
  );
}

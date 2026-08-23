import { NextResponse } from "next/server";

// Order lookup was built against Stripe Checkout sessions. It's disabled
// while the payment provider is switched to Braintree — Braintree
// transactions don't carry the same itemized line-item data, so this needs
// a proper rebuild (likely backed by order records instead of a live
// gateway lookup) rather than a straight swap. Customers are pointed to
// Contact in the meantime.
export async function POST() {
  return NextResponse.json(
    {
      error:
        "Order lookup is temporarily unavailable while we switch payment providers. Contact us with your name and order date and we'll look it up right away.",
    },
    { status: 503 },
  );
}

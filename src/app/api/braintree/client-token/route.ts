import { NextResponse } from "next/server";
import { gateway } from "@/lib/braintree";

export async function GET() {
  if (!gateway) {
    // Local/dev without keys configured — Drop-in UI won't render, but
    // nothing crashes. The checkout route's mock-mode branch handles the
    // rest of the flow.
    return NextResponse.json({ clientToken: null });
  }

  try {
    const response = await gateway.clientToken.generate({});
    return NextResponse.json({ clientToken: response.clientToken });
  } catch (err) {
    console.error("[braintree] client token generation failed:", err);
    return NextResponse.json(
      { error: "Payment form is temporarily unavailable." },
      { status: 503 },
    );
  }
}

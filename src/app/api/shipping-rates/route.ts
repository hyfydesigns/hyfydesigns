import { NextResponse } from "next/server";
import { getShippingRates, type ShippingAddress } from "@/lib/printful";

type Body = {
  address: ShippingAddress;
  items: { variantId: string; quantity: number }[];
};

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  if (!body.items || body.items.length === 0) {
    return NextResponse.json({ error: "no items" }, { status: 400 });
  }
  const a = body.address;
  if (!a || !a.address1 || !a.city || !a.state || !a.zip || !a.country) {
    return NextResponse.json(
      { error: "missing required address fields" },
      { status: 400 },
    );
  }

  try {
    const rates = await getShippingRates(body);
    return NextResponse.json({ rates });
  } catch (err) {
    const msg = (err as Error).message;
    console.error("[shipping-rates]", msg);
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}

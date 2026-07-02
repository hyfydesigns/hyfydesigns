import { NextResponse } from "next/server";
import {
  getShippingRates,
  getProducts,
  type ShippingAddress,
} from "@/lib/printful";

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

  // Look up catalog variant_id for each cart item's sync_variant_id.
  // Printful's /shipping/rates wants catalog variant_id, not sync_variant_id.
  const products = await getProducts();
  const catalogByCartVariant = new Map<string, number>();
  for (const p of products) {
    for (const v of p.variants) {
      if (v.catalogVariantId !== undefined) {
        catalogByCartVariant.set(v.id, v.catalogVariantId);
      }
    }
  }

  const translated: { catalogVariantId: number; quantity: number }[] = [];
  for (const i of body.items) {
    const catalogId = catalogByCartVariant.get(i.variantId);
    if (catalogId === undefined) {
      // Product list is stale or item was removed. In live mode this is fatal
      // because Printful needs the catalog id; in mock mode we can proceed
      // since the mock rate response doesn't inspect items.
      if (process.env.PRINTFUL_API_KEY) {
        return NextResponse.json(
          { error: `could not resolve variant ${i.variantId}` },
          { status: 400 },
        );
      }
      translated.push({ catalogVariantId: 0, quantity: i.quantity });
      continue;
    }
    translated.push({ catalogVariantId: catalogId, quantity: i.quantity });
  }

  try {
    const rates = await getShippingRates({ address: a, items: translated });
    return NextResponse.json({ rates });
  } catch (err) {
    const msg = (err as Error).message;
    console.error("[shipping-rates]", msg);
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}

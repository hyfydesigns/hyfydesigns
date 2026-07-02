import { NextResponse } from "next/server";
import { getProducts } from "@/lib/printful";

export const revalidate = 300;

export async function GET() {
  const products = await getProducts();
  const list = products.map((p) => ({
    slug: p.slug,
    name: p.name,
    thumbnail: p.images[0] ?? null,
    type: p.type,
    priceDisplay: p.priceDisplay,
  }));
  return NextResponse.json(list);
}

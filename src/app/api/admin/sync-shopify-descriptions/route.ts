import { NextResponse } from "next/server";
import { getProducts, type PrintfulProduct } from "@/lib/printful";
import {
  fetchAllShopifyProducts,
  normalizeProductName,
  type ShopifyProduct,
} from "@/lib/shopify";
import { sanityWriteClient } from "@/lib/sanity-write";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type Report = {
  shopifyCount: number;
  printfulCount: number;
  matched: number;
  created: number;
  updated: number;
  skippedExisting: number;
  skippedNoDescription: number;
  unmatchedShopify: string[];
  unmatchedPrintful: string[];
  dryRun: boolean;
};

export async function POST(req: Request) {
  const adminToken = process.env.ADMIN_SYNC_TOKEN;
  if (!adminToken) {
    return NextResponse.json(
      { error: "ADMIN_SYNC_TOKEN not configured" },
      { status: 500 },
    );
  }
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${adminToken}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  if (!sanityWriteClient) {
    return NextResponse.json(
      {
        error:
          "Sanity write client not configured. Set NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_WRITE_TOKEN.",
      },
      { status: 500 },
    );
  }

  const url = new URL(req.url);
  const dryRun = url.searchParams.get("dryRun") === "true";
  const override = url.searchParams.get("override") === "true";

  let shopifyProducts: ShopifyProduct[];
  let printfulProducts: PrintfulProduct[];
  try {
    [shopifyProducts, printfulProducts] = await Promise.all([
      fetchAllShopifyProducts(),
      getProducts(),
    ]);
  } catch (err) {
    return NextResponse.json(
      { error: `fetch failed: ${(err as Error).message}` },
      { status: 502 },
    );
  }

  const byNormalizedName = new Map<string, PrintfulProduct>();
  for (const p of printfulProducts) {
    byNormalizedName.set(normalizeProductName(p.name), p);
  }

  const matchedPrintfulSlugs = new Set<string>();

  const report: Report = {
    shopifyCount: shopifyProducts.length,
    printfulCount: printfulProducts.length,
    matched: 0,
    created: 0,
    updated: 0,
    skippedExisting: 0,
    skippedNoDescription: 0,
    unmatchedShopify: [],
    unmatchedPrintful: [],
    dryRun,
  };

  for (const shopifyProduct of shopifyProducts) {
    const normalized = normalizeProductName(shopifyProduct.title);
    const printfulMatch = byNormalizedName.get(normalized);

    if (!printfulMatch) {
      report.unmatchedShopify.push(shopifyProduct.title);
      continue;
    }
    matchedPrintfulSlugs.add(printfulMatch.slug);
    report.matched++;

    const html = (shopifyProduct.body_html ?? "").trim();
    if (!html) {
      report.skippedNoDescription++;
      continue;
    }

    const existing = await sanityWriteClient.fetch<{
      _id: string;
      htmlDescription?: string;
    } | null>(
      `*[_type == "productContent" && slug == $slug][0]{ _id, htmlDescription }`,
      { slug: printfulMatch.slug },
    );

    if (existing?.htmlDescription && !override) {
      report.skippedExisting++;
      continue;
    }

    if (dryRun) {
      if (existing) report.updated++;
      else report.created++;
      continue;
    }

    if (existing) {
      await sanityWriteClient
        .patch(existing._id)
        .set({ htmlDescription: html })
        .commit();
      report.updated++;
    } else {
      await sanityWriteClient.create({
        _type: "productContent",
        slug: printfulMatch.slug,
        htmlDescription: html,
      });
      report.created++;
    }
  }

  for (const p of printfulProducts) {
    if (!matchedPrintfulSlugs.has(p.slug)) {
      report.unmatchedPrintful.push(p.name);
    }
  }

  return NextResponse.json(report);
}

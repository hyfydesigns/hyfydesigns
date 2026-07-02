import { NextResponse } from "next/server";

// Diagnostic — reports on the second (Shopify-connected) Printful store,
// then returns the first product's full detail so we can see whether
// descriptions are present in the response.
export async function GET() {
  const key = process.env.PRINTFUL_SHOPIFY_API_KEY;
  const hasKey = Boolean(key);
  const keyPrefix = key ? `${key.slice(0, 4)}...${key.slice(-4)}` : null;

  if (!hasKey) {
    return NextResponse.json({
      hasKey: false,
      note: "PRINTFUL_SHOPIFY_API_KEY not set. Add it in Vercel env vars and redeploy.",
    });
  }

  try {
    // Step 1: list products
    const listRes = await fetch("https://api.printful.com/store/products", {
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });
    const listText = await listRes.text();
    let listBody: unknown;
    try {
      listBody = JSON.parse(listText);
    } catch {
      return NextResponse.json({
        hasKey: true,
        keyPrefix,
        status: listRes.status,
        rawList: listText.slice(0, 500),
      });
    }

    if (!listRes.ok) {
      return NextResponse.json({
        hasKey: true,
        keyPrefix,
        listStatus: listRes.status,
        listBody,
      });
    }

    const items =
      (listBody as { result?: Array<{ id: number; name: string }> }).result ??
      [];
    const productCount = items.length;
    const firstFew = items.slice(0, 5).map((p) => ({ id: p.id, name: p.name }));

    if (productCount === 0) {
      return NextResponse.json({
        hasKey: true,
        keyPrefix,
        listStatus: 200,
        productCount: 0,
        note: "Store returned zero products.",
      });
    }

    // Step 2: fetch first product's detail
    const firstId = items[0].id;
    const detailRes = await fetch(
      `https://api.printful.com/store/products/${firstId}`,
      {
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      },
    );
    const detailBody = await detailRes.json();

    // Extract just the sync_product + one sync_variant so the response is scannable
    const result = (detailBody as {
      result?: {
        sync_product?: Record<string, unknown>;
        sync_variants?: unknown[];
      };
    }).result;
    const syncProduct = result?.sync_product ?? {};
    const firstVariant = result?.sync_variants?.[0] ?? null;

    // Highlight description-related fields specifically
    const descriptionCandidates: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(syncProduct)) {
      if (/desc|body/i.test(k)) descriptionCandidates[k] = v;
    }

    return NextResponse.json({
      hasKey: true,
      keyPrefix,
      productCount,
      firstFew,
      firstProductDetail: {
        sync_product_keys: Object.keys(syncProduct),
        sync_product_description_fields: descriptionCandidates,
        sync_product: syncProduct,
        first_sync_variant: firstVariant,
      },
    });
  } catch (err) {
    return NextResponse.json({
      hasKey: true,
      keyPrefix,
      error: (err as Error).message,
    });
  }
}

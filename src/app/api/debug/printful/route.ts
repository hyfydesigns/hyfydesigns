import { NextResponse } from "next/server";

// Diagnostic endpoint — reports Printful API state without leaking the key.
// TODO: remove once integration is verified.
export async function GET(req: Request) {
  const key = process.env.PRINTFUL_API_KEY;
  const hasKey = Boolean(key);
  const keyPrefix = key ? `${key.slice(0, 4)}...${key.slice(-4)}` : null;

  if (!hasKey) {
    return NextResponse.json({
      hasKey: false,
      note: "PRINTFUL_API_KEY not present in this runtime environment",
    });
  }

  // ?productId=123 fetches the full detail endpoint for one product
  // instead of the summary list — used to inspect the raw sync_variants
  // shape (name/color/size fields) while diagnosing a mismapped variant.
  const productId = new URL(req.url).searchParams.get("productId");
  const path = productId
    ? `https://api.printful.com/store/products/${productId}`
    : "https://api.printful.com/store/products";

  try {
    const res = await fetch(path, {
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    const text = await res.text();
    let body: unknown;
    try {
      body = JSON.parse(text);
    } catch {
      body = { rawText: text.slice(0, 500) };
    }

    return NextResponse.json({
      hasKey: true,
      keyPrefix,
      status: res.status,
      ok: res.ok,
      body,
    });
  } catch (err) {
    return NextResponse.json({
      hasKey: true,
      keyPrefix,
      error: (err as Error).message,
    });
  }
}

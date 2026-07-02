import { NextResponse } from "next/server";

// Diagnostic endpoint — reports Printful API state without leaking the key.
// TODO: remove once integration is verified.
export async function GET() {
  const key = process.env.PRINTFUL_API_KEY;
  const hasKey = Boolean(key);
  const keyPrefix = key ? `${key.slice(0, 4)}...${key.slice(-4)}` : null;

  if (!hasKey) {
    return NextResponse.json({
      hasKey: false,
      note: "PRINTFUL_API_KEY not present in this runtime environment",
    });
  }

  try {
    const res = await fetch("https://api.printful.com/store/products", {
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

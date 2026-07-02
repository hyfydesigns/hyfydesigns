import { NextResponse } from "next/server";

// Diagnostic — reads SHOPIFY_STORE_DOMAIN and SHOPIFY_ADMIN_ACCESS_TOKEN,
// lists products from Shopify Admin API, and returns titles + description
// previews so we can confirm the credentials work and see whether body_html
// is populated.
export async function GET() {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

  const hasDomain = Boolean(domain);
  const hasToken = Boolean(token);

  if (!hasDomain || !hasToken) {
    return NextResponse.json({
      hasDomain,
      hasToken,
      note: "SHOPIFY_STORE_DOMAIN and/or SHOPIFY_ADMIN_ACCESS_TOKEN not set in Vercel.",
    });
  }

  const tokenPrefix = token ? `${token.slice(0, 8)}...${token.slice(-4)}` : null;
  const url = `https://${domain}/admin/api/2024-07/products.json?limit=10&fields=id,title,body_html,vendor,product_type,status`;

  try {
    const res = await fetch(url, {
      headers: {
        "X-Shopify-Access-Token": token!,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    const text = await res.text();
    let body: unknown;
    try {
      body = JSON.parse(text);
    } catch {
      return NextResponse.json({
        hasDomain: true,
        hasToken: true,
        tokenPrefix,
        domain,
        status: res.status,
        rawText: text.slice(0, 500),
      });
    }

    if (!res.ok) {
      return NextResponse.json({
        hasDomain: true,
        hasToken: true,
        tokenPrefix,
        domain,
        status: res.status,
        body,
      });
    }

    const products =
      (body as { products?: Array<{
        id: number;
        title: string;
        body_html: string | null;
        vendor?: string;
        product_type?: string;
        status?: string;
      }> }).products ?? [];

    return NextResponse.json({
      hasDomain: true,
      hasToken: true,
      tokenPrefix,
      domain,
      productCount: products.length,
      note:
        products.length === 10
          ? "Showing first 10 (Shopify has more; the sync endpoint will paginate)."
          : `Store returned ${products.length} products in this response.`,
      preview: products.map((p) => ({
        id: p.id,
        title: p.title,
        status: p.status,
        vendor: p.vendor,
        product_type: p.product_type,
        has_description: Boolean(p.body_html && p.body_html.trim().length > 0),
        description_length: p.body_html?.length ?? 0,
        description_preview: p.body_html
          ? p.body_html.replace(/\s+/g, " ").slice(0, 200)
          : null,
      })),
    });
  } catch (err) {
    return NextResponse.json({
      hasDomain: true,
      hasToken: true,
      tokenPrefix,
      domain,
      error: (err as Error).message,
    });
  }
}

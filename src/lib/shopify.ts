export type ShopifyProduct = {
  id: number;
  title: string;
  body_html: string | null;
  vendor?: string;
  product_type?: string;
  status?: string;
};

const API_VERSION = "2024-07";

// Follows Shopify's Link-header pagination. Fetches up to `max` products.
export async function fetchAllShopifyProducts({
  max = 500,
}: { max?: number } = {}): Promise<ShopifyProduct[]> {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
  if (!domain || !token) throw new Error("Shopify env vars not set");

  const fields = "id,title,body_html,vendor,product_type,status";
  let url:
    | string
    | null = `https://${domain}/admin/api/${API_VERSION}/products.json?limit=250&fields=${fields}&status=active`;

  const products: ShopifyProduct[] = [];
  while (url && products.length < max) {
    const res: Response = await fetch(url, {
      headers: {
        "X-Shopify-Access-Token": token,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Shopify list failed: ${res.status} ${text.slice(0, 200)}`);
    }
    const body = (await res.json()) as { products?: ShopifyProduct[] };
    for (const p of body.products ?? []) products.push(p);
    url = parseNextLink(res.headers.get("link"));
  }
  return products;
}

function parseNextLink(header: string | null): string | null {
  if (!header) return null;
  // Format: <url>; rel="next", <url>; rel="previous"
  for (const part of header.split(",")) {
    const match = part.match(/<([^>]+)>;\s*rel="next"/);
    if (match) return match[1];
  }
  return null;
}

// Normalize product titles for cross-store matching. Strips punctuation,
// vendor decorations like "*LIMITED EDITION*", trailing product-type words,
// and collapses whitespace.
export function normalizeProductName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\*[^*]*\*/g, " ") // strip *LIMITED EDITION*, *NEW*, etc.
    .replace(/[|–—-]+/g, " ") // strip separators
    .replace(/[^\p{Letter}\p{Number}\s]/gu, " ") // strip punctuation, keep letters/numbers
    .replace(/\s+/g, " ")
    .trim();
}

import { getProductsWithContent } from "@/lib/products";
import type { PrintfulProduct } from "@/lib/printful";

export const revalidate = 3600;

const BASE = "https://hyfydesigns.com";

// Representative flat estimate for Merchant Center listings. Actual
// checkout always shows the real, live Printful-calculated rate — this
// value only needs to be reasonable, not exact, per Google's shipping
// requirements. Matches the low end of the /checkout shipping tiers.
const SHIPPING_ESTIMATE_USD = 4.99;

// Google's official taxonomy IDs — https://support.google.com/merchants/answer/6324436
const GOOGLE_CATEGORY: Record<PrintfulProduct["type"], string> = {
  "t-shirt": "Apparel & Accessories > Clothing > Shirts & Tops",
  hoodie: "Apparel & Accessories > Clothing > Outerwear > Hoodies",
  mug: "Home & Garden > Kitchen & Dining > Tableware > Drinkware > Mugs",
  sticker: "Arts & Entertainment > Party & Celebration > Party Supplies > Stickers",
  hat: "Apparel & Accessories > Clothing Accessories > Hats",
  engraving: "Home & Garden > Decor",
};

export async function GET() {
  const products = await getProductsWithContent();

  const items = products
    .filter((p) => p.variants.length > 0 || p.priceDisplay !== "Quote")
    .map((p) => itemXml(p))
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>HyFy Designs product feed</title>
    <link>${BASE}/shop</link>
    <description>Custom apparel and merchandise from HyFy Designs, printed in Houston.</description>
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}

function itemXml(p: PrintfulProduct): string {
  const link = `${BASE}/shop/${p.slug}`;
  const prices = p.variants.map((v) => v.price).filter((n) => n > 0);
  const price = prices.length ? Math.min(...prices) : 0;
  const image = p.images[0] ?? "";
  const additionalImages = p.images.slice(1, 6);
  const category = GOOGLE_CATEGORY[p.type];
  const description = truncate(
    p.description || `${p.name} — printed on demand by HyFy Designs.`,
    5000,
  );

  return `    <item>
      <g:id>${escapeXml(p.id)}</g:id>
      <title>${escapeXml(truncate(p.name, 150))}</title>
      <description>${escapeXml(description)}</description>
      <link>${escapeXml(link)}</link>
      <g:image_link>${escapeXml(image)}</g:image_link>
${additionalImages.map((img) => `      <g:additional_image_link>${escapeXml(img)}</g:additional_image_link>`).join("\n")}
      <g:availability>in stock</g:availability>
      <g:price>${price.toFixed(2)} USD</g:price>
      <g:brand>HyFy Designs</g:brand>
      <g:condition>new</g:condition>
      <g:google_product_category>${escapeXml(category)}</g:google_product_category>
      <g:product_type>${escapeXml(p.category)}</g:product_type>
      <g:identifier_exists>no</g:identifier_exists>
      <g:shipping>
        <g:country>US</g:country>
        <g:service>Standard</g:service>
        <g:price>${SHIPPING_ESTIMATE_USD.toFixed(2)} USD</g:price>
      </g:shipping>
    </item>`;
}

function truncate(s: string, max: number): string {
  return s.length > max ? `${s.slice(0, max - 1)}…` : s;
}

function escapeXml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => {
    switch (c) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      case "'":
        return "&apos;";
      default:
        return c;
    }
  });
}

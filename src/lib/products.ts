import { getProducts, type PrintfulProduct } from "@/lib/printful";
import { sanityFetch } from "@/sanity/client";
import { ALL_FEATURED_COLORS_QUERY } from "@/sanity/queries";

// Reorders a product's images so the featured color's variant mockup is
// first. Falls through unchanged if no featured color set or no matching
// variant.
export function applyFeaturedColor(
  product: PrintfulProduct,
  featuredColor?: string,
): PrintfulProduct {
  if (!featuredColor) return product;
  const variant = product.variants.find((v) => v.color === featuredColor);
  if (!variant?.mockupUrl) return product;
  const seen = new Set<string>();
  const images: string[] = [variant.mockupUrl];
  seen.add(variant.mockupUrl);
  for (const img of product.images) {
    if (!seen.has(img)) {
      images.push(img);
      seen.add(img);
    }
  }
  return { ...product, images };
}

// Fetches products from Printful and applies the featuredColor override
// from Sanity in one pass. Use this instead of getProducts() anywhere
// listings are rendered so the featured mockup respects the CMS override.
export async function getProductsWithContent(): Promise<PrintfulProduct[]> {
  const [products, overrides] = await Promise.all([
    getProducts(),
    sanityFetch<{ slug: string; featuredColor?: string }[]>(
      ALL_FEATURED_COLORS_QUERY,
      {},
      [],
    ),
  ]);
  const bySlug = new Map(overrides.map((o) => [o.slug, o.featuredColor]));
  return products.map((p) => applyFeaturedColor(p, bySlug.get(p.slug)));
}

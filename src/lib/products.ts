import { getProducts, type PrintfulProduct } from "@/lib/printful";
import { sanityFetch } from "@/sanity/client";
import {
  ALL_FEATURED_COLORS_QUERY,
  ALL_HIDDEN_PRODUCT_SLUGS_QUERY,
} from "@/sanity/queries";

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

// Fetches products from Printful, applies the featuredColor override from
// Sanity, and drops any product marked "hidden" in Sanity. Use this instead
// of getProducts() anywhere listings are rendered so the featured mockup and
// hide toggle both respect the CMS.
export async function getProductsWithContent(): Promise<PrintfulProduct[]> {
  const [products, overrides, hidden] = await Promise.all([
    getProducts(),
    sanityFetch<{ slug: string; featuredColor?: string }[]>(
      ALL_FEATURED_COLORS_QUERY,
      {},
      [],
    ),
    sanityFetch<{ slug: string }[]>(ALL_HIDDEN_PRODUCT_SLUGS_QUERY, {}, []),
  ]);
  const bySlug = new Map(overrides.map((o) => [o.slug, o.featuredColor]));
  const hiddenSlugs = new Set(hidden.map((h) => h.slug));
  return products
    .filter((p) => !hiddenSlugs.has(p.slug))
    .map((p) => applyFeaturedColor(p, bySlug.get(p.slug)));
}

import { Suspense } from "react";
import type { Metadata } from "next";
import { Truck } from "lucide-react";
import { NavBar } from "@/components/layout/nav-bar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/ui/container";
import { ProductCard } from "@/components/ui/product-card";
import { FilterSidebar } from "@/components/shop/filter-sidebar";
import {
  CollectionsStrip,
  type CollectionStripCard,
} from "@/components/shop/collections-strip";
import { toCardProduct, type PrintfulProduct } from "@/lib/printful";
import { getProductsWithContent } from "@/lib/products";
import { sanityFetch } from "@/sanity/client";
import { SHOP_COLLECTIONS_STRIP_QUERY } from "@/sanity/queries";
import { urlFor } from "@/sanity/image";
import type { CollectionStripItem } from "@/sanity/types";

const SHOP_DESCRIPTION =
  "Custom apparel and merchandise from HyFy Designs. T-shirts, hoodies, mugs, stickers, and more. Printed on demand in Houston, shipped nationwide.";

export const metadata: Metadata = {
  title: "Shop",
  description: SHOP_DESCRIPTION,
  // Filter query params (?type=, ?color=, ?category=) create many crawlable
  // URL variants of the same catalog. Canonical keeps all their SEO credit
  // consolidated on the plain /shop URL instead of splitting it across
  // near-duplicate pages.
  alternates: { canonical: "/shop" },
  openGraph: {
    type: "website",
    title: "Shop — HyFy Designs",
    description: SHOP_DESCRIPTION,
    url: "/shop",
    siteName: "HyFy Designs",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shop — HyFy Designs",
    description: SHOP_DESCRIPTION,
  },
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[]>>;
}) {
  const sp = await searchParams;
  const [all, collections] = await Promise.all([
    getProductsWithContent(),
    sanityFetch<CollectionStripItem[]>(SHOP_COLLECTIONS_STRIP_QUERY, {}, []),
  ]);
  const filtered = applyFilters(all, sp);

  const productBySlug = new Map(all.map((p) => [p.slug, p]));
  const collectionCards: CollectionStripCard[] = collections.map((c) => {
    const image = c.highlightImage
      ? urlFor(c.highlightImage).width(440).height(440).url()
      : (c.firstProductSlug && productBySlug.get(c.firstProductSlug)?.images[0]) ||
        null;
    return { slug: c.slug, title: c.title, image };
  });

  const itemListJsonLd = {
    "@context": "https://schema.org/",
    "@type": "CollectionPage",
    name: "Shop — HyFy Designs",
    description: SHOP_DESCRIPTION,
    url: "https://hyfydesigns.com/shop",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: all.slice(0, 24).map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `https://hyfydesigns.com/shop/${p.slug}`,
        name: p.name,
      })),
    },
  };

  return (
    <>
      <NavBar />
      <main className="flex-1">
        <section className="bg-blue-tint/40 py-10 sm:py-14 border-b border-hairline">
          <Container>
            <h1 className="text-3xl sm:text-4xl">Shop the studio.</h1>
            <p className="mt-2 text-ink-600 text-sm sm:text-base max-w-xl">
              Every piece printed to order. Ships in 3–5 business days.
            </p>
            <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-ink-400">
              <Truck className="h-3.5 w-3.5 text-blue" strokeWidth={2} />
              Fulfilled by Printful
            </div>
          </Container>
        </section>

        {collectionCards.length > 0 && (
          <section className="py-8 sm:py-10 border-b border-hairline">
            <Container>
              <h2 className="text-xl sm:text-2xl mb-4 sm:mb-5">
                Shop by collection
              </h2>
              <CollectionsStrip items={collectionCards} />
            </Container>
          </section>
        )}

        <Container>
          <div className="py-8 grid gap-8 lg:grid-cols-[240px_1fr]">
            <Suspense fallback={<div />}>
              <FilterSidebar resultCount={filtered.length} />
            </Suspense>
            <div>
              <div className="hidden lg:flex items-center justify-between mb-6">
                <p className="text-sm text-ink-600">
                  {filtered.length}{" "}
                  {filtered.length === 1 ? "product" : "products"}
                </p>
              </div>
              {filtered.length === 0 ? (
                <div className="py-16 text-center">
                  <p className="text-navy font-medium">
                    No products match those filters.
                  </p>
                  <p className="text-sm text-ink-600 mt-1">
                    Try clearing a filter or browsing everything.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                  {filtered.map((p) => (
                    <ProductCard key={p.slug} product={toCardProduct(p)} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </Container>
      </main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
    </>
  );
}

function applyFilters(
  products: PrintfulProduct[],
  sp: Record<string, string | string[]>,
): PrintfulProduct[] {
  const types = normalize(sp.type);
  const categories = normalize(sp.category);
  const colors = normalize(sp.color);

  return products.filter((p) => {
    if (types.length && !types.includes(p.type)) return false;
    if (categories.length && !categories.includes(p.category)) return false;
    if (colors.length && !colors.some((c) => p.colors.includes(c))) return false;
    return true;
  });
}

function normalize(v: string | string[] | undefined): string[] {
  if (!v) return [];
  return Array.isArray(v) ? v : [v];
}

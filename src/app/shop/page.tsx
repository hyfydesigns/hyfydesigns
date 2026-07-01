import { Suspense } from "react";
import type { Metadata } from "next";
import { NavBar } from "@/components/layout/nav-bar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/ui/container";
import { ProductCard } from "@/components/ui/product-card";
import { FilterSidebar } from "@/components/shop/filter-sidebar";
import { getProducts, toCardProduct, type PrintfulProduct } from "@/lib/printful";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Custom apparel and merchandise from HyFy Designs. T-shirts, hoodies, mugs, stickers, and more. Printed in Houston.",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[]>>;
}) {
  const sp = await searchParams;
  const all = await getProducts();
  const filtered = applyFilters(all, sp);

  return (
    <>
      <NavBar />
      <main className="flex-1">
        <section className="bg-blue-tint/40 py-10 sm:py-14 border-b border-hairline">
          <Container>
            <h1 className="text-3xl sm:text-4xl">Shop the studio.</h1>
            <p className="mt-2 text-ink-600 text-sm sm:text-base max-w-xl">
              Every piece printed to order. Ships in 3–5 business days from
              Printful.
            </p>
          </Container>
        </section>

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

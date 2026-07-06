import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { ProductCard } from "@/components/ui/product-card";
import { toCardProduct } from "@/lib/printful";
import { getProductsWithContent } from "@/lib/products";

export async function FeaturedMerch() {
  const products = await getProductsWithContent();
  const featured = products.slice(0, 4);

  return (
    <section className="py-12 sm:py-16">
      <Container>
        <div className="flex items-end justify-between mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl">Featured merch</h2>
          <Link
            href="/shop"
            className="text-sm text-navy border-b border-red pb-0.5 inline-flex items-center gap-1 hover:gap-2 transition-all tap"
          >
            Shop all
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {featured.map((p) => (
            <ProductCard key={p.slug} product={toCardProduct(p)} />
          ))}
        </div>
      </Container>
    </section>
  );
}

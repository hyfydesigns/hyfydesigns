import { Container } from "@/components/ui/container";
import { ProductCard } from "@/components/ui/product-card";
import { toCardProduct } from "@/lib/printful";
import { getProductsWithContent } from "@/lib/products";

export async function BestSellers() {
  const products = await getProductsWithContent();
  const bestSellers = products.slice(2, 6);

  return (
    <section className="py-12 sm:py-16">
      <Container>
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl">Best sellers</h2>
          <p className="mt-1 text-ink-600 text-sm">
            What Houston keeps coming back for.
          </p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {bestSellers.map((p) => (
            <ProductCard key={p.slug} product={toCardProduct(p)} />
          ))}
        </div>
      </Container>
    </section>
  );
}

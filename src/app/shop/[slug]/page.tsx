import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ChevronRight } from "lucide-react";
import { NavBar } from "@/components/layout/nav-bar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/ui/container";
import { ProductCard } from "@/components/ui/product-card";
import { ProductBuyBox } from "@/components/shop/product-buy-box";
import { getProduct, getProducts, toCardProduct } from "@/lib/printful";

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Not found" };
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const all = await getProducts();
  const related = all
    .filter((p) => p.slug !== slug && p.category === product.category)
    .slice(0, 4);

  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    description: product.description,
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: product.variants[0]?.price ?? 0,
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <>
      <NavBar />
      <main className="flex-1 pb-24 sm:pb-0">
        <Container>
          <nav
            aria-label="Breadcrumb"
            className="pt-6 pb-2 text-xs text-ink-400 flex items-center gap-1"
          >
            <Link href="/" className="hover:text-navy tap">
              Home
            </Link>
            <ChevronRight className="h-3 w-3" strokeWidth={2} />
            <Link href="/shop" className="hover:text-navy tap">
              Shop
            </Link>
            <ChevronRight className="h-3 w-3" strokeWidth={2} />
            <span className="text-navy">{product.name}</span>
          </nav>

          <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-14 py-6">
            <div className="lg:sticky lg:top-20 lg:h-fit">
              <div className="aspect-square bg-blue-tint rounded-2xl flex items-center justify-center">
                <div className="w-1/2 aspect-[1/1.15] bg-cream rounded-lg flex items-center justify-center">
                  <div className="font-mono font-medium text-navy text-2xl leading-tight text-center">
                    {product.type.toUpperCase()}
                    <br />
                    <span className="text-red">MOCKUP</span>
                  </div>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-4 gap-2">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`aspect-square rounded-lg border ${i === 0 ? "border-navy" : "border-hairline"} ${["bg-blue-tint", "bg-red-tint", "bg-cream", "bg-navy"][i]}`}
                  />
                ))}
              </div>
            </div>

            <ProductBuyBox product={product} />
          </div>

          <section className="py-10 border-t border-hairline">
            <div className="grid gap-8 lg:grid-cols-3">
              <Detail title="Details">{product.description}</Detail>
              <Detail title="Sizing">
                Runs true to size. Unisex fit — size down for a slimmer cut.
                Size chart available at checkout.
              </Detail>
              <Detail title="Shipping & care">
                Ships in 3–5 business days via Printful. Machine wash cold,
                tumble dry low, do not iron directly on print.
              </Detail>
            </div>
          </section>

          {related.length > 0 && (
            <section className="py-10 border-t border-hairline">
              <h2 className="text-2xl sm:text-3xl mb-6">You might also like</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                {related.map((p) => (
                  <ProductCard key={p.slug} product={toCardProduct(p)} />
                ))}
              </div>
            </section>
          )}
        </Container>
      </main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}

function Detail({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-lg mb-2">{title}</h3>
      <p className="text-sm text-ink-600 leading-relaxed">{children}</p>
    </div>
  );
}

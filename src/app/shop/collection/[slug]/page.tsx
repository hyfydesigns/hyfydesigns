import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ChevronRight } from "lucide-react";
import { NavBar } from "@/components/layout/nav-bar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/ui/container";
import { ProductCard } from "@/components/ui/product-card";
import { getProducts, toCardProduct } from "@/lib/printful";
import { sanityFetch } from "@/sanity/client";
import {
  COLLECTION_QUERY,
  ALL_COLLECTION_SLUGS_QUERY,
} from "@/sanity/queries";
import type { CollectionDoc } from "@/sanity/types";

export async function generateStaticParams() {
  const slugs = await sanityFetch<{ slug: string }[]>(
    ALL_COLLECTION_SLUGS_QUERY,
    {},
    [],
  );
  return slugs.map((s) => ({ slug: s.slug }));
}

export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const collection = await sanityFetch<CollectionDoc | null>(
    COLLECTION_QUERY,
    { slug },
    null,
  );
  if (!collection) return { title: "Collection" };
  return {
    title: collection.title,
    description:
      collection.description ??
      `${collection.title} — a curated collection from HyFy Designs.`,
  };
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const collection = await sanityFetch<CollectionDoc | null>(
    COLLECTION_QUERY,
    { slug },
    null,
  );
  if (!collection) notFound();

  const allProducts = await getProducts();
  const productSlugs = collection.productSlugs ?? [];
  const productMap = new Map(allProducts.map((p) => [p.slug, p]));
  const products = productSlugs
    .map((s) => productMap.get(s))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <>
      <NavBar />
      <main className="flex-1">
        <section className="bg-blue-tint/40 py-10 sm:py-14 border-b border-hairline">
          <Container>
            <nav
              aria-label="Breadcrumb"
              className="mb-3 text-xs text-ink-400 flex items-center gap-1"
            >
              <Link href="/" className="hover:text-navy tap">
                Home
              </Link>
              <ChevronRight className="h-3 w-3" strokeWidth={2} />
              <Link href="/shop" className="hover:text-navy tap">
                Shop
              </Link>
              <ChevronRight className="h-3 w-3" strokeWidth={2} />
              <span className="text-navy">{collection.title}</span>
            </nav>
            <h1 className="text-3xl sm:text-4xl">{collection.title}</h1>
            {collection.description && (
              <p className="mt-2 text-ink-600 text-sm sm:text-base max-w-2xl leading-relaxed">
                {collection.description}
              </p>
            )}
            <p className="mt-3 text-xs text-ink-400">
              {products.length}{" "}
              {products.length === 1 ? "product" : "products"}
            </p>
          </Container>
        </section>

        <Container>
          <div className="py-8">
            {products.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-navy font-medium">
                  No products in this collection yet.
                </p>
                <p className="text-sm text-ink-600 mt-1">
                  Add product slugs to the collection in Sanity Studio.
                </p>
                <Link
                  href="/shop"
                  className="mt-6 inline-block text-sm text-navy border-b border-red pb-0.5 tap"
                >
                  Browse all products
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                {products.map((p) => (
                  <ProductCard key={p.slug} product={toCardProduct(p)} />
                ))}
              </div>
            )}
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}

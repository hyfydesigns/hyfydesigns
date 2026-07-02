import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import sanitizeHtml from "sanitize-html";
import { ChevronRight } from "lucide-react";
import { PortableText, type PortableTextBlock } from "@portabletext/react";
import { NavBar } from "@/components/layout/nav-bar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/ui/container";
import { ProductCard } from "@/components/ui/product-card";
import { ProductDetail } from "@/components/shop/product-detail";
import { getProduct, getProducts, toCardProduct } from "@/lib/printful";
import { sanityFetch } from "@/sanity/client";
import { PRODUCT_CONTENT_QUERY } from "@/sanity/queries";
import type { ProductContentDoc } from "@/sanity/types";

const ALLOWED_HTML_TAGS = [
  "p", "br", "b", "strong", "i", "em", "u",
  "ul", "ol", "li", "a", "h3", "h4", "h5",
  "blockquote", "hr", "span",
];

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
  const content = await sanityFetch<ProductContentDoc | null>(
    PRODUCT_CONTENT_QUERY,
    { slug },
    null,
  );
  const description = descriptionForMeta(content, product.description);
  return {
    title: product.name,
    description,
    openGraph: { title: product.name, description },
  };
}

function descriptionForMeta(
  content: ProductContentDoc | null,
  fallback: string,
): string {
  if (content?.htmlDescription) return plainTextFromHtml(content.htmlDescription);
  const blocks = content?.description as unknown[] | undefined;
  const blockText = plainTextFromBlocks(blocks);
  // If the Portable Text content contained raw HTML tags, strip them too.
  if (blockText && /<[a-z][^>]*>/i.test(blockText)) {
    return plainTextFromHtml(blockText);
  }
  return blockText || fallback;
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const [all, content] = await Promise.all([
    getProducts(),
    sanityFetch<ProductContentDoc | null>(PRODUCT_CONTENT_QUERY, { slug }, null),
  ]);

  const related = all
    .filter((p) => p.slug !== slug && p.category === product.category)
    .slice(0, 4);

  const descriptionBlocks = content?.description as PortableTextBlock[] | undefined;
  // Prefer the explicit HTML field. If empty, check whether the Portable Text
  // content is actually raw HTML that got pasted in (very common with content
  // copied from Printful). If it looks like HTML, promote it.
  const rawHtmlSource =
    content?.htmlDescription ??
    (descriptionBlocks ? htmlIfPortableTextContainsTags(descriptionBlocks) : "");
  const cleanHtml = rawHtmlSource
    ? sanitizeHtml(rawHtmlSource, {
        allowedTags: ALLOWED_HTML_TAGS,
        allowedAttributes: { a: ["href", "target", "rel"] },
        allowedSchemes: ["http", "https", "mailto"],
      })
    : "";
  // If we promoted Portable Text to HTML, don't ALSO render Portable Text.
  const shouldRenderPortableText =
    !cleanHtml && descriptionBlocks && descriptionBlocks.length > 0;
  const jsonLdDescription =
    plainTextFromHtml(cleanHtml) ||
    plainTextFromBlocks(descriptionBlocks) ||
    product.description ||
    product.name;

  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    description: jsonLdDescription,
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

          <ProductDetail product={product} />

          <section className="py-10 border-t border-hairline">
            <div className="grid gap-8 lg:grid-cols-3">
              <Detail title="Details" scrollable>
                {cleanHtml ? (
                  <div
                    className="product-html leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: cleanHtml }}
                  />
                ) : shouldRenderPortableText ? (
                  <PortableText
                    value={descriptionBlocks}
                    components={{
                      block: {
                        h3: ({ children }) => (
                          <h4 className="text-base font-medium text-navy mt-4 first:mt-0 mb-1">
                            {children}
                          </h4>
                        ),
                        normal: ({ children }) => (
                          <p className="mb-3 last:mb-0 leading-relaxed">
                            {children}
                          </p>
                        ),
                      },
                      list: {
                        bullet: ({ children }) => (
                          <ul className="list-disc pl-5 mb-3 space-y-1">
                            {children}
                          </ul>
                        ),
                        number: ({ children }) => (
                          <ol className="list-decimal pl-5 mb-3 space-y-1">
                            {children}
                          </ol>
                        ),
                      },
                      marks: {
                        link: ({ value, children }) => (
                          <a
                            href={value?.href}
                            className="underline text-navy hover:text-blue"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {children}
                          </a>
                        ),
                      },
                    }}
                  />
                ) : product.description ? (
                  <p className="leading-relaxed">{product.description}</p>
                ) : (
                  <p className="leading-relaxed">
                    {product.name} — printed on demand by HyFy Designs. Each
                    piece produced fresh when you order and shipped directly
                    to you.
                  </p>
                )}
              </Detail>
              <Detail title="Sizing">
                {content?.sizingNote ??
                  "Runs true to size. Unisex fit — size down for a slimmer cut. Size chart available at checkout."}
              </Detail>
              <Detail title="Shipping & care">
                {content?.careNote ??
                  "Ships in 3–5 business days via Printful. Machine wash cold, tumble dry low, do not iron directly on print."}
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
  scrollable,
  children,
}: {
  title: string;
  scrollable?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-lg mb-2">{title}</h3>
      <div
        className={
          scrollable
            ? "text-sm text-ink-600 max-h-[24rem] overflow-y-auto pr-2 rounded-lg scroll-pane"
            : "text-sm text-ink-600"
        }
      >
        {children}
      </div>
    </div>
  );
}

function plainTextFromBlocks(
  blocks: unknown[] | undefined,
): string {
  if (!Array.isArray(blocks)) return "";
  return blocks
    .map((b) => {
      const block = b as { _type?: string; children?: Array<{ text?: string }> };
      if (block._type !== "block" || !Array.isArray(block.children)) return "";
      return block.children.map((c) => c.text ?? "").join("");
    })
    .join(" ")
    .trim()
    .slice(0, 300);
}

function plainTextFromHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 300);
}

// If a Portable Text array is really just HTML that got pasted in, return the
// concatenated raw HTML string. Otherwise return empty so we render as normal
// Portable Text. Recognizes common tags (p, br, strong, em, ul, ol, li, h3,
// h4, blockquote) — one match is enough to consider it HTML.
const HTML_TAG_RE = /<\/?(?:p|br|strong|b|em|i|u|ul|ol|li|h[1-6]|blockquote|a|hr|span)(\s[^>]*)?>/i;
function htmlIfPortableTextContainsTags(blocks: unknown[]): string {
  const combined = blocks
    .map((b) => {
      const block = b as {
        _type?: string;
        children?: Array<{ text?: string }>;
      };
      if (block._type !== "block" || !Array.isArray(block.children)) return "";
      return block.children.map((c) => c.text ?? "").join("");
    })
    .filter(Boolean)
    .join("\n\n");
  return HTML_TAG_RE.test(combined) ? combined : "";
}

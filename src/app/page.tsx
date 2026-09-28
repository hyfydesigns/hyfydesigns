import { NavBar } from "@/components/layout/nav-bar";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/sections/hero";
import { TrustBar } from "@/components/sections/trust-bar";
import { FeaturedMerch } from "@/components/sections/featured-merch";
import { Services } from "@/components/sections/services";
import { BestSellers } from "@/components/sections/best-sellers";
import { TestimonialStrip } from "@/components/sections/testimonial-strip";
import { LifestyleGallery } from "@/components/sections/lifestyle-gallery";
import { NewsletterInline } from "@/components/sections/newsletter-inline";
import { StickyMobileCTA } from "@/components/sections/sticky-mobile-cta";

// Without this, the homepage is a pure build-time snapshot with no
// revalidation at all — Featured merch / Best sellers would keep showing
// products deleted from Printful indefinitely, until the next deploy.
// Matches the 5-minute window already used for Printful data elsewhere
// (src/lib/printful.ts's fetch, and /api/products/list).
export const revalidate = 300;

export default function HomePage() {
  return (
    <>
      <NavBar />
      <main className="flex-1">
        <Hero />
        <TrustBar />
        <FeaturedMerch />
        <Services />
        <BestSellers />
        <TestimonialStrip />
        <LifestyleGallery />
        <NewsletterInline />
      </main>
      <Footer />
      <StickyMobileCTA />
    </>
  );
}

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

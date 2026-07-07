import { Container } from "@/components/ui/container";
import { NewsletterForm } from "@/components/newsletter/newsletter-form";

export function NewsletterInline() {
  return (
    <section className="py-12 sm:py-16">
      <Container size="narrow">
        <div className="bg-navy rounded-2xl p-6 sm:p-10 text-center">
          <h2 className="text-cream text-2xl sm:text-3xl">
            Drops land first Friday of every month.
          </h2>
          <p className="mt-2 text-cream/70 text-sm sm:text-base max-w-md mx-auto">
            One email. New tees, studio picks, and a monthly Houston playlist.
          </p>
          <div className="mt-6 max-w-md mx-auto text-left sm:text-center">
            <NewsletterForm tone="dark" ctaLabel="Sign me up" />
          </div>
        </div>
      </Container>
    </section>
  );
}

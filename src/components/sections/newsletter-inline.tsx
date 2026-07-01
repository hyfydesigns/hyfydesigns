import { Container } from "@/components/ui/container";

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
          <form
            action="/api/newsletter"
            method="post"
            className="mt-6 flex flex-col sm:flex-row gap-2 max-w-md mx-auto"
          >
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              name="email"
              type="email"
              required
              placeholder="you@studio.com"
              className="flex-1 min-h-11 rounded-lg bg-cream/10 border border-cream/20 text-cream placeholder:text-cream/50 px-4 text-sm focus:outline-none focus:border-red"
            />
            <button
              type="submit"
              className="min-h-11 px-6 rounded-lg bg-red text-cream text-sm font-medium hover:bg-red-deep tap"
            >
              Sign me up
            </button>
          </form>
        </div>
      </Container>
    </section>
  );
}

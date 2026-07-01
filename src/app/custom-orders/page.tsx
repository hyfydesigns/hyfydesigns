import type { Metadata } from "next";
import { UploadCloud, MessageCircle, Truck } from "lucide-react";
import { NavBar } from "@/components/layout/nav-bar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/badge";
import { QuoteForm } from "@/components/custom/quote-form";

export const metadata: Metadata = {
  title: "Custom orders",
  description:
    "Get a custom quote for team merch, event tees, engravings, or personal projects. Upload your art and we quote within 24 hours.",
};

const steps = [
  {
    icon: UploadCloud,
    title: "Upload your art",
    copy: "Drop files, sketches, or a rough idea. No polished artwork required.",
  },
  {
    icon: MessageCircle,
    title: "Get a quote in 24h",
    copy: "We reply with pricing, timeline, and any questions to lock the scope.",
  },
  {
    icon: Truck,
    title: "We print and ship",
    copy: "Approve the mockup, we produce and deliver — locally in Houston or shipped nationally.",
  },
];

const portfolio = [
  { title: "Blacksmith Coffee tees", meta: "80 shirts · Heights, TX", tone: "bg-red-tint text-red-deep" },
  { title: "TX Marathon merch", meta: "500 pieces · Downtown", tone: "bg-blue text-cream" },
  { title: "Wedding welcome mugs", meta: "60 mugs · East End", tone: "bg-blue-tint text-blue" },
  { title: "Startup swag pack", meta: "150 kits · Midtown", tone: "bg-navy text-cream" },
  { title: "5K event bibs", meta: "800 bibs · Buffalo Bayou", tone: "bg-cream-warm text-navy" },
  { title: "Studio anniversary poster", meta: "Screen print · Montrose", tone: "bg-red text-cream" },
];

export default function CustomOrdersPage() {
  return (
    <>
      <NavBar />
      <main className="flex-1">
        <section className="py-12 sm:py-20 bg-blue-tint/40">
          <Container>
            <div className="max-w-3xl">
              <Eyebrow>Custom orders</Eyebrow>
              <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl leading-[1.05]">
                Bring your idea. <br />
                <span className="relative inline-block">
                  <span className="relative z-10">We&apos;ll print it.</span>
                  <span className="absolute left-0 right-0 bottom-1 h-3 bg-red -z-0" />
                </span>
              </h1>
              <p className="mt-5 text-ink-600 text-base sm:text-lg max-w-xl leading-relaxed">
                Team merch, event tees, wedding favors, engraved gifts — 20+
                years of studio experience, quoted per project.
              </p>
            </div>
          </Container>
        </section>

        <section className="py-12 sm:py-16">
          <Container>
            <div className="grid gap-6 sm:grid-cols-3">
              {steps.map((s, i) => (
                <div
                  key={s.title}
                  className="relative bg-white rounded-2xl p-6 sm:p-7 border border-hairline"
                >
                  <span className="absolute top-4 right-5 font-display text-4xl sm:text-5xl text-blue-tint">
                    0{i + 1}
                  </span>
                  <s.icon
                    className="h-8 w-8 text-navy mb-4"
                    strokeWidth={1.5}
                  />
                  <h3 className="text-lg sm:text-xl">{s.title}</h3>
                  <p className="mt-1.5 text-sm text-ink-600 leading-relaxed">
                    {s.copy}
                  </p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        <section className="py-12 sm:py-16 border-t border-hairline">
          <Container size="narrow">
            <h2 className="text-3xl sm:text-4xl">Get a quote.</h2>
            <p className="mt-2 text-ink-600">
              The more details the better — we&apos;ll reply within 24 hours.
            </p>
            <div className="mt-8">
              <QuoteForm />
            </div>
          </Container>
        </section>

        <section
          id="portfolio"
          className="py-12 sm:py-16 border-t border-hairline"
        >
          <Container>
            <div className="mb-8">
              <h2 className="text-3xl sm:text-4xl">Past projects.</h2>
              <p className="mt-2 text-ink-600">
                A sample of what we&apos;ve made for Houston teams and small
                businesses.
              </p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {portfolio.map((p) => (
                <div
                  key={p.title}
                  className={`aspect-[4/5] rounded-xl p-5 sm:p-6 flex flex-col justify-end ${p.tone}`}
                >
                  <p className="text-xs opacity-80">{p.meta}</p>
                  <p className="text-sm sm:text-base font-medium mt-1">
                    {p.title}
                  </p>
                </div>
              ))}
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}

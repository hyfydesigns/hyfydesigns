import type { Metadata } from "next";
import { Palette, Users, Heart, Sparkles } from "lucide-react";
import { NavBar } from "@/components/layout/nav-bar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "About",
  description:
    "The story behind HyFy Designs — a Houston custom apparel studio with 20+ years of print experience.",
};

const timeline = [
  { year: "2004", title: "Studio opens", copy: "First heat press, first stack of blank tees." },
  { year: "2011", title: "Ten years in", copy: "Moved into the East End studio we still call home." },
  { year: "2019", title: "Print-on-demand launch", copy: "Partnered with Printful to ship one-off orders worldwide." },
  { year: "2024", title: "20-year milestone", copy: "Over 200,000 pieces printed for Houston teams, brands, and originals." },
];

const values = [
  { icon: Palette, title: "Craft", copy: "Color-matching, thread choice, print placement — the small stuff makes the shirt." },
  { icon: Users, title: "Community", copy: "We print for the coffee shop down the street and the mural crew across town." },
  { icon: Sparkles, title: "Color", copy: "Bold, vivid, unafraid — Houston is a colorful city, so is our work." },
  { icon: Heart, title: "Care", copy: "Every order printed like it's for someone we know. Because usually it is." },
];

export default function AboutPage() {
  return (
    <>
      <NavBar />
      <main className="flex-1">
        <section className="py-12 sm:py-20 bg-navy text-cream relative overflow-hidden">
          <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-blue opacity-40" />
          <div className="absolute right-1/3 bottom-0 h-72 w-72 rounded-full bg-red opacity-30" />
          <Container className="relative">
            <div className="max-w-3xl">
              <Eyebrow className="bg-cream/10 text-cream">Our story</Eyebrow>
              <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl leading-[1.05] text-cream">
                Twenty years of ink,
                <br />
                one Houston studio.
              </h1>
              <p className="mt-5 text-cream/80 text-base sm:text-lg max-w-2xl leading-relaxed">
                HyFy Designs opened in 2004 as a two-person operation. Today
                we&apos;re still small, still Houston-based, and still print
                every order like it&apos;s our first.
              </p>
            </div>
          </Container>
        </section>

        <section className="py-12 sm:py-16">
          <Container size="narrow">
            <div className="grid gap-8 lg:grid-cols-[1fr_2fr]">
              <div>
                <Eyebrow>The founder</Eyebrow>
                <h2 className="mt-3 text-2xl sm:text-3xl">Meet the studio.</h2>
              </div>
              <div className="prose-custom">
                <p className="text-lg sm:text-xl font-voice italic text-navy leading-relaxed">
                  <span className="float-left mr-2 mt-1 text-6xl leading-none font-display not-italic text-red">
                    W
                  </span>
                  hat started as a side hustle printing tees for a friend&apos;s
                  band turned into a two-decade partnership with Houston&apos;s
                  creative community.
                </p>
                <p className="mt-4 text-base text-ink-600 leading-relaxed">
                  We&apos;ve printed for coffee shops in the Heights, wedding
                  parties in Montrose, mural crews in the East End, and every
                  5K on Buffalo Bayou you can name. Along the way, our tools
                  changed — heat press to DTG to full print-on-demand via
                  Printful — but the standard hasn&apos;t. Print sharp,
                  color-true, feel-good, first time.
                </p>
                <p className="mt-4 text-base text-ink-600 leading-relaxed">
                  We&apos;re not the biggest print shop in Texas. We just want
                  to be the one your friends recommend.
                </p>
              </div>
            </div>
          </Container>
        </section>

        <section className="py-12 sm:py-16 bg-blue-tint/40 border-y border-hairline">
          <Container>
            <h2 className="text-2xl sm:text-3xl mb-8 sm:mb-10">
              Twenty years, a few milestones.
            </h2>
            <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {timeline.map((t) => (
                <li
                  key={t.year}
                  className="bg-white rounded-2xl p-5 sm:p-6 border border-hairline"
                >
                  <p className="font-display text-3xl sm:text-4xl text-blue">
                    {t.year}
                  </p>
                  <h3 className="mt-2 text-base sm:text-lg">{t.title}</h3>
                  <p className="mt-1 text-sm text-ink-600 leading-relaxed">
                    {t.copy}
                  </p>
                </li>
              ))}
            </ol>
          </Container>
        </section>

        <section className="py-12 sm:py-16">
          <Container>
            <div className="max-w-xl mb-8 sm:mb-10">
              <h2 className="text-2xl sm:text-3xl">What we care about.</h2>
              <p className="mt-2 text-ink-600">
                Four things we come back to on every project.
              </p>
            </div>
            <div className="grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {values.map((v) => (
                <div
                  key={v.title}
                  className="p-6 rounded-2xl bg-white border border-hairline"
                >
                  <div className="h-11 w-11 rounded-lg bg-red-tint text-red-deep inline-flex items-center justify-center">
                    <v.icon className="h-5 w-5" strokeWidth={1.75} />
                  </div>
                  <h3 className="mt-4 text-lg">{v.title}</h3>
                  <p className="mt-1.5 text-sm text-ink-600 leading-relaxed">
                    {v.copy}
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

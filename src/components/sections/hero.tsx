import { MapPin, ArrowRight, Star } from "lucide-react";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/badge";
import { sanityFetch } from "@/sanity/client";
import { HOME_HERO_QUERY, HERO_SLIDES_QUERY } from "@/sanity/queries";
import type { HomeHeroDoc, HeroSlideDoc } from "@/sanity/types";
import { HeroCarousel } from "./hero-carousel";

type CtaCopy = { label: string; href: string };

const defaults: {
  eyebrow: string;
  sub: string;
  primaryCta: CtaCopy;
  secondaryCta: CtaCopy;
} = {
  eyebrow: "Printed in Houston since 2004",
  sub: "Bold shirts, mugs, stickers, and print-on-demand pieces built for creatives, teams, and Houston originals.",
  primaryCta: { label: "Browse merch", href: "/shop" },
  secondaryCta: { label: "Request custom quote", href: "/custom-orders" },
};

export async function Hero() {
  const [doc, slides] = await Promise.all([
    sanityFetch<HomeHeroDoc | null>(HOME_HERO_QUERY, {}, null),
    sanityFetch<HeroSlideDoc[]>(HERO_SLIDES_QUERY, {}, []),
  ]);

  const eyebrow = doc?.eyebrow ?? defaults.eyebrow;
  const sub = doc?.sub ?? defaults.sub;
  const primaryCta = doc?.primaryCta?.label
    ? { label: doc.primaryCta.label, href: doc.primaryCta.href ?? "/shop" }
    : defaults.primaryCta;
  const secondaryCta = doc?.secondaryCta?.label
    ? {
        label: doc.secondaryCta.label,
        href: doc.secondaryCta.href ?? "/custom-orders",
      }
    : defaults.secondaryCta;

  return (
    <section className="relative">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-12 items-center py-10 sm:py-16 lg:py-20">
          <div className="order-1">
            <Eyebrow>
              <MapPin className="h-3 w-3" strokeWidth={2.5} />
              {eyebrow}
            </Eyebrow>
            {doc?.headline ? (
              <h1 className="mt-4 text-[34px] sm:text-5xl lg:text-6xl leading-[1.03] font-medium text-navy">
                {renderHeadline(doc.headline)}
              </h1>
            ) : (
              <h1 className="mt-4 text-[34px] sm:text-5xl lg:text-6xl leading-[1.03] font-medium text-navy">
                Wear the <span className="text-blue">city</span> you love.
                <br />
                <span className="relative inline-block">
                  <span className="relative z-10">Custom merch,</span>
                  <span className="absolute left-0 right-0 bottom-1 h-3 sm:h-4 bg-red -z-0" />
                </span>{" "}
                made with care.
              </h1>
            )}
            <p className="mt-4 sm:mt-6 text-[15px] sm:text-base text-ink-600 max-w-lg leading-relaxed">
              {sub}
            </p>
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3">
              <ButtonLink href={primaryCta.href} size="lg" className="w-full sm:w-auto">
                {primaryCta.label}
                <ArrowRight className="h-4 w-4" strokeWidth={2} />
              </ButtonLink>
              <ButtonLink
                href={secondaryCta.href}
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto"
              >
                {secondaryCta.label}
              </ButtonLink>
            </div>
            <div className="mt-6 sm:mt-8 flex flex-wrap gap-x-5 gap-y-2 text-xs text-ink-400">
              <span className="inline-flex items-center gap-1.5">
                <Star className="h-3.5 w-3.5 text-blue" strokeWidth={2} />
                4.9 avg rating
              </span>
            </div>
          </div>

          {slides.length > 0 ? (
            <HeroCarousel slides={slides} />
          ) : (
            <div className="order-2 relative aspect-square lg:aspect-[4/5] rounded-2xl bg-blue overflow-hidden flex items-center justify-center">
              <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-red text-cream text-[10px] uppercase tracking-[0.06em] font-medium">
                New drop
              </div>
              <ShirtGraphic />
              <div className="absolute bottom-4 left-4 flex gap-1.5">
                {["#0A2A6E", "#E02D2D", "#FDFBF5", "#8FB4F5"].map((c) => (
                  <span
                    key={c}
                    className="h-4 w-4 rounded-full border-2 border-white/70"
                    style={{ background: c }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}

// Parses a headline string with *asterisks* for the red highlight strip and
// _underscores_ for the blue accent color. Newlines become <br /> so editors
// can control line breaks from the CMS.
function renderHeadline(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const lines = text.split(/\r?\n/);
  lines.forEach((line, lineIdx) => {
    const parts = parseInlineMarks(line, `${lineIdx}`);
    nodes.push(...parts);
    if (lineIdx < lines.length - 1) {
      nodes.push(<br key={`br-${lineIdx}`} />);
    }
  });
  return nodes;
}

function parseInlineMarks(line: string, keyPrefix: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const regex = /(\*[^*\n]+\*|_[^_\n]+_)/g;
  let lastIndex = 0;
  let idx = 0;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(line)) !== null) {
    if (match.index > lastIndex) {
      parts.push(line.slice(lastIndex, match.index));
    }
    const token = match[0];
    const inner = token.slice(1, -1);
    const key = `${keyPrefix}-${idx++}`;
    if (token.startsWith("*")) {
      parts.push(
        <span key={key} className="relative inline-block">
          <span className="relative z-10">{inner}</span>
          <span className="absolute left-0 right-0 bottom-1 h-3 sm:h-4 bg-red -z-0" />
        </span>,
      );
    } else {
      parts.push(
        <span key={key} className="text-blue">
          {inner}
        </span>,
      );
    }
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < line.length) {
    parts.push(line.slice(lastIndex));
  }
  return parts;
}

function ShirtGraphic() {
  return (
    <div className="relative w-1/2 sm:w-3/5 aspect-[1/1.15] bg-cream rounded-lg flex items-center justify-center">
      <div
        className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-1/3 h-3.5 bg-cream rounded-full"
        style={{ borderBottomLeftRadius: 50, borderBottomRightRadius: 50 }}
      />
      <div className="font-mono font-medium text-center leading-tight text-navy text-lg sm:text-2xl lg:text-3xl -tracking-wide">
        H-TOWN
        <br />
        <span className="text-red">ORIGINAL</span>
      </div>
    </div>
  );
}

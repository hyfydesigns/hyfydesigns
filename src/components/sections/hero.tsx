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
    <section className="relative overflow-hidden">
      <HeroBackground />
      <Container className="relative">
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
                {["#22E5FF", "#FF3B5C", "#0A0A12", "#FF7FC7"].map((c) => (
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

// Deterministic skyline layout (x/width/height in a 1440x300 viewBox) —
// hand-tuned rather than random so the render is stable across requests
// and doesn't need a client component just to seed randomness safely.
const SKYLINE_BUILDINGS = [
  { x: 0, w: 70, h: 120 },
  { x: 65, w: 45, h: 190 },
  { x: 105, w: 60, h: 90 },
  { x: 160, w: 50, h: 230 },
  { x: 205, w: 80, h: 140 },
  { x: 280, w: 40, h: 260 },
  { x: 315, w: 65, h: 110 },
  { x: 375, w: 55, h: 200 },
  { x: 425, w: 90, h: 160 },
  { x: 510, w: 45, h: 240 },
  { x: 550, w: 70, h: 100 },
  { x: 615, w: 50, h: 210 },
  { x: 660, w: 85, h: 150 },
  { x: 740, w: 40, h: 270 },
  { x: 775, w: 65, h: 120 },
  { x: 835, w: 55, h: 190 },
  { x: 885, w: 75, h: 140 },
  { x: 955, w: 45, h: 230 },
  { x: 995, w: 60, h: 100 },
  { x: 1050, w: 80, h: 200 },
  { x: 1125, w: 50, h: 150 },
  { x: 1170, w: 65, h: 240 },
  { x: 1230, w: 55, h: 110 },
  { x: 1280, w: 70, h: 180 },
  { x: 1345, w: 95, h: 130 },
] as const;

const WINDOW_COLORS = ["#22E5FF", "#FF2E9A", "#FF3B5C"] as const;
const SKYLINE_VIEW_HEIGHT = 300;

// A code-generated night-city backdrop standing in for a background photo:
// a skyline silhouette with lit windows, blurred neon glow orbs, faint
// scanlines, and SVG film grain. No external image asset, so no licensing
// question — and it reads as photographic at a glance rather than as a
// flat illustration, which a gradient alone doesn't achieve. A scrim on
// top keeps the headline legible regardless of where the art is busiest.
function HeroBackground() {
  return (
    <div className="absolute inset-0" aria-hidden="true">
      <div className="absolute -left-24 -top-16 h-80 w-80 rounded-full bg-navy opacity-25 blur-[110px]" />
      <div className="absolute right-0 top-1/4 h-96 w-96 rounded-full bg-blue opacity-20 blur-[110px]" />
      <div className="absolute left-1/3 bottom-0 h-72 w-72 rounded-full bg-red opacity-15 blur-[110px]" />

      <svg
        className="absolute inset-x-0 bottom-0 w-full h-[45%] sm:h-[55%]"
        viewBox={`0 0 1440 ${SKYLINE_VIEW_HEIGHT}`}
        preserveAspectRatio="xMidYMax slice"
      >
        {SKYLINE_BUILDINGS.map((b, i) => {
          const y = SKYLINE_VIEW_HEIGHT - b.h;
          const cols = Math.max(1, Math.floor(b.w / 14));
          const rows = Math.max(1, Math.floor(b.h / 18));
          const windows: React.ReactNode[] = [];
          for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
              if ((i * 3 + r * 5 + c * 2) % 4 !== 0) continue;
              windows.push(
                <rect
                  key={`${r}-${c}`}
                  x={b.x + 5 + c * 14}
                  y={y + 8 + r * 18}
                  width={4}
                  height={6}
                  fill={WINDOW_COLORS[(i + r + c) % WINDOW_COLORS.length]}
                  opacity={0.55}
                />,
              );
            }
          }
          return (
            <g key={i}>
              <rect x={b.x} y={y} width={b.w} height={b.h} fill="#0D0D18" />
              {windows}
            </g>
          );
        })}
      </svg>

      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, rgba(255,255,255,0.6) 0px, rgba(255,255,255,0.6) 1px, transparent 1px, transparent 3px)",
        }}
      />

      <svg className="absolute inset-0 w-full h-full opacity-[0.04] mix-blend-overlay">
        <filter id="hero-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#hero-grain)" />
      </svg>

      <div className="absolute inset-0 bg-cream/60" />
    </div>
  );
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

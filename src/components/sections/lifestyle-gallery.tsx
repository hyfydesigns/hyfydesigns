import { Container } from "@/components/ui/container";
import { MapPin } from "lucide-react";

const tiles = [
  { location: "Buffalo Bayou", ratio: "aspect-[4/5]", tone: "bg-blue" },
  { location: "Montrose", ratio: "aspect-[4/3]", tone: "bg-red-tint" },
  { location: "Discovery Green", ratio: "aspect-[4/4]", tone: "bg-navy" },
  { location: "The Heights", ratio: "aspect-[4/3]", tone: "bg-blue-tint" },
  { location: "East End", ratio: "aspect-[4/5]", tone: "bg-red" },
  { location: "Downtown", ratio: "aspect-[4/4]", tone: "bg-cream-warm" },
];

const textOnTile: Record<string, string> = {
  "bg-blue": "text-cream",
  "bg-red-tint": "text-red-deep",
  "bg-navy": "text-cream",
  "bg-blue-tint": "text-navy",
  "bg-red": "text-cream",
  "bg-cream-warm": "text-navy",
};

export function LifestyleGallery() {
  return (
    <section className="py-12 sm:py-16 bg-cream-warm/40">
      <Container>
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl">On the streets of H-town.</h2>
          <p className="mt-1 text-ink-600 text-sm">
            Real customers, real neighborhoods.
          </p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
          {tiles.map((t, i) => (
            <div
              key={i}
              className={`relative rounded-xl overflow-hidden ${t.ratio} ${t.tone}`}
            >
              <div
                className={`absolute bottom-2 left-2 sm:bottom-3 sm:left-3 inline-flex items-center gap-1 text-[10px] sm:text-xs px-2 py-1 rounded-full bg-white/85 backdrop-blur-sm ${textOnTile[t.tone] ?? "text-navy"}`}
              >
                <MapPin className="h-3 w-3" strokeWidth={2.5} />
                <span className="text-navy font-medium">{t.location}</span>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-ink-400 text-center sm:text-left">
          Swap tiles for real lifestyle photos in the CMS.
        </p>
      </Container>
    </section>
  );
}

import { MapPin, ArrowRight, Truck, Star } from "lucide-react";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/badge";

export function Hero() {
  return (
    <section className="relative">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-12 items-center py-10 sm:py-16 lg:py-20">
          <div className="order-1">
            <Eyebrow>
              <MapPin className="h-3 w-3" strokeWidth={2.5} />
              Printed in Houston since 2004
            </Eyebrow>
            <h1 className="mt-4 text-[34px] sm:text-5xl lg:text-6xl leading-[1.03] font-medium text-navy">
              Wear the <span className="text-blue">city</span> you love.
              <br />
              <span className="relative inline-block">
                <span className="relative z-10">Custom merch,</span>
                <span className="absolute left-0 right-0 bottom-1 h-3 sm:h-4 bg-red -z-0" />
              </span>{" "}
              made with care.
            </h1>
            <p className="mt-4 sm:mt-6 text-[15px] sm:text-base text-ink-600 max-w-lg leading-relaxed">
              Bold shirts, mugs, stickers, and print-on-demand pieces built for
              creatives, teams, and Houston originals.
            </p>
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3">
              <ButtonLink href="/shop" size="lg" className="w-full sm:w-auto">
                Browse merch
                <ArrowRight className="h-4 w-4" strokeWidth={2} />
              </ButtonLink>
              <ButtonLink
                href="/custom-orders"
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto"
              >
                Request custom quote
              </ButtonLink>
            </div>
            <div className="mt-6 sm:mt-8 flex flex-wrap gap-x-5 gap-y-2 text-xs text-ink-400">
              <span className="inline-flex items-center gap-1.5">
                <Truck className="h-3.5 w-3.5 text-blue" strokeWidth={2} />
                Fulfilled by Printful
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Star className="h-3.5 w-3.5 text-blue" strokeWidth={2} />
                4.9 avg rating
              </span>
            </div>
          </div>

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
        </div>
      </Container>
    </section>
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

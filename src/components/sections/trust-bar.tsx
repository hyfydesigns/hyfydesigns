import { Container } from "@/components/ui/container";
import { TrustPillar, type TrustIcon } from "@/components/ui/trust-pillar";
import { site } from "@/lib/site";

export function TrustBar() {
  return (
    <section className="bg-navy text-cream">
      <Container>
        <div className="hidden sm:grid grid-cols-4 gap-6 py-4">
          {site.trust.map((t) => (
            <TrustPillar
              key={t.label}
              icon={t.icon as TrustIcon}
              label={t.label}
            />
          ))}
        </div>
        <div className="sm:hidden flex gap-2 py-3 overflow-x-auto -mx-5 px-5 no-scrollbar">
          {site.trust.map((t) => (
            <TrustPillar
              key={t.label}
              icon={t.icon as TrustIcon}
              label={shortLabel(t.label)}
              compact
            />
          ))}
        </div>
      </Container>
    </section>
  );
}

function shortLabel(l: string) {
  return l
    .replace("20+ years of print experience", "20+ yrs of print")
    .replace("Local Houston studio", "Local studio")
    .replace("No minimums on print-on-demand", "No minimums");
}

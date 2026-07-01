import { Container } from "@/components/ui/container";
import { ServiceCard, type Service } from "@/components/ui/service-card";

const services: Service[] = [
  {
    icon: "Shirt",
    title: "Print-on-demand shop",
    copy: "Buy from our ready-to-print catalog. Every order printed fresh and shipped by Printful.",
    href: "/shop",
    cta: "Browse the shop",
  },
  {
    icon: "Users",
    title: "Bulk & team orders",
    copy: "Uniforms, event tees, team merch. Volume pricing after 24 pieces, delivered to Houston or shipped nationally.",
    href: "/custom-orders#bulk",
    cta: "Get a bulk quote",
  },
  {
    icon: "Palette",
    title: "Design services",
    copy: "No artwork yet? Our studio designs original prints from a rough idea, mood board, or napkin sketch.",
    href: "/custom-orders#design",
    cta: "Start with design",
  },
];

export function Services() {
  return (
    <section className="py-12 sm:py-16 bg-blue-tint/40">
      <Container>
        <div className="max-w-2xl mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl">
            Three ways to work with the studio.
          </h2>
          <p className="mt-2 text-ink-600 text-sm sm:text-base">
            Ready-made merch, custom projects, or a full design partnership —
            same studio, same care.
          </p>
        </div>
        <div className="grid gap-4 sm:gap-5 md:grid-cols-3">
          {services.map((s) => (
            <ServiceCard key={s.title} service={s} />
          ))}
        </div>
      </Container>
    </section>
  );
}

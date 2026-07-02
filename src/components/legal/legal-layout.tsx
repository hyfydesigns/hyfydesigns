import { Container } from "@/components/ui/container";

export function LegalLayout({
  title,
  effectiveDate,
  children,
}: {
  title: string;
  effectiveDate: string;
  children: React.ReactNode;
}) {
  return (
    <Container size="narrow">
      <div className="py-10 sm:py-16">
        <p className="text-xs uppercase tracking-wider text-ink-400 mb-3">
          Legal
        </p>
        <h1 className="text-3xl sm:text-4xl mb-2">{title}</h1>
        <p className="text-sm text-ink-400 mb-8">
          Effective {effectiveDate}
        </p>
        <div className="legal-prose text-ink-600 text-[15px] leading-relaxed space-y-4">
          {children}
        </div>
      </div>
    </Container>
  );
}

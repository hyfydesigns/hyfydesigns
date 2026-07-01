import Link from "next/link";
import { ArrowRight } from "lucide-react";
import * as Icons from "lucide-react";

export type Service = {
  icon: string;
  title: string;
  copy: string;
  href: string;
  cta: string;
};

export function ServiceCard({ service }: { service: Service }) {
  const Icon =
    (Icons as unknown as Record<
      string,
      React.ComponentType<{ className?: string; strokeWidth?: number }>
    >)[service.icon] ?? Icons.Package;

  return (
    <Link
      href={service.href}
      className="group block p-6 sm:p-7 rounded-2xl bg-white border border-hairline hover:border-navy transition-colors"
    >
      <div className="mb-4 h-11 w-11 rounded-lg bg-blue-tint text-navy inline-flex items-center justify-center">
        <Icon className="h-5 w-5" strokeWidth={1.75} />
      </div>
      <h3 className="text-lg sm:text-xl mb-1.5">{service.title}</h3>
      <p className="text-sm text-ink-600 leading-relaxed mb-4">{service.copy}</p>
      <span className="inline-flex items-center gap-1 text-sm text-navy border-b border-red pb-0.5 group-hover:gap-2 transition-all">
        {service.cta}
        <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
      </span>
    </Link>
  );
}

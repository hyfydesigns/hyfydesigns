import { Award, Store, ShieldCheck, Package, Truck, Star } from "lucide-react";

const iconMap = {
  award: Award,
  "building-store": Store,
  "shield-check": ShieldCheck,
  package: Package,
  truck: Truck,
  star: Star,
} as const;

export type TrustIcon = keyof typeof iconMap;

export function TrustPillar({
  icon,
  label,
  compact = false,
}: {
  icon: TrustIcon;
  label: string;
  compact?: boolean;
}) {
  const Icon = iconMap[icon];
  return (
    <div
      className={
        compact
          ? "inline-flex items-center gap-1.5 text-[11px] whitespace-nowrap px-3 py-1.5 rounded-full bg-white/6 flex-shrink-0"
          : "flex items-center gap-2.5 text-xs sm:text-sm"
      }
    >
      <Icon
        className={compact ? "h-3.5 w-3.5 text-blue-light" : "h-4 w-4 text-blue-light"}
        strokeWidth={2}
      />
      <span>{label}</span>
    </div>
  );
}

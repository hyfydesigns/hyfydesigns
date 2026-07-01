import { cn } from "@/lib/cn";

type Tone = "navy" | "red" | "blue" | "cream";

const tones: Record<Tone, string> = {
  navy: "bg-navy text-cream",
  red: "bg-red text-cream",
  blue: "bg-blue text-cream",
  cream: "bg-cream text-navy border border-navy/20",
};

export function BadgeTag({
  children,
  tone = "navy",
  className,
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.08em] font-medium px-2.5 py-1 rounded-full",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.08em] font-medium text-navy bg-blue-tint px-3 py-1.5 rounded-full",
        className,
      )}
    >
      {children}
    </span>
  );
}

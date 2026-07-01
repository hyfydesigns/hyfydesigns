import { Star } from "lucide-react";
import { cn } from "@/lib/cn";

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  initials: string;
  rating?: number;
};

export function TestimonialCard({
  testimonial,
  variant = "solid",
  className,
}: {
  testimonial: Testimonial;
  variant?: "solid" | "card";
  className?: string;
}) {
  const rating = testimonial.rating ?? 5;
  return (
    <div
      className={cn(
        variant === "solid"
          ? "bg-blue text-cream p-5 sm:p-7 rounded-2xl"
          : "bg-white text-navy p-5 sm:p-6 rounded-2xl border border-hairline",
        className,
      )}
    >
      <div className="flex gap-0.5 mb-2" aria-label={`${rating} star rating`}>
        {Array.from({ length: rating }).map((_, i) => (
          <Star
            key={i}
            className="h-3.5 w-3.5 fill-current text-[#FFC107]"
            strokeWidth={0}
          />
        ))}
      </div>
      <p
        className={cn(
          "font-voice italic leading-snug mb-4",
          "text-[15px] sm:text-lg",
        )}
      >
        &ldquo;{testimonial.quote}&rdquo;
      </p>
      <div className="flex items-center gap-2.5 text-xs sm:text-sm">
        <span
          className={cn(
            "h-8 w-8 rounded-full inline-flex items-center justify-center font-medium text-xs",
            variant === "solid" ? "bg-red text-cream" : "bg-red-tint text-red-deep",
          )}
        >
          {testimonial.initials}
        </span>
        <span className={variant === "solid" ? "opacity-90" : "text-ink-600"}>
          {testimonial.name} · {testimonial.role}
        </span>
      </div>
    </div>
  );
}

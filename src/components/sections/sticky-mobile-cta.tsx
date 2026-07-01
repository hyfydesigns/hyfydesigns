import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function StickyMobileCTA() {
  return (
    <div className="sm:hidden sticky bottom-0 z-30 bg-cream border-t border-hairline">
      <div className="flex items-center gap-3 px-4 py-2.5">
        <div className="flex-1 leading-tight">
          <p className="text-[10px] uppercase tracking-wider text-ink-400">
            Custom project?
          </p>
          <p className="text-sm font-medium text-navy">Quote in 24h</p>
        </div>
        <Link
          href="/custom-orders"
          className="inline-flex items-center gap-1.5 min-h-11 px-4 rounded-lg bg-navy text-cream text-sm font-medium tap"
        >
          Start
          <ArrowRight className="h-4 w-4" strokeWidth={2} />
        </Link>
      </div>
    </div>
  );
}

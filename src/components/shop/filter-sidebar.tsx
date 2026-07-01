"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/cn";

const filters = {
  type: ["t-shirt", "hoodie", "mug", "sticker", "hat", "engraving"],
  category: ["apparel", "drinkware", "accessories", "custom"],
  color: ["Navy", "Cream", "Red", "Blue", "White"],
};

type Group = keyof typeof filters;

export function FilterSidebar({ resultCount }: { resultCount: number }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    if (!drawerOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [drawerOpen]);

  function toggle(group: Group, value: string) {
    const next = new URLSearchParams(params.toString());
    const current = next.getAll(group);
    if (current.includes(value)) {
      next.delete(group);
      current.filter((c) => c !== value).forEach((v) => next.append(group, v));
    } else {
      next.append(group, value);
    }
    router.push(`/shop?${next.toString()}`);
  }

  function isActive(group: Group, value: string) {
    return params.getAll(group).includes(value);
  }

  function clearAll() {
    router.push("/shop");
  }

  const activeCount =
    (Object.keys(filters) as Group[])
      .map((g) => params.getAll(g).length)
      .reduce((a, b) => a + b, 0);

  const content = (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink-600">
          {resultCount} {resultCount === 1 ? "product" : "products"}
        </p>
        {activeCount > 0 && (
          <button
            onClick={clearAll}
            className="text-xs text-red underline tap"
          >
            Clear all
          </button>
        )}
      </div>
      {(Object.keys(filters) as Group[]).map((group) => (
        <div key={group}>
          <h3 className="text-xs uppercase tracking-wider text-ink-400 mb-2.5">
            {group}
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {filters[group].map((value) => (
              <button
                key={value}
                onClick={() => toggle(group, value)}
                className={cn(
                  "text-xs px-3 py-1.5 rounded-full border transition-colors tap",
                  isActive(group, value)
                    ? "bg-navy text-cream border-navy"
                    : "bg-white text-navy border-hairline hover:border-navy",
                )}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block sticky top-20 h-fit">
        <h2 className="text-lg mb-4">Filters</h2>
        {content}
      </aside>

      {/* Mobile trigger */}
      <button
        onClick={() => setDrawerOpen(true)}
        className="lg:hidden inline-flex items-center gap-2 text-sm text-navy border border-navy px-4 min-h-11 rounded-lg font-medium tap"
      >
        <SlidersHorizontal className="h-4 w-4" strokeWidth={2} />
        Filters
        {activeCount > 0 && (
          <span className="ml-1 h-5 min-w-5 px-1 rounded-full bg-red text-cream text-[10px] inline-flex items-center justify-center">
            {activeCount}
          </span>
        )}
      </button>

      {/* Mobile drawer */}
      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden transition-opacity",
          drawerOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        )}
        aria-hidden={!drawerOpen}
      >
        <div
          onClick={() => setDrawerOpen(false)}
          className="absolute inset-0 bg-navy/40"
        />
        <div
          className={cn(
            "absolute inset-x-0 bottom-0 bg-cream rounded-t-2xl max-h-[85dvh] flex flex-col transition-transform duration-300",
            drawerOpen ? "translate-y-0" : "translate-y-full",
          )}
        >
          <div className="flex items-center justify-between px-5 h-14 border-b border-hairline">
            <h2 className="text-lg">Filters</h2>
            <button
              onClick={() => setDrawerOpen(false)}
              aria-label="Close filters"
              className="h-11 w-11 -mr-2 inline-flex items-center justify-center text-navy tap"
            >
              <X className="h-5 w-5" strokeWidth={2} />
            </button>
          </div>
          <div className="p-5 overflow-y-auto flex-1">{content}</div>
          <div className="p-5 border-t border-hairline">
            <button
              onClick={() => setDrawerOpen(false)}
              className="w-full min-h-12 rounded-lg bg-navy text-cream text-sm font-medium tap"
            >
              Show {resultCount} products
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

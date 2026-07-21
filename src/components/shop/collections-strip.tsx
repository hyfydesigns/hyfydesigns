"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Layers } from "lucide-react";

export type CollectionStripCard = {
  slug: string;
  title: string;
  image: string | null;
};

export function CollectionsStrip({ items }: { items: CollectionStripCard[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  function scrollByCard(dir: 1 | -1) {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const amount = card ? card.offsetWidth + 12 : 240;
    el.scrollBy({ left: amount * dir, behavior: "smooth" });
  }

  if (items.length === 0) return null;

  return (
    <div className="relative">
      <div
        ref={scrollerRef}
        className="flex gap-3 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory pb-1"
      >
        {items.map((c) => (
          <Link
            key={c.slug}
            href={`/shop/collection/${c.slug}`}
            data-card
            className="group snap-start flex-shrink-0 w-[150px] sm:w-[200px] lg:w-[220px]"
          >
            <div className="relative aspect-square rounded-xl overflow-hidden bg-blue-tint border border-hairline">
              {c.image ? (
                <Image
                  src={c.image}
                  alt={c.title}
                  fill
                  sizes="220px"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-navy">
                  <Layers className="h-10 w-10" strokeWidth={1.5} />
                </div>
              )}
            </div>
            <p className="mt-2 text-sm font-medium text-navy group-hover:text-blue transition-colors">
              {c.title}
            </p>
          </Link>
        ))}
      </div>

      {items.length > 3 && (
        <>
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            aria-label="Scroll collections left"
            className="hidden sm:inline-flex absolute left-0 top-[calc(50%-14px)] -translate-y-1/2 -translate-x-1/2 h-9 w-9 rounded-full bg-white border border-hairline shadow-sm items-center justify-center text-navy hover:border-navy tap"
          >
            <ChevronLeft className="h-4 w-4" strokeWidth={2} />
          </button>
          <button
            type="button"
            onClick={() => scrollByCard(1)}
            aria-label="Scroll collections right"
            className="hidden sm:inline-flex absolute right-0 top-[calc(50%-14px)] -translate-y-1/2 translate-x-1/2 h-9 w-9 rounded-full bg-white border border-hairline shadow-sm items-center justify-center text-navy hover:border-navy tap"
          >
            <ChevronRight className="h-4 w-4" strokeWidth={2} />
          </button>
        </>
      )}
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { urlFor } from "@/sanity/image";
import type { HeroSlideDoc } from "@/sanity/types";

const AUTOPLAY_MS = 5000;
const SWIPE_THRESHOLD = 40;

export function HeroCarousel({ slides }: { slides: HeroSlideDoc[] }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const total = slides.length;

  useEffect(() => {
    if (total <= 1 || paused) return;
    const timer = setInterval(() => {
      setActive((i) => (i + 1) % total);
    }, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [total, paused]);

  function goTo(i: number) {
    setActive(((i % total) + total) % total);
  }

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > SWIPE_THRESHOLD) {
      goTo(active + (delta < 0 ? 1 : -1));
    }
    touchStartX.current = null;
  }

  return (
    <div
      className="order-2 relative aspect-square lg:aspect-[4/5] rounded-2xl bg-blue overflow-hidden group"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {slides.map((slide, i) => {
        const inner = (
          <Image
            src={urlFor(slide.image).width(1200).height(1500).url()}
            alt={slide.alt}
            fill
            sizes="(min-width: 1024px) 42vw, 100vw"
            className="object-cover"
            priority={i === 0}
          />
        );
        return (
          <div
            key={slide._id}
            aria-hidden={i !== active}
            className={cn(
              "absolute inset-0 transition-opacity duration-700",
              i === active ? "opacity-100" : "opacity-0 pointer-events-none",
            )}
          >
            {slide.linkHref ? (
              <Link
                href={slide.linkHref}
                aria-label={slide.alt}
                className="block h-full w-full"
              >
                {inner}
              </Link>
            ) : (
              inner
            )}
            {slide.badgeLabel && (
              <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-red text-cream text-[10px] uppercase tracking-[0.06em] font-medium pointer-events-none">
                {slide.badgeLabel}
              </div>
            )}
          </div>
        );
      })}

      {total > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
          {slides.map((s, i) => (
            <button
              key={s._id}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Show slide ${i + 1}`}
              aria-current={i === active}
              className={cn(
                "h-2 rounded-full transition-all",
                i === active ? "w-6 bg-cream" : "w-2 bg-cream/50 hover:bg-cream/80",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}

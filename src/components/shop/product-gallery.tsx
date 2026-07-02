"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/cn";

export function ProductGallery({
  images,
  productType,
  productName,
}: {
  images: string[];
  productType: string;
  productName: string;
}) {
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return (
      <div>
        <div className="aspect-square bg-blue-tint rounded-2xl flex items-center justify-center">
          <div className="w-1/2 aspect-[1/1.15] bg-cream rounded-lg flex items-center justify-center">
            <div className="font-mono font-medium text-navy text-2xl leading-tight text-center">
              {productType.toUpperCase()}
              <br />
              <span className="text-red">MOCKUP</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const activeSrc = images[active] ?? images[0];

  return (
    <div>
      <div className="relative aspect-square bg-white rounded-2xl overflow-hidden border border-hairline">
        <Image
          src={activeSrc}
          alt={productName}
          fill
          sizes="(min-width: 1024px) 55vw, 100vw"
          className="object-contain"
          priority
        />
      </div>
      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-6 gap-2">
          {images.slice(0, 8).map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
              className={cn(
                "relative aspect-square rounded-lg overflow-hidden border transition-colors tap",
                i === active
                  ? "border-navy border-2"
                  : "border-hairline hover:border-navy",
              )}
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="120px"
                className="object-contain"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

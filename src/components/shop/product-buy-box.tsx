"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/cn";
import type { PrintfulProduct } from "@/lib/printful";

export function ProductBuyBox({ product }: { product: PrintfulProduct }) {
  const [color, setColor] = useState(product.colors[0]);
  const [size, setSize] = useState<string | null>(
    product.variants[0]?.size ?? null,
  );

  const sizes = Array.from(new Set(product.variants.map((v) => v.size)));
  const isCustom = product.category === "custom";

  return (
    <div>
      <p className="text-xs uppercase tracking-wider text-ink-400">
        {product.type}
      </p>
      <h1 className="mt-1 text-3xl sm:text-4xl">{product.name}</h1>
      <p className="mt-3 text-2xl font-medium text-navy font-display">
        {product.priceDisplay}
      </p>
      <p className="mt-4 text-sm sm:text-base text-ink-600 leading-relaxed">
        {product.description}
      </p>

      {product.colors.length > 0 && (
        <div className="mt-6">
          <p className="text-xs uppercase tracking-wider text-ink-400 mb-2">
            Color · <span className="text-navy normal-case">{color}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                aria-label={c}
                className={cn(
                  "h-9 w-9 rounded-full border-2 flex items-center justify-center transition-all tap",
                  c === color ? "border-navy scale-110" : "border-hairline",
                )}
                style={{ background: swatchColor(c) }}
              >
                {c === color && (
                  <Check
                    className={cn(
                      "h-4 w-4",
                      isLight(c) ? "text-navy" : "text-cream",
                    )}
                    strokeWidth={3}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {sizes.length > 0 && (
        <div className="mt-6">
          <p className="text-xs uppercase tracking-wider text-ink-400 mb-2">
            Size
          </p>
          <div className="grid grid-cols-4 gap-2 max-w-xs">
            {sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={cn(
                  "min-h-11 text-sm font-medium rounded-lg border transition-colors tap",
                  s === size
                    ? "bg-navy text-cream border-navy"
                    : "bg-white text-navy border-hairline hover:border-navy",
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 hidden sm:flex gap-3">
        <button
          type="button"
          className="flex-1 min-h-12 rounded-lg bg-navy text-cream font-medium text-sm inline-flex items-center justify-center gap-2 hover:bg-navy-deep tap"
        >
          {isCustom ? "Start a project" : "Add to bag"}
          <ArrowRight className="h-4 w-4" strokeWidth={2} />
        </button>
        <button
          type="button"
          className="min-h-12 px-6 rounded-lg border border-navy text-navy font-medium text-sm hover:bg-navy hover:text-cream tap"
        >
          Save
        </button>
      </div>

      {/* Sticky mobile add-to-bag */}
      <div className="sm:hidden fixed inset-x-0 bottom-0 z-30 bg-cream border-t border-hairline p-3 flex gap-2 items-center">
        <div className="flex-1">
          <p className="text-[10px] uppercase tracking-wider text-ink-400">
            {color} {size ? `· ${size}` : ""}
          </p>
          <p className="text-sm font-medium text-navy">{product.priceDisplay}</p>
        </div>
        <button
          type="button"
          className="flex-1 min-h-12 rounded-lg bg-navy text-cream text-sm font-medium inline-flex items-center justify-center gap-1.5 tap"
        >
          {isCustom ? "Start" : "Add to bag"}
          <ArrowRight className="h-4 w-4" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}

function swatchColor(name: string): string {
  const map: Record<string, string> = {
    Navy: "#0A2A6E",
    Cream: "#FDFBF5",
    Red: "#E02D2D",
    Blue: "#1E4FD9",
    White: "#FFFFFF",
    Mixed: "linear-gradient(45deg, #0A2A6E 25%, #E02D2D 25% 50%, #1E4FD9 50% 75%, #FDFBF5 75%)",
    Wood: "#B8865A",
    Metal: "#9CA3AF",
    Acrylic: "#E5E7EB",
  };
  return map[name] ?? "#E6EEFB";
}

function isLight(name: string) {
  return ["Cream", "White", "Acrylic"].includes(name);
}

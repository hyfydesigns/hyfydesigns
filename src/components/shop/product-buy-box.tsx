"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/cn";
import { useCart } from "@/lib/cart-store";
import { trackEvent } from "@/components/analytics/posthog-provider";
import type { PrintfulProduct } from "@/lib/printful";
import { swatchColor, isLightSwatch } from "@/lib/swatch-colors";

export function ProductBuyBox({
  product,
  color,
  size,
  onColorChange,
  onSizeChange,
}: {
  product: PrintfulProduct;
  color: string;
  size: string | null;
  onColorChange: (c: string) => void;
  onSizeChange: (s: string) => void;
}) {
  const addItem = useCart((s) => s.addItem);
  const [flash, setFlash] = useState<"idle" | "added">("idle");

  const sizes = Array.from(new Set(product.variants.map((v) => v.size)));
  const isCustom = product.category === "custom";

  const activeVariant = product.variants.find(
    (v) => v.color === color && v.size === size,
  );
  const canAdd = Boolean(activeVariant);

  function handleAdd() {
    if (!activeVariant) return;
    addItem({
      variantId: activeVariant.id,
      slug: product.slug,
      name: product.name,
      color: activeVariant.color,
      size: activeVariant.size,
      price: activeVariant.price,
      quantity: 1,
    });
    trackEvent("add_to_cart", {
      slug: product.slug,
      variant_id: activeVariant.id,
      color: activeVariant.color,
      size: activeVariant.size,
      price: activeVariant.price,
    });
    setFlash("added");
    setTimeout(() => setFlash("idle"), 1500);
  }

  const primaryLabel = isCustom
    ? "Start a project"
    : flash === "added"
      ? "Added"
      : "Add to bag";
  const mobileLabel = isCustom
    ? "Start"
    : flash === "added"
      ? "Added"
      : "Add to bag";

  return (
    <div>
      <p className="text-xs uppercase tracking-wider text-ink-400">
        {product.type}
      </p>
      <h1 className="mt-1 text-3xl sm:text-4xl">{product.name}</h1>
      <p className="mt-3 text-2xl font-medium text-navy font-display">
        {product.priceDisplay}
      </p>

      {product.colors.length > 0 && (
        <div className="mt-6">
          <p className="text-xs uppercase tracking-wider text-ink-400 mb-2">
            Color · <span className="text-navy normal-case">{color}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((c) => {
              const bg = swatchColor(c);
              const isGradient = bg.startsWith("linear");
              return (
                <button
                  key={c}
                  onClick={() => onColorChange(c)}
                  aria-label={c}
                  title={c}
                  className={cn(
                    "h-9 w-9 rounded-full border-2 flex items-center justify-center transition-all tap",
                    c === color
                      ? "border-navy scale-110 ring-2 ring-navy/10"
                      : "border-hairline-strong hover:border-navy",
                  )}
                  style={
                    isGradient ? { backgroundImage: bg } : { background: bg }
                  }
                >
                  {c === color && (
                    <Check
                      className={cn(
                        "h-4 w-4",
                        isLightSwatch(c) ? "text-navy" : "text-cream",
                      )}
                      strokeWidth={3}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {sizes.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs uppercase tracking-wider text-ink-400">
              Size
            </p>
            {size && !isCustom && !canAdd && (
              <p className="text-xs text-red">
                Not available in {color}
              </p>
            )}
          </div>
          <div className="grid grid-cols-4 gap-2 max-w-xs">
            {sizes.map((s) => {
              const availableInColor = product.variants.some(
                (v) => v.color === color && v.size === s,
              );
              return (
                <button
                  key={s}
                  onClick={() => onSizeChange(s)}
                  disabled={color !== "" && !availableInColor}
                  className={cn(
                    "min-h-11 text-sm font-medium rounded-lg border transition-colors tap",
                    s === size
                      ? "bg-navy text-cream border-navy"
                      : availableInColor
                        ? "bg-white text-navy border-hairline hover:border-navy"
                        : "bg-white/40 text-ink-200 border-hairline line-through cursor-not-allowed",
                  )}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-8 hidden sm:flex gap-3">
        {isCustom ? (
          <Link
            href="/custom-orders"
            className="flex-1 min-h-12 rounded-lg bg-navy text-cream font-medium text-sm inline-flex items-center justify-center gap-2 hover:bg-navy-deep tap"
          >
            {primaryLabel}
            <ArrowRight className="h-4 w-4" strokeWidth={2} />
          </Link>
        ) : (
          <button
            type="button"
            onClick={handleAdd}
            disabled={!canAdd}
            className={cn(
              "flex-1 min-h-12 rounded-lg font-medium text-sm inline-flex items-center justify-center gap-2 tap transition-colors",
              canAdd
                ? "bg-navy text-cream hover:bg-navy-deep"
                : "bg-ink-200 text-cream cursor-not-allowed",
              flash === "added" && "bg-blue text-cream",
            )}
          >
            {flash === "added" ? (
              <Check className="h-4 w-4" strokeWidth={2.5} />
            ) : (
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            )}
            {primaryLabel}
          </button>
        )}
      </div>

      {/* Sticky mobile add-to-bag */}
      <div className="sm:hidden fixed inset-x-0 bottom-0 z-30 bg-cream border-t border-hairline p-3 flex gap-2 items-center">
        <div className="flex-1">
          <p className="text-[10px] uppercase tracking-wider text-ink-400">
            {color} {size ? `· ${size}` : ""}
          </p>
          <p className="text-sm font-medium text-navy">{product.priceDisplay}</p>
        </div>
        {isCustom ? (
          <Link
            href="/custom-orders"
            className="flex-1 min-h-12 rounded-lg bg-navy text-cream text-sm font-medium inline-flex items-center justify-center gap-1.5 tap"
          >
            {mobileLabel}
            <ArrowRight className="h-4 w-4" strokeWidth={2} />
          </Link>
        ) : (
          <button
            type="button"
            onClick={handleAdd}
            disabled={!canAdd}
            className={cn(
              "flex-1 min-h-12 rounded-lg text-sm font-medium inline-flex items-center justify-center gap-1.5 tap transition-colors",
              canAdd
                ? "bg-navy text-cream"
                : "bg-ink-200 text-cream cursor-not-allowed",
              flash === "added" && "bg-blue text-cream",
            )}
          >
            {mobileLabel}
            {flash === "added" ? (
              <Check className="h-4 w-4" strokeWidth={2.5} />
            ) : (
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            )}
          </button>
        )}
      </div>
    </div>
  );
}

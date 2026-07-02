"use client";

import { useMemo, useState } from "react";
import type { PrintfulProduct } from "@/lib/printful";
import { ProductGallery } from "./product-gallery";
import { ProductBuyBox } from "./product-buy-box";

export function ProductDetail({ product }: { product: PrintfulProduct }) {
  const [color, setColor] = useState(product.colors[0] ?? "");
  const [size, setSize] = useState<string | null>(
    product.variants[0]?.size ?? null,
  );

  // When a color is selected, prefer showing that color's variant mockup
  // first, then the rest.
  const images = useMemo(() => {
    if (!color) return product.images;
    const colorVariants = product.variants.filter((v) => v.color === color);
    const colorMockups = Array.from(
      new Set(colorVariants.map((v) => v.mockupUrl).filter(Boolean) as string[]),
    );
    const rest = product.images.filter((src) => !colorMockups.includes(src));
    return [...colorMockups, ...rest];
  }, [color, product.images, product.variants]);

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-14 py-6">
      <div className="lg:sticky lg:top-20 lg:h-fit">
        <ProductGallery
          key={color}
          images={images}
          productType={product.type}
          productName={product.name}
        />
      </div>
      <ProductBuyBox
        product={product}
        color={color}
        size={size}
        onColorChange={setColor}
        onSizeChange={setSize}
      />
    </div>
  );
}

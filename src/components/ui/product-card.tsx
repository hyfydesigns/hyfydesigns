import Link from "next/link";
import * as Icons from "lucide-react";
import { Plus, ArrowRight, Package } from "lucide-react";
import { BadgeTag } from "./badge";
import { cn } from "@/lib/cn";

export type Product = {
  slug: string;
  name: string;
  meta: string;
  price: string;
  badge?: { label: string; tone: "navy" | "red" | "blue" };
  visual: {
    kind: "icon" | "image";
    src: string;
    bg: "red-tint" | "blue-tint" | "navy" | "cream";
  };
  isQuote?: boolean;
};

const bgClass: Record<Product["visual"]["bg"], string> = {
  "red-tint": "bg-red-tint text-red-deep",
  "blue-tint": "bg-blue-tint text-blue",
  navy: "bg-navy text-red",
  cream: "bg-cream text-navy border border-dashed border-navy/20",
};

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/shop/${product.slug}`}
      className="group block bg-white rounded-xl overflow-hidden border border-hairline hover:border-hairline-strong transition-colors"
    >
      <div
        className={cn(
          "aspect-square relative flex items-center justify-center overflow-hidden",
          bgClass[product.visual.bg],
        )}
      >
        {product.badge && (
          <div className="absolute top-2 left-2 z-10">
            <BadgeTag tone={product.badge.tone}>{product.badge.label}</BadgeTag>
          </div>
        )}
        <ProductVisual product={product} />
        <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/5 transition-colors" />
      </div>
      <div className="p-3 sm:p-4">
        <p className="text-sm font-medium text-navy leading-tight">
          {product.name}
        </p>
        <p className="text-xs text-ink-400 mt-0.5">{product.meta}</p>
        <div className="mt-2.5 flex items-center justify-between">
          <span className="text-sm font-medium text-navy">
            {product.isQuote ? "Quote" : product.price}
          </span>
          <span
            className={cn(
              "inline-flex items-center justify-center rounded-md text-xs font-medium",
              "h-9 w-9 sm:h-auto sm:w-auto sm:px-2.5 sm:py-1.5",
              product.isQuote
                ? "text-navy hover:bg-blue-tint"
                : "bg-navy text-cream hover:bg-navy-deep",
            )}
            aria-label={product.isQuote ? "Start custom order" : "Quick add"}
          >
            {product.isQuote ? (
              <ArrowRight className="h-4 w-4" />
            ) : (
              <>
                <Plus className="h-4 w-4 sm:mr-1" />
                <span className="hidden sm:inline">Quick add</span>
              </>
            )}
          </span>
        </div>
      </div>
    </Link>
  );
}

function ProductVisual({ product }: { product: Product }) {
  if (product.visual.kind === "image") {
    return (
      <img
        src={product.visual.src}
        alt={product.name}
        className="w-full h-full object-cover"
        loading="lazy"
      />
    );
  }
  const Icon =
    (Icons as unknown as Record<
      string,
      React.ComponentType<{ className?: string; strokeWidth?: number }>
    >)[product.visual.src] ?? Package;
  return <Icon className="h-16 w-16 sm:h-20 sm:w-20" strokeWidth={1.5} />;
}

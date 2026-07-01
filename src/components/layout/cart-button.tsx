"use client";

import { ShoppingBag } from "lucide-react";
import { useCart, cartCount } from "@/lib/cart-store";

export function CartButton() {
  const items = useCart((s) => s.items);
  const setOpen = useCart((s) => s.setOpen);
  const count = cartCount(items);

  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      aria-label={`Cart · ${count} items`}
      className="h-11 w-11 -mr-2 inline-flex items-center justify-center hover:text-blue tap relative"
    >
      <ShoppingBag className="h-5 w-5" strokeWidth={2} />
      {count > 0 && (
        <span className="absolute top-1.5 right-1.5 h-4 min-w-4 px-1 rounded-full bg-red text-cream text-[10px] font-medium inline-flex items-center justify-center">
          {count}
        </span>
      )}
    </button>
  );
}

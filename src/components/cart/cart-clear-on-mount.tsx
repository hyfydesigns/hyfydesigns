"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useCart, cartTotal, cartCount } from "@/lib/cart-store";
import { trackEvent } from "@/components/analytics/posthog-provider";

export function CartClearOnMount() {
  const searchParams = useSearchParams();
  const items = useCart((s) => s.items);
  const clear = useCart((s) => s.clear);
  const setOpen = useCart((s) => s.setOpen);

  useEffect(() => {
    const isPostCheckout =
      searchParams.get("session_id") || searchParams.get("mock");
    if (!isPostCheckout) return;
    if (items.length === 0) return;

    trackEvent("purchase_completed", {
      session_id: searchParams.get("session_id") ?? "mock",
      item_count: cartCount(items),
      subtotal: cartTotal(items),
    });
    clear();
    setOpen(false);
  }, [searchParams, items, clear, setOpen]);

  return null;
}

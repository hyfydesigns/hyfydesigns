"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart, cartTotal, cartCount } from "@/lib/cart-store";
import { trackEvent } from "@/components/analytics/posthog-provider";
import { cn } from "@/lib/cn";

export function CartDrawer() {
  const router = useRouter();
  const items = useCart((s) => s.items);
  const open = useCart((s) => s.open);
  const setOpen = useCart((s) => s.setOpen);
  const removeItem = useCart((s) => s.removeItem);
  const updateQuantity = useCart((s) => s.updateQuantity);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  function onCheckout() {
    trackEvent("checkout_opened", {
      item_count: cartCount(items),
      subtotal: cartTotal(items),
    });
    setOpen(false);
    router.push("/checkout");
  }

  const total = cartTotal(items);
  const count = cartCount(items);

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 transition-opacity",
        open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
      )}
      aria-hidden={!open}
    >
      <div
        onClick={() => setOpen(false)}
        className="absolute inset-0 bg-navy/40"
      />
      <div
        className={cn(
          "absolute inset-y-0 right-0 w-full sm:w-[420px] bg-cream flex flex-col transition-transform duration-300",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-center justify-between px-5 h-14 border-b border-hairline">
          <h2 className="text-lg flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" strokeWidth={2} />
            Your bag
            <span className="text-sm text-ink-400 font-normal">({count})</span>
          </h2>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close cart"
            className="h-11 w-11 -mr-2 inline-flex items-center justify-center text-navy tap"
          >
            <X className="h-5 w-5" strokeWidth={2} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
            <ShoppingBag
              className="h-12 w-12 text-ink-200 mb-3"
              strokeWidth={1.5}
            />
            <p className="text-navy font-medium">Your bag is empty.</p>
            <p className="mt-1 text-sm text-ink-600">Let&apos;s fix that.</p>
            <a
              href="/shop"
              className="mt-6 min-h-11 px-6 rounded-lg bg-navy text-cream text-sm font-medium inline-flex items-center gap-1.5 tap"
              onClick={() => setOpen(false)}
            >
              Browse merch
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </a>
          </div>
        ) : (
          <>
            <ul className="flex-1 overflow-y-auto p-5 space-y-4">
              {items.map((item) => (
                <li
                  key={item.variantId}
                  className="flex gap-3 pb-4 border-b border-hairline last:border-b-0"
                >
                  <div className="h-16 w-16 rounded-lg bg-blue-tint flex-shrink-0 overflow-hidden relative">
                    {item.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.image}
                        alt={item.name}
                        className="absolute inset-0 h-full w-full object-contain"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-navy truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-ink-400 mt-0.5">
                      {item.color} · {item.size}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-1 border border-hairline rounded-md">
                        <button
                          onClick={() =>
                            updateQuantity(item.variantId, item.quantity - 1)
                          }
                          aria-label="Decrease quantity"
                          className="h-8 w-8 inline-flex items-center justify-center text-navy tap"
                        >
                          <Minus className="h-3.5 w-3.5" strokeWidth={2} />
                        </button>
                        <span className="text-sm w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.variantId, item.quantity + 1)
                          }
                          aria-label="Increase quantity"
                          className="h-8 w-8 inline-flex items-center justify-center text-navy tap"
                        >
                          <Plus className="h-3.5 w-3.5" strokeWidth={2} />
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-navy">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                        <button
                          onClick={() => removeItem(item.variantId)}
                          className="text-xs text-red underline tap"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-hairline p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-ink-600">Subtotal</span>
                <span className="text-lg font-medium text-navy font-display">
                  ${total.toFixed(2)}
                </span>
              </div>
              <p className="text-xs text-ink-400">
                Shipping and taxes calculated at checkout.
              </p>
              <button
                onClick={onCheckout}
                className="w-full min-h-12 rounded-lg bg-navy text-cream text-sm font-medium inline-flex items-center justify-center gap-2 hover:bg-navy-deep tap"
              >
                Checkout
                <ArrowRight className="h-4 w-4" strokeWidth={2} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

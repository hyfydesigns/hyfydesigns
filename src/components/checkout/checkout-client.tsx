"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Truck } from "lucide-react";
import { useCart, cartTotal, cartCount } from "@/lib/cart-store";
import { trackEvent } from "@/components/analytics/posthog-provider";
import { cn } from "@/lib/cn";
import type { ShippingAddress, ShippingRate } from "@/lib/printful";

type Status = "address" | "loadingRates" | "rates" | "loadingCheckout";

export function CheckoutClient() {
  const items = useCart((s) => s.items);
  const [status, setStatus] = useState<Status>("address");
  const [error, setError] = useState<string | null>(null);
  const [rates, setRates] = useState<ShippingRate[]>([]);
  const [selectedRateId, setSelectedRateId] = useState<string | null>(null);

  const [address, setAddress] = useState<ShippingAddress & { email: string }>({
    name: "",
    email: "",
    address1: "",
    city: "",
    state: "",
    zip: "",
    country: "US",
  });

  const subtotal = cartTotal(items);
  const selectedRate = rates.find((r) => r.id === selectedRateId);

  if (items.length === 0) {
    return (
      <div className="py-16 text-center bg-white border border-hairline rounded-2xl">
        <p className="text-navy font-medium">Your bag is empty.</p>
        <p className="mt-1 text-sm text-ink-600">
          Add something before checking out.
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-flex items-center gap-1.5 min-h-11 px-6 rounded-lg bg-navy text-cream text-sm font-medium tap"
        >
          Browse merch
          <ArrowRight className="h-4 w-4" strokeWidth={2} />
        </Link>
      </div>
    );
  }

  async function onAddressSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setStatus("loadingRates");
    trackEvent("shipping_lookup_started", {
      state: address.state,
      item_count: cartCount(items),
    });
    try {
      const res = await fetch("/api/shipping-rates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: {
            name: address.name,
            address1: address.address1,
            city: address.city,
            state: address.state,
            zip: address.zip,
            country: address.country,
          },
          items: items.map((i) => ({
            variantId: i.variantId,
            quantity: i.quantity,
          })),
        }),
      });
      const data = (await res.json()) as {
        rates?: ShippingRate[];
        error?: string;
      };
      if (!res.ok || !data.rates) {
        throw new Error(data.error ?? `HTTP ${res.status}`);
      }
      setRates(data.rates);
      setSelectedRateId(data.rates[0]?.id ?? null);
      setStatus("rates");
    } catch (err) {
      setError((err as Error).message);
      setStatus("address");
    }
  }

  async function onCheckout() {
    if (!selectedRate) return;
    setStatus("loadingCheckout");
    setError(null);
    trackEvent("checkout_started", {
      item_count: cartCount(items),
      subtotal,
      shipping: selectedRate.rate,
      shipping_method: selectedRate.name,
    });
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          email: address.email,
          address: {
            name: address.name,
            address1: address.address1,
            city: address.city,
            state: address.state,
            zip: address.zip,
            country: address.country,
          },
          rate: selectedRate,
        }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!data.url) throw new Error(data.error ?? "no checkout URL returned");
      window.location.href = data.url;
    } catch (err) {
      setError((err as Error).message);
      setStatus("rates");
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
      <div className="space-y-8 min-w-0">
        <section className="bg-white border border-hairline rounded-2xl p-5 sm:p-7">
          <div className="flex items-center gap-2 mb-5">
            <span className="h-6 w-6 rounded-full bg-navy text-cream text-xs font-medium inline-flex items-center justify-center">
              1
            </span>
            <h2 className="text-lg">Shipping address</h2>
          </div>

          <form onSubmit={onAddressSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full name" required>
                <input
                  required
                  value={address.name}
                  onChange={(e) =>
                    setAddress({ ...address, name: e.target.value })
                  }
                  className={fieldClass}
                  disabled={status !== "address"}
                />
              </Field>
              <Field label="Email" required>
                <input
                  required
                  type="email"
                  value={address.email}
                  onChange={(e) =>
                    setAddress({ ...address, email: e.target.value })
                  }
                  className={fieldClass}
                  disabled={status !== "address"}
                />
              </Field>
            </div>
            <Field label="Street address" required>
              <input
                required
                value={address.address1}
                onChange={(e) =>
                  setAddress({ ...address, address1: e.target.value })
                }
                placeholder="123 Main St"
                className={fieldClass}
                disabled={status !== "address"}
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="City" required>
                <input
                  required
                  value={address.city}
                  onChange={(e) =>
                    setAddress({ ...address, city: e.target.value })
                  }
                  className={fieldClass}
                  disabled={status !== "address"}
                />
              </Field>
              <Field label="State" required>
                <input
                  required
                  value={address.state}
                  onChange={(e) =>
                    setAddress({
                      ...address,
                      state: e.target.value.toUpperCase().slice(0, 2),
                    })
                  }
                  placeholder="TX"
                  maxLength={2}
                  className={fieldClass}
                  disabled={status !== "address"}
                />
              </Field>
              <Field label="ZIP" required>
                <input
                  required
                  value={address.zip}
                  onChange={(e) =>
                    setAddress({ ...address, zip: e.target.value })
                  }
                  placeholder="77002"
                  maxLength={10}
                  className={fieldClass}
                  disabled={status !== "address"}
                />
              </Field>
            </div>

            {status === "address" && (
              <button
                type="submit"
                className="mt-2 w-full sm:w-auto min-h-12 px-8 rounded-lg bg-navy text-cream font-medium text-sm inline-flex items-center justify-center gap-2 tap"
              >
                Calculate shipping
                <ArrowRight className="h-4 w-4" strokeWidth={2} />
              </button>
            )}
            {status === "loadingRates" && (
              <p className="text-sm text-ink-600 mt-2">
                Getting live rates from Printful…
              </p>
            )}
          </form>
        </section>

        {(status === "rates" || status === "loadingCheckout") && (
          <section className="bg-white border border-hairline rounded-2xl p-5 sm:p-7">
            <div className="flex items-center gap-2 mb-5">
              <span className="h-6 w-6 rounded-full bg-navy text-cream text-xs font-medium inline-flex items-center justify-center">
                2
              </span>
              <h2 className="text-lg">Shipping method</h2>
              <button
                type="button"
                onClick={() => setStatus("address")}
                className="ml-auto text-xs text-navy underline"
                disabled={status === "loadingCheckout"}
              >
                Edit address
              </button>
            </div>

            <div className="space-y-2">
              {rates.map((r) => {
                const active = r.id === selectedRateId;
                return (
                  <label
                    key={r.id}
                    className={cn(
                      "flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors",
                      active
                        ? "border-navy bg-blue-tint/40"
                        : "border-hairline hover:border-navy",
                    )}
                  >
                    <input
                      type="radio"
                      name="rate"
                      value={r.id}
                      checked={active}
                      onChange={() => setSelectedRateId(r.id)}
                      className="mt-1 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <span className="font-medium text-navy text-sm min-w-0 break-words">
                          {r.name}
                        </span>
                        <span className="font-medium text-navy flex-shrink-0">
                          ${r.rate.toFixed(2)}
                        </span>
                      </div>
                      <p className="text-xs text-ink-400 mt-0.5 flex items-start gap-1">
                        <Truck
                          className="h-3 w-3 mt-0.5 flex-shrink-0"
                          strokeWidth={2}
                        />
                        <span>
                          {r.minDays}–{r.maxDays} business days after
                          fulfillment
                        </span>
                      </p>
                    </div>
                    {active && (
                      <Check
                        className="h-4 w-4 text-navy flex-shrink-0"
                        strokeWidth={2.5}
                      />
                    )}
                  </label>
                );
              })}
            </div>

            <button
              type="button"
              onClick={onCheckout}
              disabled={!selectedRate || status === "loadingCheckout"}
              className="mt-6 w-full min-h-12 rounded-lg bg-navy text-cream font-medium text-sm inline-flex items-center justify-center gap-2 disabled:opacity-50 tap"
            >
              {status === "loadingCheckout"
                ? "Redirecting to Stripe…"
                : "Continue to payment"}
              {status !== "loadingCheckout" && (
                <ArrowRight className="h-4 w-4" strokeWidth={2} />
              )}
            </button>
          </section>
        )}

        {error && (
          <div className="bg-red-tint text-red-deep p-4 rounded-xl text-sm">
            {error}
          </div>
        )}
      </div>

      <aside className="lg:sticky lg:top-20 lg:h-fit min-w-0">
        <div className="bg-white border border-hairline rounded-2xl p-5 sm:p-6">
          <h3 className="text-lg mb-4">Order summary</h3>
          <ul className="space-y-3 pb-4 border-b border-hairline">
            {items.map((i) => (
              <li key={i.variantId} className="flex gap-3">
                <div className="h-14 w-14 rounded-lg bg-blue-tint overflow-hidden relative flex-shrink-0">
                  {i.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={i.image}
                      alt={i.name}
                      className="absolute inset-0 h-full w-full object-contain"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-navy truncate">
                    {i.name}
                  </p>
                  <p className="text-xs text-ink-400">
                    {i.color} · {i.size} · Qty {i.quantity}
                  </p>
                </div>
                <p className="text-sm font-medium text-navy">
                  ${(i.price * i.quantity).toFixed(2)}
                </p>
              </li>
            ))}
          </ul>
          <div className="pt-4 space-y-2 text-sm">
            <div className="flex justify-between text-ink-600">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-ink-600">
              <span>Shipping</span>
              <span>
                {selectedRate
                  ? `$${selectedRate.rate.toFixed(2)}`
                  : status === "address"
                    ? "Enter address"
                    : "—"}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t border-hairline text-navy font-medium text-base">
              <span>Total</span>
              <span>
                $
                {(subtotal + (selectedRate?.rate ?? 0)).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

const fieldClass =
  "w-full min-h-11 rounded-lg border border-hairline-strong bg-white px-3 text-sm focus:outline-none focus:border-navy disabled:bg-cream-warm/40 disabled:text-ink-400";

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-xs uppercase tracking-wider text-ink-400 mb-1.5">
        {label}
        {required && <span className="text-red ml-0.5">*</span>}
      </span>
      {children}
    </label>
  );
}

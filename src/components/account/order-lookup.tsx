"use client";

import { useState } from "react";
import { Search, Package, MapPin, Check } from "lucide-react";

type OrderResult = {
  reference: string;
  email: string;
  placedAt: number;
  status: string;
  currency: string;
  amountTotal: number;
  amountShipping: number;
  items: {
    name: string;
    quantity: number;
    amountTotal: number;
    thumbnail: string | null;
  }[];
  shipping: {
    name: string;
    line1: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  } | null;
};

export function OrderLookup() {
  const [email, setEmail] = useState("");
  const [reference, setReference] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "found">("idle");
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<OrderResult | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError(null);
    setOrder(null);
    try {
      const res = await fetch("/api/orders/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, reference }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        setStatus("idle");
        return;
      }
      setOrder(data as OrderResult);
      setStatus("found");
    } catch {
      setError("Couldn't reach our servers. Try again in a moment.");
      setStatus("idle");
    }
  }

  function reset() {
    setOrder(null);
    setStatus("idle");
    setError(null);
  }

  if (status === "found" && order) {
    return <OrderResultCard order={order} onReset={reset} />;
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <label className="block">
        <span className="block text-xs uppercase tracking-wider text-ink-400 mb-1.5">
          Email you used at checkout <span className="text-red">*</span>
        </span>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={fieldClass}
        />
      </label>

      <label className="block">
        <span className="block text-xs uppercase tracking-wider text-ink-400 mb-1.5">
          Order reference <span className="text-red">*</span>
        </span>
        <input
          required
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          placeholder="cs_live_..."
          className={`${fieldClass} font-mono text-xs`}
        />
        <span className="block text-xs text-ink-400 mt-1.5 leading-relaxed">
          Starts with <code className="font-mono">cs_</code>. Find it in the
          confirmation email or Stripe receipt you got at checkout.
        </span>
      </label>

      {error && (
        <div className="bg-red-tint text-red-deep p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full sm:w-auto min-h-12 px-8 rounded-lg bg-navy text-cream font-medium text-sm inline-flex items-center justify-center gap-2 disabled:opacity-50 tap"
      >
        <Search className="h-4 w-4" strokeWidth={2} />
        {status === "loading" ? "Looking up…" : "Look up order"}
      </button>
    </form>
  );
}

function OrderResultCard({
  order,
  onReset,
}: {
  order: OrderResult;
  onReset: () => void;
}) {
  const currency = order.currency.toUpperCase();
  const fmt = (cents: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency }).format(
      cents / 100,
    );
  const placed = new Date(order.placedAt * 1000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs bg-blue-tint text-navy px-2.5 py-1 rounded-full">
            <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
            {order.status === "paid" ? "Order confirmed" : order.status}
          </div>
          <p className="mt-2 text-sm text-ink-600">Placed on {placed}</p>
          <p className="text-xs text-ink-400 font-mono mt-1 break-all">
            {order.reference}
          </p>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="text-xs text-navy underline shrink-0"
        >
          Look up another
        </button>
      </div>

      <div>
        <h3 className="text-sm font-medium text-navy mb-3 inline-flex items-center gap-1.5">
          <Package className="h-4 w-4" strokeWidth={2} />
          Items
        </h3>
        <ul className="divide-y divide-hairline border-y border-hairline">
          {order.items.map((item, i) => (
            <li key={i} className="flex gap-3 py-3">
              <div className="h-14 w-14 rounded-lg bg-blue-tint overflow-hidden relative flex-shrink-0">
                {item.thumbnail && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.thumbnail}
                    alt=""
                    className="absolute inset-0 h-full w-full object-contain"
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-navy">{item.name}</p>
                <p className="text-xs text-ink-400">Qty {item.quantity}</p>
              </div>
              <p className="text-sm font-medium text-navy whitespace-nowrap">
                {fmt(item.amountTotal)}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {order.shipping && (
        <div>
          <h3 className="text-sm font-medium text-navy mb-2 inline-flex items-center gap-1.5">
            <MapPin className="h-4 w-4" strokeWidth={2} />
            Shipping to
          </h3>
          <address className="not-italic text-sm text-ink-600 leading-relaxed">
            {order.shipping.name}
            <br />
            {order.shipping.line1}
            <br />
            {order.shipping.city}, {order.shipping.state} {order.shipping.zip}
            <br />
            {order.shipping.country}
          </address>
        </div>
      )}

      <div className="pt-3 border-t border-hairline space-y-1.5 text-sm">
        {order.amountShipping > 0 && (
          <div className="flex justify-between text-ink-600">
            <span>Shipping</span>
            <span>{fmt(order.amountShipping)}</span>
          </div>
        )}
        <div className="flex justify-between text-navy font-medium text-base">
          <span>Total</span>
          <span>{fmt(order.amountTotal)}</span>
        </div>
      </div>

      <p className="text-xs text-ink-400 leading-relaxed">
        Print production usually takes 2–5 business days, then shipping.
        Tracking is emailed by Printful when your order ships.
      </p>
    </div>
  );
}

const fieldClass =
  "w-full min-h-11 rounded-lg border border-hairline-strong bg-white px-3 text-sm focus:outline-none focus:border-navy";

"use client";

import { useEffect, useMemo, useState } from "react";
import { set, unset, useFormValue, type StringInputProps } from "sanity";

type ProductRow = {
  slug: string;
  name: string;
  colors?: string[];
};

export function FeaturedColorPicker(props: StringInputProps) {
  const slug = useFormValue(["slug"]);
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/products/list")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<ProductRow[]>;
      })
      .then((data) => {
        if (cancelled) return;
        setProducts(data);
        setLoading(false);
      })
      .catch((e) => {
        if (cancelled) return;
        setError((e as Error).message);
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const selectedProduct = useMemo(
    () => products.find((p) => p.slug === slug),
    [products, slug],
  );

  const value = typeof props.value === "string" ? props.value : "";

  function pick(color: string) {
    props.onChange(color ? set(color) : unset());
  }

  if (typeof slug !== "string" || !slug) {
    return (
      <div style={noteStyle}>
        Pick a product above first, then the colors will appear here.
      </div>
    );
  }

  if (loading) {
    return <div style={noteStyle}>Loading colors from Printful…</div>;
  }

  if (error) {
    return (
      <div style={{ ...noteStyle, background: "#fde2e2", color: "#8a1a1a" }}>
        Failed to load: {error}
      </div>
    );
  }

  if (!selectedProduct) {
    return (
      <div style={{ ...noteStyle, background: "#fff4e5", color: "#7a4a00" }}>
        Product &ldquo;{slug}&rdquo; not found in Printful.
      </div>
    );
  }

  const colors = selectedProduct.colors ?? [];

  if (colors.length === 0) {
    return (
      <div style={noteStyle}>
        This product doesn&rsquo;t have color variants.
      </div>
    );
  }

  return (
    <select
      value={value}
      onChange={(e) => pick(e.currentTarget.value)}
      style={selectStyle}
    >
      <option value="">Use Printful default</option>
      {colors.map((c) => (
        <option key={c} value={c}>
          {c}
        </option>
      ))}
    </select>
  );
}

const noteStyle: React.CSSProperties = {
  padding: 12,
  borderRadius: 4,
  fontSize: 13,
  background: "#f4f4f4",
  color: "#555",
};

const selectStyle: React.CSSProperties = {
  width: "100%",
  padding: "8px 12px",
  fontSize: 14,
  border: "1px solid #ddd",
  borderRadius: 4,
  background: "#fff",
};

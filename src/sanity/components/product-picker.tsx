"use client";

import { useEffect, useMemo, useState } from "react";
import { set, unset, type ArrayOfPrimitivesInputProps } from "sanity";

type ProductRow = {
  slug: string;
  name: string;
  thumbnail: string | null;
  type: string;
  priceDisplay: string;
};

export function ProductPicker(
  props: ArrayOfPrimitivesInputProps<string | number | boolean>,
) {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const value = useMemo<string[]>(
    () =>
      Array.isArray(props.value)
        ? (props.value.filter((v) => typeof v === "string") as string[])
        : [],
    [props.value],
  );

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

  const filtered = useMemo(() => {
    if (!query) return products;
    const q = query.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q),
    );
  }, [products, query]);

  function toggle(slug: string) {
    const next = value.includes(slug)
      ? value.filter((s) => s !== slug)
      : [...value, slug];
    props.onChange(next.length === 0 ? unset() : set(next));
  }

  function move(slug: string, delta: -1 | 1) {
    const idx = value.indexOf(slug);
    const target = idx + delta;
    if (idx === -1 || target < 0 || target >= value.length) return;
    const next = [...value];
    [next[idx], next[target]] = [next[target], next[idx]];
    props.onChange(set(next));
  }

  const selectedProducts = value
    .map((slug) => products.find((p) => p.slug === slug))
    .filter((p): p is ProductRow => Boolean(p));

  return (
    <div style={outerStyle}>
      {loading && (
        <div style={{ ...noteStyle, background: "#f4f4f4" }}>
          Loading products from Printful…
        </div>
      )}

      {error && (
        <div style={{ ...noteStyle, background: "#fde2e2", color: "#8a1a1a" }}>
          Failed to load products: {error}
        </div>
      )}

      {!loading && !error && products.length === 0 && (
        <div style={{ ...noteStyle, background: "#fff4e5", color: "#7a4a00" }}>
          No products found. Confirm PRINTFUL_API_KEY is set in Vercel.
        </div>
      )}

      {!loading && products.length > 0 && (
        <>
          <input
            type="text"
            placeholder="Search products…"
            value={query}
            onChange={(e) => setQuery(e.currentTarget.value)}
            style={searchStyle}
          />

          {selectedProducts.length > 0 && (
            <div style={selectedBoxStyle}>
              <div style={selectedHeaderStyle}>
                Selected ({selectedProducts.length}) — order shown here is the
                order on the collection page
              </div>
              <div>
                {selectedProducts.map((p, i) => (
                  <div key={p.slug} style={selectedRowStyle}>
                    <span style={{ flex: 1, fontSize: 13 }}>
                      {i + 1}. {p.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => move(p.slug, -1)}
                      disabled={i === 0}
                      style={miniBtnStyle(i === 0)}
                      aria-label="Move up"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => move(p.slug, 1)}
                      disabled={i === selectedProducts.length - 1}
                      style={miniBtnStyle(i === selectedProducts.length - 1)}
                      aria-label="Move down"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() => toggle(p.slug)}
                      style={miniBtnStyle(false)}
                      aria-label="Remove"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={listBoxStyle}>
            {filtered.map((p) => {
              const checked = value.includes(p.slug);
              return (
                <label
                  key={p.slug}
                  style={{
                    ...rowStyle,
                    background: checked ? "#eaf2ff" : "transparent",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggle(p.slug)}
                    style={{ margin: 0 }}
                  />
                  {p.thumbnail && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.thumbnail}
                      alt=""
                      width={40}
                      height={40}
                      style={thumbStyle}
                    />
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={nameStyle}>{p.name}</div>
                    <div style={metaStyle}>
                      {p.type} · {p.priceDisplay} · {p.slug}
                    </div>
                  </div>
                </label>
              );
            })}
            {filtered.length === 0 && (
              <div style={{ padding: 16, fontSize: 13, color: "#6b6b67" }}>
                No products match &ldquo;{query}&rdquo;.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

const outerStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 12,
};
const noteStyle: React.CSSProperties = {
  padding: 12,
  borderRadius: 4,
  fontSize: 13,
};
const searchStyle: React.CSSProperties = {
  width: "100%",
  padding: "8px 12px",
  fontSize: 14,
  border: "1px solid #ddd",
  borderRadius: 4,
  background: "#fff",
};
const selectedBoxStyle: React.CSSProperties = {
  padding: 12,
  border: "1px solid #b8d4ff",
  background: "#eaf2ff",
  borderRadius: 4,
};
const selectedHeaderStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 500,
  color: "#1a3a80",
  marginBottom: 8,
};
const selectedRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 6,
  padding: "4px 0",
};
const listBoxStyle: React.CSSProperties = {
  border: "1px solid #ddd",
  borderRadius: 4,
  maxHeight: 480,
  overflowY: "auto",
};
const rowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  padding: "8px 12px",
  cursor: "pointer",
  borderBottom: "1px solid #eee",
};
const thumbStyle: React.CSSProperties = {
  objectFit: "cover",
  borderRadius: 4,
  background: "#f4f4f4",
  flexShrink: 0,
};
const nameStyle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 500,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};
const metaStyle: React.CSSProperties = {
  fontSize: 11,
  color: "#6b6b67",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

function miniBtnStyle(disabled: boolean): React.CSSProperties {
  return {
    width: 26,
    height: 26,
    borderRadius: 4,
    border: "1px solid #ccc",
    background: "#fff",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.4 : 1,
    fontSize: 13,
    lineHeight: 1,
  };
}

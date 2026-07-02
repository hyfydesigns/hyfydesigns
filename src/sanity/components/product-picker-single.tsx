"use client";

import { useEffect, useMemo, useState } from "react";
import { set, unset, type StringInputProps } from "sanity";

type ProductRow = {
  slug: string;
  name: string;
  thumbnail: string | null;
  type: string;
  priceDisplay: string;
};

export function ProductPickerSingle(props: StringInputProps) {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const value = typeof props.value === "string" ? props.value : "";

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

  const selected = products.find((p) => p.slug === value);

  function pick(slug: string) {
    props.onChange(slug ? set(slug) : unset());
  }

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
          {selected && (
            <div style={selectedBoxStyle}>
              <div style={selectedHeaderStyle}>Selected product</div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                {selected.thumbnail && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={selected.thumbnail}
                    alt=""
                    width={40}
                    height={40}
                    style={thumbStyle}
                  />
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={nameStyle}>{selected.name}</div>
                  <div style={metaStyle}>{selected.slug}</div>
                </div>
                <button
                  type="button"
                  onClick={() => pick("")}
                  style={miniBtnStyle(false)}
                  aria-label="Clear"
                >
                  Change
                </button>
              </div>
            </div>
          )}

          {!selected && (
            <>
              <input
                type="text"
                placeholder="Search products…"
                value={query}
                onChange={(e) => setQuery(e.currentTarget.value)}
                style={searchStyle}
              />
              <div style={listBoxStyle}>
                {filtered.map((p) => (
                  <button
                    key={p.slug}
                    type="button"
                    onClick={() => pick(p.slug)}
                    style={rowBtnStyle}
                  >
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
                    <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
                      <div style={nameStyle}>{p.name}</div>
                      <div style={metaStyle}>
                        {p.type} · {p.priceDisplay} · {p.slug}
                      </div>
                    </div>
                  </button>
                ))}
                {filtered.length === 0 && (
                  <div style={{ padding: 16, fontSize: 13, color: "#6b6b67" }}>
                    No products match &ldquo;{query}&rdquo;.
                  </div>
                )}
              </div>
            </>
          )}
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
const listBoxStyle: React.CSSProperties = {
  border: "1px solid #ddd",
  borderRadius: 4,
  maxHeight: 400,
  overflowY: "auto",
  display: "flex",
  flexDirection: "column",
};
const rowBtnStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  padding: "8px 12px",
  cursor: "pointer",
  borderBottom: "1px solid #eee",
  background: "transparent",
  border: "none",
  borderBottomStyle: "solid",
  borderBottomWidth: 1,
  borderBottomColor: "#eee",
  width: "100%",
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
    padding: "4px 10px",
    borderRadius: 4,
    border: "1px solid #ccc",
    background: "#fff",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.4 : 1,
    fontSize: 12,
    fontWeight: 500,
  };
}

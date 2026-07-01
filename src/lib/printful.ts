import type { Product } from "@/components/ui/product-card";

export type PrintfulVariant = {
  id: string;
  color: string;
  size: string;
  price: number;
  mockupUrl?: string;
};

export type PrintfulProduct = {
  slug: string;
  name: string;
  type: "t-shirt" | "mug" | "sticker" | "hoodie" | "hat" | "engraving";
  category: "apparel" | "drinkware" | "accessories" | "custom";
  colors: string[];
  description: string;
  variants: PrintfulVariant[];
  images: string[];
  badge?: { label: string; tone: "navy" | "red" | "blue" };
  meta: string;
  priceDisplay: string;
};

const PRINTFUL_BASE = "https://api.printful.com";
const apiKey = process.env.PRINTFUL_API_KEY;

async function pf<T>(path: string): Promise<T | null> {
  if (!apiKey) return null;
  const res = await fetch(`${PRINTFUL_BASE}${path}`, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    next: { revalidate: 300 },
  });
  if (!res.ok) return null;
  const data = (await res.json()) as { result: T };
  return data.result;
}

export async function getProducts(): Promise<PrintfulProduct[]> {
  const live = await pf<unknown[]>("/store/products");
  if (live) {
    // Map Printful store response → PrintfulProduct here once live catalog exists.
    return mockProducts;
  }
  return mockProducts;
}

export async function getProduct(slug: string): Promise<PrintfulProduct | null> {
  const all = await getProducts();
  return all.find((p) => p.slug === slug) ?? null;
}

export async function createOrder(payload: {
  email: string;
  items: { variantId: string; quantity: number }[];
  shipping: {
    name: string;
    address1: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
}) {
  if (!apiKey) {
    return { ok: true, mocked: true, orderId: `mock_${Date.now()}` };
  }
  const res = await fetch(`${PRINTFUL_BASE}/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      recipient: {
        name: payload.shipping.name,
        address1: payload.shipping.address1,
        city: payload.shipping.city,
        state_code: payload.shipping.state,
        zip: payload.shipping.zip,
        country_code: payload.shipping.country,
        email: payload.email,
      },
      items: payload.items.map((i) => ({
        variant_id: i.variantId,
        quantity: i.quantity,
      })),
    }),
  });
  if (!res.ok) throw new Error(`Printful order failed: ${res.status}`);
  const data = (await res.json()) as { result: { id: number } };
  return { ok: true, mocked: false, orderId: String(data.result.id) };
}

export function toCardProduct(p: PrintfulProduct): Product {
  const bg =
    p.type === "t-shirt" || p.type === "hoodie"
      ? "red-tint"
      : p.type === "mug"
        ? "blue-tint"
        : p.type === "sticker"
          ? "navy"
          : "cream";
  const iconName =
    p.type === "t-shirt" || p.type === "hoodie"
      ? "Shirt"
      : p.type === "mug"
        ? "Coffee"
        : p.type === "sticker"
          ? "Sticker"
          : p.type === "hat"
            ? "HardHat"
            : "Wrench";
  return {
    slug: p.slug,
    name: p.name,
    meta: p.meta,
    price: p.priceDisplay,
    badge: p.badge,
    visual: { kind: "icon", src: iconName, bg },
    isQuote: p.category === "custom",
  };
}

const mockProducts: PrintfulProduct[] = [
  {
    slug: "bayou-city-tee",
    name: "Bayou City tee",
    type: "t-shirt",
    category: "apparel",
    colors: ["Navy", "Cream", "Red", "Blue"],
    description:
      "Our best-selling Houston-print tee. 100% ring-spun cotton, DTG-printed for a soft hand feel.",
    variants: [
      { id: "v-tee-nvy-m", color: "Navy", size: "M", price: 28 },
      { id: "v-tee-nvy-l", color: "Navy", size: "L", price: 28 },
      { id: "v-tee-crm-m", color: "Cream", size: "M", price: 28 },
      { id: "v-tee-crm-l", color: "Cream", size: "L", price: 28 },
    ],
    images: [],
    badge: { label: "Bestseller", tone: "navy" },
    meta: "Unisex · 6 colors",
    priceDisplay: "$28",
  },
  {
    slug: "studio-mug",
    name: "Studio mug",
    type: "mug",
    category: "drinkware",
    colors: ["White", "Cream"],
    description:
      "11oz ceramic mug printed with your art. Dishwasher-safe, microwave-safe.",
    variants: [
      { id: "v-mug-wht-11", color: "White", size: "11oz", price: 16 },
      { id: "v-mug-wht-15", color: "White", size: "15oz", price: 19 },
    ],
    images: [],
    badge: { label: "New", tone: "red" },
    meta: "11oz · Ceramic",
    priceDisplay: "$16",
  },
  {
    slug: "sticker-pack",
    name: "Sticker pack",
    type: "sticker",
    category: "accessories",
    colors: ["Mixed"],
    description:
      "Five vinyl stickers, weather-resistant. Perfect for laptops, water bottles, and hard hats.",
    variants: [{ id: "v-stk-mix", color: "Mixed", size: "One size", price: 9 }],
    images: [],
    meta: "5 designs · Vinyl",
    priceDisplay: "$9",
  },
  {
    slug: "custom-engraving",
    name: "Custom engraving",
    type: "engraving",
    category: "custom",
    colors: ["Wood", "Metal", "Acrylic"],
    description:
      "Laser-engraved plaques, coasters, and gifts. Quoted per project.",
    variants: [],
    images: [],
    meta: "Wood · Metal · Acrylic",
    priceDisplay: "Quote",
  },
  {
    slug: "montrose-hoodie",
    name: "Montrose hoodie",
    type: "hoodie",
    category: "apparel",
    colors: ["Navy", "Cream"],
    description:
      "Heavyweight fleece hoodie with embroidered chest logo. Kangaroo pocket, rib-knit cuffs.",
    variants: [
      { id: "v-hood-nvy-m", color: "Navy", size: "M", price: 54 },
      { id: "v-hood-nvy-l", color: "Navy", size: "L", price: 54 },
    ],
    images: [],
    meta: "Unisex · Heavyweight",
    priceDisplay: "$54",
  },
  {
    slug: "heights-cap",
    name: "Heights cap",
    type: "hat",
    category: "apparel",
    colors: ["Navy", "Red"],
    description: "Structured 6-panel cap with embroidered logo.",
    variants: [{ id: "v-cap-nvy", color: "Navy", size: "One size", price: 26 }],
    images: [],
    meta: "Structured · Embroidered",
    priceDisplay: "$26",
  },
];

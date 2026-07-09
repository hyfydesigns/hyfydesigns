import type { Product } from "@/components/ui/product-card";

export type PrintfulVariant = {
  id: string; // sync_variant_id — used for creating orders
  catalogVariantId?: number; // catalog variant_id — used for shipping rate lookup (absent on mock data)
  color: string;
  size: string;
  price: number;
  mockupUrl?: string;
};

export type PrintfulProduct = {
  id: string; // stable short id (Printful sync_product id) — use for external feeds like Google Merchant
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

// Printful /store/products (list) response shape
type PfStoreProductSummary = {
  id: number;
  external_id: string;
  name: string;
  variants: number;
  synced: number;
  thumbnail_url: string;
};

// Printful /store/products/{id} (single) response shape
type PfStoreProductDetail = {
  sync_product: {
    id: number;
    external_id: string;
    name: string;
    thumbnail_url: string;
  };
  sync_variants: Array<{
    id: number;
    external_id: string;
    variant_id: number;
    retail_price: string;
    name: string;
    product: {
      variant_id: number;
      product_id: number;
      image: string;
      name: string;
    };
    files: Array<{ id: number; type: string; preview_url?: string }>;
  }>;
};

const PRINTFUL_BASE = "https://api.printful.com";
const apiKey = process.env.PRINTFUL_API_KEY;

async function pf<T>(path: string, init?: RequestInit): Promise<T | null> {
  if (!apiKey) return null;
  const res = await fetch(`${PRINTFUL_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    next: { revalidate: 300 },
  });
  if (!res.ok) return null;
  const data = (await res.json()) as { result: T };
  return data.result;
}

export async function getProducts(): Promise<PrintfulProduct[]> {
  const summaries = await pf<PfStoreProductSummary[]>("/store/products");
  if (!summaries) return mockProducts;

  const details = await Promise.all(
    summaries.map((s) => pf<PfStoreProductDetail>(`/store/products/${s.id}`)),
  );

  return details
    .filter((d): d is PfStoreProductDetail => d !== null)
    .map((d, i) => mapDetail(d, summaries[i]));
}

export async function getProduct(slug: string): Promise<PrintfulProduct | null> {
  const all = await getProducts();
  return all.find((p) => p.slug === slug) ?? null;
}

export type ShippingAddress = {
  name?: string;
  address1: string;
  city: string;
  state: string;
  zip: string;
  country: string;
};

export type ShippingRate = {
  id: string;
  name: string;
  rate: number;
  currency: string;
  minDays: number;
  maxDays: number;
};

export async function getShippingRates(payload: {
  address: ShippingAddress;
  items: { catalogVariantId: number; quantity: number }[];
}): Promise<ShippingRate[]> {
  if (!apiKey) {
    return [
      { id: "STANDARD", name: "Flat Rate", rate: 4.99, currency: "USD", minDays: 5, maxDays: 8 },
      { id: "PRINTFUL_FAST", name: "Priority", rate: 12.99, currency: "USD", minDays: 3, maxDays: 5 },
    ];
  }
  const res = await fetch(`${PRINTFUL_BASE}/shipping/rates`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      recipient: {
        address1: payload.address.address1,
        city: payload.address.city,
        state_code: payload.address.state,
        zip: payload.address.zip,
        country_code: payload.address.country,
      },
      items: payload.items.map((i) => ({
        variant_id: i.catalogVariantId,
        quantity: i.quantity,
      })),
    }),
  });
  if (!res.ok) {
    const bodyText = await res.text().catch(() => "");
    throw new Error(
      `Printful shipping rates failed: ${res.status} ${bodyText.slice(0, 400)}`,
    );
  }
  const data = (await res.json()) as {
    result: Array<{
      id: string;
      name: string;
      rate: string;
      currency: string;
      minDeliveryDays?: number;
      maxDeliveryDays?: number;
    }>;
  };
  return data.result.map((r) => ({
    id: r.id,
    name: r.name,
    rate: Number(r.rate),
    currency: r.currency,
    minDays: r.minDeliveryDays ?? 3,
    maxDays: r.maxDeliveryDays ?? 8,
  }));
}

export async function generateMockup(payload: {
  variantIds: number[];
  imageUrl: string;
}) {
  if (!apiKey) return { status: "mocked", mockups: [] };
  const res = await pf<{ task_key: string }>(
    "/mockup-generator/create-task/71",
    {
      method: "POST",
      body: JSON.stringify({
        variant_ids: payload.variantIds,
        format: "jpg",
        files: [{ placement: "front", image_url: payload.imageUrl }],
      }),
    },
  );
  return { status: "pending", taskKey: res?.task_key };
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
        sync_variant_id: Number(i.variantId),
        quantity: i.quantity,
      })),
    }),
  });
  if (!res.ok) {
    const bodyText = await res.text().catch(() => "");
    throw new Error(
      `Printful order failed: ${res.status} ${bodyText.slice(0, 400)}`,
    );
  }
  const data = (await res.json()) as { result: { id: number } };
  return { ok: true, mocked: false, orderId: String(data.result.id) };
}

function mapDetail(
  d: PfStoreProductDetail,
  summary: PfStoreProductSummary,
): PrintfulProduct {
  const name = d.sync_product.name;
  const slug = slugify(name) || d.sync_product.external_id;
  const colors = Array.from(
    new Set(d.sync_variants.map((v) => extractColor(v.name))),
  ).filter(Boolean);
  const type = detectType(name);
  const category = categoryFor(type);
  const priceNum = Number(d.sync_variants[0]?.retail_price ?? "0");
  const priceDisplay = formatPrice(priceNum);

  const variants = d.sync_variants.map((v) => ({
    id: String(v.id),
    catalogVariantId: v.variant_id,
    color: extractColor(v.name),
    size: extractSize(v.name),
    price: Number(v.retail_price),
    mockupUrl:
      v.files?.find((f) => f.type === "preview")?.preview_url ??
      v.product.image,
  }));

  // Collect unique mockup URLs: main thumbnail first, then one per unique color
  const seen = new Set<string>();
  const images: string[] = [];
  if (summary.thumbnail_url) {
    images.push(summary.thumbnail_url);
    seen.add(summary.thumbnail_url);
  }
  for (const v of variants) {
    if (v.mockupUrl && !seen.has(v.mockupUrl)) {
      images.push(v.mockupUrl);
      seen.add(v.mockupUrl);
    }
  }

  return {
    id: String(d.sync_product.id),
    slug,
    name,
    type,
    category,
    colors,
    description: "",
    variants,
    images: images.slice(0, 8),
    meta: `${colors.length} color${colors.length === 1 ? "" : "s"}`,
    priceDisplay,
  };
}

function formatPrice(n: number): string {
  return n % 1 === 0 ? `$${n.toFixed(0)}` : `$${n.toFixed(2)}`;
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[‘’']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function extractColor(variantName: string): string {
  const parts = variantName.split(" / ");
  return parts.length > 1 ? parts[parts.length - 2] : "One color";
}

function extractSize(variantName: string): string {
  const parts = variantName.split(" / ");
  return parts[parts.length - 1] ?? "One size";
}

function detectType(name: string): PrintfulProduct["type"] {
  const n = name.toLowerCase();
  if (n.includes("hoodie") || n.includes("sweatshirt")) return "hoodie";
  if (n.includes("mug")) return "mug";
  if (n.includes("sticker")) return "sticker";
  if (n.includes("hat") || n.includes("cap") || n.includes("beanie")) return "hat";
  if (n.includes("engrav") || n.includes("plaque")) return "engraving";
  return "t-shirt";
}

function categoryFor(type: PrintfulProduct["type"]): PrintfulProduct["category"] {
  if (type === "mug") return "drinkware";
  if (type === "sticker" || type === "hat") return "accessories";
  if (type === "engraving") return "custom";
  return "apparel";
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
  const hasImage = p.images[0] && p.images[0].startsWith("http");
  return {
    slug: p.slug,
    name: p.name,
    meta: p.meta,
    price: p.priceDisplay,
    badge: p.badge,
    visual: hasImage
      ? { kind: "image", src: p.images[0], bg }
      : { kind: "icon", src: iconName, bg },
    isQuote: p.category === "custom",
  };
}

const mockProducts: PrintfulProduct[] = [
  {
    id: "mock-1",
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
    id: "mock-2",
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
    id: "mock-3",
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
    id: "mock-4",
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
    id: "mock-5",
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
    id: "mock-6",
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

import type { CartItem } from "@/lib/cart-store";
import { getProductsWithContent } from "@/lib/products";

// Re-derives every line item's price and name from the live Printful
// catalog. Client-submitted prices are never trusted for billing —
// without this, anyone can POST an arbitrary price for any variantId and
// get a real, payable order at that price. Shared by every checkout
// entry point (whichever payment processor is wired up at the time).

const MAX_QUANTITY_PER_ITEM = 50;

export type VerifiedItem = {
  variantId: string;
  slug: string;
  name: string;
  color: string;
  size: string;
  price: number;
  quantity: number;
};

export class UnavailableItemError extends Error {
  constructor(itemName: string) {
    super(
      `"${itemName || "An item"}" in your cart is no longer available. Please remove it and try again.`,
    );
    this.name = "UnavailableItemError";
  }
}

export async function verifyCartItems(
  items: CartItem[],
): Promise<VerifiedItem[]> {
  const catalog = await getProductsWithContent();
  const variantIndex = new Map<
    string,
    { name: string; color: string; size: string; price: number; slug: string }
  >();
  for (const product of catalog) {
    for (const variant of product.variants) {
      variantIndex.set(variant.id, {
        name: product.name,
        color: variant.color,
        size: variant.size,
        price: variant.price,
        slug: product.slug,
      });
    }
  }

  const verifiedItems: VerifiedItem[] = [];
  for (const item of items) {
    const authoritative = variantIndex.get(item.variantId);
    if (!authoritative) {
      throw new UnavailableItemError(item.name);
    }
    const quantity = Math.min(
      Math.max(1, Math.floor(Number(item.quantity) || 0)),
      MAX_QUANTITY_PER_ITEM,
    );
    verifiedItems.push({
      variantId: item.variantId,
      slug: authoritative.slug,
      name: authoritative.name,
      color: authoritative.color,
      size: authoritative.size,
      price: authoritative.price,
      quantity,
    });
  }

  return verifiedItems;
}

export function cartSubtotal(items: VerifiedItem[]): number {
  return items.reduce((sum, i) => sum + i.price * i.quantity, 0);
}

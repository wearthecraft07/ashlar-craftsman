import { PRODUCTS } from "@/data/products";
import { mapDbProduct, type DbProduct } from "@/lib/catalog/map-product";
import { createServiceClient } from "@/lib/supabase/admin";
import { createPublicClient } from "@/lib/supabase/public";
import type { Product } from "@/types";

export type CheckoutLineInput = {
  productId: string;
  slug?: string;
  quantity: number;
  size: string;
  color: { id: string; name: string; hex: string };
  name?: string;
  avatarConfig?: Record<string, string>;
  custom?: boolean;
};

export type PricedLine = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  color: { id: string; name: string; hex: string };
  image: string;
  avatarConfig?: Record<string, string>;
  custom?: boolean;
};

function staticProduct(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id || p.slug === id);
}

async function loadProduct(
  productId: string,
  slug?: string,
): Promise<Product | null> {
  const supabase = createServiceClient() ?? createPublicClient();
  if (supabase) {
    const byId = await supabase
      .from("products")
      .select("*")
      .eq("id", productId)
      .maybeSingle();
    if (byId.data) return mapDbProduct(byId.data as DbProduct);

    for (const key of [slug, productId].filter(Boolean) as string[]) {
      const bySlug = await supabase
        .from("products")
        .select("*")
        .eq("slug", key)
        .maybeSingle();
      if (bySlug.data) return mapDbProduct(bySlug.data as DbProduct);
    }
  }
  return staticProduct(productId) ?? (slug ? staticProduct(slug) : null) ?? null;
}

export async function priceCheckoutLines(inputs: CheckoutLineInput[]) {
  const lines: PricedLine[] = [];
  let subtotal = 0;

  for (const input of inputs) {
    const product = await loadProduct(input.productId, input.slug);
    if (!product) {
      throw new Error(`Product not found: ${input.productId}`);
    }
    if (product.status && product.status !== "published") {
      throw new Error(`${product.name} is unavailable.`);
    }
    if (product.inventory < input.quantity) {
      throw new Error(
        `${product.name} only has ${product.inventory} left in stock.`,
      );
    }
    if (!product.sizes.includes(input.size)) {
      throw new Error(`Size ${input.size} unavailable for ${product.name}.`);
    }

    const color =
      product.colors.find((c) => c.id === input.color.id) ??
      product.colors[0] ??
      input.color;

    const line: PricedLine = {
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      quantity: input.quantity,
      size: input.size,
      color,
      image: product.images[0] ?? "/shirt-mark.png",
      avatarConfig: input.avatarConfig,
      custom: input.custom,
    };
    lines.push(line);
    subtotal += line.price * line.quantity;
  }

  const shipping = subtotal >= 7500 ? 0 : subtotal > 0 ? 800 : 0;
  const tax = Math.round(subtotal * 0.08);
  const total = subtotal + shipping + tax;

  return { lines, subtotal, shipping, tax, total };
}

import { PRODUCTS } from "@/data/products";
import { mapDbProduct, type DbProduct } from "@/lib/catalog/map-product";
import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/types";

function staticProducts(includeUnpublished = false): Product[] {
  return PRODUCTS.map((product) => ({
    ...product,
    status: "published" as const,
    lowStockThreshold: 5,
    category: String(product.category),
  })).filter((p) => includeUnpublished || p.status === "published");
}

export async function listProducts(options?: {
  includeUnpublished?: boolean;
  featured?: boolean;
  bestSeller?: boolean;
  category?: string;
}): Promise<{ products: Product[]; source: "database" | "static" }> {
  const supabase = await createClient();

  if (!supabase) {
    let products = staticProducts(options?.includeUnpublished);
    if (options?.featured) products = products.filter((p) => p.featured);
    if (options?.bestSeller) products = products.filter((p) => p.bestSeller);
    if (options?.category) {
      products = products.filter((p) => p.category === options.category);
    }
    return { products, source: "static" };
  }

  let query = supabase.from("products").select("*").order("created_at", {
    ascending: false,
  });

  if (!options?.includeUnpublished) {
    query = query.eq("status", "published");
  }
  if (options?.featured) query = query.eq("featured", true);
  if (options?.bestSeller) query = query.eq("best_seller", true);
  if (options?.category) query = query.eq("category", options.category);

  const { data, error } = await query;
  if (error || !data?.length) {
    let products = staticProducts(options?.includeUnpublished);
    if (options?.featured) products = products.filter((p) => p.featured);
    if (options?.bestSeller) products = products.filter((p) => p.bestSeller);
    if (options?.category) {
      products = products.filter((p) => p.category === options.category);
    }
    return { products, source: "static" };
  }

  return {
    products: (data as DbProduct[]).map(mapDbProduct),
    source: "database",
  };
}

export async function getProductBySlug(
  slug: string,
): Promise<{ product: Product | null; source: "database" | "static" }> {
  const supabase = await createClient();

  if (supabase) {
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (data) {
      const product = mapDbProduct(data as DbProduct);
      if (product.status !== "published") {
        return { product: null, source: "database" };
      }
      return { product, source: "database" };
    }
  }

  const fallback = staticProducts().find((p) => p.slug === slug) ?? null;
  return { product: fallback, source: "static" };
}

export async function listCategories() {
  const supabase = await createClient();
  if (!supabase) {
    const fromProducts = Array.from(
      new Set(PRODUCTS.map((p) => String(p.category))),
    ).map((slug, index) => ({
      id: slug,
      slug,
      name: slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      description: "",
      sort_order: index,
      enabled: true,
    }));
    return { categories: fromProducts, source: "static" as const };
  }

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("enabled", true)
    .order("sort_order", { ascending: true });

  if (error || !data?.length) {
    return listCategoriesFallback();
  }

  return { categories: data, source: "database" as const };
}

function listCategoriesFallback() {
  const fromProducts = Array.from(
    new Set(PRODUCTS.map((p) => String(p.category))),
  ).map((slug, index) => ({
    id: slug,
    slug,
    name: slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    description: "",
    sort_order: index,
    enabled: true,
  }));
  return { categories: fromProducts, source: "static" as const };
}

import type { Product, ProductColor, ProductStatus } from "@/types";

export type DbProduct = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  sale_price?: number | null;
  compare_at?: number | null;
  sku?: string | null;
  category: string;
  category_id?: string | null;
  colors: ProductColor[] | null;
  sizes: string[] | null;
  images: string[] | null;
  tags: string[] | null;
  featured?: boolean | null;
  best_seller?: boolean | null;
  inventory: number;
  low_stock_threshold?: number | null;
  status?: ProductStatus | null;
  created_at: string;
  updated_at?: string | null;
};

export function mapDbProduct(row: DbProduct): Product {
  const listPrice = row.price;
  const salePrice = row.sale_price ?? undefined;
  const onSale = typeof salePrice === "number" && salePrice > 0 && salePrice < listPrice;

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    price: onSale ? salePrice : listPrice,
    compareAtPrice: onSale ? listPrice : row.compare_at ?? undefined,
    salePrice: onSale ? salePrice : undefined,
    sku: row.sku ?? undefined,
    category: row.category,
    categoryId: row.category_id ?? undefined,
    colors: row.colors ?? [],
    sizes: row.sizes ?? [],
    images: row.images?.length ? row.images : ["/shirt-mark.png"],
    tags: row.tags ?? [],
    featured: Boolean(row.featured),
    bestSeller: Boolean(row.best_seller),
    inventory: row.inventory,
    lowStockThreshold: row.low_stock_threshold ?? 5,
    status: row.status ?? "published",
    createdAt: row.created_at,
    updatedAt: row.updated_at ?? undefined,
  };
}

export function stockLabel(product: Product) {
  if (product.status === "out_of_stock" || product.inventory <= 0) {
    return "out_of_stock" as const;
  }
  if (product.inventory <= (product.lowStockThreshold ?? 5)) {
    return "low_stock" as const;
  }
  return "in_stock" as const;
}

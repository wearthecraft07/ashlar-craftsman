import type { Metadata } from "next";
import { Suspense } from "react";
import { ShopCatalog } from "@/components/shop/ShopCatalog";
import { listProducts } from "@/lib/catalog/products";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Browse Ashlar Craftsman tees, limited drops, and custom avatar shirts.",
};

export default async function ShopPage() {
  const { products } = await listProducts();

  return (
    <Suspense fallback={<div className="px-4 pt-28">Loading shop...</div>}>
      <ShopCatalog products={products} />
    </Suspense>
  );
}

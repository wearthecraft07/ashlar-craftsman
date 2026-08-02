import type { MetadataRoute } from "next";
import { PRODUCTS } from "@/data/products";

export default function sitemap(): MetadataRoute.Sitemap {
  const site = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const staticRoutes = ["", "/shop", "/avatar", "/cart", "/checkout"].map(
    (path) => ({
      url: `${site}${path}`,
      lastModified: new Date(),
    }),
  );

  const productRoutes = PRODUCTS.map((product) => ({
    url: `${site}/shop/${product.slug}`,
    lastModified: new Date(product.createdAt),
  }));

  return [...staticRoutes, ...productRoutes];
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/shop/ProductDetail";
import { PRODUCTS } from "@/data/products";
import { getProductStory } from "@/data/product-stories";
import { getProductBySlug, listProducts } from "@/lib/catalog/products";
import { getRelatedProducts } from "@/lib/products/related";

/** Refresh after admin print-layout / catalog edits (also revalidated on save). */
export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const { products } = await listProducts({ includeUnpublished: true });
  const slugs = products.length
    ? products.map((product) => product.slug)
    : PRODUCTS.map((product) => product.slug);
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { product } = await getProductBySlug(slug);
  if (!product) return { title: "Product" };
  const story = getProductStory(product);
  return {
    title: product.name,
    description: `${story.philosophy} ${product.description}`.slice(0, 160),
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const { product } = await getProductBySlug(slug);
  if (!product) notFound();

  const { products } = await listProducts();
  const relatedProducts = getRelatedProducts(product, products, 4);

  return (
    <ProductDetail product={product} relatedProducts={relatedProducts} />
  );
}

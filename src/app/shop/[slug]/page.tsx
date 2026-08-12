import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/shop/ProductDetail";
import { PRODUCTS } from "@/data/products";
import { getProductBySlug, listProducts } from "@/lib/catalog/products";

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
  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const { product } = await getProductBySlug(slug);
  if (!product) notFound();
  return <ProductDetail product={product} />;
}

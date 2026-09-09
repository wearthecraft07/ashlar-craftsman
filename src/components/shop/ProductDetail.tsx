"use client";

import { ProductAvatarWearCta } from "@/components/product/ProductAvatarWearCta";
import { ProductBrotherTestLink } from "@/components/product/ProductBrotherTestLink";
import { ProductGallery, type GalleryView } from "@/components/product/ProductGallery";
import { ProductLookCloser } from "@/components/product/ProductLookCloser";
import { ProductRelated } from "@/components/product/ProductRelated";
import {
  ProductForThoseWhoKnow,
  ProductMeaning,
  ProductQuality,
  ProductStorySection,
} from "@/components/product/ProductStorySections";
import { ProductTrust } from "@/components/product/ProductTrust";
import { Button } from "@/components/ui/Button";
import { isLodgeCompatibleProduct } from "@/data/lodge-edition";
import { getProductStory } from "@/data/product-stories";
import { useCartStore } from "@/lib/cart-store";
import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/types";
import { useMemo, useState } from "react";

type Props = {
  product: Product;
  relatedProducts: Product[];
};

export function ProductDetail({ product, relatedProducts }: Props) {
  const story = useMemo(() => getProductStory(product), [product]);
  const [color, setColor] = useState(product.colors[0]);
  const [size, setSize] = useState(product.sizes[2] ?? product.sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [galleryView, setGalleryView] = useState<GalleryView>("front");
  const addItem = useCartStore((s) => s.addItem);

  function add() {
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      color,
      size,
      quantity,
      image: product.images[0],
    });
    setAdded(true);
  }

  return (
    <div className="pb-20 pt-28">
      {/* Hero: image + purchase first (mobile-friendly order) */}
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-14 lg:px-8">
        <ProductGallery
          product={product}
          color={color}
          activeView={galleryView}
          onViewChange={setGalleryView}
          detailSymbols={story.lookCloser}
        />

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--gold)]">
            {story.collectionLabel}
          </p>
          <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl leading-tight text-[var(--lodge-blue)] sm:text-5xl">
            {product.name}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-[var(--walnut)] sm:text-lg">
            {story.philosophy}
          </p>
          <p className="mt-5 text-2xl font-semibold text-[var(--lodge-blue)]">
            {formatCurrency(product.price)}
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="ml-3 text-base font-normal text-[var(--walnut)]/55 line-through">
                {formatCurrency(product.compareAtPrice)}
              </span>
            )}
          </p>

          <div className="mt-8">
            <p className="text-sm font-semibold text-[var(--lodge-blue)]">
              Color
            </p>
            <div className="mt-3 flex flex-wrap gap-3">
              {product.colors.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  aria-label={item.name}
                  aria-pressed={color.id === item.id}
                  onClick={() => setColor(item)}
                  className={`h-10 w-10 rounded-full border-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] ${
                    color.id === item.id
                      ? "border-[var(--gold)]"
                      : "border-black/10"
                  }`}
                  style={{ backgroundColor: item.hex }}
                />
              ))}
            </div>
            <p className="mt-2 text-xs text-[var(--walnut)]/70">{color.name}</p>
          </div>

          <div className="mt-8">
            <p className="text-sm font-semibold text-[var(--lodge-blue)]">
              Size
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.sizes.map((item) => (
                <button
                  key={item}
                  type="button"
                  aria-pressed={size === item}
                  onClick={() => setSize(item)}
                  className={`h-11 min-w-11 rounded-full px-4 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] ${
                    size === item
                      ? "bg-[var(--lodge-blue)] text-[var(--ivory)]"
                      : "bg-black/5 text-[var(--lodge-blue)]"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <p className="text-sm font-semibold text-[var(--lodge-blue)]">
              Quantity
            </p>
            <div className="mt-3 inline-flex items-center rounded-full border border-[var(--stone)]/60">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex h-11 w-11 items-center justify-center text-lg text-[var(--lodge-blue)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
              >
                −
              </button>
              <span className="min-w-10 text-center text-sm font-semibold tabular-nums">
                {quantity}
              </span>
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                className="flex h-11 w-11 items-center justify-center text-lg text-[var(--lodge-blue)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
              >
                +
              </button>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Button onClick={add} size="lg" disabled={product.inventory < 1}>
              Add to cart
            </Button>
            {product.category === "custom" && (
              <Button href="/avatar" variant="ghost" size="lg">
                Open Avatar Studio
              </Button>
            )}
          </div>
          {added && (
            <p className="mt-4 text-sm text-[var(--gold)]" role="status">
              Added to cart.{" "}
              <a href="/cart" className="underline underline-offset-2">
                View cart
              </a>
            </p>
          )}

          <ProductAvatarWearCta product={product} />

          {isLodgeCompatibleProduct(product) && (
            <div className="mt-6 rounded-[1.25rem] border border-[var(--gold)]/25 bg-[var(--panel)] px-5 py-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
                Lodge Editions
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[var(--walnut)]">
                Start a Lodge Edition concept with this piece as the foundation.
              </p>
              <div className="mt-4">
                <Button
                  href={`/lodge-edition?product=${product.slug}`}
                  size="sm"
                  variant="dark"
                >
                  Make It Your Lodge
                </Button>
              </div>
            </div>
          )}

          <ProductTrust sizes={product.sizes} inventory={product.inventory} />
        </div>
      </div>

      {/* Storytelling below the purchase fold */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ProductStorySection story={story} />
        <ProductLookCloser symbols={story.lookCloser} />
        <ProductMeaning story={story} />
        <ProductForThoseWhoKnow story={story} />
        <ProductQuality story={story} />
        {story.showBrotherTestLink && <ProductBrotherTestLink />}
        <ProductRelated products={relatedProducts} />
      </div>
    </div>
  );
}

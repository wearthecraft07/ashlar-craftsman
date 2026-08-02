"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/shop/ProductCard";
import { PRODUCTS } from "@/data/products";
import { cn } from "@/lib/utils";
import type { ProductCategory } from "@/types";

const FILTERS: { id: "all" | ProductCategory; label: string }[] = [
  { id: "all", label: "All" },
  { id: "essentials", label: "Essentials" },
  { id: "premium", label: "Premium" },
  { id: "limited", label: "Limited" },
  { id: "custom", label: "Custom" },
];

export function ShopCatalog() {
  const params = useSearchParams();
  const initial = (params.get("category") as ProductCategory | null) ?? "all";
  const [category, setCategory] = useState<"all" | ProductCategory>(
    FILTERS.some((f) => f.id === initial) ? initial : "all",
  );
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"featured" | "price-asc" | "price-desc">(
    "featured",
  );

  const products = useMemo(() => {
    let list = [...PRODUCTS];
    if (category !== "all") {
      list = list.filter((p) => p.category === category);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.tags.some((tag) => tag.includes(q)),
      );
    }
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    return list;
  }, [category, query, sort]);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--gold)]">
          Shop
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl text-[var(--ink)] sm:text-5xl">
          The catalog.
        </h1>
        <p className="mt-4 text-[var(--muted)]">
          Filter by collection, sort by price, and find your next mark.
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {FILTERS.map((filter) => (
            <button
              key={filter.id}
              type="button"
              onClick={() => setCategory(filter.id)}
              className={cn(
                "shrink-0 rounded-full border px-4 py-2.5 text-sm font-semibold transition",
                category === filter.id
                  ? "border-[var(--gold)] bg-[var(--lodge-blue)] text-[var(--gold)]"
                  : "border-[var(--lodge-blue)]/20 bg-white text-[var(--lodge-blue)] hover:border-[var(--gold)]",
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tees..."
            className="h-11 rounded-full border border-black/10 bg-white px-4 text-sm outline-none ring-[var(--gold)] focus:ring-2"
            aria-label="Search products"
          />
          <select
            value={sort}
            onChange={(e) =>
              setSort(e.target.value as "featured" | "price-asc" | "price-desc")
            }
            className="h-11 rounded-full border border-black/10 bg-white px-4 text-sm outline-none"
            aria-label="Sort products"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>
      {products.length === 0 && (
        <p className="mt-16 text-center text-[var(--muted)]">
          No products match those filters.
        </p>
      )}
    </div>
  );
}

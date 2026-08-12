"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils";
import type { Product, ProductStatus } from "@/types";

const STATUSES: ProductStatus[] = [
  "draft",
  "published",
  "out_of_stock",
  "archived",
];

const emptyForm = {
  id: "",
  slug: "",
  name: "",
  description: "",
  price: "4800",
  sale_price: "",
  sku: "",
  category: "essentials",
  inventory: "50",
  low_stock_threshold: "5",
  status: "draft" as ProductStatus,
  featured: false,
  best_seller: false,
  tags: "",
  sizes: "S,M,L,XL",
  images: "/shirt-mark.png",
};

export function AdminProductsManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [mode, setMode] = useState("loading");
  const [message, setMessage] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/products");
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error || "Unable to load products.");
      setMode("error");
      return;
    }
    setProducts(data.products ?? []);
    setMode(data.mode ?? "database");
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  function editProduct(product: Product) {
    setForm({
      id: product.id,
      slug: product.slug,
      name: product.name,
      description: product.description,
      price: String(product.compareAtPrice ?? product.price),
      sale_price:
        product.salePrice || product.compareAtPrice
          ? String(product.price)
          : "",
      sku: product.sku ?? "",
      category: String(product.category),
      inventory: String(product.inventory),
      low_stock_threshold: String(product.lowStockThreshold ?? 5),
      status: product.status ?? "draft",
      featured: Boolean(product.featured),
      best_seller: Boolean(product.bestSeller),
      tags: product.tags.join(","),
      sizes: product.sizes.join(","),
      images: product.images.join(","),
    });
  }

  function duplicateProduct(product: Product) {
    editProduct(product);
    setForm((prev) => ({
      ...prev,
      id: "",
      slug: `${product.slug}-copy`,
      name: `${product.name} (Copy)`,
      status: "draft",
    }));
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    const listPrice = Number(form.price);
    const sale = form.sale_price ? Number(form.sale_price) : null;

    const payload = {
      id: form.id || undefined,
      slug: form.slug.trim(),
      name: form.name.trim(),
      description: form.description.trim(),
      price: listPrice,
      sale_price: sale,
      sku: form.sku.trim() || null,
      category: form.category.trim(),
      inventory: Number(form.inventory),
      low_stock_threshold: Number(form.low_stock_threshold),
      status: form.status,
      featured: form.featured,
      best_seller: form.best_seller,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      sizes: form.sizes
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      images: form.images
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      colors: [
        { id: "black", name: "Black", hex: "#0A0A0A" },
        { id: "white", name: "White", hex: "#F7F7F5" },
      ],
    };

    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setMessage(data.error || "Save failed.");
      return;
    }

    setMessage(form.id ? "Product updated." : "Product created.");
    setForm(emptyForm);
    await load();
  }

  async function removeProduct(id: string) {
    if (!confirm("Delete this product?")) return;
    const res = await fetch(`/api/admin/products?id=${id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error || "Delete failed.");
      return;
    }
    setMessage("Product deleted.");
    await load();
  }

  async function onUpload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const body = new FormData(event.currentTarget);
    const res = await fetch("/api/upload", { method: "POST", body });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error || "Upload failed.");
      return;
    }
    if (data.url) {
      setForm((prev) => ({
        ...prev,
        images: prev.images
          ? `${prev.images},${data.url}`
          : String(data.url),
      }));
      setMessage("Image uploaded and added to the form.");
    }
  }

  return (
    <div>
      <Header
        title="Products"
        subtitle="Create, edit, publish, and manage inventory without touching code."
      />
      {mode === "demo" && (
        <p className="mt-4 rounded-2xl border border-[var(--gold)]/30 bg-[var(--gold)]/10 px-4 py-3 text-sm text-[var(--gold)]">
          Supabase is not connected — product saves require schema + env keys.
        </p>
      )}
      {message && (
        <p className="mt-4 text-sm text-[var(--gold)]" role="status">
          {message}
        </p>
      )}

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Panel title="Catalog">
          <div className="space-y-3">
            {products.map((product) => (
              <div
                key={product.id}
                className="rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{product.name}</p>
                    <p className="text-sm text-white/50">
                      {product.slug} · {product.category} ·{" "}
                      {product.status ?? "published"}
                    </p>
                    <p className="mt-1 text-sm text-[var(--gold)]">
                      {formatCurrency(product.price)} · {product.inventory} in
                      stock
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => editProduct(product)}
                      className="rounded-full bg-white/10 px-3 py-1.5 text-xs"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => duplicateProduct(product)}
                      className="rounded-full bg-white/10 px-3 py-1.5 text-xs"
                    >
                      Duplicate
                    </button>
                    <button
                      type="button"
                      onClick={() => void removeProduct(product.id)}
                      className="rounded-full bg-red-500/20 px-3 py-1.5 text-xs text-red-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {!products.length && (
              <p className="text-sm text-white/50">
                No products yet. Add one on the right, or run supabase/seed.sql.
              </p>
            )}
          </div>
        </Panel>

        <div className="space-y-6">
          <Panel title={form.id ? "Edit product" : "Add product"}>
            <form onSubmit={onSubmit} className="space-y-3">
              <Field
                label="Name"
                value={form.name}
                onChange={(v) =>
                  setForm((p) => ({
                    ...p,
                    name: v,
                    slug:
                      p.id || p.slug
                        ? p.slug
                        : v
                            .toLowerCase()
                            .replace(/[^a-z0-9]+/g, "-")
                            .replace(/(^-|-$)/g, ""),
                  }))
                }
              />
              <Field
                label="Slug"
                value={form.slug}
                onChange={(v) => setForm((p) => ({ ...p, slug: v }))}
              />
              <label className="block text-sm text-white/70">
                Description
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, description: e.target.value }))
                  }
                  className="mt-1 min-h-24 w-full rounded-2xl border border-white/15 bg-black/20 px-3 py-2 text-white"
                />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <Field
                  label="List price (cents)"
                  value={form.price}
                  onChange={(v) => setForm((p) => ({ ...p, price: v }))}
                />
                <Field
                  label="Sale price (cents)"
                  value={form.sale_price}
                  onChange={(v) => setForm((p) => ({ ...p, sale_price: v }))}
                />
                <Field
                  label="SKU"
                  value={form.sku}
                  onChange={(v) => setForm((p) => ({ ...p, sku: v }))}
                />
                <Field
                  label="Category slug"
                  value={form.category}
                  onChange={(v) => setForm((p) => ({ ...p, category: v }))}
                />
                <Field
                  label="Inventory"
                  value={form.inventory}
                  onChange={(v) => setForm((p) => ({ ...p, inventory: v }))}
                />
                <Field
                  label="Low-stock at"
                  value={form.low_stock_threshold}
                  onChange={(v) =>
                    setForm((p) => ({ ...p, low_stock_threshold: v }))
                  }
                />
              </div>
              <label className="block text-sm text-white/70">
                Status
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      status: e.target.value as ProductStatus,
                    }))
                  }
                  className="mt-1 h-11 w-full rounded-full border border-white/15 bg-black/20 px-3 text-white"
                >
                  {STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </label>
              <Field
                label="Sizes (comma-separated)"
                value={form.sizes}
                onChange={(v) => setForm((p) => ({ ...p, sizes: v }))}
              />
              <Field
                label="Tags (comma-separated)"
                value={form.tags}
                onChange={(v) => setForm((p) => ({ ...p, tags: v }))}
              />
              <Field
                label="Images (comma-separated URLs)"
                value={form.images}
                onChange={(v) => setForm((p) => ({ ...p, images: v }))}
              />
              <div className="flex flex-wrap gap-4 text-sm">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, featured: e.target.checked }))
                    }
                  />
                  Featured
                </label>
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.best_seller}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, best_seller: e.target.checked }))
                    }
                  />
                  Best seller
                </label>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving…" : form.id ? "Update product" : "Add product"}
                </Button>
                {form.id && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setForm(emptyForm)}
                  >
                    Cancel edit
                  </Button>
                )}
              </div>
            </form>
          </Panel>

          <Panel title="Upload image">
            <form onSubmit={onUpload} className="space-y-3">
              <input
                type="file"
                name="file"
                accept="image/*"
                className="block w-full text-sm text-white/70"
              />
              <Button type="submit" variant="ghost" size="sm">
                Upload to Cloudinary
              </Button>
            </form>
          </Panel>
        </div>
      </div>
    </div>
  );
}

function Header({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-3xl">{title}</h1>
      <p className="mt-2 text-sm text-white/55">{subtitle}</p>
    </div>
  );
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[1.5rem] border border-white/10 bg-[#1a1a1a] p-5">
      <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block text-sm text-white/70">
      {label}
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 h-11 w-full rounded-full border border-white/15 bg-black/20 px-3 text-white"
      />
    </label>
  );
}

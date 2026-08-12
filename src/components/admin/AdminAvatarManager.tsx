"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";

type Category = {
  id: string;
  key: string;
  name: string;
  layer_order: number;
  sort_order: number;
  enabled: boolean;
};

type Item = {
  id: string;
  category_id: string;
  key: string;
  name: string;
  description: string;
  asset_url: string | null;
  sort_order: number;
  active: boolean;
  featured: boolean;
  price: number | null;
};

export function AdminAvatarManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [message, setMessage] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [form, setForm] = useState({
    id: "",
    key: "",
    name: "",
    description: "",
    asset_url: "",
    sort_order: "0",
    active: true,
    featured: false,
    price: "",
  });

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/avatar");
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error || "Unable to load avatar catalog.");
      return;
    }
    setCategories(data.categories ?? []);
    setItems(data.items ?? []);
    if (!categoryId && data.categories?.[0]?.id) {
      setCategoryId(data.categories[0].id);
    }
  }, [categoryId]);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(
    () => items.filter((item) => item.category_id === categoryId),
    [items, categoryId],
  );

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!categoryId) {
      setMessage("Select a category first.");
      return;
    }

    const res = await fetch("/api/admin/avatar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data: {
          id: form.id || undefined,
          category_id: categoryId,
          key: form.key.trim(),
          name: form.name.trim(),
          description: form.description.trim(),
          asset_url: form.asset_url.trim() || null,
          sort_order: Number(form.sort_order),
          active: form.active,
          featured: form.featured,
          price: form.price ? Number(form.price) : null,
        },
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error || "Save failed.");
      return;
    }
    setMessage(form.id ? "Avatar item updated." : "Avatar item created.");
    setForm({
      id: "",
      key: "",
      name: "",
      description: "",
      asset_url: "",
      sort_order: "0",
      active: true,
      featured: false,
      price: "",
    });
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
    setForm((prev) => ({ ...prev, asset_url: data.url }));
    setMessage("Asset uploaded.");
  }

  async function remove(id: string) {
    if (!confirm("Delete this avatar item?")) return;
    const res = await fetch(`/api/admin/avatar?id=${id}&entity=item`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error || "Delete failed.");
      return;
    }
    setMessage("Item deleted.");
    await load();
  }

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-3xl">
        Avatar Studio items
      </h1>
      <p className="mt-2 text-sm text-white/55">
        Add layered assets and option keys without editing code. Built-in SVG
        options remain when a category has no DB items.
      </p>
      {message && (
        <p className="mt-4 text-sm text-[var(--gold)]" role="status">
          {message}
        </p>
      )}

      <div className="mt-6">
        <label className="text-sm text-white/70">
          Category
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="mt-2 h-11 w-full max-w-md rounded-full border border-white/15 bg-black/20 px-4"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name} (layer {category.layer_order})
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="space-y-3 rounded-[1.5rem] border border-white/10 bg-[#1a1a1a] p-5">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="flex items-start justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 p-4"
            >
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-white/50">
                  {item.key} · {item.active ? "active" : "hidden"}
                  {item.featured ? " · featured" : ""}
                </p>
                {item.asset_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.asset_url}
                    alt={item.name}
                    className="mt-2 h-16 w-16 rounded-lg object-contain bg-white/10"
                  />
                )}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="rounded-full bg-white/10 px-3 py-1.5 text-xs"
                  onClick={() =>
                    setForm({
                      id: item.id,
                      key: item.key,
                      name: item.name,
                      description: item.description,
                      asset_url: item.asset_url ?? "",
                      sort_order: String(item.sort_order),
                      active: item.active,
                      featured: item.featured,
                      price: item.price != null ? String(item.price) : "",
                    })
                  }
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="rounded-full bg-red-500/20 px-3 py-1.5 text-xs text-red-200"
                  onClick={() => void remove(item.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {!filtered.length && (
            <p className="text-sm text-white/50">
              No DB items in this category yet — studio will use built-in SVG
              options.
            </p>
          )}
        </section>

        <div className="space-y-6">
          <section className="rounded-[1.5rem] border border-white/10 bg-[#1a1a1a] p-5">
            <form onSubmit={onSubmit} className="space-y-3">
              <Field
                label="Name"
                value={form.name}
                onChange={(v) =>
                  setForm((p) => ({
                    ...p,
                    name: v,
                    key:
                      p.id || p.key
                        ? p.key
                        : v
                            .toLowerCase()
                            .replace(/[^a-z0-9]+/g, "-")
                            .replace(/(^-|-$)/g, ""),
                  }))
                }
              />
              <Field
                label="Key"
                value={form.key}
                onChange={(v) => setForm((p) => ({ ...p, key: v }))}
              />
              <Field
                label="Description"
                value={form.description}
                onChange={(v) => setForm((p) => ({ ...p, description: v }))}
              />
              <Field
                label="Asset URL"
                value={form.asset_url}
                onChange={(v) => setForm((p) => ({ ...p, asset_url: v }))}
              />
              <Field
                label="Sort order"
                value={form.sort_order}
                onChange={(v) => setForm((p) => ({ ...p, sort_order: v }))}
              />
              <Field
                label="Optional price (cents)"
                value={form.price}
                onChange={(v) => setForm((p) => ({ ...p, price: v }))}
              />
              <div className="flex gap-4 text-sm">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.active}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, active: e.target.checked }))
                    }
                  />
                  Active
                </label>
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
              </div>
              <Button type="submit">
                {form.id ? "Update item" : "Add item"}
              </Button>
            </form>
          </section>

          <section className="rounded-[1.5rem] border border-white/10 bg-[#1a1a1a] p-5">
            <form onSubmit={onUpload} className="space-y-3">
              <input type="file" name="file" accept="image/*,.svg" />
              <Button type="submit" variant="ghost" size="sm">
                Upload layer asset
              </Button>
            </form>
          </section>
        </div>
      </div>
    </div>
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
        className="mt-1 h-11 w-full rounded-full border border-white/15 bg-black/20 px-3"
      />
    </label>
  );
}

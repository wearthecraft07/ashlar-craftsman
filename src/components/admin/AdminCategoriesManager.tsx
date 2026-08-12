"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import type { Category } from "@/types";

export function AdminCategoriesManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    id: "",
    slug: "",
    name: "",
    description: "",
    sort_order: "0",
    enabled: true,
  });

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/categories");
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error || "Unable to load categories.");
      return;
    }
    setCategories(data.categories ?? []);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: form.id || undefined,
        slug: form.slug.trim(),
        name: form.name.trim(),
        description: form.description.trim(),
        sort_order: Number(form.sort_order),
        enabled: form.enabled,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error || "Save failed.");
      return;
    }
    setMessage(form.id ? "Category updated." : "Category created.");
    setForm({
      id: "",
      slug: "",
      name: "",
      description: "",
      sort_order: "0",
      enabled: true,
    });
    await load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this category?")) return;
    const res = await fetch(`/api/admin/categories?id=${id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error || "Delete failed.");
      return;
    }
    setMessage("Category deleted.");
    await load();
  }

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-3xl">
        Categories
      </h1>
      <p className="mt-2 text-sm text-white/55">
        Manage shop categories without hard-coding them in the app.
      </p>
      {message && (
        <p className="mt-4 text-sm text-[var(--gold)]" role="status">
          {message}
        </p>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-[1.5rem] border border-white/10 bg-[#1a1a1a] p-5">
          <div className="space-y-3">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex items-start justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                <div>
                  <p className="font-semibold">{category.name}</p>
                  <p className="text-sm text-white/50">
                    {category.slug} · order {category.sort_order} ·{" "}
                    {category.enabled ? "enabled" : "disabled"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="rounded-full bg-white/10 px-3 py-1.5 text-xs"
                    onClick={() =>
                      setForm({
                        id: category.id,
                        slug: category.slug,
                        name: category.name,
                        description: category.description,
                        sort_order: String(category.sort_order),
                        enabled: category.enabled,
                      })
                    }
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="rounded-full bg-red-500/20 px-3 py-1.5 text-xs text-red-200"
                    onClick={() => void remove(category.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[1.5rem] border border-white/10 bg-[#1a1a1a] p-5">
          <form onSubmit={onSubmit} className="space-y-3">
            <label className="block text-sm text-white/70">
              Name
              <input
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    name: e.target.value,
                    slug:
                      p.id || p.slug
                        ? p.slug
                        : e.target.value
                            .toLowerCase()
                            .replace(/[^a-z0-9]+/g, "-")
                            .replace(/(^-|-$)/g, ""),
                  }))
                }
                className="mt-1 h-11 w-full rounded-full border border-white/15 bg-black/20 px-3"
                required
              />
            </label>
            <label className="block text-sm text-white/70">
              Slug
              <input
                value={form.slug}
                onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
                className="mt-1 h-11 w-full rounded-full border border-white/15 bg-black/20 px-3"
                required
              />
            </label>
            <label className="block text-sm text-white/70">
              Description
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm((p) => ({ ...p, description: e.target.value }))
                }
                className="mt-1 min-h-24 w-full rounded-2xl border border-white/15 bg-black/20 px-3 py-2"
              />
            </label>
            <label className="block text-sm text-white/70">
              Sort order
              <input
                value={form.sort_order}
                onChange={(e) =>
                  setForm((p) => ({ ...p, sort_order: e.target.value }))
                }
                className="mt-1 h-11 w-full rounded-full border border-white/15 bg-black/20 px-3"
              />
            </label>
            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.enabled}
                onChange={(e) =>
                  setForm((p) => ({ ...p, enabled: e.target.checked }))
                }
              />
              Enabled
            </label>
            <Button type="submit">
              {form.id ? "Update category" : "Add category"}
            </Button>
          </form>
        </section>
      </div>
    </div>
  );
}

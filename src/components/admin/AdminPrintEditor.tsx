"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ShirtPrintComposer } from "@/components/print/ShirtPrintComposer";
import { Button } from "@/components/ui/Button";
import {
  constrainLayout,
  DEFAULT_PRINT_LAYOUT,
  layoutWithAspect,
  resetPlacement,
  type PrintLayout,
} from "@/lib/print/layout";
import type { Product } from "@/types";

type Mode = "edit" | "preview";

export function AdminPrintEditor() {
  const [products, setProducts] = useState<Product[]>([]);
  const [productId, setProductId] = useState("");
  const [layout, setLayout] = useState<PrintLayout>({ ...DEFAULT_PRINT_LAYOUT });
  const [savedSnapshot, setSavedSnapshot] = useState<PrintLayout>({
    ...DEFAULT_PRINT_LAYOUT,
  });
  const [mode, setMode] = useState<Mode>("edit");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const selected = useMemo(
    () => products.find((p) => p.id === productId) ?? null,
    [products, productId],
  );

  const shirtColor = selected?.colors[0]?.hex ?? "#0A0A0A";
  const dirty = JSON.stringify(layout) !== JSON.stringify(savedSnapshot);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/products");
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Unable to load products.");
      setLoading(false);
      return;
    }
    setProducts((data.products ?? []) as Product[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    if (!productId && products[0]) {
      const q =
        typeof window !== "undefined"
          ? new URLSearchParams(window.location.search).get("product")
          : null;
      if (q && products.some((p) => p.id === q)) {
        setProductId(q);
      } else {
        setProductId(products[0].id);
      }
    }
  }, [products, productId]);

  useEffect(() => {
    if (!productId) return;
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    const next = product.printLayout
      ? constrainLayout(product.printLayout)
      : { ...DEFAULT_PRINT_LAYOUT };
    setLayout(next);
    setSavedSnapshot(next);
    setMode("edit");
    setMessage("");
    setError("");
    // eslint-disable-next-line react-hooks/exhaustive-deps -- sync on product switch only
  }, [productId]);

  function updateField<K extends keyof PrintLayout>(key: K, value: PrintLayout[K]) {
    setLayout((prev) => constrainLayout({ ...prev, [key]: value }));
  }

  async function onUpload(file: File | null) {
    if (!file) return;
    setUploading(true);
    setError("");
    setMessage("");

    if (file.type !== "image/png" && !file.name.toLowerCase().endsWith(".png")) {
      setError("Only transparent PNG files are allowed.");
      setUploading(false);
      return;
    }

    const body = new FormData();
    body.append("file", file);
    body.append("pngOnly", "1");
    body.append("purpose", "print-design");
    body.append("folder", "ashlar-craftsman/print-designs");

    const res = await fetch("/api/upload", { method: "POST", body });
    const data = await res.json();
    setUploading(false);

    if (!res.ok) {
      setError(data.error || "Upload failed.");
      return;
    }

    const w = Number(data.width) || 1;
    const h = Number(data.height) || 1;
    const aspect = w / h;

    setLayout((prev) =>
      resetPlacement(
        layoutWithAspect(
          {
            ...prev,
            designUrl: data.url as string,
          },
          aspect,
        ),
      ),
    );
    setMessage("Design uploaded. Adjust placement, then Save Changes.");
    setMode("edit");
  }

  function removeDesign() {
    setLayout((prev) => ({
      ...prev,
      designUrl: null,
    }));
    setMessage("Design removed. Save Changes to clear it on the storefront.");
  }

  function onResetPlacement() {
    if (!layout.designUrl) {
      setError("Upload a design before resetting placement.");
      return;
    }
    setLayout((prev) => resetPlacement(prev));
    setMessage("Placement reset to default.");
  }

  function onCancel() {
    setLayout(savedSnapshot);
    setMode("edit");
    setMessage("Changes discarded.");
    setError("");
  }

  async function onSave() {
    if (!productId) {
      setError("Select a product first.");
      return;
    }
    setSaving(true);
    setError("");
    setMessage("");

    const res = await fetch("/api/admin/print-layout", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId,
        layout: layout.designUrl ? constrainLayout(layout) : null,
      }),
    });
    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setError(data.error || "Unable to save print layout.");
      return;
    }

    const next = data.layout
      ? constrainLayout(data.layout as PrintLayout)
      : { ...DEFAULT_PRINT_LAYOUT };
    setLayout(next);
    setSavedSnapshot(next);
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? { ...p, printLayout: data.product?.printLayout ?? null }
          : p,
      ),
    );
    setMessage("Print layout saved. Storefront will use this placement.");
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-white/70">
        Loading print editor…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">
            Catalog
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-white">
            T-Shirt Print Editor
          </h1>
          <p className="mt-2 max-w-xl text-sm text-white/60">
            Upload a transparent PNG, place it on the tee mockup, and save
            normalized placement for the public product page.
          </p>
        </div>
        <Button href="/admin/products" variant="ghost" size="sm" className="!bg-transparent !text-white/80 border-white/20">
          Back to products
        </Button>
      </div>

      {(error || message) && (
        <div
          className={`rounded-2xl border px-4 py-3 text-sm ${
            error
              ? "border-red-400/40 bg-red-500/10 text-red-100"
              : "border-[var(--gold)]/30 bg-[var(--gold)]/10 text-[var(--gold)]"
          }`}
        >
          {error || message}
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        <section className="order-1 space-y-4 lg:order-none">
          <div className="overflow-hidden rounded-[1.5rem] border border-[var(--gold)]/20 bg-[linear-gradient(165deg,#F7F2E7_0%,#EDE6D6_100%)] p-6 sm:p-10">
            <div className="mx-auto max-w-[340px]">
              <ShirtPrintComposer
                layout={layout}
                shirtColor={shirtColor}
                editing={mode === "edit"}
                onChange={mode === "edit" ? setLayout : undefined}
              />
            </div>
            <p className="mt-4 text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--lodge-blue)]/45">
              {mode === "preview"
                ? "Storefront preview — guides hidden"
                : "Edit mode — dashed gold outline is the print-safe area"}
            </p>
          </div>
        </section>

        <aside className="order-2 space-y-5 lg:order-none">
          <label className="block space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">
              Product
            </span>
            <select
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className="w-full rounded-2xl border border-white/15 bg-[#1a1a1a] px-4 py-3 text-sm text-white"
            >
              {products.length === 0 && (
                <option value="">No products found</option>
              )}
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>

          {selected && (
            <p className="text-sm text-white/50">
              Editing{" "}
              <Link
                href={`/products/${selected.slug}`}
                className="text-[var(--gold)] underline-offset-2 hover:underline"
                target="_blank"
              >
                {selected.slug}
              </Link>
              {selected.printLayout?.designUrl ? " · layout saved" : " · no layout yet"}
              {dirty ? " · unsaved changes" : ""}
            </p>
          )}

          <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">
              Design PNG
            </p>
            <input
              type="file"
              accept="image/png,.png"
              disabled={uploading || !productId}
              onChange={(e) => void onUpload(e.target.files?.[0] ?? null)}
              className="block w-full text-sm text-white/70 file:mr-3 file:rounded-full file:border-0 file:bg-[var(--gold)] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[var(--lodge-blue)]"
            />
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="!bg-transparent border-white/20 !text-white/80"
                disabled={!layout.designUrl || uploading}
                onClick={removeDesign}
              >
                Remove design
              </Button>
            </div>
            {uploading && (
              <p className="text-xs text-white/50">Uploading PNG…</p>
            )}
            <p className="text-xs text-white/40">
              Transparent PNG only · max 5MB · 64–4000px per side
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label className="space-y-1 text-xs text-white/50">
              X ({(layout.x * 100).toFixed(0)}%)
              <input
                type="range"
                min={0}
                max={100}
                value={Math.round(layout.x * 100)}
                disabled={!layout.designUrl || mode === "preview"}
                onChange={(e) =>
                  updateField("x", Number(e.target.value) / 100)
                }
                className="w-full"
              />
            </label>
            <label className="space-y-1 text-xs text-white/50">
              Y ({(layout.y * 100).toFixed(0)}%)
              <input
                type="range"
                min={0}
                max={100}
                value={Math.round(layout.y * 100)}
                disabled={!layout.designUrl || mode === "preview"}
                onChange={(e) =>
                  updateField("y", Number(e.target.value) / 100)
                }
                className="w-full"
              />
            </label>
            <label className="space-y-1 text-xs text-white/50">
              Scale ({(layout.width * 100).toFixed(0)}%)
              <input
                type="range"
                min={8}
                max={100}
                value={Math.round(layout.width * 100)}
                disabled={!layout.designUrl || mode === "preview"}
                onChange={(e) =>
                  updateField("width", Number(e.target.value) / 100)
                }
                className="w-full"
              />
            </label>
            <label className="space-y-1 text-xs text-white/50">
              Rotation ({Math.round(layout.rotation)}°)
              <input
                type="range"
                min={0}
                max={359}
                value={Math.round(layout.rotation)}
                disabled={!layout.designUrl || mode === "preview"}
                onChange={(e) =>
                  updateField("rotation", Number(e.target.value))
                }
                className="w-full"
              />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <label className="space-y-1 text-xs text-white/50">
              X
              <input
                type="number"
                step={0.01}
                min={0}
                max={1}
                value={Number(layout.x.toFixed(3))}
                disabled={!layout.designUrl || mode === "preview"}
                onChange={(e) => updateField("x", Number(e.target.value))}
                className="w-full rounded-xl border border-white/15 bg-[#1a1a1a] px-3 py-2 text-sm text-white"
              />
            </label>
            <label className="space-y-1 text-xs text-white/50">
              Y
              <input
                type="number"
                step={0.01}
                min={0}
                max={1}
                value={Number(layout.y.toFixed(3))}
                disabled={!layout.designUrl || mode === "preview"}
                onChange={(e) => updateField("y", Number(e.target.value))}
                className="w-full rounded-xl border border-white/15 bg-[#1a1a1a] px-3 py-2 text-sm text-white"
              />
            </label>
            <label className="space-y-1 text-xs text-white/50">
              Width
              <input
                type="number"
                step={0.01}
                min={0.08}
                max={1}
                value={Number(layout.width.toFixed(3))}
                disabled={!layout.designUrl || mode === "preview"}
                onChange={(e) => updateField("width", Number(e.target.value))}
                className="w-full rounded-xl border border-white/15 bg-[#1a1a1a] px-3 py-2 text-sm text-white"
              />
            </label>
            <label className="space-y-1 text-xs text-white/50">
              Rotation °
              <input
                type="number"
                step={1}
                min={0}
                max={359}
                value={Math.round(layout.rotation)}
                disabled={!layout.designUrl || mode === "preview"}
                onChange={(e) =>
                  updateField("rotation", Number(e.target.value))
                }
                className="w-full rounded-xl border border-white/15 bg-[#1a1a1a] px-3 py-2 text-sm text-white"
              />
            </label>
          </div>

          <div className="flex flex-col gap-2">
            <Button
              type="button"
              onClick={() => void onSave()}
              disabled={saving || !productId || !dirty}
            >
              {saving ? "Saving…" : "Save Changes"}
            </Button>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="!bg-transparent border-white/20 !text-white/80"
                onClick={onResetPlacement}
                disabled={!layout.designUrl || mode === "preview"}
              >
                Reset Placement
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="!bg-transparent border-white/20 !text-white/80"
                onClick={() =>
                  setMode((m) => (m === "edit" ? "preview" : "edit"))
                }
              >
                {mode === "preview" ? "Back to Edit" : "Preview"}
              </Button>
            </div>
            <Button
              type="button"
              variant="dark"
              size="sm"
              onClick={onCancel}
              disabled={!dirty}
            >
              Cancel
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
}

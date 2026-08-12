"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import type { Announcement } from "@/types";

export function AdminAnnouncementsManager() {
  const [items, setItems] = useState<Announcement[]>([]);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    id: "",
    title: "",
    body: "",
    published: true,
    starts_at: "",
    ends_at: "",
  });

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/announcements");
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error || "Unable to load announcements.");
      return;
    }
    setItems(data.announcements ?? []);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const res = await fetch("/api/admin/announcements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: form.id || undefined,
        title: form.title.trim(),
        body: form.body.trim(),
        published: form.published,
        starts_at: form.starts_at || null,
        ends_at: form.ends_at || null,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error || "Save failed.");
      return;
    }
    setMessage(form.id ? "Announcement updated." : "Announcement created.");
    setForm({
      id: "",
      title: "",
      body: "",
      published: true,
      starts_at: "",
      ends_at: "",
    });
    await load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this announcement?")) return;
    const res = await fetch(`/api/admin/announcements?id=${id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error || "Delete failed.");
      return;
    }
    setMessage("Announcement deleted.");
    await load();
  }

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-3xl">
        Announcements
      </h1>
      <p className="mt-2 text-sm text-white/55">
        Publish timed banners for collections, shipping promos, and studio drops.
      </p>
      {message && (
        <p className="mt-4 text-sm text-[var(--gold)]" role="status">
          {message}
        </p>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-[1.5rem] border border-white/10 bg-[#1a1a1a] p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{item.title}</p>
                  <p className="mt-1 text-sm text-white/60">{item.body}</p>
                  <p className="mt-2 text-xs text-white/40">
                    {item.published ? "Published" : "Draft"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="rounded-full bg-white/10 px-3 py-1.5 text-xs"
                    onClick={() =>
                      setForm({
                        id: item.id,
                        title: item.title,
                        body: item.body,
                        published: item.published,
                        starts_at: item.starts_at?.slice(0, 16) ?? "",
                        ends_at: item.ends_at?.slice(0, 16) ?? "",
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
            </div>
          ))}
        </section>

        <form
          onSubmit={onSubmit}
          className="space-y-3 rounded-[1.5rem] border border-white/10 bg-[#1a1a1a] p-5"
        >
          <label className="block text-sm text-white/70">
            Title
            <input
              required
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              className="mt-1 h-11 w-full rounded-full border border-white/15 bg-black/20 px-3"
            />
          </label>
          <label className="block text-sm text-white/70">
            Body
            <textarea
              value={form.body}
              onChange={(e) => setForm((p) => ({ ...p, body: e.target.value }))}
              className="mt-1 min-h-28 w-full rounded-2xl border border-white/15 bg-black/20 px-3 py-2"
            />
          </label>
          <label className="block text-sm text-white/70">
            Starts at
            <input
              type="datetime-local"
              value={form.starts_at}
              onChange={(e) =>
                setForm((p) => ({ ...p, starts_at: e.target.value }))
              }
              className="mt-1 h-11 w-full rounded-full border border-white/15 bg-black/20 px-3"
            />
          </label>
          <label className="block text-sm text-white/70">
            Ends at
            <input
              type="datetime-local"
              value={form.ends_at}
              onChange={(e) => setForm((p) => ({ ...p, ends_at: e.target.value }))}
              className="mt-1 h-11 w-full rounded-full border border-white/15 bg-black/20 px-3"
            />
          </label>
          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) =>
                setForm((p) => ({ ...p, published: e.target.checked }))
              }
            />
            Published
          </label>
          <Button type="submit">
            {form.id ? "Update announcement" : "Create announcement"}
          </Button>
        </form>
      </div>
    </div>
  );
}

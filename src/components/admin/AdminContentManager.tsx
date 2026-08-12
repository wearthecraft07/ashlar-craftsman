"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";

type ContentRow = { key: string; value: Record<string, unknown> };

const KEYS = [
  "homepage.hero",
  "homepage.announcement",
  "about",
  "footer",
] as const;

export function AdminContentManager() {
  const [rows, setRows] = useState<ContentRow[]>([]);
  const [key, setKey] = useState<string>(KEYS[0]);
  const [json, setJson] = useState("{}");
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/content");
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error || "Unable to load content.");
      return;
    }
    setRows(data.content ?? []);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    const match = rows.find((row) => row.key === key);
    setJson(JSON.stringify(match?.value ?? {}, null, 2));
  }, [key, rows]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    try {
      const value = JSON.parse(json);
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || "Save failed.");
        return;
      }
      setMessage(`Saved ${key}.`);
      await load();
    } catch {
      setMessage("Invalid JSON.");
    }
  }

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-3xl">
        Website content
      </h1>
      <p className="mt-2 text-sm text-white/55">
        Edit homepage hero, about, footer, and announcement copy stored in
        site_content.
      </p>
      {message && (
        <p className="mt-4 text-sm text-[var(--gold)]" role="status">
          {message}
        </p>
      )}

      <form
        onSubmit={onSubmit}
        className="mt-8 max-w-3xl space-y-4 rounded-[1.5rem] border border-white/10 bg-[#1a1a1a] p-5"
      >
        <label className="block text-sm text-white/70">
          Content key
          <select
            value={key}
            onChange={(e) => setKey(e.target.value)}
            className="mt-2 h-11 w-full rounded-full border border-white/15 bg-black/20 px-4"
          >
            {KEYS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm text-white/70">
          JSON value
          <textarea
            value={json}
            onChange={(e) => setJson(e.target.value)}
            className="mt-2 min-h-64 w-full rounded-2xl border border-white/15 bg-black/20 px-4 py-3 font-mono text-xs"
          />
        </label>
        <Button type="submit">Save content</Button>
      </form>
    </div>
  );
}

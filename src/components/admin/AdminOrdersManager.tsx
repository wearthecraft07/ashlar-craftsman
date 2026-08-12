"use client";

import { useCallback, useEffect, useState } from "react";
import { formatCurrency } from "@/lib/utils";

type OrderRow = {
  id: string;
  email: string;
  status: string;
  total: number;
  subtotal: number;
  shipping: number;
  tax: number;
  items: unknown[];
  shipping_address?: Record<string, string> | null;
  notes?: string;
  created_at: string;
};

const STATUSES = [
  "pending",
  "paid",
  "processing",
  "ready",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
];

export function AdminOrdersManager() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [status, setStatus] = useState("");
  const [q, setQ] = useState("");
  const [message, setMessage] = useState("");
  const [selected, setSelected] = useState<OrderRow | null>(null);

  const load = useCallback(async () => {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (q.trim()) params.set("q", q.trim());
    const res = await fetch(`/api/admin/orders?${params}`);
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error || "Unable to load orders.");
      return;
    }
    setOrders(data.orders ?? []);
  }, [status, q]);

  useEffect(() => {
    void load();
  }, [load]);

  async function updateStatus(id: string, nextStatus: string) {
    const res = await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: nextStatus }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error || "Update failed.");
      return;
    }
    setMessage(`Order updated to ${nextStatus}.`);
    setSelected(data.order);
    await load();
  }

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-3xl">Orders</h1>
      <p className="mt-2 text-sm text-white/55">
        Search, filter, and update fulfillment status.
      </p>
      {message && (
        <p className="mt-4 text-sm text-[var(--gold)]" role="status">
          {message}
        </p>
      )}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search email..."
          className="h-11 flex-1 rounded-full border border-white/15 bg-black/20 px-4 text-sm"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="h-11 rounded-full border border-white/15 bg-black/20 px-4 text-sm"
        >
          <option value="">All statuses</option>
          {STATUSES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="overflow-x-auto rounded-[1.5rem] border border-white/10">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-white/5 text-white/60">
              <tr>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="cursor-pointer border-t border-white/10 hover:bg-white/5"
                  onClick={() => setSelected(order)}
                >
                  <td className="px-4 py-3 font-mono text-xs">
                    {order.id.slice(0, 8)}
                  </td>
                  <td className="px-4 py-3">{order.email}</td>
                  <td className="px-4 py-3">{formatCurrency(order.total)}</td>
                  <td className="px-4 py-3 capitalize text-[var(--gold)]">
                    {order.status}
                  </td>
                  <td className="px-4 py-3">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {!orders.length && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-white/50">
                    No orders yet. Complete a checkout to see them here.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <section className="rounded-[1.5rem] border border-white/10 bg-[#1a1a1a] p-5">
          {!selected ? (
            <p className="text-sm text-white/50">Select an order for details.</p>
          ) : (
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--gold)]">
                  Order detail
                </p>
                <p className="mt-2 font-mono text-xs text-white/60">
                  {selected.id}
                </p>
                <p className="mt-2">{selected.email}</p>
              </div>
              <div className="space-y-1 text-white/70">
                <p>Subtotal: {formatCurrency(selected.subtotal)}</p>
                <p>Shipping: {formatCurrency(selected.shipping)}</p>
                <p>Tax: {formatCurrency(selected.tax)}</p>
                <p className="text-white">
                  Total: {formatCurrency(selected.total)}
                </p>
              </div>
              {selected.shipping_address && (
                <div className="rounded-2xl bg-white/5 p-3 text-white/70">
                  <p>{selected.shipping_address.name}</p>
                  <p>{selected.shipping_address.line1}</p>
                  <p>
                    {selected.shipping_address.city}
                    {selected.shipping_address.state
                      ? `, ${selected.shipping_address.state}`
                      : ""}{" "}
                    {selected.shipping_address.postalCode}
                  </p>
                </div>
              )}
              <div>
                <p className="mb-2 text-white/60">Line items</p>
                <ul className="space-y-2">
                  {(Array.isArray(selected.items) ? selected.items : []).map(
                    (item, index) => {
                      const line = item as {
                        name?: string;
                        quantity?: number;
                        size?: string;
                        color?: { name?: string };
                        avatarConfig?: unknown;
                      };
                      return (
                        <li
                          key={index}
                          className="rounded-xl bg-white/5 px-3 py-2"
                        >
                          {line.name} × {line.quantity} · {line.color?.name} /{" "}
                          {line.size}
                          {line.avatarConfig ? " · custom avatar" : ""}
                        </li>
                      );
                    },
                  )}
                </ul>
              </div>
              <label className="block">
                Status
                <select
                  value={selected.status}
                  onChange={(e) => void updateStatus(selected.id, e.target.value)}
                  className="mt-2 h-11 w-full rounded-full border border-white/15 bg-black/20 px-4"
                >
                  {STATUSES.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

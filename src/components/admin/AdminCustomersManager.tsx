"use client";

import { useCallback, useEffect, useState } from "react";
import { formatCurrency } from "@/lib/utils";

type Customer = {
  id: string;
  email: string | null;
  full_name: string | null;
  role: string;
  disabled: boolean;
  created_at: string;
  orderCount: number;
  lifetimeValue: number;
};

export function AdminCustomersManager() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [q, setQ] = useState("");
  const [message, setMessage] = useState("");
  const [selected, setSelected] = useState<Customer | null>(null);

  const load = useCallback(async () => {
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    const res = await fetch(`/api/admin/customers?${params}`);
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error || "Unable to load customers.");
      return;
    }
    setCustomers(data.customers ?? []);
  }, [q]);

  useEffect(() => {
    void load();
  }, [load]);

  async function toggleDisabled(customer: Customer) {
    const res = await fetch("/api/admin/customers", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: customer.id,
        disabled: !customer.disabled,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error || "Update failed.");
      return;
    }
    setMessage(
      data.customer.disabled ? "Account disabled." : "Account re-enabled.",
    );
    setSelected(data.customer);
    await load();
  }

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-3xl">
        Customers
      </h1>
      <p className="mt-2 text-sm text-white/55">
        Search accounts, review order totals, and disable access if needed.
      </p>
      {message && (
        <p className="mt-4 text-sm text-[var(--gold)]" role="status">
          {message}
        </p>
      )}

      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search name or email..."
        className="mt-6 h-11 w-full max-w-md rounded-full border border-white/15 bg-black/20 px-4 text-sm"
      />

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="overflow-x-auto rounded-[1.5rem] border border-white/10">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-white/5 text-white/60">
              <tr>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Orders</th>
                <th className="px-4 py-3">Lifetime</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr
                  key={customer.id}
                  className="cursor-pointer border-t border-white/10 hover:bg-white/5"
                  onClick={() => setSelected(customer)}
                >
                  <td className="px-4 py-3">
                    <p>{customer.full_name || "Customer"}</p>
                    <p className="text-white/45">{customer.email}</p>
                  </td>
                  <td className="px-4 py-3">{customer.orderCount}</td>
                  <td className="px-4 py-3">
                    {formatCurrency(customer.lifetimeValue)}
                  </td>
                  <td className="px-4 py-3">
                    {customer.disabled ? "Disabled" : customer.role}
                  </td>
                </tr>
              ))}
              {!customers.length && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-white/50">
                    No customers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <section className="rounded-[1.5rem] border border-white/10 bg-[#1a1a1a] p-5 text-sm">
          {!selected ? (
            <p className="text-white/50">Select a customer for details.</p>
          ) : (
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--gold)]">
                Customer detail
              </p>
              <p className="text-lg font-semibold">
                {selected.full_name || "Customer"}
              </p>
              <p className="text-white/70">{selected.email}</p>
              <p className="text-white/50">
                Joined {new Date(selected.created_at).toLocaleDateString()}
              </p>
              <p>Role: {selected.role}</p>
              <p>Orders: {selected.orderCount}</p>
              <p>Lifetime value: {formatCurrency(selected.lifetimeValue)}</p>
              <button
                type="button"
                onClick={() => void toggleDisabled(selected)}
                className="mt-4 rounded-full border border-white/15 px-4 py-2 text-xs hover:bg-white/10"
              >
                {selected.disabled ? "Re-enable account" : "Disable account"}
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

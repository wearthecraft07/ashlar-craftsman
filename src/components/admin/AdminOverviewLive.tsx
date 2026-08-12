"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

type Stats = {
  sales: number;
  orders: number;
  pendingOrders: number;
  completedOrders: number;
  customers: number;
  products: number;
  lowStockCount: number;
  inventoryUnits: number;
  recentOrders: Array<{
    id: string;
    email: string;
    total: number;
    status: string;
    created_at: string;
  }>;
  recentCustomers: Array<{
    id: string;
    email: string | null;
    full_name: string | null;
    created_at: string;
  }>;
  lowStockProducts: Array<{
    id: string;
    name: string;
    inventory: number;
  }>;
  topProducts: Array<{
    id: string;
    name: string;
    inventory: number;
  }>;
};

export function AdminOverviewLive() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [mode, setMode] = useState("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    void (async () => {
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Unable to load dashboard.");
        setMode("error");
        return;
      }
      setMode(data.mode ?? "database");
      setStats(data.stats);
    })();
  }, []);

  if (mode === "loading") {
    return <p className="text-sm text-white/50">Loading dashboard…</p>;
  }

  if (mode === "demo" || !stats) {
    return (
      <div>
        <Header
          title="Dashboard"
          subtitle="Connect Supabase and run seed.sql to see live store metrics."
        />
        {error && (
          <p className="mt-4 text-sm text-[var(--gold)]">{error}</p>
        )}
      </div>
    );
  }

  return (
    <div>
      <Header
        title="Dashboard"
        subtitle="Live snapshot of sales, orders, customers, and inventory."
      />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Total sales" value={formatCurrency(stats.sales)} />
        <Stat label="Orders" value={String(stats.orders)} />
        <Stat label="Pending" value={String(stats.pendingOrders)} />
        <Stat label="Completed" value={String(stats.completedOrders)} />
        <Stat label="Customers" value={String(stats.customers)} />
        <Stat label="Products" value={String(stats.products)} />
        <Stat label="Low stock" value={String(stats.lowStockCount)} />
        <Stat label="Inventory units" value={String(stats.inventoryUnits)} />
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <Panel title="Recent orders">
          {stats.recentOrders.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between border-b border-white/10 py-3 text-sm last:border-0"
            >
              <div>
                <p>{order.email}</p>
                <p className="text-white/45">
                  {new Date(order.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p>{formatCurrency(order.total)}</p>
                <p className="capitalize text-[var(--gold)]">{order.status}</p>
              </div>
            </div>
          ))}
          {!stats.recentOrders.length && (
            <p className="text-sm text-white/50">No orders yet.</p>
          )}
          <Link
            href="/admin/orders"
            className="mt-3 inline-block text-sm text-[var(--gold)]"
          >
            Manage orders →
          </Link>
        </Panel>

        <Panel title="Recent customers">
          {stats.recentCustomers.map((customer) => (
            <div
              key={customer.id}
              className="flex items-center justify-between border-b border-white/10 py-3 text-sm last:border-0"
            >
              <div>
                <p>{customer.full_name || "Customer"}</p>
                <p className="text-white/45">{customer.email}</p>
              </div>
              <p className="text-white/45">
                {new Date(customer.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
          {!stats.recentCustomers.length && (
            <p className="text-sm text-white/50">No customers yet.</p>
          )}
          <Link
            href="/admin/customers"
            className="mt-3 inline-block text-sm text-[var(--gold)]"
          >
            Manage customers →
          </Link>
        </Panel>

        <Panel title="Low stock">
          {stats.lowStockProducts.map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between border-b border-white/10 py-3 text-sm last:border-0"
            >
              <p>{product.name}</p>
              <p className="text-[var(--gold)]">{product.inventory} left</p>
            </div>
          ))}
          {!stats.lowStockProducts.length && (
            <p className="text-sm text-white/50">Inventory looks healthy.</p>
          )}
        </Panel>

        <Panel title="Best sellers">
          {stats.topProducts.map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between border-b border-white/10 py-3 text-sm last:border-0"
            >
              <p>{product.name}</p>
              <p className="text-white/60">{product.inventory} left</p>
            </div>
          ))}
          {!stats.topProducts.length && (
            <p className="text-sm text-white/50">Mark products as best sellers.</p>
          )}
        </Panel>
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

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
      <p className="text-xs uppercase tracking-[0.2em] text-white/45">{label}</p>
      <p className="mt-3 font-[family-name:var(--font-display)] text-2xl text-[var(--gold)]">
        {value}
      </p>
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

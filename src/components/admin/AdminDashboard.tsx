"use client";

import { FormEvent, useMemo, useState } from "react";
import { PRODUCTS } from "@/data/products";
import { formatCurrency } from "@/lib/utils";

const DEMO_ORDERS = [
  {
    id: "ord_1001",
    email: "marcus@email.com",
    total: 11200,
    status: "paid",
    createdAt: "2026-07-28",
  },
  {
    id: "ord_1002",
    email: "aisha@email.com",
    total: 6400,
    status: "processing",
    createdAt: "2026-07-29",
  },
  {
    id: "ord_1003",
    email: "devon@email.com",
    total: 15600,
    status: "shipped",
    createdAt: "2026-07-30",
  },
];

const DEMO_CUSTOMERS = [
  { id: "c1", name: "Marcus R.", email: "marcus@email.com", orders: 4 },
  { id: "c2", name: "Aisha K.", email: "aisha@email.com", orders: 2 },
  { id: "c3", name: "Devon L.", email: "devon@email.com", orders: 6 },
];

export function AdminOverview() {
  const revenue = DEMO_ORDERS.reduce((sum, o) => sum + o.total, 0);
  const inventory = PRODUCTS.reduce((sum, p) => sum + p.inventory, 0);

  return (
    <div>
      <Header title="Overview" subtitle="Live snapshot of the Ashlar storefront." />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Revenue" value={formatCurrency(revenue)} />
        <Stat label="Orders" value={String(DEMO_ORDERS.length)} />
        <Stat label="Products" value={String(PRODUCTS.length)} />
        <Stat label="Inventory units" value={String(inventory)} />
      </div>
      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <Panel title="Recent orders">
          {DEMO_ORDERS.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between border-b border-white/10 py-3 text-sm last:border-0"
            >
              <div>
                <p>{order.email}</p>
                <p className="text-white/45">{order.createdAt}</p>
              </div>
              <div className="text-right">
                <p>{formatCurrency(order.total)}</p>
                <p className="capitalize text-[var(--gold)]">{order.status}</p>
              </div>
            </div>
          ))}
        </Panel>
        <Panel title="Top products">
          {PRODUCTS.filter((p) => p.bestSeller).map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between border-b border-white/10 py-3 text-sm last:border-0"
            >
              <p>{product.name}</p>
              <p className="text-white/60">{product.inventory} left</p>
            </div>
          ))}
        </Panel>
      </div>
    </div>
  );
}

export function AdminProducts() {
  const [products, setProducts] = useState(PRODUCTS);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("5200");
  const [inventory, setInventory] = useState("50");
  const [message, setMessage] = useState("");

  async function onUpload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const file = form.get("file");

    if (file instanceof File && file.size > 0) {
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || "Upload skipped — Cloudinary not configured.");
      } else {
        setMessage(`Uploaded design: ${data.url}`);
      }
    }

    const next = {
      ...products[0],
      id: `prod_${Date.now()}`,
      slug: name.toLowerCase().replace(/\s+/g, "-"),
      name: name || "Untitled Tee",
      price: Number(price) || 5000,
      inventory: Number(inventory) || 0,
      category: "limited" as const,
      featured: false,
      bestSeller: false,
      createdAt: new Date().toISOString(),
    };
    setProducts((prev) => [next, ...prev]);
    setName("");
    setMessage((prev) => prev || "Design added to inventory (local demo).");
  }

  return (
    <div>
      <Header
        title="Products & inventory"
        subtitle="Upload shirt designs and manage stock."
      />
      <form
        onSubmit={onUpload}
        className="mt-8 grid gap-4 rounded-[1.5rem] border border-white/10 bg-white/5 p-6 md:grid-cols-2"
      >
        <label className="text-sm">
          Design name
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-black/30 px-3"
          />
        </label>
        <label className="text-sm">
          Price (cents)
          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-black/30 px-3"
          />
        </label>
        <label className="text-sm">
          Inventory
          <input
            value={inventory}
            onChange={(e) => setInventory(e.target.value)}
            className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-black/30 px-3"
          />
        </label>
        <label className="text-sm">
          Design file
          <input
            name="file"
            type="file"
            accept="image/*,.svg"
            className="mt-2 block w-full text-sm text-white/70"
          />
        </label>
        <button
          type="submit"
          className="md:col-span-2 h-12 rounded-full bg-[var(--gold)] font-semibold text-[var(--ink)]"
        >
          Upload & add product
        </button>
        {message && <p className="md:col-span-2 text-sm text-[var(--gold)]">{message}</p>}
      </form>

      <div className="mt-8 overflow-x-auto rounded-[1.5rem] border border-white/10">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-white/5 text-white/60">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Inventory</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t border-white/10">
                <td className="px-4 py-3">{product.name}</td>
                <td className="px-4 py-3 capitalize">{product.category}</td>
                <td className="px-4 py-3">{formatCurrency(product.price)}</td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    value={product.inventory}
                    onChange={(e) =>
                      setProducts((prev) =>
                        prev.map((p) =>
                          p.id === product.id
                            ? { ...p, inventory: Number(e.target.value) }
                            : p,
                        ),
                      )
                    }
                    className="h-9 w-24 rounded-lg border border-white/10 bg-black/30 px-2"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function AdminOrders() {
  return (
    <div>
      <Header title="Orders" subtitle="Track fulfillment across the store." />
      <div className="mt-8 overflow-x-auto rounded-[1.5rem] border border-white/10">
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
            {DEMO_ORDERS.map((order) => (
              <tr key={order.id} className="border-t border-white/10">
                <td className="px-4 py-3">{order.id}</td>
                <td className="px-4 py-3">{order.email}</td>
                <td className="px-4 py-3">{formatCurrency(order.total)}</td>
                <td className="px-4 py-3 capitalize text-[var(--gold)]">
                  {order.status}
                </td>
                <td className="px-4 py-3">{order.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function AdminCustomers() {
  return (
    <div>
      <Header title="Customers" subtitle="People wearing the craft." />
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {DEMO_CUSTOMERS.map((customer) => (
          <div
            key={customer.id}
            className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5"
          >
            <p className="text-lg font-semibold">{customer.name}</p>
            <p className="mt-1 text-sm text-white/55">{customer.email}</p>
            <p className="mt-4 text-sm text-[var(--gold)]">
              {customer.orders} orders
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdminAnalytics() {
  const bars = useMemo(
    () => [
      { label: "Mon", value: 42 },
      { label: "Tue", value: 58 },
      { label: "Wed", value: 35 },
      { label: "Thu", value: 72 },
      { label: "Fri", value: 88 },
      { label: "Sat", value: 64 },
      { label: "Sun", value: 51 },
    ],
    [],
  );

  return (
    <div>
      <Header
        title="Analytics"
        subtitle="Demo performance chart — connect Supabase + Stripe for live data."
      />
      <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-white/5 p-6">
        <div className="flex h-56 items-end gap-3">
          {bars.map((bar) => (
            <div key={bar.label} className="flex flex-1 flex-col items-center gap-2">
              <div
                className="w-full rounded-t-xl bg-[linear-gradient(180deg,#C9A227,#8A6E12)]"
                style={{ height: `${bar.value}%` }}
              />
              <span className="text-xs text-white/50">{bar.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Stat label="Conversion" value="3.8%" />
        <Stat label="Avg. order" value="$86" />
        <Stat label="Avatar → cart" value="27%" />
      </div>
    </div>
  );
}

function Header({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl">
        {title}
      </h1>
      <p className="mt-2 text-sm text-white/55">{subtitle}</p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
      <p className="text-xs uppercase tracking-[0.2em] text-white/45">{label}</p>
      <p className="mt-3 font-[family-name:var(--font-display)] text-3xl text-[var(--gold)]">
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
    <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
      <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-white/55">
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </div>
  );
}

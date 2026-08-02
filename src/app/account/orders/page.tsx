import type { Metadata } from "next";
import { formatCurrency } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Order history",
};

const DEMO = [
  {
    id: "ord_1001",
    total: 11200,
    status: "Delivered",
    date: "Jul 20, 2026",
    items: "Ashlar Mark Tee, Craft Your Journey Tee",
  },
  {
    id: "ord_1002",
    total: 6400,
    status: "Processing",
    date: "Jul 29, 2026",
    items: "Custom Avatar Tee",
  },
];

export default function OrdersPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-20 pt-28 sm:px-6">
      <h1 className="font-[family-name:var(--font-display)] text-4xl">
        Order history
      </h1>
      <p className="mt-3 text-sm text-[var(--muted)]">
        Demo orders shown until Supabase is connected.
      </p>
      <div className="mt-8 space-y-4">
        {DEMO.map((order) => (
          <article
            key={order.id}
            className="rounded-[1.5rem] border border-black/8 bg-white p-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-semibold">{order.id}</p>
              <p className="text-sm text-[var(--gold)]">{order.status}</p>
            </div>
            <p className="mt-2 text-sm text-[var(--muted)]">{order.items}</p>
            <div className="mt-4 flex justify-between text-sm">
              <span>{order.date}</span>
              <span className="font-semibold">
                {formatCurrency(order.total)}
              </span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

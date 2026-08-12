import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { getSessionUser } from "@/lib/auth/admin";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Order history",
};

export default async function OrdersPage() {
  const { user } = await getSessionUser();

  if (!user) {
    return (
      <div className="mx-auto max-w-3xl px-4 pb-20 pt-28 sm:px-6">
        <h1 className="font-[family-name:var(--font-display)] text-4xl">
          Order history
        </h1>
        <p className="mt-4 text-[var(--muted)]">
          Sign in to view your orders.
        </p>
        <Button href="/auth/login" className="mt-6">
          Sign in
        </Button>
      </div>
    );
  }

  const supabase = await createClient();
  let orders: Array<{
    id: string;
    status: string;
    total: number;
    subtotal: number;
    shipping: number;
    tax: number;
    created_at: string;
    items: Array<{
      name?: string;
      quantity?: number;
      size?: string;
      color?: { name?: string };
      avatarConfig?: unknown;
    }> | null;
    shipping_address?: Record<string, string> | null;
  }> = [];

  if (supabase) {
    const { data } = await supabase
      .from("orders")
      .select(
        "id, status, total, subtotal, shipping, tax, created_at, items, shipping_address",
      )
      .or(
        `user_id.eq.${user.id}${user.email ? `,email.eq.${user.email}` : ""}`,
      )
      .order("created_at", { ascending: false });
    orders = (data as typeof orders) ?? [];
  }

  return (
    <div className="mx-auto max-w-3xl px-4 pb-20 pt-28 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-4xl">
            Order history
          </h1>
          <p className="mt-3 text-sm text-[var(--muted)]">
            Orders linked to your account email.
          </p>
        </div>
        <Link
          href="/account"
          className="text-sm text-[var(--gold)] underline-offset-2 hover:underline"
        >
          Back to account
        </Link>
      </div>

      <div className="mt-8 space-y-4">
        {orders.length === 0 && (
          <p className="rounded-[1.5rem] border border-black/8 bg-white p-6 text-sm text-[var(--muted)]">
            No orders yet.{" "}
            <Link href="/shop" className="underline">
              Start shopping
            </Link>
          </p>
        )}
        {orders.map((order) => (
          <article
            key={order.id}
            className="rounded-[1.5rem] border border-black/8 bg-white p-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-mono text-xs text-[var(--muted)]">{order.id}</p>
              <p className="text-sm capitalize text-[var(--gold)]">
                {order.status}
              </p>
            </div>
            <ul className="mt-3 space-y-1 text-sm text-[var(--walnut)]">
              {(order.items ?? []).map((item, index) => (
                <li key={index}>
                  {item.name} × {item.quantity}
                  {item.color?.name ? ` · ${item.color.name}` : ""}
                  {item.size ? ` / ${item.size}` : ""}
                  {item.avatarConfig ? " · custom avatar" : ""}
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-wrap justify-between gap-2 text-sm">
              <span>{new Date(order.created_at).toLocaleString()}</span>
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

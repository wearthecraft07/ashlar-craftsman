"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import { formatCurrency } from "@/lib/utils";
import type { Profile } from "@/types";

type OrderPreview = {
  id: string;
  status: string;
  total: number;
  created_at: string;
  items: Array<{ name?: string }> | null;
};

type AvatarPreview = {
  id: string;
  name: string;
  updated_at: string;
};

export function AccountDashboard({
  profile,
  orders,
  avatars,
}: {
  profile: Profile;
  orders: OrderPreview[];
  avatars: AvatarPreview[];
}) {
  const router = useRouter();

  async function signOut() {
    const supabase = createClient();
    if (supabase) await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-5xl px-4 pb-20 pt-28 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--gold)]">
            Account
          </p>
          <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl text-[var(--lodge-blue)]">
            {profile.full_name || "Craftsman"}
          </h1>
          <p className="mt-2 text-[var(--walnut)]">{profile.email}</p>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Member since{" "}
            {new Date(profile.created_at).toLocaleDateString()}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button href="/avatar">Avatar Studio</Button>
          <Button variant="ghost" onClick={() => void signOut()}>
            Sign out
          </Button>
        </div>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <section className="rounded-[1.5rem] border border-[var(--stone)] bg-white p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-semibold text-[var(--lodge-blue)]">
              Recent orders
            </h2>
            <Link
              href="/account/orders"
              className="text-sm text-[var(--gold)] underline-offset-2 hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {orders.length === 0 && (
              <p className="text-sm text-[var(--muted)]">
                No orders yet.{" "}
                <Link href="/shop" className="underline">
                  Browse the shop
                </Link>
              </p>
            )}
            {orders.slice(0, 4).map((order) => (
              <article
                key={order.id}
                className="rounded-2xl border border-black/5 bg-[var(--ivory)] p-4"
              >
                <div className="flex justify-between gap-3 text-sm">
                  <p className="font-mono text-xs text-[var(--muted)]">
                    {order.id.slice(0, 8)}
                  </p>
                  <p className="capitalize text-[var(--gold)]">{order.status}</p>
                </div>
                <p className="mt-2 text-sm text-[var(--walnut)]">
                  {(order.items ?? [])
                    .map((item) => item.name)
                    .filter(Boolean)
                    .join(", ") || "Order items"}
                </p>
                <div className="mt-2 flex justify-between text-sm">
                  <span>
                    {new Date(order.created_at).toLocaleDateString()}
                  </span>
                  <span className="font-semibold">
                    {formatCurrency(order.total)}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-[1.5rem] border border-[var(--stone)] bg-white p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-semibold text-[var(--lodge-blue)]">
              Saved avatars
            </h2>
            <Link
              href="/avatar"
              className="text-sm text-[var(--gold)] underline-offset-2 hover:underline"
            >
              Open studio
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {avatars.length === 0 && (
              <p className="text-sm text-[var(--muted)]">
                No cloud-saved avatars yet. Save from the studio while signed in.
              </p>
            )}
            {avatars.map((avatar) => (
              <article
                key={avatar.id}
                className="rounded-2xl border border-black/5 bg-[var(--ivory)] p-4"
              >
                <p className="font-semibold text-[var(--lodge-blue)]">
                  {avatar.name}
                </p>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  Updated {new Date(avatar.updated_at).toLocaleDateString()}
                </p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export function AccountSignedOut() {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-20 pt-28 sm:px-6">
      <h1 className="font-[family-name:var(--font-display)] text-4xl">
        Account
      </h1>
      <p className="mt-4 text-[var(--muted)]">
        Sign in to sync avatar designs, view order history, and manage your
        profile across devices.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button href="/auth/login">Sign in</Button>
        <Button href="/auth/signup" variant="ghost">
          Create account
        </Button>
        <Button href="/avatar" variant="dark">
          Avatar Studio
        </Button>
      </div>
    </div>
  );
}

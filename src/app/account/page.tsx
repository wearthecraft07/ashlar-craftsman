import type { Metadata } from "next";
import {
  AccountDashboard,
  AccountSignedOut,
} from "@/components/account/AccountDashboard";
import { getProfile, getSessionUser } from "@/lib/auth/admin";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Account",
};

export default async function AccountPage() {
  const { user } = await getSessionUser();
  if (!user) return <AccountSignedOut />;

  const profile = await getProfile();
  if (!profile) return <AccountSignedOut />;

  const supabase = await createClient();
  let orders: Array<{
    id: string;
    status: string;
    total: number;
    created_at: string;
    items: Array<{ name?: string }> | null;
  }> = [];
  let avatars: Array<{ id: string; name: string; updated_at: string }> = [];

  if (supabase) {
    const orderQuery = user.email
      ? supabase
          .from("orders")
          .select("id, status, total, created_at, items")
          .or(`user_id.eq.${user.id},email.eq.${user.email}`)
      : supabase
          .from("orders")
          .select("id, status, total, created_at, items")
          .eq("user_id", user.id);

    const [{ data: orderRows }, { data: avatarRows }] = await Promise.all([
      orderQuery.order("created_at", { ascending: false }).limit(10),
      supabase
        .from("avatars")
        .select("id, name, updated_at")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false })
        .limit(12),
    ]);
    orders = (orderRows as typeof orders) ?? [];
    avatars = (avatarRows as typeof avatars) ?? [];
  }

  return (
    <AccountDashboard profile={profile} orders={orders} avatars={avatars} />
  );
}

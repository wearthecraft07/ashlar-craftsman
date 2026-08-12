import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/admin";
import type { AdminRole, Profile } from "@/types";

const ADMIN_ROLES: AdminRole[] = ["admin", "super_admin"];

export function isAdminRole(role?: string | null): role is AdminRole {
  return Boolean(role && ADMIN_ROLES.includes(role as AdminRole));
}

function adminEmailsFromEnv() {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function emailIsBootstrapAdmin(email?: string | null) {
  if (!email) return false;
  return adminEmailsFromEnv().includes(email.toLowerCase());
}

export async function getSessionUser() {
  const supabase = await createClient();
  if (!supabase) return { supabase: null, user: null };

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { supabase, user };
}

export async function getProfile(): Promise<Profile | null> {
  const { supabase, user } = await getSessionUser();
  if (!supabase || !user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  const service = createServiceClient();

  if (!data) {
    const role = emailIsBootstrapAdmin(user.email) ? "super_admin" : "customer";
    if (service) {
      const { data: created } = await service
        .from("profiles")
        .upsert({
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name ?? null,
          role,
        })
        .select("*")
        .single();
      return (created as Profile) ?? null;
    }
    return null;
  }

  if (
    emailIsBootstrapAdmin(data.email) &&
    data.role === "customer" &&
    !data.disabled &&
    service
  ) {
    const { data: promoted } = await service
      .from("profiles")
      .update({ role: "super_admin" })
      .eq("id", user.id)
      .select("*")
      .single();
    return (promoted as Profile) ?? (data as Profile);
  }

  return data as Profile;
}

export async function requireAdmin(options?: {
  superAdmin?: boolean;
}): Promise<
  | { ok: true; profile: Profile; userId: string }
  | { ok: false; status: 401 | 403; error: string }
> {
  const { user } = await getSessionUser();
  if (!user) {
    return { ok: false, status: 401, error: "Authentication required." };
  }

  const profile = await getProfile();
  if (!profile || profile.disabled) {
    return { ok: false, status: 403, error: "Admin access denied." };
  }

  if (options?.superAdmin) {
    if (profile.role !== "super_admin") {
      return { ok: false, status: 403, error: "Super admin required." };
    }
  } else if (!isAdminRole(profile.role) && !profile.is_admin) {
    return { ok: false, status: 403, error: "Admin access denied." };
  }

  return { ok: true, profile, userId: user.id };
}

export function isSupabaseAuthConfigured() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(url && key && !url.includes("your_supabase"));
}

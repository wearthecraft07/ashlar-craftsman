"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { Button } from "@/components/ui/Button";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(
    searchParams.get("error") === "forbidden"
      ? "This account does not have administrator access."
      : "",
  );
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    if (!isSupabaseConfigured()) {
      setMessage(
        "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY to .env.local, run supabase/schema.sql + seed.sql, then set ADMIN_EMAILS to your admin address.",
      );
      setLoading(false);
      return;
    }

    const supabase = createClient();
    if (!supabase) {
      setMessage("Unable to create Supabase client.");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;

      const next = searchParams.get("next") || "/admin";
      router.replace(next);
      router.refresh();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to sign in.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#111111] px-4 text-white">
      <div className="w-full max-w-md rounded-[1.75rem] border border-white/10 bg-[#1a1a1a] p-8 shadow-2xl">
        <div className="flex items-center gap-3">
          <BrandLogo size="sm" className="h-12 w-12" onDark />
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-[var(--gold)]">
              Administrator
            </p>
            <h1 className="font-[family-name:var(--font-display)] text-2xl">
              Admin login
            </h1>
          </div>
        </div>

        <p className="mt-4 text-sm text-white/60">
          Secure access for Ashlar Craftsman store management. Customer accounts
          cannot enter this area.
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <label className="block text-sm">
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 h-12 w-full rounded-full border border-white/15 bg-black/30 px-4 outline-none ring-[var(--gold)] focus:ring-2"
            />
          </label>
          <label className="block text-sm">
            Password
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 h-12 w-full rounded-full border border-white/15 bg-black/30 px-4 outline-none ring-[var(--gold)] focus:ring-2"
            />
          </label>
          {message && (
            <p className="rounded-2xl border border-[var(--gold)]/30 bg-[var(--gold)]/10 px-4 py-3 text-sm text-[var(--gold)]">
              {message}
            </p>
          )}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in…" : "Sign in to admin"}
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-white/40">
          <Link href="/" className="underline-offset-2 hover:underline">
            Back to storefront
          </Link>
        </p>
      </div>
    </div>
  );
}

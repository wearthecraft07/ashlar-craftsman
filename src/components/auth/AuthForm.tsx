"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

type Mode = "login" | "signup";

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    if (!isSupabaseConfigured()) {
      setMessage(
        "Supabase is not configured. Add keys to .env.local to enable auth.",
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
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage("Check your email to confirm your account.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push("/account");
        router.refresh();
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Auth failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto max-w-md rounded-[2rem] border border-black/8 bg-white p-6 sm:p-8"
    >
      <h1 className="font-[family-name:var(--font-display)] text-3xl">
        {mode === "login" ? "Sign in" : "Create account"}
      </h1>
      <p className="mt-3 text-sm text-[var(--muted)]">
        Powered by Supabase Auth.
      </p>
      <label className="mt-8 block text-sm font-medium">
        Email
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-2 h-12 w-full rounded-full border border-black/10 px-4 outline-none ring-[var(--gold)] focus:ring-2"
        />
      </label>
      <label className="mt-4 block text-sm font-medium">
        Password
        <input
          required
          type="password"
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-2 h-12 w-full rounded-full border border-black/10 px-4 outline-none ring-[var(--gold)] focus:ring-2"
        />
      </label>
      <Button type="submit" className="mt-8 w-full" disabled={loading}>
        {loading ? "Please wait..." : mode === "login" ? "Sign in" : "Sign up"}
      </Button>
      {message && (
        <p className="mt-4 text-sm text-[var(--gold)]" role="status">
          {message}
        </p>
      )}
    </form>
  );
}

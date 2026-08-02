import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Account",
};

export default function AccountPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-20 pt-28 sm:px-6">
      <h1 className="font-[family-name:var(--font-display)] text-4xl">
        Account
      </h1>
      <p className="mt-4 text-[var(--muted)]">
        Sign in with Supabase Auth to sync avatars and order history across
        devices. Local avatar saves already work in the studio.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button href="/auth/login">Sign in</Button>
        <Button href="/auth/signup" variant="ghost">
          Create account
        </Button>
        <Button href="/account/orders" variant="dark">
          Order history
        </Button>
      </div>
      <div className="mt-10 rounded-[1.5rem] border border-black/8 bg-white p-6">
        <h2 className="font-semibold">Quick links</h2>
        <ul className="mt-4 space-y-2 text-sm text-[var(--muted)]">
          <li>
            <Link href="/avatar" className="underline">
              Edit saved avatars
            </Link>
          </li>
          <li>
            <Link href="/cart" className="underline">
              View cart
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

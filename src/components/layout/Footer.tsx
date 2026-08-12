"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/ui/BrandLogo";

export function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="border-t border-[var(--gold)]/25 bg-[var(--lodge-blue)] text-[var(--ivory)]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4 lg:px-8">
        <div className="md:col-span-2">
          <Link href="/" aria-label="the ASHLAR CRAFTSMAN home">
            <BrandLogo size="lg" className="h-24 w-24" onDark />
          </Link>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-[var(--ivory)]/70">
            Traditional craftsmanship meets modern character. Build your avatar,
            craft your journey, wear the mark.
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
            Explore
          </p>
          <ul className="mt-4 space-y-2 text-sm text-[var(--ivory)]/75">
            <li>
              <Link href="/avatar" className="hover:text-[var(--gold)]">
                Avatar Studio
              </Link>
            </li>
            <li>
              <Link href="/shop" className="hover:text-[var(--gold)]">
                Shop
              </Link>
            </li>
            <li>
              <Link href="/account" className="hover:text-[var(--gold)]">
                Account
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
            Support
          </p>
          <ul className="mt-4 space-y-2 text-sm text-[var(--ivory)]/75">
            <li>hello@ashlarcraftsman.com</li>
            <li>Shipping worldwide</li>
            <li>Secure Stripe checkout</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[var(--gold)]/15 px-4 py-5 text-center text-xs text-[var(--ivory)]/45 sm:px-6">
        © {new Date().getFullYear()} the ASHLAR CRAFTSMAN. Craft Your Journey.
      </div>
    </footer>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/ui/BrandLogo";

export function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="border-t border-black/10 bg-[var(--ink)] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4 lg:px-8">
        <div className="md:col-span-2">
          <Link href="/" aria-label="the ASHLAR CRAFTSMAN home">
            <BrandLogo size="lg" className="h-24 w-24" onDark />
          </Link>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-white/65">
            Luxury streetwear meets classic craftsmanship. Build your avatar,
            craft your journey, wear the mark.
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
            Explore
          </p>
          <ul className="mt-4 space-y-2 text-sm text-white/75">
            <li>
              <Link href="/avatar" className="hover:text-white">
                Avatar Studio
              </Link>
            </li>
            <li>
              <Link href="/shop" className="hover:text-white">
                Shop
              </Link>
            </li>
            <li>
              <Link href="/account" className="hover:text-white">
                Account
              </Link>
            </li>
            <li>
              <Link href="/admin" className="hover:text-white">
                Admin
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
            Support
          </p>
          <ul className="mt-4 space-y-2 text-sm text-white/75">
            <li>hello@ashlarcraftsman.com</li>
            <li>Shipping worldwide</li>
            <li>Secure Stripe checkout</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-5 text-center text-xs text-white/45 sm:px-6">
        © {new Date().getFullYear()} the ASHLAR CRAFTSMAN. Craft Your Journey.
      </div>
    </footer>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { Button } from "@/components/ui/Button";
import { useCartStore } from "@/lib/cart-store";
import { cn } from "@/lib/utils";

const links = [
  { href: "/avatar", label: "Avatar Studio" },
  { href: "/shop", label: "Shop" },
  { href: "/#collections", label: "Collections" },
  { href: "/#gallery", label: "Gallery" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const totalItems = useCartStore((s) =>
    s.items.reduce((sum, item) => sum + item.quantity, 0),
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  if (pathname?.startsWith("/admin")) return null;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-[var(--gold)]/25 bg-[var(--lodge-blue)]/95 backdrop-blur-xl"
          : "bg-[var(--lodge-blue)]",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:h-20 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="relative z-10 inline-flex items-center transition duration-300 hover:opacity-90"
          aria-label="the ASHLAR CRAFTSMAN home"
        >
          <BrandLogo size="sm" className="h-11 w-11 sm:h-12 sm:w-12" priority onDark />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "nav-link text-sm font-semibold tracking-wide transition-opacity hover:opacity-80",
                pathname === link.href &&
                  "underline decoration-[var(--gold)] decoration-2 underline-offset-8",
              )}
              style={{ color: "#FFFFFF" }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/cart"
            className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/40 bg-[var(--lodge-blue)] text-white transition hover:border-white hover:text-white"
            aria-label={`Cart with ${totalItems} items`}
            style={{ color: "#FFFFFF" }}
          >
            <ShoppingBag className="h-5 w-5 text-white" />
            {totalItems > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--gold)] px-1 text-[10px] font-bold text-[var(--lodge-blue)]">
                {totalItems}
              </span>
            )}
          </Link>
          <Button href="/avatar" size="sm" className="hidden sm:inline-flex">
            Craft Avatar
          </Button>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--gold)]/35 bg-[var(--lodge-blue)] text-[var(--ivory)] md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="border-t border-[var(--gold)]/20 bg-[var(--lodge-blue)] px-4 pb-6 pt-2 md:hidden"
          >
            <nav className="flex flex-col gap-3">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-xl px-3 py-3 text-base font-semibold hover:bg-white/5"
                  style={{ color: "#FFFFFF" }}
                >
                  {link.label}
                </Link>
              ))}
              <Button href="/avatar" className="mt-2 w-full">
                Craft Avatar
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

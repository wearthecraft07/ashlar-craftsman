"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Package,
  ShoppingBag,
  Shirt,
  Users,
} from "lucide-react";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/admin", label: "Overview", icon: BarChart3 },
  { href: "/admin/products", label: "Products", icon: Shirt },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/analytics", label: "Analytics", icon: Package },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#111111] text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 lg:flex-row lg:px-8">
        <aside className="w-full shrink-0 lg:w-64">
          <Link
            href="/"
            className="inline-flex items-center gap-3"
            aria-label="the ASHLAR CRAFTSMAN home"
          >
            <BrandLogo size="sm" className="h-12 w-12" onDark />
            <span className="font-[family-name:var(--font-display)] text-sm tracking-[0.18em] text-[var(--gold)]">
              ADMIN
            </span>
          </Link>
          <nav className="mt-8 flex gap-2 overflow-x-auto lg:flex-col">
            {nav.map((item) => {
              const Icon = item.icon;
              const active =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname?.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "inline-flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition",
                    active
                      ? "bg-[var(--gold)] text-[var(--ink)]"
                      : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}

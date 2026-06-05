"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

import { AuthControls } from "@/components/layout/auth-controls";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { cn } from "@/lib/utils";

type NavItem = {
  href: Route;
  label: string;
};

const nav: NavItem[] = [
  { href: "/learn", label: "Learn" },
  { href: "/study", label: "Study" },
  { href: "/simulator", label: "Simulate" },
  { href: "/discussions", label: "Discuss" },
  { href: "/governance", label: "Governance" },
  { href: "/map", label: "Map" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  if (pathname === "/") {
    return null;
  }

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-20 border-b border-slate-800/80 bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-8">
        <Link className="flex min-w-0 items-center gap-3" href="/">
          <Image
            alt="Society Lab logo"
            className="h-11 w-11 flex-none"
            height={44}
            src="/atlas/society-lab-logo.png"
            width={44}
          />
          <div className="min-w-0">
            <span className="atlas-display block truncate text-2xl leading-none text-slate-900">Society Lab</span>
            <span className="block truncate text-[11px] text-slate-500">
              Civic intelligence for a better future
            </span>
          </div>
        </Link>

        <div className="hidden items-center gap-4 lg:flex">
          <nav className="flex items-center gap-1 rounded-full border border-[rgba(28,36,48,0.08)] bg-white/70 p-1 dark:border-slate-800 dark:bg-slate-900/80">
            {nav.map((item) => (
              <Link
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  isActive(item.href)
                    ? "bg-[rgba(59,130,246,0.12)] text-slate-900 dark:bg-cyan-400/12 dark:text-cyan-100"
                    : "text-slate-500 hover:bg-white hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-50",
                )}
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <AuthControls />
          </div>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <button
            aria-label="Toggle menu"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(28,36,48,0.12)] bg-white/80 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            onClick={() => setMenuOpen((value) => !value)}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <div className="border-t border-[rgba(28,36,48,0.08)] bg-white/92 px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-950/95 lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1">
            {nav.map((item) => (
              <Link
                className={cn(
                  "rounded-2xl px-4 py-3 text-sm font-medium transition-colors",
                  isActive(item.href)
                    ? "bg-[rgba(59,130,246,0.12)] text-slate-900 dark:bg-cyan-400/12 dark:text-cyan-100"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-200 dark:hover:bg-slate-800",
                )}
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-2">
              <AuthControls />
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}

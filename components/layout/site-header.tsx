"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import { Globe2, Menu, X } from "lucide-react";
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

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <header className="sticky top-0 z-20 border-b border-slate-800/80 bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
        <Link href="/" className="flex items-center gap-3 flex-shrink-0">
          <div className="rounded-2xl border border-cyan-300/20 bg-cyan-400/10 p-2">
            <Globe2 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <span className="block font-semibold leading-tight">Society Lab</span>
            <span className="hidden text-xs text-slate-400 sm:block">Prototype for systemic redesign</span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          <span className="mr-2 rounded-full border border-amber-300/20 bg-amber-400/15 px-3 py-1 text-xs font-medium text-amber-100">
            Alpha concept
          </span>
          <nav className="flex gap-1">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-xl px-3 py-1.5 text-sm font-medium transition-colors",
                  isActive(item.href)
                    ? "bg-cyan-400/12 text-cyan-200 border border-cyan-400/20"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="ml-2 flex items-center gap-2">
            <ThemeToggle />
            <AuthControls />
          </div>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <AuthControls />
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="rounded-xl border border-slate-700 bg-slate-800/60 p-2 text-slate-300 hover:text-slate-100 transition-colors"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-slate-800 bg-background/95 backdrop-blur md:hidden">
          <nav className="mx-auto max-w-7xl flex flex-col gap-1 px-4 py-3">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                  isActive(item.href)
                    ? "bg-cyan-400/12 text-cyan-200 border border-cyan-400/20"
                    : "text-slate-300 hover:text-slate-100 hover:bg-slate-800/60"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

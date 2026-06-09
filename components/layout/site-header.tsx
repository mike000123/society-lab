"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import { Bell, Bookmark, Menu, Search, X } from "lucide-react";

import { AuthControls } from "@/components/layout/auth-controls";
import { ToolbarSearch } from "@/components/layout/toolbar-search";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { cn } from "@/lib/utils";

type NavItem = {
  href: Route;
  label: string;
};

const nav: NavItem[] = [
  { href: "/learn", label: "Learn" },
  { href: "/simulator", label: "Simulate" },
  { href: "/discussions", label: "Discuss" },
  { href: "/governance", label: "Governance" },
  { href: "/map", label: "Map" },
  { href: "/study", label: "Study" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-30 border-b border-[rgba(28,36,48,0.08)] bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[88rem] items-center justify-between gap-6 px-4 py-3 md:px-8">
        <Link className="flex min-w-0 items-center gap-3" href="/">
          <Image
            alt="Society Lab logo"
            className="h-10 w-10 flex-none"
            height={44}
            src="/atlas/society-lab-logo.png"
            width={44}
          />
          <div className="min-w-0">
            <span className="block truncate text-[1.9rem] font-semibold leading-none tracking-[-0.04em] text-slate-950">
              Society Lab
            </span>
            <span className="block truncate text-[11px] font-medium leading-tight text-slate-500">
              Civic intelligence for a better future
            </span>
          </div>
        </Link>

        <div className="hidden min-w-0 flex-1 items-center justify-end gap-8 lg:flex">
          <nav className="mr-auto flex items-center gap-8 pl-8 xl:gap-10">
            {nav.map((item) => (
              <Link
                className={cn(
                  "relative py-2 text-[15px] font-bold tracking-[-0.01em] transition-colors",
                  isActive(item.href)
                    ? "text-[rgb(var(--atlas-primary))] after:absolute after:inset-x-0 after:-bottom-[14px] after:h-0.5 after:rounded-full after:bg-[rgb(var(--atlas-primary))]"
                    : "text-slate-700 hover:text-slate-950",
                )}
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <ToolbarSearch />
            {[Bell, Bookmark].map((Icon, index) => (
              <button
                aria-label={index === 0 ? "Notifications" : "Bookmarks"}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-600 transition hover:bg-[rgba(28,36,48,0.04)] hover:text-slate-950"
                key={index}
                type="button"
              >
                <Icon className="h-5 w-5" />
              </button>
            ))}
            <ThemeToggle compact />
            <AuthControls />
          </div>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
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
            <div className="mb-3 flex h-11 items-center gap-3 rounded-[1rem] border border-[rgba(28,36,48,0.08)] bg-white px-4 text-slate-500">
              <Search className="h-4 w-4 text-slate-400" />
              <span className="text-sm">Search simulators, topics, models...</span>
            </div>
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
            <div className="flex items-center justify-between gap-3 px-1 pt-3">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Bell className="h-4 w-4" />
                <Bookmark className="h-4 w-4" />
              </div>
              <ThemeToggle />
            </div>
            <div className="pt-2">
              <AuthControls />
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { AuthChangeEvent, Session, User } from "@supabase/supabase-js";
import { LayoutDashboard, LoaderCircle, LogIn, LogOut, Moon, Sun, Wrench } from "lucide-react";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { hasSupabaseEnv } from "@/lib/supabase/public-env";
import { applyTheme, readStoredTheme, type Theme } from "@/components/layout/ThemeToggle";

export function AuthControls() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isReady, setIsReady] = useState(!hasSupabaseEnv);
  const [user, setUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<Theme>("light");
  const supabase = useMemo(() => {
    if (!hasSupabaseEnv) {
      return null;
    }

    return createClient();
  }, []);

  useEffect(() => {
    setTheme(readStoredTheme());
  }, []);

  useEffect(() => {
    if (!supabase) {
      return;
    }

    let isActive = true;

    const syncSession = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (!isActive) {
        return;
      }

      setUser(error ? null : data.user);
      setIsReady(true);
    };

    void syncSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      if (!isActive) {
        return;
      }

      setUser(session?.user ?? null);
      setIsReady(true);
      router.refresh();
    });

    return () => {
      isActive = false;
      subscription.unsubscribe();
    };
  }, [router, supabase]);

  const handleSignOut = () => {
    if (!supabase) {
      return;
    }

    startTransition(() => {
      void supabase.auth.signOut().then(() => {
        setUser(null);
        router.push("/");
        router.refresh();
      });
    });
  };

  const toggleTheme = () => {
    const nextTheme: Theme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    applyTheme(nextTheme);
  };

  const profileLabel =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "Profile";
  const avatarUrl =
    typeof user?.user_metadata?.avatar_url === "string" ? (user.user_metadata.avatar_url as string) : null;
  const initials = profileLabel
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part: string) => part[0]?.toUpperCase() ?? "")
    .join("") || "SL";

  if (!hasSupabaseEnv) {
    return (
      <Button variant="outline" asChild>
        <Link href="/auth">
          <Wrench className="mr-2 h-4 w-4" />
          Auth setup
        </Link>
      </Button>
    );
  }

  if (!isReady) {
    return (
      <Button variant="ghost" disabled>
        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
        Session
      </Button>
    );
  }

  if (!user) {
    return (
      <Button asChild className="h-10 rounded-full px-4 text-sm font-semibold">
        <Link href="/auth">
          <LogIn className="mr-2 h-4 w-4" />
          Sign in
        </Link>
      </Button>
    );
  }

  return (
    <details className="group relative">
      <summary className="flex cursor-pointer list-none items-center rounded-full px-0.5 py-0.5 text-slate-700 transition hover:text-slate-900 [&::-webkit-details-marker]:hidden">
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            alt={`${profileLabel} avatar`}
            className="h-10 w-10 rounded-full object-cover shadow-[0_8px_18px_rgba(28,36,48,0.12)]"
            referrerPolicy="no-referrer"
            src={avatarUrl}
          />
        ) : (
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(59,130,246,0.14)] text-xs font-semibold text-primary shadow-[0_8px_18px_rgba(28,36,48,0.08)]">
            {initials}
          </span>
        )}
      </summary>

      <div className="absolute right-0 top-[calc(100%+0.75rem)] z-30 w-60 overflow-hidden rounded-[1.4rem] border border-[rgba(28,36,48,0.08)] bg-white/96 shadow-[0_20px_44px_rgba(28,36,48,0.12)] backdrop-blur">
        <div className="flex items-center gap-3 border-b border-[rgba(28,36,48,0.08)] px-4 py-4">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              alt={`${profileLabel} avatar`}
              className="h-10 w-10 rounded-full object-cover"
              referrerPolicy="no-referrer"
              src={avatarUrl}
            />
          ) : (
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(59,130,246,0.14)] text-sm font-semibold text-primary">
              {initials}
            </span>
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900">{profileLabel}</p>
            <p className="truncate text-xs text-slate-500">{user.email}</p>
          </div>
        </div>

        <div className="p-2">
          <button
            className="flex w-full items-center gap-3 rounded-[1rem] px-3 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-[rgba(28,36,48,0.04)] hover:text-slate-900"
            onClick={(event) => {
              event.currentTarget.closest("details")?.removeAttribute("open");
              toggleTheme();
            }}
            type="button"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4 text-amber-500" />
            ) : (
              <Moon className="h-4 w-4 text-slate-500" />
            )}
            {theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          </button>
          <Link
            className="flex items-center gap-3 rounded-[1rem] px-3 py-3 text-sm font-medium text-slate-700 transition hover:bg-[rgba(59,130,246,0.08)] hover:text-slate-900"
            href="/dashboard"
            onClick={(event) => {
              event.currentTarget.closest("details")?.removeAttribute("open");
            }}
          >
            <LayoutDashboard className="h-4 w-4 text-primary" />
            Dashboard
          </Link>
          <button
            className="flex w-full items-center gap-3 rounded-[1rem] px-3 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-[rgba(28,36,48,0.04)] hover:text-slate-900"
            disabled={isPending}
            onClick={(event) => {
              event.currentTarget.closest("details")?.removeAttribute("open");
              handleSignOut();
            }}
            type="button"
          >
            {isPending ? (
              <LoaderCircle className="h-4 w-4 animate-spin text-slate-500" />
            ) : (
              <LogOut className="h-4 w-4 text-slate-500" />
            )}
            Sign out
          </button>
        </div>
      </div>
    </details>
  );
}

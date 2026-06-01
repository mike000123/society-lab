"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { AuthChangeEvent, Session, User } from "@supabase/supabase-js";
import { LayoutDashboard, LoaderCircle, LogIn, LogOut, Wrench } from "lucide-react";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { hasSupabaseEnv } from "@/lib/supabase/public-env";

export function AuthControls() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isReady, setIsReady] = useState(!hasSupabaseEnv);
  const [user, setUser] = useState<User | null>(null);
  const supabase = useMemo(() => {
    if (!hasSupabaseEnv) {
      return null;
    }

    return createClient();
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
      <Button asChild>
        <Link href="/auth">
          <LogIn className="mr-2 h-4 w-4" />
          Sign in
        </Link>
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" asChild>
        <Link href="/dashboard">
          <LayoutDashboard className="mr-2 h-4 w-4" />
          Dashboard
        </Link>
      </Button>
      <Button variant="ghost" onClick={handleSignOut} disabled={isPending}>
        {isPending ? (
          <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <LogOut className="mr-2 h-4 w-4" />
        )}
        Sign out
      </Button>
    </div>
  );
}

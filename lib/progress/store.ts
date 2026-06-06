"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import type { Database } from "@/lib/database.types";
import { createClient as createSupabaseClient } from "@/lib/supabase/client";
import { hasSupabaseEnv } from "@/lib/supabase/public-env";

const STORAGE_KEY = "society_lab_progress_v1";
const DEV_MODE_KEY = "society_lab_dev_mode";

type ProgressRow = Database["public"]["Tables"]["user_module_progress"]["Row"];
type ProgressInsert = Database["public"]["Tables"]["user_module_progress"]["Insert"];

export interface ModuleProgress {
  slug: string;
  visited: boolean;
  quizScore: number | null;   // null = not attempted, 0-100 = last score
  quizPassed: boolean;        // score >= 60
  completedAt: string | null; // ISO date
}

export interface ProgressStore {
  modules: Record<string, ModuleProgress>;
}

function defaultStore(): ProgressStore {
  return { modules: {} };
}

function emptyModuleProgress(slug: string): ModuleProgress {
  return {
    slug,
    visited: false,
    quizScore: null,
    quizPassed: false,
    completedAt: null,
  };
}

function loadStore(): ProgressStore {
  if (typeof window === "undefined") return defaultStore();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultStore();
    return JSON.parse(raw) as ProgressStore;
  } catch {
    return defaultStore();
  }
}

function saveStore(store: ProgressStore) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

function rowToModuleProgress(row: ProgressRow): ModuleProgress {
  return {
    slug: row.module_slug,
    visited: row.visited,
    quizScore: row.quiz_score,
    quizPassed: row.quiz_passed,
    completedAt: row.completed_at,
  };
}

function toProgressInsert(userId: string, progress: ModuleProgress): ProgressInsert {
  return {
    user_id: userId,
    module_slug: progress.slug,
    visited: progress.visited,
    quiz_score: progress.quizScore,
    quiz_passed: progress.quizPassed,
    completed_at: progress.completedAt,
  };
}

function latestIsoDate(first: string | null, second: string | null) {
  if (!first) return second;
  if (!second) return first;

  return new Date(first).getTime() >= new Date(second).getTime() ? first : second;
}

function mergeModuleProgress(local: ModuleProgress, remote: ModuleProgress): ModuleProgress {
  const bestScore =
    local.quizScore == null
      ? remote.quizScore
      : remote.quizScore == null
        ? local.quizScore
        : Math.max(local.quizScore, remote.quizScore);

  return {
    slug: local.slug,
    visited: local.visited || remote.visited,
    quizScore: bestScore,
    quizPassed: local.quizPassed || remote.quizPassed,
    completedAt: latestIsoDate(local.completedAt, remote.completedAt),
  };
}

function mergeProgressStore(localStore: ProgressStore, rows: ProgressRow[]): ProgressStore {
  const mergedModules = { ...localStore.modules };

  for (const row of rows) {
    const incoming = rowToModuleProgress(row);
    const current = mergedModules[incoming.slug] ?? emptyModuleProgress(incoming.slug);
    mergedModules[incoming.slug] = mergeModuleProgress(current, incoming);
  }

  return { modules: mergedModules };
}

// ─── Hook ──────────────────────────────────────────────────────────────────────────────────
export function useProgress() {
  const [store, setStore] = useState<ProgressStore>(defaultStore);
  const [devMode, setDevModeState] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [syncState, setSyncState] = useState<"idle" | "syncing" | "synced" | "error">("idle");
  const supabase = useMemo(() => (hasSupabaseEnv ? createSupabaseClient() : null), []);

  const syncModuleToSupabase = useCallback(
    async (progress: ModuleProgress, explicitUserId?: string | null) => {
      const activeUserId = explicitUserId ?? userId;

      if (!supabase || !activeUserId) return;

      setSyncState("syncing");

      const { error } = await supabase.from("user_module_progress").upsert(
        [toProgressInsert(activeUserId, progress)],
        { onConflict: "user_id,module_slug" },
      );

      if (error) {
        setSyncState("error");
        return;
      }

      setSyncState("synced");
    },
    [supabase, userId],
  );

  const syncStoreToSupabase = useCallback(
    async (progressStore: ProgressStore, explicitUserId?: string | null) => {
      const activeUserId = explicitUserId ?? userId;

      if (!supabase || !activeUserId) return;

      const rows = Object.values(progressStore.modules).map((progress) =>
        toProgressInsert(activeUserId, progress),
      );

      if (rows.length === 0) {
        setSyncState("synced");
        return;
      }

      const { error } = await supabase
        .from("user_module_progress")
        .upsert(rows, { onConflict: "user_id,module_slug" });

      if (error) {
        setSyncState("error");
        return;
      }

      setSyncState("synced");
    },
    [supabase, userId],
  );

  const hydrateFromSupabase = useCallback(
    async (activeUserId: string) => {
      if (!supabase) return;

      setSyncState("syncing");

      const localStore = loadStore();
      const { data, error } = await supabase
        .from("user_module_progress")
        .select("*")
        .eq("user_id", activeUserId);

      if (error) {
        setSyncState("error");
        return;
      }

      const mergedStore = mergeProgressStore(localStore, data ?? []);

      saveStore(mergedStore);
      setStore(mergedStore);

      await syncStoreToSupabase(mergedStore, activeUserId);
    },
    [supabase, syncStoreToSupabase],
  );

  useEffect(() => {
    const localStore = loadStore();
    setStore(localStore);
    setDevModeState(localStorage.getItem(DEV_MODE_KEY) === "true");

    if (!supabase) return;
    const activeSupabase = supabase;

    let cancelled = false;

    async function resolveSession() {
      const { data } = await activeSupabase.auth.getUser();
      if (cancelled) return;

      const activeUserId = data.user?.id ?? null;
      setUserId(activeUserId);

      if (activeUserId) {
        await hydrateFromSupabase(activeUserId);
      }
    }

    void resolveSession();

    const {
      data: { subscription },
    } = activeSupabase.auth.onAuthStateChange((_event, session) => {
      const activeUserId = session?.user?.id ?? null;
      setUserId(activeUserId);

      if (activeUserId) {
        void hydrateFromSupabase(activeUserId);
      } else {
        setSyncState("idle");
      }
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [hydrateFromSupabase, supabase]);

  const getModule = useCallback(
    (slug: string): ModuleProgress => {
      return store.modules[slug] ?? emptyModuleProgress(slug);
    },
    [store],
  );

  const markVisited = useCallback((slug: string) => {
    setStore((prev) => {
      const current = prev.modules[slug] ?? emptyModuleProgress(slug);
      const next: ProgressStore = {
        modules: {
          ...prev.modules,
          [slug]: {
            ...current,
            visited: true,
            slug,
          },
        },
      };
      saveStore(next);
      void syncModuleToSupabase(next.modules[slug]);
      return next;
    });
  }, [syncModuleToSupabase]);

  const recordQuiz = useCallback((slug: string, score: number, total: number) => {
    const pct = total === 0 ? 0 : Math.round((score / total) * 100);
    const passed = pct >= 60;
    setStore((prev) => {
      const current = prev.modules[slug] ?? emptyModuleProgress(slug);
      const next: ProgressStore = {
        modules: {
          ...prev.modules,
          [slug]: {
            slug,
            visited: true,
            quizScore: pct,
            quizPassed: passed,
            completedAt: passed ? new Date().toISOString() : current.completedAt,
          },
        },
      };
      saveStore(next);
      void syncModuleToSupabase(next.modules[slug]);
      return next;
    });
  }, [syncModuleToSupabase]);

  const toggleDevMode = useCallback(() => {
    setDevModeState((prev) => {
      const next = !prev;
      localStorage.setItem(DEV_MODE_KEY, String(next));
      return next;
    });
  }, []);

  const isUnlocked = useCallback(
    (slug: string, orderedSlugs: string[]): boolean => {
      if (devMode) return true; // dev mode unlocks everything
      const idx = orderedSlugs.indexOf(slug);
      if (idx <= 0) return true; // first module always unlocked
      const prev = orderedSlugs[idx - 1];
      return store.modules[prev]?.quizPassed === true;
    },
    [store, devMode],
  );

  const trackProgress = useCallback(
    (orderedSlugs: string[]): { completed: number; total: number } => {
      const completed = orderedSlugs.filter(
        (s) => store.modules[s]?.quizPassed,
      ).length;
      return { completed, total: orderedSlugs.length };
    },
    [store],
  );

  const getTotalCompleted = useCallback((): number => {
    return Object.values(store.modules).filter((m) => m.quizPassed).length;
  }, [store]);

  // Returns slug of first unlocked-but-not-yet-passed module across an ordered list
  const getNextUnlocked = useCallback(
    (orderedSlugs: string[]): string | null => {
      for (const slug of orderedSlugs) {
        if (store.modules[slug]?.quizPassed) continue; // already done
        const idx = orderedSlugs.indexOf(slug);
        const unlocked = devMode || idx === 0 || store.modules[orderedSlugs[idx - 1]]?.quizPassed === true;
        if (unlocked) return slug;
      }
      return null;
    },
    [store, devMode],
  );

  return {
    getModule,
    markVisited,
    recordQuiz,
    isUnlocked,
    trackProgress,
    getTotalCompleted,
    getNextUnlocked,
    devMode,
    toggleDevMode,
    syncState,
    syncedUserId: userId,
  };
}

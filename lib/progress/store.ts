"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "society_lab_progress_v1";
const DEV_MODE_KEY = "society_lab_dev_mode";

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

// ─── Hook ──────────────────────────────────────────────────────────────────────────────────
export function useProgress() {
  const [store, setStore] = useState<ProgressStore>(defaultStore);
  const [devMode, setDevModeState] = useState(false);

  useEffect(() => {
    setStore(loadStore());
    setDevModeState(localStorage.getItem(DEV_MODE_KEY) === "true");
  }, []);

  const getModule = useCallback(
    (slug: string): ModuleProgress => {
      return (
        store.modules[slug] ?? {
          slug,
          visited: false,
          quizScore: null,
          quizPassed: false,
          completedAt: null,
        }
      );
    },
    [store],
  );

  const markVisited = useCallback((slug: string) => {
    setStore((prev) => {
      const next: ProgressStore = {
        modules: {
          ...prev.modules,
          [slug]: {
            ...prev.modules[slug],
            slug,
            visited: true,
            quizScore: prev.modules[slug]?.quizScore ?? null,
            quizPassed: prev.modules[slug]?.quizPassed ?? false,
            completedAt: prev.modules[slug]?.completedAt ?? null,
          },
        },
      };
      saveStore(next);
      return next;
    });
  }, []);

  const recordQuiz = useCallback((slug: string, score: number, total: number) => {
    const pct = total === 0 ? 0 : Math.round((score / total) * 100);
    const passed = pct >= 60;
    setStore((prev) => {
      const next: ProgressStore = {
        modules: {
          ...prev.modules,
          [slug]: {
            slug,
            visited: true,
            quizScore: pct,
            quizPassed: passed,
            completedAt: passed ? new Date().toISOString() : (prev.modules[slug]?.completedAt ?? null),
          },
        },
      };
      saveStore(next);
      return next;
    });
  }, []);

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

  return { getModule, markVisited, recordQuiz, isUnlocked, trackProgress, getTotalCompleted, getNextUnlocked, devMode, toggleDevMode };
}

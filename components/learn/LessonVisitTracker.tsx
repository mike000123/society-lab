"use client";

import { useEffect } from "react";

import { useProgress } from "@/lib/progress/store";

export function LessonVisitTracker({ slug }: { slug: string }) {
  const { markVisited } = useProgress();

  useEffect(() => {
    markVisited(slug);
  }, [markVisited, slug]);

  return null;
}

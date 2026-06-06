"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Check, Clock3, Loader2, MessageSquare, Users, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Database } from "@/lib/database.types";
import { createClient } from "@/lib/supabase/client";
import { hasSupabaseEnv } from "@/lib/supabase/public-env";
import { cn } from "@/lib/utils";

type ParticipantStatus = Database["public"]["Enums"]["thread_participant_status"];
type ThreadRow = Database["public"]["Tables"]["threads"]["Row"];

type CircleSummary = {
  contextSlug: string | null;
  contextType: Database["public"]["Enums"]["thread_context_type"];
  createdAt: string;
  id: string;
  prompt: string | null;
  role: Database["public"]["Enums"]["thread_participant_role"];
  status: ParticipantStatus;
  title: string;
};

export function PrivateCirclesPanel({ selectedThreadId }: { selectedThreadId?: string | null }) {
  const supabase = useMemo(() => (hasSupabaseEnv ? createClient() : null), []);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [circles, setCircles] = useState<CircleSummary[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    const activeSupabase = supabase;

    let cancelled = false;

    async function loadCircles() {
      setLoading(true);
      setError(null);

      const {
        data: { user },
      } = await activeSupabase.auth.getUser();

      if (cancelled) return;

      const activeUserId = user?.id ?? null;
      setCurrentUserId(activeUserId);

      if (!activeUserId) {
        setCircles([]);
        setLoading(false);
        return;
      }

      const { data: membershipRows, error: membershipError } = await activeSupabase
        .from("thread_participants")
        .select("thread_id,status,role,created_at")
        .eq("user_id", activeUserId)
        .in("status", ["pending", "accepted"]);

      if (cancelled) return;

      if (membershipError) {
        setError(membershipError.message);
        setLoading(false);
        return;
      }

      const threadIds = Array.from(new Set((membershipRows ?? []).map((row) => row.thread_id)));

      if (threadIds.length === 0) {
        setCircles([]);
        setLoading(false);
        return;
      }

      const { data: threads, error: threadError } = await activeSupabase
        .from("threads")
        .select("id,title,prompt,created_at,context_type,context_slug")
        .eq("kind", "private_circle")
        .in("id", threadIds);

      if (cancelled) return;

      if (threadError) {
        setError(threadError.message);
        setLoading(false);
        return;
      }

      const threadMap = new Map((threads ?? []).map((thread) => [thread.id, thread]));

      const summaries: CircleSummary[] = (membershipRows ?? [])
        .map((row) => {
          const thread = threadMap.get(row.thread_id) as Pick<
            ThreadRow,
            "context_slug" | "context_type" | "created_at" | "id" | "prompt" | "title"
          > | undefined;
          if (!thread) return null;

          return {
            contextSlug: thread.context_slug,
            contextType: thread.context_type,
            createdAt: thread.created_at,
            id: thread.id,
            prompt: thread.prompt,
            role: row.role,
            status: row.status,
            title: thread.title,
          };
        })
        .filter((item): item is CircleSummary => Boolean(item))
        .sort((a, b) => {
          if (a.status !== b.status) return a.status === "pending" ? -1 : 1;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });

      setCircles(summaries);
      setLoading(false);
    }

    void loadCircles();

    return () => {
      cancelled = true;
    };
  }, [supabase]);

  async function updateInvite(threadId: string, status: Extract<ParticipantStatus, "accepted" | "declined">) {
    if (!supabase || !currentUserId) return;
    const activeSupabase = supabase;

    setUpdatingId(threadId);
    setError(null);

    const { error: updateError } = await activeSupabase
      .from("thread_participants")
      .update({ status })
      .eq("thread_id", threadId)
      .eq("user_id", currentUserId);

    if (updateError) {
      setError(updateError.message);
      setUpdatingId(null);
      return;
    }

    setCircles((prev) =>
      prev
        .map((circle) => (circle.id === threadId ? { ...circle, status } : circle))
        .filter((circle) => circle.status !== "declined"),
    );
    setUpdatingId(null);
  }

  const pendingInvites = circles.filter((circle) => circle.status === "pending");
  const acceptedCircles = circles.filter((circle) => circle.status === "accepted");

  if (!hasSupabaseEnv) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[1.7rem] border border-[rgba(28,36,48,0.08)] bg-white/92 px-5 py-5 shadow-[0_14px_32px_rgba(28,36,48,0.04)]">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-cyan-200 bg-cyan-50 text-cyan-600">
            <Users className="h-4 w-4" />
          </div>
          <div>
            <p className="atlas-kicker">Private circles</p>
            <h2 className="atlas-display text-2xl text-slate-900">Study-circle inbox</h2>
          </div>
        </div>

        {loading ? (
          <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading circles...
          </div>
        ) : !currentUserId ? (
          <p className="mt-4 text-sm leading-7 text-slate-600">
            <Link className="font-semibold text-primary hover:text-blue-700" href="/auth">
              Sign in
            </Link>{" "}
            to review study-circle invites and continue private module conversations.
          </p>
        ) : (
          <>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.16em] text-slate-400">
                <span>Invites</span>
                <span>{pendingInvites.length}</span>
              </div>

              {pendingInvites.length > 0 ? (
                pendingInvites.map((circle) => (
                  <div className="rounded-[1.25rem] border border-[rgba(28,36,48,0.08)] bg-[rgba(246,244,238,0.76)] px-4 py-4" key={circle.id}>
                    <p className="font-semibold text-slate-900">{circle.title}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{circle.prompt ?? "Private module conversation invite."}</p>
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <Button
                        className="h-auto rounded-full px-4 py-2 text-sm"
                        disabled={updatingId === circle.id}
                        onClick={() => updateInvite(circle.id, "accepted")}
                        type="button"
                      >
                        {updatingId === circle.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                        Accept
                      </Button>
                      <button
                        className="inline-flex items-center gap-2 rounded-full border border-[rgba(28,36,48,0.12)] bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-[rgba(28,36,48,0.22)] hover:text-slate-900"
                        disabled={updatingId === circle.id}
                        onClick={() => updateInvite(circle.id, "declined")}
                        type="button"
                      >
                        <X className="h-4 w-4" />
                        Decline
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm leading-6 text-slate-500">No pending invites right now.</p>
              )}
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.16em] text-slate-400">
                <span>Your circles</span>
                <span>{acceptedCircles.length}</span>
              </div>

              {acceptedCircles.length > 0 ? (
                acceptedCircles.map((circle) => (
                  <Link
                    className={cn(
                      "block rounded-[1.25rem] border px-4 py-4 transition",
                      selectedThreadId === circle.id
                        ? "border-primary bg-[rgba(59,130,246,0.08)]"
                        : "border-[rgba(28,36,48,0.08)] bg-white/88 hover:border-[rgba(28,36,48,0.16)]",
                    )}
                    href={`/discussions?thread=${circle.id}`}
                    key={circle.id}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-slate-900">{circle.title}</p>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          {circle.prompt ?? "Private study circle"}
                        </p>
                      </div>
                      <ArrowRight className="mt-0.5 h-4 w-4 flex-none text-slate-400" />
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span className="inline-flex items-center gap-1">
                        <Clock3 className="h-3.5 w-3.5" />
                        {new Date(circle.createdAt).toLocaleDateString()}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MessageSquare className="h-3.5 w-3.5" />
                        {circle.contextType}
                      </span>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-sm leading-6 text-slate-500">
                  No active circles yet. Start one from a module or track page after discovering shared learners.
                </p>
              )}
            </div>
          </>
        )}

        {error ? <p className="mt-4 text-sm text-rose-600">{error}</p> : null}
      </div>
    </div>
  );
}

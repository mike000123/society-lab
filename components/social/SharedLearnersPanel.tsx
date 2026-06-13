"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, Loader2, Lock, MessageSquare, Users } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import type { Database } from "@/lib/database.types";
import { createClient } from "@/lib/supabase/client";
import { hasSupabaseEnv } from "@/lib/supabase/public-env";
import { cn } from "@/lib/utils";

type ContactPermission = Database["public"]["Enums"]["contact_permission"];
type ThreadContextType = Database["public"]["Enums"]["thread_context_type"];

type SharedLearnersPanelProps = {
  onSuccess?: () => void;
  contextSlug: string;
  contextTitle: string;
  contextType: Extract<ThreadContextType, "module" | "track">;
  moduleSlugs?: string[];
};

type LearnerProfile = {
  allowStudyCircleInvites: boolean;
  avatarUrl: string | null;
  contactPermission: ContactPermission;
  discoverableBySharedModules: boolean;
  fullName: string | null;
  id: string;
  showLearningActivity: boolean;
  username: string | null;
};

type SharedLearner = {
  activityAt: string | null;
  id: string;
  inviteable: boolean;
  label: string;
  sharedCount: number;
  sharedModules: string[];
  avatarUrl: string | null;
};

function initialsFor(name: string) {
  const parts = name.split(/\s+/).filter(Boolean).slice(0, 2);
  if (parts.length === 0) return "SL";
  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("");
}

function displayName(profile: LearnerProfile) {
  return profile.fullName ?? profile.username ?? "Society Lab member";
}

export function SharedLearnersPanel({
  contextSlug,
  contextTitle,
  contextType,
  moduleSlugs = [],
  onSuccess,
}: SharedLearnersPanelProps) {
  const router = useRouter();
  const supabase = useMemo(() => (hasSupabaseEnv ? createClient() : null), []);
  const moduleScopeKey = moduleSlugs.join("|");
  const stableModuleSlugs = useMemo(
    () => (moduleScopeKey ? moduleScopeKey.split("|") : []),
    [moduleScopeKey],
  );
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [learners, setLearners] = useState<SharedLearner[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    const activeSupabase = supabase;

    let cancelled = false;

    async function loadLearners() {
      setLoading(true);
      setError(null);

      const {
        data: { user },
      } = await activeSupabase.auth.getUser();

      if (cancelled) return;

      const activeUserId = user?.id ?? null;
      setCurrentUserId(activeUserId);

      if (!activeUserId) {
        setLearners([]);
        setLoading(false);
        return;
      }

        const query =
        contextType === "module"
          ? activeSupabase
              .from("user_module_progress")
              .select("user_id,module_slug,completed_at,updated_at,visited")
              .eq("module_slug", contextSlug)
              .eq("visited", true)
          : activeSupabase
              .from("user_module_progress")
              .select("user_id,module_slug,completed_at,updated_at,visited")
              .in("module_slug", stableModuleSlugs)
              .eq("visited", true);

      const { data: progressRows, error: progressError } = await query;

      if (cancelled) return;

      if (progressError) {
        setError(progressError.message);
        setLoading(false);
        return;
      }

      const rows = (progressRows ?? []).filter((row) => row.user_id !== activeUserId);
      const uniqueUserIds = Array.from(new Set(rows.map((row) => row.user_id)));

      if (uniqueUserIds.length === 0) {
        setLearners([]);
        setLoading(false);
        return;
      }

      const { data: profiles, error: profileError } = await activeSupabase
        .from("profiles")
        .select(
          "id,full_name,username,avatar_url,show_learning_activity,discoverable_by_shared_modules,allow_study_circle_invites,contact_permission",
        )
        .in("id", uniqueUserIds);

      if (cancelled) return;

      if (profileError) {
        setError(profileError.message);
        setLoading(false);
        return;
      }

      const profileMap = new Map(
        (profiles ?? []).map((profile) => [profile.id, {
          allowStudyCircleInvites: profile.allow_study_circle_invites,
          avatarUrl: profile.avatar_url,
          contactPermission: profile.contact_permission,
          discoverableBySharedModules: profile.discoverable_by_shared_modules,
          fullName: profile.full_name,
          id: profile.id,
          showLearningActivity: profile.show_learning_activity,
          username: profile.username,
        } satisfies LearnerProfile]),
      );

      const aggregated = new Map<string, SharedLearner>();

      for (const row of rows) {
        const profile = profileMap.get(row.user_id);
        if (!profile) continue;

        const existing = aggregated.get(row.user_id);
        const inviteable =
          profile.showLearningActivity &&
          profile.discoverableBySharedModules &&
          profile.allowStudyCircleInvites &&
          (profile.contactPermission === "any_member" || profile.contactPermission === "shared_modules");

        if (!existing) {
          aggregated.set(row.user_id, {
            avatarUrl: profile.avatarUrl,
            activityAt: row.completed_at ?? row.updated_at,
            id: row.user_id,
            inviteable,
            label: displayName(profile),
            sharedCount: 1,
            sharedModules: [row.module_slug],
          });
        } else {
          existing.sharedCount += 1;
          existing.sharedModules.push(row.module_slug);
          const nextActivityAt = row.completed_at ?? row.updated_at;
          if (
            !existing.activityAt ||
            (nextActivityAt && new Date(nextActivityAt).getTime() > new Date(existing.activityAt).getTime())
          ) {
            existing.activityAt = nextActivityAt;
          }
        }
      }

      setLearners(
        Array.from(aggregated.values())
          .sort((a, b) => b.sharedCount - a.sharedCount || a.label.localeCompare(b.label))
          .slice(0, 8),
      );
      setLoading(false);
    }

    void loadLearners();

    return () => {
      cancelled = true;
    };
  }, [contextSlug, contextType, moduleScopeKey, stableModuleSlugs, supabase]);

  function toggleSelected(userId: string) {
    setSelectedIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId],
    );
  }

  async function handleCreateCircle() {
    if (!supabase || !currentUserId || selectedIds.length === 0) return;
    const activeSupabase = supabase;

    setCreating(true);
    setError(null);

    const titlePrefix = contextType === "module" ? "Study circle" : "Track circle";
    const prompt =
      message.trim() || `Private ${contextType}-based study circle for ${contextTitle}.`;

    const { data: thread, error: threadError } = await activeSupabase
      .from("threads")
      .insert({
        author_id: currentUserId,
        context_slug: contextSlug,
        context_type: contextType,
        kind: "private_circle",
        prompt,
        status: "open",
        title: `${titlePrefix}: ${contextTitle}`,
        visibility: "private",
      })
      .select("id")
      .single();

    if (threadError || !thread) {
      setError(threadError?.message ?? "Unable to create the study circle.");
      setCreating(false);
      return;
    }

    const invites = selectedIds.map((userId) => ({
      invited_by: currentUserId,
      role: "member" as const,
      status: "pending" as const,
      thread_id: thread.id,
      user_id: userId,
    }));

    const { error: inviteError } = await activeSupabase.from("thread_participants").insert(invites);

    if (inviteError) {
      setError(inviteError.message);
      setCreating(false);
      return;
    }

    if (onSuccess) onSuccess();
    router.push(`/discussions?thread=${thread.id}`);
    router.refresh();
  }

  if (!hasSupabaseEnv) {
    return null;
  }

  const inviteableLearners = learners.filter((learner) => learner.inviteable);

  return (
    <section className="space-y-5 rounded-[1.8rem] border border-[rgba(28,36,48,0.08)] bg-white/88 px-5 py-5 shadow-[0_14px_32px_rgba(28,36,48,0.04)]">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 flex-none items-center justify-center rounded-full border border-[rgba(28,36,48,0.08)] bg-[rgba(246,244,238,0.82)] text-slate-700">
          <Users className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Shared learners</p>
          <h3 className="text-[1.15rem] font-semibold leading-6 text-slate-900">People who studied this</h3>
          <p className="text-sm leading-6 text-slate-600">
            Find members who opted into discovery through shared modules, then invite one or more of them into a private study circle.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading shared learners...
        </div>
      ) : !currentUserId ? (
        <div className="rounded-[1.35rem] border border-[rgba(28,36,48,0.08)] bg-[rgba(246,244,238,0.76)] px-4 py-4">
          <p className="text-sm leading-7 text-slate-600">
            <Link className="font-semibold text-primary hover:text-blue-700" href="/auth">
              Sign in
            </Link>{" "}
            to sync your progress, discover peers, and start a private study circle around this lesson.
          </p>
        </div>
      ) : learners.length === 0 ? (
        <div className="rounded-[1.35rem] border border-[rgba(28,36,48,0.08)] bg-[rgba(246,244,238,0.76)] px-4 py-4 text-sm leading-7 text-slate-600">
          No one has opted into discovery here yet. Once more members sync their learning activity, this section will start to populate.
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {learners.map((learner) => {
              const selected = selectedIds.includes(learner.id);
              return (
                <button
                  className={cn(
                    "flex w-full items-start gap-3 rounded-[1.3rem] border px-4 py-4 text-left transition",
                    learner.inviteable
                      ? selected
                        ? "border-primary bg-[rgba(59,130,246,0.08)]"
                        : "border-[rgba(28,36,48,0.08)] bg-white/86 hover:border-[rgba(28,36,48,0.16)]"
                      : "border-[rgba(28,36,48,0.08)] bg-[rgba(246,244,238,0.72)]",
                  )}
                  disabled={!learner.inviteable}
                  key={learner.id}
                  onClick={() => toggleSelected(learner.id)}
                  type="button"
                >
                  <div className="flex h-10 w-10 flex-none items-center justify-center overflow-hidden rounded-full border border-[rgba(28,36,48,0.1)] bg-white text-sm font-semibold text-slate-700">
                    {learner.avatarUrl ? (
                      <Image alt={learner.label} className="h-full w-full object-cover" height={40} src={learner.avatarUrl} unoptimized width={40} />
                    ) : (
                      initialsFor(learner.label)
                    )}
                  </div>

                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-slate-900">{learner.label}</p>
                      <span className="rounded-full border border-[rgba(28,36,48,0.08)] bg-white/88 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                        {learner.sharedCount} shared {learner.sharedCount === 1 ? "module" : "modules"}
                      </span>
                    </div>
                    <p className="text-sm leading-6 text-slate-600">
                      {contextType === "module"
                        ? "Studied this module and opted into shared learning."
                        : `Overlaps with ${learner.sharedCount} modules in this track.`}
                    </p>
                  </div>

                  <div className="mt-0.5 flex flex-none items-center gap-2">
                    {learner.inviteable ? (
                      <span
                        className={cn(
                          "inline-flex h-6 w-6 items-center justify-center rounded-full border text-xs",
                          selected
                            ? "border-primary bg-primary text-white"
                            : "border-[rgba(28,36,48,0.12)] bg-white text-slate-400",
                        )}
                      >
                        {selected ? <CheckCircle2 className="h-3.5 w-3.5" /> : "+"}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white/80 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                        <Lock className="h-3 w-3" />
                        Visible only
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="space-y-4 rounded-[1.35rem] border border-[rgba(28,36,48,0.08)] bg-[rgba(246,244,238,0.76)] px-4 py-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-slate-900">Start a private study circle</p>
                <p className="text-sm leading-6 text-slate-600">
                  Invite one or more learners into a small conversation tied to {contextTitle}.
                </p>
              </div>
              <span className="rounded-full border border-[rgba(28,36,48,0.08)] bg-white/88 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                {selectedIds.length} selected
              </span>
            </div>

            <textarea
              className="min-h-[6.5rem] w-full rounded-[1.2rem] border border-[rgba(28,36,48,0.12)] bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-primary"
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Optional opening message for the circle..."
              value={message}
            />

            <div className="flex flex-wrap items-center gap-3">
              <Button
                className="rounded-full px-5"
                disabled={creating || selectedIds.length === 0}
                onClick={handleCreateCircle}
                type="button"
              >
                {creating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating circle
                  </>
                ) : (
                  <>
                    Start study circle
                    <MessageSquare className="h-4 w-4" />
                  </>
                )}
              </Button>
              {inviteableLearners.length === 0 ? (
                <p className="text-sm text-slate-500">Visible learners are not accepting study-circle invites yet.</p>
              ) : null}
            </div>

            {error ? <p className="text-sm text-rose-600">{error}</p> : null}
          </div>
        </>
      )}
    </section>
  );
}

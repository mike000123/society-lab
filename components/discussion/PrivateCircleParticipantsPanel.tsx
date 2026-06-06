"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Loader2,
  Lock,
  Plus,
  UserPlus,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Database } from "@/lib/database.types";
import { LEARNING_TRACKS } from "@/lib/tracks/config";
import { createClient } from "@/lib/supabase/client";
import { hasSupabaseEnv } from "@/lib/supabase/public-env";
import { cn } from "@/lib/utils";

type ContactPermission = Database["public"]["Enums"]["contact_permission"];
type ParticipantRole = Database["public"]["Enums"]["thread_participant_role"];
type ParticipantStatus = Database["public"]["Enums"]["thread_participant_status"];
type ThreadContextType = Database["public"]["Enums"]["thread_context_type"];

type ThreadSummary = {
  authorId: string;
  contextSlug: string | null;
  contextType: ThreadContextType;
  id: string;
  kind: Database["public"]["Enums"]["thread_kind"];
  title: string;
};

type ParticipantProfile = {
  avatarUrl: string | null;
  fullName: string | null;
  id: string;
  username: string | null;
};

type ParticipantEntry = {
  avatarUrl: string | null;
  id: string;
  invitedAt: string;
  label: string;
  role: ParticipantRole;
  status: ParticipantStatus;
};

type CandidateEntry = {
  avatarUrl: string | null;
  id: string;
  inviteable: boolean;
  label: string;
  sharedCount: number;
};

function initialsFor(name: string) {
  const parts = name.split(/\s+/).filter(Boolean).slice(0, 2);
  if (parts.length === 0) return "SL";
  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("");
}

function displayName(profile: ParticipantProfile) {
  return profile.fullName ?? profile.username ?? "Society Lab member";
}

function trackModuleSlugs(trackId: string) {
  return LEARNING_TRACKS.find((track) => track.id === trackId)?.moduleSlugs ?? [];
}

export function PrivateCircleParticipantsPanel({ threadId }: { threadId?: string | null }) {
  const supabase = useMemo(() => (hasSupabaseEnv ? createClient() : null), []);
  const [loading, setLoading] = useState(true);
  const [inviting, setInviting] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [circle, setCircle] = useState<ThreadSummary | null>(null);
  const [currentRole, setCurrentRole] = useState<ParticipantRole | null>(null);
  const [currentStatus, setCurrentStatus] = useState<ParticipantStatus | null>(null);
  const [ownerAllowsExpansion, setOwnerAllowsExpansion] = useState(false);
  const [participants, setParticipants] = useState<ParticipantEntry[]>([]);
  const [candidates, setCandidates] = useState<CandidateEntry[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase || !threadId) {
      setLoading(false);
      return;
    }

    const activeSupabase = supabase;
    const activeThreadId = threadId;
    let cancelled = false;

    async function loadPanel() {
      setLoading(true);
      setError(null);

      const {
        data: { user },
      } = await activeSupabase.auth.getUser();

      if (cancelled) return;

      const activeUserId = user?.id ?? null;
      setCurrentUserId(activeUserId);

      if (!activeUserId) {
        setLoading(false);
        return;
      }

      const { data: thread, error: threadError } = await activeSupabase
        .from("threads")
        .select("id,title,author_id,context_type,context_slug,kind")
        .eq("id", activeThreadId)
        .maybeSingle();

      if (cancelled) return;

      if (threadError) {
        setError(threadError.message);
        setLoading(false);
        return;
      }

      if (!thread || thread.kind !== "private_circle") {
        setCircle(null);
        setLoading(false);
        return;
      }

      const threadSummary: ThreadSummary = {
        authorId: thread.author_id,
        contextSlug: thread.context_slug,
        contextType: thread.context_type,
        id: thread.id,
        kind: thread.kind,
        title: thread.title,
      };
      setCircle(threadSummary);

      const [{ data: ownerProfile }, { data: membershipRows, error: membershipError }] = await Promise.all([
        activeSupabase
          .from("profiles")
          .select("allow_participant_invites")
          .eq("id", thread.author_id)
          .maybeSingle(),
        activeSupabase
          .from("thread_participants")
          .select("user_id,status,role,created_at")
          .eq("thread_id", activeThreadId),
      ]);

      if (cancelled) return;

      setOwnerAllowsExpansion(ownerProfile?.allow_participant_invites ?? false);

      if (membershipError) {
        setError(membershipError.message);
        setLoading(false);
        return;
      }

      const participantRows = membershipRows ?? [];
      const currentMembership = participantRows.find((row) => row.user_id === activeUserId) ?? null;
      setCurrentRole(currentMembership?.role ?? null);
      setCurrentStatus(currentMembership?.status ?? null);

      const participantIds = Array.from(new Set(participantRows.map((row) => row.user_id)));
      const { data: profileRows, error: profileError } = await activeSupabase
        .from("profiles")
        .select("id,full_name,username,avatar_url")
        .in("id", participantIds);

      if (cancelled) return;

      if (profileError) {
        setError(profileError.message);
        setLoading(false);
        return;
      }

      const profileMap = new Map(
        (profileRows ?? []).map((profile) => [
          profile.id,
          {
            avatarUrl: profile.avatar_url,
            fullName: profile.full_name,
            id: profile.id,
            username: profile.username,
          } satisfies ParticipantProfile,
        ]),
      );

      setParticipants(
        participantRows
          .map((row) => {
            const profile = profileMap.get(row.user_id);
            if (!profile) return null;

            return {
              avatarUrl: profile.avatarUrl,
              id: row.user_id,
              invitedAt: row.created_at,
              label: displayName(profile),
              role: row.role,
              status: row.status,
            } satisfies ParticipantEntry;
          })
          .filter((item): item is ParticipantEntry => Boolean(item))
          .sort((a, b) => {
            if (a.role !== b.role) return a.role === "owner" ? -1 : 1;
            if (a.status !== b.status) return a.status === "accepted" ? -1 : 1;
            return a.label.localeCompare(b.label);
          }),
      );

      const canInvite =
        currentMembership?.status === "accepted" &&
        (currentMembership.role === "owner" || ownerProfile?.allow_participant_invites === true);

      if (!canInvite || !thread.context_slug) {
        setCandidates([]);
        setLoading(false);
        return;
      }

      const candidateModuleSlugs =
        thread.context_type === "module" ? [thread.context_slug] : trackModuleSlugs(thread.context_slug);

      if (candidateModuleSlugs.length === 0) {
        setCandidates([]);
        setLoading(false);
        return;
      }

      const { data: progressRows, error: progressError } = await activeSupabase
        .from("user_module_progress")
        .select("user_id,module_slug")
        .in("module_slug", candidateModuleSlugs)
        .eq("visited", true);

      if (cancelled) return;

      if (progressError) {
        setError(progressError.message);
        setLoading(false);
        return;
      }

      const excludedIds = new Set(participantIds);
      excludedIds.add(activeUserId);

      const eligibleUserIds = Array.from(
        new Set(
          (progressRows ?? [])
            .map((row) => row.user_id)
            .filter((userId) => !excludedIds.has(userId)),
        ),
      );

      if (eligibleUserIds.length === 0) {
        setCandidates([]);
        setLoading(false);
        return;
      }

      const { data: candidateProfiles, error: candidateProfileError } = await activeSupabase
        .from("profiles")
        .select(
          "id,full_name,username,avatar_url,show_learning_activity,discoverable_by_shared_modules,allow_study_circle_invites,contact_permission",
        )
        .in("id", eligibleUserIds);

      if (cancelled) return;

      if (candidateProfileError) {
        setError(candidateProfileError.message);
        setLoading(false);
        return;
      }

      const sharedCounts = new Map<string, number>();
      for (const row of progressRows ?? []) {
        if (!eligibleUserIds.includes(row.user_id)) continue;
        sharedCounts.set(row.user_id, (sharedCounts.get(row.user_id) ?? 0) + 1);
      }

      setCandidates(
        (candidateProfiles ?? [])
          .map((profile) => {
            const contactPermission = profile.contact_permission as ContactPermission;
            const inviteable =
              profile.show_learning_activity &&
              profile.discoverable_by_shared_modules &&
              profile.allow_study_circle_invites &&
              (contactPermission === "any_member" || contactPermission === "shared_modules");

            return {
              avatarUrl: profile.avatar_url,
              id: profile.id,
              inviteable,
              label: profile.full_name ?? profile.username ?? "Society Lab member",
              sharedCount: sharedCounts.get(profile.id) ?? 0,
            } satisfies CandidateEntry;
          })
          .sort((a, b) => b.sharedCount - a.sharedCount || a.label.localeCompare(b.label))
          .slice(0, 8),
      );

      setLoading(false);
    }

    void loadPanel();

    return () => {
      cancelled = true;
    };
  }, [supabase, threadId]);

  function toggleSelected(userId: string) {
    setSelectedIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId],
    );
  }

  async function inviteMoreParticipants() {
    if (!supabase || !threadId || selectedIds.length === 0 || !currentUserId) return;
    const activeSupabase = supabase;

    setInviting(true);
    setError(null);

    const promptPrefix = message.trim();
    const inviteRows = selectedIds.map((userId) => ({
      invited_by: currentUserId,
      role: "member" as const,
      status: "pending" as const,
      thread_id: threadId,
      user_id: userId,
    }));

    const { error: inviteError } = await activeSupabase
      .from("thread_participants")
      .upsert(inviteRows, { onConflict: "thread_id,user_id" });

    if (inviteError) {
      setError(inviteError.message);
      setInviting(false);
      return;
    }

    if (promptPrefix && circle) {
      await activeSupabase.from("posts").insert({
        author_id: currentUserId,
        content: `Invited more participants to "${circle.title}": ${promptPrefix}`,
        kind: "synthesis",
        thread_id: threadId,
      });
    }

    setParticipants((prev) => {
      const invited = candidates
        .filter((candidate) => selectedIds.includes(candidate.id))
        .map((candidate) => ({
          avatarUrl: candidate.avatarUrl,
          id: candidate.id,
          invitedAt: new Date().toISOString(),
          label: candidate.label,
          role: "member" as const,
          status: "pending" as const,
        }));

      return [...prev, ...invited].sort((a, b) => {
        if (a.role !== b.role) return a.role === "owner" ? -1 : 1;
        if (a.status !== b.status) return a.status === "accepted" ? -1 : 1;
        return a.label.localeCompare(b.label);
      });
    });
    setCandidates((prev) => prev.filter((candidate) => !selectedIds.includes(candidate.id)));
    setSelectedIds([]);
    setMessage("");
    setInviting(false);
  }

  if (!hasSupabaseEnv || !threadId) {
    return null;
  }

  if (!circle && !loading) {
    return null;
  }

  const canInviteMore =
    currentStatus === "accepted" && (currentRole === "owner" || ownerAllowsExpansion);
  const acceptedParticipants = participants.filter((participant) => participant.status === "accepted");
  const pendingParticipants = participants.filter((participant) => participant.status === "pending");

  return (
    <div className="space-y-6">
      <div className="rounded-[1.7rem] border border-[rgba(28,36,48,0.08)] bg-white/92 px-5 py-5 shadow-[0_14px_32px_rgba(28,36,48,0.04)]">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 text-emerald-600">
            <Users className="h-4 w-4" />
          </div>
          <div>
            <p className="atlas-kicker">Participants</p>
            <h2 className="atlas-display text-2xl text-slate-900">Who is in this circle</h2>
          </div>
        </div>

        {loading ? (
          <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading participants...
          </div>
        ) : (
          <>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.16em] text-slate-400">
                <span>Accepted</span>
                <span>{acceptedParticipants.length}</span>
              </div>

              {acceptedParticipants.map((participant) => (
                <div
                  className="flex items-center gap-3 rounded-[1.2rem] border border-[rgba(28,36,48,0.08)] bg-white/86 px-4 py-3"
                  key={participant.id}
                >
                  <div className="flex h-10 w-10 flex-none items-center justify-center overflow-hidden rounded-full border border-[rgba(28,36,48,0.1)] bg-white text-sm font-semibold text-slate-700">
                    {participant.avatarUrl ? (
                      <Image alt={participant.label} className="h-full w-full object-cover" height={40} src={participant.avatarUrl} unoptimized width={40} />
                    ) : (
                      initialsFor(participant.label)
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-900">{participant.label}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span className="inline-flex items-center gap-1">
                        <Clock3 className="h-3.5 w-3.5" />
                        Joined {new Date(participant.invitedAt).toLocaleDateString()}
                      </span>
                      <span className="rounded-full border border-[rgba(28,36,48,0.08)] bg-[rgba(246,244,238,0.76)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                        {participant.role}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 space-y-3">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.16em] text-slate-400">
                <span>Pending invites</span>
                <span>{pendingParticipants.length}</span>
              </div>

              {pendingParticipants.length > 0 ? (
                pendingParticipants.map((participant) => (
                  <div
                    className="flex items-center gap-3 rounded-[1.2rem] border border-[rgba(28,36,48,0.08)] bg-[rgba(246,244,238,0.76)] px-4 py-3"
                    key={participant.id}
                  >
                    <div className="flex h-10 w-10 flex-none items-center justify-center overflow-hidden rounded-full border border-[rgba(28,36,48,0.1)] bg-white text-sm font-semibold text-slate-700">
                      {participant.avatarUrl ? (
                        <Image alt={participant.label} className="h-full w-full object-cover" height={40} src={participant.avatarUrl} unoptimized width={40} />
                      ) : (
                        initialsFor(participant.label)
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-slate-900">{participant.label}</p>
                      <p className="mt-1 text-xs text-slate-500">Invite pending</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm leading-6 text-slate-500">No pending invites in this circle.</p>
              )}
            </div>

            {!canInviteMore ? (
              <div className="mt-5 rounded-[1.3rem] border border-[rgba(28,36,48,0.08)] bg-[rgba(246,244,238,0.76)] px-4 py-4">
                <p className="text-sm leading-7 text-slate-600">
                  {currentRole === "owner"
                    ? "You can invite more people after this circle is fully loaded."
                    : "Only the circle owner can expand this conversation right now, unless they enable participant invitations in their privacy settings."}
                </p>
              </div>
            ) : null}
          </>
        )}

        {error ? <p className="mt-4 text-sm text-rose-600">{error}</p> : null}
      </div>

      {canInviteMore ? (
        <div className="rounded-[1.7rem] border border-[rgba(28,36,48,0.08)] bg-white/92 px-5 py-5 shadow-[0_14px_32px_rgba(28,36,48,0.04)]">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-cyan-200 bg-cyan-50 text-cyan-600">
              <UserPlus className="h-4 w-4" />
            </div>
            <div>
              <p className="atlas-kicker">Expand the circle</p>
              <h2 className="atlas-display text-2xl text-slate-900">Invite more shared learners</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Choose more members who studied the same {circle?.contextType === "track" ? "track" : "module"} and bring them into this conversation.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading candidates...
            </div>
          ) : candidates.length === 0 ? (
            <div className="mt-4 rounded-[1.3rem] border border-[rgba(28,36,48,0.08)] bg-[rgba(246,244,238,0.76)] px-4 py-4 text-sm leading-7 text-slate-600">
              No additional shared learners are available to invite yet.
            </div>
          ) : (
            <>
              <div className="mt-4 space-y-3">
                {candidates.map((candidate) => {
                  const selected = selectedIds.includes(candidate.id);
                  return (
                    <button
                      className={cn(
                        "flex w-full items-start gap-3 rounded-[1.25rem] border px-4 py-4 text-left transition",
                        candidate.inviteable
                          ? selected
                            ? "border-primary bg-[rgba(59,130,246,0.08)]"
                            : "border-[rgba(28,36,48,0.08)] bg-white/86 hover:border-[rgba(28,36,48,0.16)]"
                          : "border-[rgba(28,36,48,0.08)] bg-[rgba(246,244,238,0.76)]",
                      )}
                      disabled={!candidate.inviteable}
                      key={candidate.id}
                      onClick={() => toggleSelected(candidate.id)}
                      type="button"
                    >
                      <div className="flex h-10 w-10 flex-none items-center justify-center overflow-hidden rounded-full border border-[rgba(28,36,48,0.1)] bg-white text-sm font-semibold text-slate-700">
                        {candidate.avatarUrl ? (
                          <Image alt={candidate.label} className="h-full w-full object-cover" height={40} src={candidate.avatarUrl} unoptimized width={40} />
                        ) : (
                          initialsFor(candidate.label)
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold text-slate-900">{candidate.label}</p>
                          <span className="rounded-full border border-[rgba(28,36,48,0.08)] bg-white/88 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                            {candidate.sharedCount} shared {candidate.sharedCount === 1 ? "module" : "modules"}
                          </span>
                        </div>
                        <p className="mt-1 text-sm leading-6 text-slate-600">
                          {candidate.inviteable
                            ? "Open to study-circle invites."
                            : "Visible through shared learning, but not accepting invites."}
                        </p>
                      </div>
                      <div className="mt-0.5 flex flex-none items-center">
                        {candidate.inviteable ? (
                          <span
                            className={cn(
                              "inline-flex h-6 w-6 items-center justify-center rounded-full border text-xs",
                              selected
                                ? "border-primary bg-primary text-white"
                                : "border-[rgba(28,36,48,0.12)] bg-white text-slate-400",
                            )}
                          >
                            {selected ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white/80 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                            <Lock className="h-3 w-3" />
                            Locked
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              <textarea
                className="mt-4 min-h-[6rem] w-full rounded-[1.2rem] border border-[rgba(28,36,48,0.12)] bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-primary"
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Optional note to explain why you are expanding the circle..."
                value={message}
              />

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <Button
                  className="rounded-full px-5"
                  disabled={inviting || selectedIds.length === 0}
                  onClick={inviteMoreParticipants}
                  type="button"
                >
                  {inviting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending invites
                    </>
                  ) : (
                    <>
                      Invite selected
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
                <span className="text-sm text-slate-500">{selectedIds.length} selected</span>
              </div>
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}

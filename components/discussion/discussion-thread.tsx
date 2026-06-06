"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AlertCircle, ArrowRight, Info, Landmark, Send, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  backgroundFilterGroups,
  summarizeBackgroundFilters,
} from "@/lib/community/profile-options";
import { normalizeLinkedInUrl } from "@/lib/community/linkedin";
import { CATEGORY_META, getAllProposals } from "@/lib/governance/proposals";
import { useSubmissions } from "@/lib/governance/votes";
import type { Database, Json } from "@/lib/database.types";
import { hasSupabaseEnv } from "@/lib/supabase/public-env";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

type PostKind = Database["public"]["Enums"]["post_kind"];
type PostRow = Database["public"]["Tables"]["posts"]["Row"];
type ThreadParticipationMode = Database["public"]["Enums"]["thread_participation_mode"];
type ProposalReference = {
  category?: string | null;
  id: string;
  moduleSlug?: string | null;
  moduleTitle?: string | null;
  title: string;
};

interface LivePost {
  author_avatar_url?: string | null;
  author_label: string;
  author_linkedin_url?: string | null;
  content: string;
  created_at: string;
  id: string;
  kind: PostKind;
  proposalReference?: ProposalReference | null;
}

type ViewerBackgroundProfile = {
  academicLevel: string | null;
  expertiseDomains: string[];
  professionalStage: string | null;
};

type ThreadMeta = {
  authorId: string;
  desiredAcademicLevels: string[];
  desiredExpertiseDomains: string[];
  desiredProfessionalStages: string[];
  kind: Database["public"]["Enums"]["thread_kind"];
  participationMode: ThreadParticipationMode;
  title: string;
  visibility: Database["public"]["Enums"]["thread_visibility"];
};

type ParticipantStatus = Database["public"]["Enums"]["thread_participant_status"];

const KIND_LABELS: Record<PostKind, string> = {
  claim: "Claim",
  counterpoint: "Counterpoint",
  evidence: "Evidence",
  question: "Question",
  synthesis: "Synthesis",
};

const KIND_TONES: Record<PostKind, string> = {
  claim: "border-amber-200 bg-amber-50 text-amber-700",
  counterpoint: "border-rose-200 bg-rose-50 text-rose-700",
  evidence: "border-cyan-200 bg-cyan-50 text-cyan-700",
  question: "border-emerald-200 bg-emerald-50 text-emerald-700",
  synthesis: "border-violet-200 bg-violet-50 text-violet-700",
};

const SEED_POSTS: LivePost[] = [
  {
    id: "seed-1",
    kind: "claim",
    content: "Current housing policy incentivizes asset inflation over social stability.",
    created_at: new Date().toISOString(),
    author_label: "Systems Analyst",
  },
  {
    id: "seed-2",
    kind: "counterpoint",
    content: "Supply constraints dominate; financing incentives are secondary but still meaningful.",
    created_at: new Date().toISOString(),
    author_label: "Economist",
  },
  {
    id: "seed-3",
    kind: "question",
    content: "At what point does asset-price growth stop reflecting real productivity gains?",
    created_at: new Date().toISOString(),
    author_label: "Policy Analyst",
  },
  {
    id: "seed-4",
    kind: "synthesis",
    content: "Both supply and financing matter, but the thread suggests the current system rewards asset appreciation faster than housing access.",
    created_at: new Date().toISOString(),
    author_label: "Civic Designer",
  },
];

function timeAgo(iso: string) {
  const delta = Date.now() - new Date(iso).getTime();
  const hours = Math.max(1, Math.floor(delta / (1000 * 60 * 60)));
  if (hours < 24) {
    return `${hours}h ago`;
  }
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function proposalReferenceFromMetadata(metadata: Json): ProposalReference | null {
  if (!metadata || Array.isArray(metadata) || typeof metadata !== "object") {
    return null;
  }

  const proposalReference = metadata.proposalReference;
  if (!proposalReference || Array.isArray(proposalReference) || typeof proposalReference !== "object") {
    return null;
  }

  const id = typeof proposalReference.id === "string" ? proposalReference.id : null;
  const title = typeof proposalReference.title === "string" ? proposalReference.title : null;
  if (!id || !title) {
    return null;
  }

  return {
    category: typeof proposalReference.category === "string" ? proposalReference.category : null,
    id,
    moduleSlug: typeof proposalReference.moduleSlug === "string" ? proposalReference.moduleSlug : null,
    moduleTitle: typeof proposalReference.moduleTitle === "string" ? proposalReference.moduleTitle : null,
    title,
  };
}

function proposalTone(category?: string | null) {
  switch (category) {
    case "economic":
    case "banking":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "political":
    case "democracy":
      return "border-amber-200 bg-amber-50 text-amber-700";
    case "social":
      return "border-rose-200 bg-rose-50 text-rose-700";
    case "information":
    case "technology":
      return "border-cyan-200 bg-cyan-50 text-cyan-700";
    default:
      return "border-slate-200 bg-slate-50 text-slate-600";
  }
}

function proposalCategoryLabel(category?: string | null) {
  if (!category) return null;
  return CATEGORY_META[category as keyof typeof CATEGORY_META]?.label ?? category;
}

function viewerMatchesThreadBackground(
  thread: ThreadMeta | null,
  profile: ViewerBackgroundProfile | null,
) {
  if (!thread) return false;
  if (thread.participationMode === "open") return true;
  if (!profile) return false;

  const academicMatch =
    thread.desiredAcademicLevels.length === 0 ||
    (profile.academicLevel ? thread.desiredAcademicLevels.includes(profile.academicLevel) : false);
  const professionalMatch =
    thread.desiredProfessionalStages.length === 0 ||
    (profile.professionalStage ? thread.desiredProfessionalStages.includes(profile.professionalStage) : false);
  const expertiseMatch =
    thread.desiredExpertiseDomains.length === 0 ||
    profile.expertiseDomains.some((value) => thread.desiredExpertiseDomains.includes(value));

  return academicMatch && professionalMatch && expertiseMatch;
}

function participationTone(participationMode: ThreadParticipationMode) {
  return participationMode === "background_guided"
    ? "border-amber-200 bg-amber-50/85 text-amber-800"
    : "border-emerald-200 bg-emerald-50/85 text-emerald-800";
}

function ThreadShell({
  children,
  footer,
}: {
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="rounded-[1.7rem] border border-[rgba(28,36,48,0.08)] bg-white/92 shadow-[0_14px_32px_rgba(28,36,48,0.04)]">
      <div className="divide-y divide-[rgba(28,36,48,0.08)] px-5">{children}</div>
      {footer ? <div className="border-t border-[rgba(28,36,48,0.08)] px-5 py-5">{footer}</div> : null}
    </div>
  );
}

function authorInitials(label: string) {
  const words = label
    .split(/\s+/)
    .map((part) => part.trim())
    .filter(Boolean)
    .slice(0, 2);

  if (words.length === 0) return "SL";
  return words.map((word) => word[0]?.toUpperCase() ?? "").join("");
}

function PostRow({ post }: { post: LivePost }) {
  const avatar = (
    <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-[rgba(28,36,48,0.12)] bg-[linear-gradient(145deg,#eef4ff,#f8fafc)] shadow-[0_8px_18px_rgba(28,36,48,0.06)]">
      {post.author_avatar_url ? (
        <Image
          alt={post.author_label}
          className="h-full w-full object-cover"
          height={44}
          src={post.author_avatar_url}
          unoptimized
          width={44}
        />
      ) : (
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-700">
          {authorInitials(post.author_label)}
        </span>
      )}
    </div>
  );

  return (
    <article className="grid gap-3 py-4 md:grid-cols-[8rem_minmax(0,1fr)]">
      <div className="space-y-2">
        <span className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${KIND_TONES[post.kind]}`}>
          {KIND_LABELS[post.kind]}
        </span>
        <div className="flex items-center gap-3 text-xs text-slate-500">
          {post.author_linkedin_url ? (
            <Link href={post.author_linkedin_url} rel="noreferrer" target="_blank" title={`Open ${post.author_label} on LinkedIn`}>
              {avatar}
            </Link>
          ) : (
            avatar
          )}
          <div>
            <div className="font-medium text-slate-700">{post.author_label}</div>
            <div>{timeAgo(post.created_at)}</div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {post.proposalReference ? (
          <div className="rounded-[1rem] border border-[rgba(28,36,48,0.08)] bg-[rgba(246,244,238,0.62)] px-4 py-3">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Referenced proposal</p>
              {proposalCategoryLabel(post.proposalReference.category) ? (
                <span
                  className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${proposalTone(
                    post.proposalReference.category,
                  )}`}
                >
                  {proposalCategoryLabel(post.proposalReference.category)}
                </span>
              ) : null}
            </div>
            <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900">{post.proposalReference.title}</p>
                {post.proposalReference.moduleTitle ? (
                  <p className="mt-1 text-xs text-slate-500">Addresses: {post.proposalReference.moduleTitle}</p>
                ) : null}
              </div>
              <div className="flex flex-wrap gap-2">
                <Link
                  className="inline-flex items-center gap-1 rounded-full border border-[rgba(28,36,48,0.12)] bg-white px-3 py-2 text-xs font-semibold text-primary transition hover:border-[rgba(28,36,48,0.22)] hover:text-slate-900"
                  href={`/governance/${post.proposalReference.id}`}
                >
                  Open proposal
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                {post.proposalReference.moduleSlug ? (
                  <Link
                    className="inline-flex items-center gap-1 rounded-full border border-[rgba(28,36,48,0.08)] bg-white/80 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-[rgba(28,36,48,0.18)] hover:text-slate-900"
                    href={`/learn/${post.proposalReference.moduleSlug}`}
                  >
                    Open module
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}

        <p className="text-sm leading-7 text-slate-700">{post.content}</p>
      </div>
    </article>
  );
}

function Composer({
  content,
  disabled,
  error,
  kind,
  proposalOptions,
  selectedProposalId,
  onKindChange,
  onProposalChange,
  onSubmit,
  onContentChange,
  submitting,
}: {
  content: string;
  disabled: boolean;
  error?: string | null;
  kind: PostKind;
  onContentChange: (value: string) => void;
  onKindChange: (value: PostKind) => void;
  onProposalChange: (value: string) => void;
  onSubmit: (event: React.FormEvent) => void;
  proposalOptions: ProposalReference[];
  selectedProposalId: string;
  submitting: boolean;
}) {
  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div className="flex flex-wrap gap-2">
        {(Object.keys(KIND_LABELS) as PostKind[]).map((value) => (
          <button
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] transition ${
              kind === value
                ? KIND_TONES[value]
                : "border-[rgba(28,36,48,0.08)] bg-white/90 text-slate-500 hover:text-slate-800"
            }`}
            key={value}
            onClick={() => onKindChange(value)}
            type="button"
          >
            {KIND_LABELS[value]}
          </button>
        ))}
      </div>

      <textarea
        className="w-full rounded-[1.35rem] border border-[rgba(28,36,48,0.12)] bg-[rgba(251,249,245,0.95)] px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[rgb(var(--atlas-primary))] resize-none"
        onChange={(event) => onContentChange(event.target.value)}
        placeholder={`Add a ${KIND_LABELS[kind].toLowerCase()}...`}
        rows={3}
        value={content}
      />

      <div className="rounded-[1.15rem] border border-[rgba(28,36,48,0.08)] bg-[rgba(246,244,238,0.45)] px-4 py-3">
        <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
          <Landmark className="h-3.5 w-3.5" />
          Reference a governance proposal
        </label>
        <select
          className="mt-2 w-full rounded-[0.95rem] border border-[rgba(28,36,48,0.12)] bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-[rgb(var(--atlas-primary))]"
          onChange={(event) => onProposalChange(event.target.value)}
          value={selectedProposalId}
        >
          <option value="">No linked proposal</option>
          {proposalOptions.map((proposal) => (
            <option key={proposal.id} value={proposal.id}>
              {proposal.title}
            </option>
          ))}
        </select>

        {selectedProposalId ? (
          (() => {
            const selectedProposal = proposalOptions.find((proposal) => proposal.id === selectedProposalId);
            if (!selectedProposal) return null;

            return (
              <div className="mt-3 rounded-[1rem] border border-[rgba(28,36,48,0.08)] bg-white px-3 py-3">
                <div className="flex flex-wrap items-center gap-2">
                  {proposalCategoryLabel(selectedProposal.category) ? (
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${proposalTone(
                        selectedProposal.category,
                      )}`}
                    >
                      {proposalCategoryLabel(selectedProposal.category)}
                    </span>
                  ) : null}
                  {selectedProposal.moduleTitle ? (
                    <span className="text-xs text-slate-500">{selectedProposal.moduleTitle}</span>
                  ) : null}
                </div>
                <p className="mt-2 text-sm font-semibold text-slate-900">{selectedProposal.title}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Link
                    className="inline-flex items-center gap-1 text-xs font-semibold text-primary transition hover:text-slate-900"
                    href={`/governance/${selectedProposal.id}`}
                    target="_blank"
                  >
                    Preview proposal
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  {selectedProposal.moduleSlug ? (
                    <Link
                      className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 transition hover:text-slate-900"
                      href={`/learn/${selectedProposal.moduleSlug}`}
                      target="_blank"
                    >
                      Open linked module
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  ) : null}
                </div>
              </div>
            );
          })()
        ) : null}
      </div>

      <div className="flex justify-end">
        <Button className="rounded-full gap-2 px-5" disabled={disabled} type="submit">
          <Send className="h-3.5 w-3.5" />
          {submitting ? "Posting..." : "Post"}
        </Button>
      </div>

      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
    </form>
  );
}

function StaticThread({
  message = "Connect Supabase to enable live discussions. Showing example posts for now.",
}: {
  message?: string;
}) {
  return (
    <div className="space-y-3">
      <p className="rounded-[1.1rem] border border-amber-200 bg-amber-50/80 px-4 py-3 text-xs text-amber-700">
        {message}
      </p>

      <ThreadShell>
        {SEED_POSTS.map((post) => (
          <PostRow key={post.id} post={post} />
        ))}
      </ThreadShell>
    </div>
  );
}

function LiveThread({ threadId }: { threadId: string }) {
  const [posts, setPosts] = useState<LivePost[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [threadMeta, setThreadMeta] = useState<ThreadMeta | null>(null);
  const [viewerProfile, setViewerProfile] = useState<ViewerBackgroundProfile | null>(null);
  const [participantStatus, setParticipantStatus] = useState<ParticipantStatus | null>(null);
  const [content, setContent] = useState("");
  const [kind, setKind] = useState<PostKind>("claim");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [selectedProposalId, setSelectedProposalId] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const supabase = useMemo(() => createClient(), []);
  const { submissions } = useSubmissions();
  const proposalOptions = useMemo(
    () =>
      getAllProposals(submissions).map((proposal) => ({
        category: proposal.category,
        id: proposal.id,
        moduleSlug: proposal.moduleSlug,
        moduleTitle: proposal.moduleTitle,
        title: proposal.title,
      })),
    [submissions],
  );
  const proposalById = useMemo(
    () => new Map(proposalOptions.map((proposal) => [proposal.id, proposal])),
    [proposalOptions],
  );
  const audienceGroups = useMemo(
    () =>
      threadMeta
        ? backgroundFilterGroups({
            academicLevels: threadMeta.desiredAcademicLevels,
            expertiseDomains: threadMeta.desiredExpertiseDomains,
            professionalStages: threadMeta.desiredProfessionalStages,
          })
        : [],
    [threadMeta],
  );
  const audienceSummary = useMemo(
    () =>
      threadMeta
        ? summarizeBackgroundFilters({
            academicLevels: threadMeta.desiredAcademicLevels,
            expertiseDomains: threadMeta.desiredExpertiseDomains,
            professionalStages: threadMeta.desiredProfessionalStages,
          })
        : "Open to everyone",
    [threadMeta],
  );
  const matchesThreadBackground = useMemo(
    () => viewerMatchesThreadBackground(threadMeta, viewerProfile),
    [threadMeta, viewerProfile],
  );
  const canCompose = useMemo(() => {
    if (!threadMeta) return Boolean(userId);
    if (!userId) return false;
    if (userId === threadMeta.authorId) return true;
    if (threadMeta.kind === "private_circle") return participantStatus === "accepted";
    if (threadMeta.participationMode === "open") return true;
    return matchesThreadBackground;
  }, [matchesThreadBackground, participantStatus, threadMeta, userId]);

  const toDisplayPost = useCallback(
    async (row: PostRow): Promise<LivePost> => {
      const { data: profile } = await supabase
        .from("profiles")
        .select("username, full_name, avatar_url, linkedin_url, share_linkedin_profile")
        .eq("id", row.author_id)
        .single();
      const author_label = profile?.username ?? profile?.full_name ?? "Anonymous";
      return {
        author_avatar_url: profile?.avatar_url ?? null,
        id: row.id,
        kind: row.kind,
        content: row.content,
        created_at: row.created_at,
        author_label,
        author_linkedin_url:
          profile?.share_linkedin_profile && profile?.linkedin_url
            ? normalizeLinkedInUrl(profile.linkedin_url)
            : null,
        proposalReference: proposalReferenceFromMetadata(row.metadata),
      };
    },
    [supabase],
  );

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setLoadError(null);
      setSubmitError(null);

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!cancelled) {
        setUserId(user?.id ?? null);
      }

      const [threadResult, postsResult, profileResult, participantResult] = await Promise.all([
        supabase
          .from("threads")
          .select(
            "id,title,author_id,visibility,kind,participation_mode,desired_academic_levels,desired_professional_stages,desired_expertise_domains",
          )
          .eq("id", threadId)
          .single(),
        supabase
          .from("posts")
          .select("*")
          .eq("thread_id", threadId)
          .order("created_at", { ascending: true })
          .limit(100),
        user?.id
          ? supabase
              .from("profiles")
              .select("academic_level,professional_stage,expertise_domains")
              .eq("id", user.id)
              .maybeSingle()
          : Promise.resolve({ data: null, error: null }),
        user?.id
          ? supabase
              .from("thread_participants")
              .select("status")
              .eq("thread_id", threadId)
              .eq("user_id", user.id)
              .maybeSingle()
          : Promise.resolve({ data: null, error: null }),
      ]);

      if (cancelled) {
        return;
      }

      if (threadResult.error) {
        setLoadError(threadResult.error.message);
        setPosts([]);
        setThreadMeta(null);
        setViewerProfile(null);
        setLoading(false);
        return;
      }

      if (postsResult.error) {
        setLoadError(postsResult.error.message);
        setPosts([]);
        setThreadMeta(null);
        setViewerProfile(null);
        setLoading(false);
        return;
      }

      const thread = threadResult.data;
      const rows = postsResult.data;

      if (!thread || !rows) {
        setPosts([]);
        setThreadMeta(null);
        setViewerProfile(null);
        setLoading(false);
        return;
      }

      const display = await Promise.all(rows.map(toDisplayPost));
      if (!cancelled) {
        setThreadMeta({
          authorId: thread.author_id,
          desiredAcademicLevels: thread.desired_academic_levels,
          desiredExpertiseDomains: thread.desired_expertise_domains,
          desiredProfessionalStages: thread.desired_professional_stages,
          kind: thread.kind,
          participationMode: thread.participation_mode,
          title: thread.title,
          visibility: thread.visibility,
        });
        setViewerProfile(
          profileResult.data
            ? {
                academicLevel: profileResult.data.academic_level,
                expertiseDomains: profileResult.data.expertise_domains ?? [],
                professionalStage: profileResult.data.professional_stage,
              }
            : null,
        );
        setParticipantStatus(participantResult.data?.status ?? null);
        setPosts(display);
        setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [threadId, supabase, toDisplayPost]);

  useEffect(() => {
    const channel = supabase
      .channel(`thread:${threadId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "posts",
          filter: `thread_id=eq.${threadId}`,
        },
        async (payload) => {
          const newPost = await toDisplayPost(payload.new as PostRow);
          setPosts((previous) => {
            if (previous.some((post) => post.id === newPost.id)) {
              return previous;
            }
            return [...previous, newPost];
          });
          setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [threadId, supabase, toDisplayPost]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!content.trim() || !userId || !canCompose) {
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    const trimmedContent = content.trim();
    const activeKind = kind;
    const linkedProposal = selectedProposalId ? proposalById.get(selectedProposalId) ?? null : null;
    const { data, error } = await supabase
      .from("posts")
      .insert({
        thread_id: threadId,
        author_id: userId,
        kind: activeKind,
        content: trimmedContent,
        metadata: linkedProposal
          ? {
              proposalReference: {
                category: linkedProposal.category ?? null,
                id: linkedProposal.id,
                moduleSlug: linkedProposal.moduleSlug ?? null,
                moduleTitle: linkedProposal.moduleTitle ?? null,
                title: linkedProposal.title,
              },
            }
          : {},
      })
      .select("*")
      .single();

    if (error || !data) {
      setSubmitError(error?.message ?? "Unable to post into this conversation.");
      setSubmitting(false);
      return;
    }

    const newPost = await toDisplayPost(data);
    setPosts((previous) => {
      if (previous.some((post) => post.id === newPost.id)) {
        return previous;
      }
      return [...previous, newPost];
    });
    setContent("");
    setSelectedProposalId("");
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    setSubmitting(false);
  }

  return (
    <ThreadShell
      footer={
        userId && canCompose ? (
          <Composer
            content={content}
            disabled={submitting || !content.trim()}
            error={submitError}
            kind={kind}
            onContentChange={setContent}
            onKindChange={setKind}
            onProposalChange={setSelectedProposalId}
            onSubmit={handleSubmit}
            proposalOptions={proposalOptions}
            selectedProposalId={selectedProposalId}
            submitting={submitting}
          />
        ) : threadMeta?.kind === "public_discussion" && threadMeta.participationMode === "background_guided" ? (
          <div className="space-y-3 rounded-[1.2rem] border border-amber-200 bg-amber-50/75 px-4 py-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full border border-amber-200 bg-white text-amber-700">
                {userId ? <ShieldCheck className="h-4 w-4" /> : <Info className="h-4 w-4" />}
              </div>
              <div className="space-y-2">
                <p className="text-sm font-semibold text-slate-900">This discussion is seeking specific backgrounds</p>
                <p className="text-sm leading-6 text-slate-700">
                  {userId
                    ? "You can read everything here, but posting is currently reserved for members whose background profile matches the thread creator’s requested audience."
                    : "You can read this thread, but posting is currently guided toward specific backgrounds chosen by the thread creator."}
                </p>
                <div className="flex flex-wrap gap-2">
                  {audienceGroups.map((group) => (
                    <span
                      className="rounded-full border border-amber-200 bg-white px-3 py-1.5 text-xs font-semibold text-amber-800"
                      key={group.label}
                    >
                      {group.label}: {group.values.join(", ")}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-3 text-sm">
                  {userId ? (
                    <Link className="font-semibold text-primary transition hover:text-slate-900" href="/dashboard">
                      Update your account background
                    </Link>
                  ) : (
                    <Link className="font-semibold text-primary transition hover:text-slate-900" href="/auth">
                      Sign in to join guided discussions
                    </Link>
                  )}
                </div>
                </div>
              </div>
            </div>
        ) : userId && threadMeta?.kind === "private_circle" ? (
          <div className="space-y-3 rounded-[1.2rem] border border-slate-200 bg-slate-50/80 px-4 py-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700">
                <Info className="h-4 w-4" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-semibold text-slate-900">Posting is available after the invite is accepted</p>
                <p className="text-sm leading-6 text-slate-600">
                  {participantStatus === "pending"
                    ? "This study circle is visible in your inbox, but you need to accept the invite before you can post."
                    : "Only accepted participants can contribute inside this private study circle."}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-sm text-slate-500">
            <a className="font-medium text-[rgb(var(--atlas-primary))] hover:underline" href="/auth">
              Sign in
            </a>{" "}
            to join the discussion.
          </p>
        )
      }
    >
      {threadMeta?.kind === "public_discussion" ? (
        <div className="space-y-3 py-4">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "inline-flex rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em]",
                participationTone(threadMeta.participationMode),
              )}
            >
              {threadMeta.participationMode === "open" ? "Open participation" : "Guided participation"}
            </span>
            {threadMeta.participationMode === "background_guided" ? (
              <span className="text-xs text-slate-500">{audienceSummary}</span>
            ) : (
              <span className="text-xs text-slate-500">Any signed-in member can contribute.</span>
            )}
          </div>
          {threadMeta.participationMode === "background_guided" && userId && matchesThreadBackground ? (
            <div className="flex items-start gap-3 rounded-[1rem] border border-emerald-200 bg-emerald-50/70 px-4 py-3">
              <ShieldCheck className="mt-0.5 h-4 w-4 text-emerald-700" />
              <p className="text-sm leading-6 text-emerald-800">
                Your background profile matches this thread’s requested participation focus, so you can contribute directly.
              </p>
            </div>
          ) : null}
        </div>
      ) : null}

      {loading ? (
        <p className="py-4 text-sm text-slate-500">Loading discussion...</p>
      ) : loadError ? (
        <p className="py-4 text-sm text-rose-600">{loadError}</p>
      ) : posts.length === 0 ? (
        <p className="py-4 text-sm text-slate-500">No posts yet. Be the first to add a claim.</p>
      ) : (
        posts.map((post) => <PostRow key={post.id} post={post} />)
      )}
      <div ref={bottomRef} />
    </ThreadShell>
  );
}

export function DiscussionThread({ threadId }: { threadId?: string }) {
  if (!hasSupabaseEnv) {
    return <StaticThread />;
  }

  if (!threadId) {
    return <StaticThread message="No public thread selected yet. Showing example posts for now." />;
  }

  return <LiveThread threadId={threadId} />;
}

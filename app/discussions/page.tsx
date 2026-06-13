import Link from "next/link";
import {
  ArrowRight,
  BookOpenText,
  Building2,
  Clock3,
  Cpu,
  FileText,
  Landmark,
  Leaf,
  Lightbulb,
  MessageSquare,
  PiggyBank,
  Scale,
  Sparkles,
  TrendingUp,
  Users,
  Vote,
} from "lucide-react";

import { AtlasPage } from "@/components/atlas/AtlasPage";
import { IllustratedTabHero } from "@/components/atlas/IllustratedTabHero";
import { SoftPanel } from "@/components/atlas/SoftPanel";
import { CardCarousel } from "@/components/ui/CardCarousel";
import { AgentPanel } from "@/components/discussion/AgentPanel";
import { PrivateCircleParticipantsPanel } from "@/components/discussion/PrivateCircleParticipantsPanel";
import { PrivateCirclesPanel } from "@/components/discussion/PrivateCirclesPanel";
import { StartDiscussionModalButton } from "@/components/discussion/StartDiscussionModalButton";
import { DiscussionThread } from "@/components/discussion/discussion-thread";
import { summarizeBackgroundFilters } from "@/lib/community/profile-options";
import type { Database } from "@/lib/database.types";
import { isSeededPublicThreadId, SEEDED_PUBLIC_THREADS } from "@/lib/discussion/seeded-public-threads";
import { SEEDED_PROPOSALS } from "@/lib/governance/proposals";
import { LEARNING_TRACKS } from "@/lib/tracks/config";
import { createOptionalClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

// ── Static data ────────────────────────────────────────────────────────────────

const BIG_QUESTIONS = [
  { id: "housing",  icon: Building2,  question: "Why is housing becoming unaffordable?", discussions: 124, color: "text-cyan-600    border-cyan-200    bg-cyan-50"    },
  { id: "wealth",   icon: TrendingUp, question: "Why does wealth concentrate?",           discussions: 98,  color: "text-emerald-600 border-emerald-200 bg-emerald-50" },
  { id: "ecology",  icon: Leaf,       question: "Can growth and ecology coexist?",         discussions: 87,  color: "text-green-600   border-green-200   bg-green-50"   },
  { id: "money",    icon: PiggyBank,  question: "How should money be created?",            discussions: 76,  color: "text-amber-600   border-amber-200   bg-amber-50"   },
  { id: "ai",       icon: Cpu,        question: "How should AI be governed?",              discussions: 64,  color: "text-sky-600     border-sky-200     bg-sky-50"     },
  { id: "politics", icon: Landmark,   question: "Why does politics feel stuck?",           discussions: 58,  color: "text-violet-600  border-violet-200  bg-violet-50"  },
];

const DELIBERATION_PIPELINE = [
  { icon: MessageSquare, label: "Question",     desc: "Identify what we need to understand", color: "text-slate-500    border-[rgba(28,36,48,0.12)] bg-white"         },
  { icon: FileText,      label: "Claim",        desc: "State a clear position",               color: "text-amber-600   border-amber-200              bg-amber-50/80"  },
  { icon: BookOpenText,  label: "Evidence",     desc: "Back it with credible sources",        color: "text-cyan-600    border-cyan-200               bg-cyan-50/80"   },
  { icon: Scale,         label: "Counterpoint", desc: "Test the strongest alternative",       color: "text-rose-600    border-rose-200               bg-rose-50/80"   },
  { icon: Lightbulb,     label: "Synthesis",    desc: "Pull the useful parts together",       color: "text-violet-600  border-violet-200             bg-violet-50/80" },
  { icon: Sparkles,      label: "Proposal",     desc: "Turn ideas into concrete actions",     color: "text-blue-600    border-blue-200               bg-blue-50/80"   },
  { icon: Vote,          label: "Governance",   desc: "Vote, refine and implement",           color: "text-emerald-600 border-emerald-200            bg-emerald-50/80"},
];

// Mock-display metadata for seeded threads (matches mockup numbers)
const THREAD_DISPLAY_META: Record<string, {
  participants: number; evidenceCount: number; proposalCount: number;
  lastActivity: string; extraAvatars: number;
}> = {
  "seed-growth-distribution":                          { participants: 126, evidenceCount: 43, proposalCount: 6, lastActivity: "2h ago", extraAvatars: 23 },
  "seed-housing-public-good":                          { participants: 84,  evidenceCount: 31, proposalCount: 4, lastActivity: "5h ago", extraAvatars: 17 },
  "seed-public-banks-for-housing-and-green-investment":{ participants: 101, evidenceCount: 38, proposalCount: 5, lastActivity: "1d ago", extraAvatars: 19 },
  "seed-gdp-not-wellbeing":                            { participants: 72,  evidenceCount: 27, proposalCount: 3, lastActivity: "1d ago", extraAvatars: 11 },
};

const AVATAR_PALETTES = [
  ["bg-blue-400",   "bg-emerald-400", "bg-amber-400" ],
  ["bg-rose-400",   "bg-sky-400",     "bg-violet-400"],
  ["bg-teal-400",   "bg-orange-400",  "bg-pink-400"  ],
  ["bg-indigo-400", "bg-lime-500",    "bg-cyan-400"  ],
];

type DiscussionStatus = "open" | "needs-evidence" | "synthesis-in-progress" | "proposal-emerging";

const STATUS_META: Record<DiscussionStatus, { label: string; badgeColor: string; barColor: string }> = {
  "open":                  { label: "Open",                  badgeColor: "border-emerald-200 bg-emerald-50 text-emerald-700", barColor: "bg-emerald-400" },
  "needs-evidence":        { label: "Needs Evidence",        badgeColor: "border-amber-200   bg-amber-50   text-amber-700",   barColor: "bg-amber-400"   },
  "synthesis-in-progress": { label: "Synthesis in progress", badgeColor: "border-blue-200    bg-blue-50    text-blue-700",    barColor: "bg-blue-400"    },
  "proposal-emerging":     { label: "Proposal emerging",     badgeColor: "border-violet-200  bg-violet-50  text-violet-700",  barColor: "bg-violet-400"  },
};

const SEEDED_STATUSES: Record<string, DiscussionStatus> = {
  "seed-growth-distribution":                          "open",
  "seed-housing-public-good":                          "needs-evidence",
  "seed-public-banks-for-housing-and-green-investment":"synthesis-in-progress",
  "seed-gdp-not-wellbeing":                            "proposal-emerging",
};

const DEMO_TOPIC =
  "How do financial, political, and social systems create and sustain inequality — and what leverage points exist for change?";
const EMPTY_POSTS: { kind: string; content: string; author: string }[] = [];

// ── Types ──────────────────────────────────────────────────────────────────────

type DiscussionFilter = "all" | "following" | "mine";

type PublicThreadSummary = {
  authorId: string;
  authorLabel: string;
  contextSlug: string | null;
  contextType: "general" | "module" | "track";
  desiredAcademicLevels: string[];
  desiredExpertiseDomains: string[];
  desiredProfessionalStages: string[];
  hasUserContribution: boolean;
  id: string;
  isFollowed: boolean;
  participationMode: Database["public"]["Enums"]["thread_participation_mode"];
  participationSummary: string;
  prompt: string | null;
  title: string;
  updatedAt: string;
  postCount: number;
};

// ── Helpers ────────────────────────────────────────────────────────────────────

function deriveStatus(thread: PublicThreadSummary): DiscussionStatus {
  const seeded = SEEDED_STATUSES[thread.id];
  if (seeded) return seeded;
  if (thread.postCount === 0) return "needs-evidence";
  if (thread.postCount >= 6) return "synthesis-in-progress";
  return "open";
}

function buildDiscussionHref(filter: DiscussionFilter, threadId?: string) {
  const p = new URLSearchParams();
  p.set("filter", filter);
  if (threadId) p.set("thread", threadId);
  return `/discussions?${p.toString()}`;
}

function trackIdsForVisitedModules(moduleSlugs: Set<string>) {
  return new Set(
    LEARNING_TRACKS.filter((t) => t.moduleSlugs.some((s) => moduleSlugs.has(s))).map((t) => t.id),
  );
}

function filterEmptyMessage(filter: DiscussionFilter, signedIn: boolean) {
  if (!signedIn) return "Sign in to see discussions you follow or have contributed to. For now, browse public threads.";
  if (filter === "following") return "No followed discussions yet. Open a module or track you studied, or start a thread tied to it.";
  if (filter === "mine") return "You have not contributed to a public discussion yet.";
  return "No public threads yet.";
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default async function DiscussionsPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = (await searchParams) ?? {};
  const requestedThreadId =
    typeof params.thread === "string" && params.thread.trim().length > 0 ? params.thread : undefined;
  const requestedFilter =
    typeof params.filter === "string" && ["all", "following", "mine"].includes(params.filter)
      ? (params.filter as DiscussionFilter)
      : "all";

  const supabase = await createOptionalClient();
  let currentUserId: string | null = null;
  let publicThreads: PublicThreadSummary[] = SEEDED_PUBLIC_THREADS.map((thread) => ({
    authorId: `seeded:${thread.id}`,
    authorLabel: thread.authorLabel,
    contextSlug: thread.contextSlug,
    contextType: thread.contextType,
    desiredAcademicLevels: thread.desiredAcademicLevels,
    desiredExpertiseDomains: thread.desiredExpertiseDomains,
    desiredProfessionalStages: thread.desiredProfessionalStages,
    hasUserContribution: false,
    id: thread.id,
    isFollowed: false,
    participationMode: thread.participationMode,
    participationSummary: "Open to everyone",
    postCount: thread.posts.length,
    prompt: thread.prompt,
    title: thread.title,
    updatedAt: thread.updatedAt,
  }));

  if (supabase) {
    const { data: { user } } = await supabase.auth.getUser();
    currentUserId = user?.id ?? null;

    const { data: publicThreadRows } = await supabase
      .from("threads")
      .select(
        "id,title,prompt,author_id,updated_at,context_type,context_slug,participation_mode,desired_academic_levels,desired_professional_stages,desired_expertise_domains",
      )
      .eq("kind", "public_discussion")
      .eq("visibility", "public")
      .eq("status", "open")
      .order("updated_at", { ascending: false })
      .limit(24);

    const threadRows = publicThreadRows ?? [];
    const publicThreadIds = threadRows.map((t) => t.id);

    let visitedModuleSlugs = new Set<string>();
    if (currentUserId) {
      const { data: progressRows } = await supabase
        .from("user_module_progress")
        .select("module_slug")
        .eq("user_id", currentUserId)
        .eq("visited", true);
      visitedModuleSlugs = new Set((progressRows ?? []).map((r) => r.module_slug));
    }
    const visitedTrackIds = trackIdsForVisitedModules(visitedModuleSlugs);

    const [postRowsResult, profileRowsResult] = await Promise.all([
      publicThreadIds.length > 0
        ? supabase.from("posts").select("thread_id,author_id").in("thread_id", publicThreadIds)
        : Promise.resolve({ data: [], error: null }),
      threadRows.length > 0
        ? supabase.from("profiles").select("id,full_name,username")
            .in("id", Array.from(new Set(threadRows.map((t) => t.author_id))))
        : Promise.resolve({ data: [], error: null }),
    ]);

    const postRows = postRowsResult.data ?? [];
    const profileRows = profileRowsResult.data ?? [];
    const authorMap = new Map(profileRows.map((p) => [p.id, p.full_name ?? p.username ?? "Society Lab member"]));

    const postCountByThread = new Map<string, number>();
    const contributedThreadIds = new Set<string>();
    for (const post of postRows) {
      postCountByThread.set(post.thread_id, (postCountByThread.get(post.thread_id) ?? 0) + 1);
      if (currentUserId && post.author_id === currentUserId) contributedThreadIds.add(post.thread_id);
    }

    const liveThreads = threadRows.map((thread) => {
      const contextSlug = thread.context_slug;
      const participationSummary = summarizeBackgroundFilters({
        academicLevels: thread.desired_academic_levels,
        expertiseDomains: thread.desired_expertise_domains,
        professionalStages: thread.desired_professional_stages,
      });
      const hasUserContribution =
        Boolean(currentUserId) && (contributedThreadIds.has(thread.id) || thread.author_id === currentUserId);
      const isFollowed =
        Boolean(currentUserId) &&
        (thread.author_id === currentUserId ||
          (thread.context_type === "module" && typeof contextSlug === "string" && visitedModuleSlugs.has(contextSlug)) ||
          (thread.context_type === "track" && typeof contextSlug === "string" && visitedTrackIds.has(contextSlug)));
      return {
        authorId: thread.author_id,
        authorLabel: authorMap.get(thread.author_id) ?? "Society Lab member",
        contextSlug: thread.context_slug,
        contextType: thread.context_type,
        desiredAcademicLevels: thread.desired_academic_levels,
        desiredExpertiseDomains: thread.desired_expertise_domains,
        desiredProfessionalStages: thread.desired_professional_stages,
        hasUserContribution,
        id: thread.id,
        isFollowed,
        participationMode: thread.participation_mode,
        participationSummary,
        postCount: postCountByThread.get(thread.id) ?? 0,
        prompt: thread.prompt,
        title: thread.title,
        updatedAt: thread.updated_at,
      } satisfies PublicThreadSummary;
    });

    publicThreads = [...publicThreads, ...liveThreads];
  }

  const filteredPublicThreads = publicThreads.filter((thread) => {
    if (requestedFilter === "following") return thread.isFollowed;
    if (requestedFilter === "mine") return thread.hasUserContribution;
    return true;
  });

  let activeThread: { id: string; kind: "private_circle" | "public_discussion" } | null = null;
  if (requestedThreadId && isSeededPublicThreadId(requestedThreadId)) {
    activeThread = { id: requestedThreadId, kind: "public_discussion" };
  }
  if (supabase && requestedThreadId && !activeThread) {
    const { data } = await supabase.from("threads").select("id, kind").eq("id", requestedThreadId).maybeSingle();
    if (data) activeThread = data;
  }
  if (!activeThread) {
    const first = filteredPublicThreads[0];
    if (first) activeThread = { id: first.id, kind: "public_discussion" };
  }

  const selectedThreadId = activeThread?.id;
  const selectedSeededThreadId =
    selectedThreadId && isSeededPublicThreadId(selectedThreadId) ? selectedThreadId : undefined;
  const isPrivateCircle = activeThread?.kind === "private_circle";
  const visibleThreads = filteredPublicThreads.slice(0, 8);
  const hasFilteredResults = visibleThreads.length > 0;

  return (
    <AtlasPage className="space-y-0 pb-14">

      {/* ── FULL-WIDTH HERO (same pattern as all other tabs) ──────────── */}
      <IllustratedTabHero
        eyebrow="Collective Intelligence"
        title={"Think together.\nDesign better futures."}
        description="Turn ideas into evidence, evidence into synthesis, and synthesis into proposals that could actually change things."
        imageAlt="Citizens collaborating around ideas"
        imageSrc="/atlas/discuss-hero.png"
        actions={
          <>
            <StartDiscussionModalButton />
            <Link
              className="inline-flex items-center gap-2 rounded-full border border-[rgba(28,36,48,0.14)] bg-white/90 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-[rgba(28,36,48,0.24)] hover:text-slate-900"
              href="#big-questions"
            >
              <MessageSquare className="h-4 w-4" />
              Explore Questions
            </Link>
          </>
        }
      />

      {/* ── MAIN CONTENT: 2-column grid ───────────────────────────────── */}
      <div className="grid gap-6 pt-6 xl:grid-cols-[minmax(0,1fr)_22rem] xl:items-start">

        {/* LEFT COLUMN ───────────────────────────────────────────────── */}
        <div className="space-y-6">

          {/* BIG QUESTIONS */}
          <SoftPanel className="space-y-5" id="big-questions">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="atlas-kicker">Open questions</p>
                <h2 className="atlas-display mt-2 text-2xl text-slate-900">What should we tackle next?</h2>
                <p className="mt-1 text-sm text-slate-500">Explore key questions facing our society. Click to view or start a discussion.</p>
              </div>
              <Link
                className="mt-1 shrink-0 text-sm font-semibold text-primary transition hover:text-slate-900"
                href="/discussions?filter=all"
              >
                View all <span aria-hidden>{"→"}</span>
              </Link>
            </div>

            <CardCarousel perPage={3} className="px-1">
              {BIG_QUESTIONS.map(({ color, discussions, icon: Icon, id, question }) => (
                <Link
                  className="flex h-full min-h-[9rem] flex-col items-center justify-center rounded-[1.3rem] border border-[rgba(28,36,48,0.08)] bg-white px-3 py-5 text-center transition hover:border-[rgba(28,36,48,0.18)] hover:shadow-[0_12px_24px_rgba(28,36,48,0.06)]"
                  href="/discussions?filter=all"
                  key={id}
                >
                  <div className={cn("flex h-11 w-11 items-center justify-center rounded-full border", color)}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="mt-3 text-[0.82rem] font-semibold leading-5 text-slate-900">{question}</p>
                  <p className="mt-1.5 text-[11px] font-medium text-slate-400">{discussions} discussions</p>
                </Link>
              ))}
            </CardCarousel>
          </SoftPanel>

          {/* ACTIVE DISCUSSIONS */}
          <SoftPanel className="space-y-5" id="discussion-board">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="atlas-kicker">Collective threads</p>
                <h2 className="atlas-display mt-2 text-2xl text-slate-900">
                  {isPrivateCircle ? "Private study circle" : "Active Discussions"}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Ongoing conversations where the community is building understanding and solutions.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {(
                  [
                    { label: "All",              value: "all"       },
                    { label: "Following",        value: "following" },
                    { label: "My contributions", value: "mine"      },
                  ] satisfies { label: string; value: DiscussionFilter }[]
                ).map(({ label, value }) => (
                  <Link
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] transition",
                      requestedFilter === value
                        ? "border-[rgba(59,130,246,0.22)] bg-[rgba(59,130,246,0.08)] text-slate-900"
                        : "border-[rgba(28,36,48,0.1)] bg-white/90 text-slate-400 hover:text-slate-700",
                    )}
                    href={buildDiscussionHref(value)}
                    key={value}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            {hasFilteredResults ? (
              <>
                {/* 4-per-row discussion cards */}
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  {visibleThreads.slice(0, 4).map((thread, idx) => {
                    const isSelected   = thread.id === selectedThreadId;
                    const status       = deriveStatus(thread);
                    const meta         = STATUS_META[status];
                    const displayMeta  = THREAD_DISPLAY_META[thread.id];
                    const avatarColors = AVATAR_PALETTES[idx % AVATAR_PALETTES.length];

                    return (
                      <Link
                        className={cn(
                          "group flex flex-col overflow-hidden rounded-[1.4rem] border transition",
                          isSelected
                            ? "border-[rgba(59,130,246,0.28)] bg-[rgba(59,130,246,0.04)] shadow-[0_14px_28px_rgba(59,130,246,0.08)]"
                            : "border-[rgba(28,36,48,0.08)] bg-white hover:border-[rgba(28,36,48,0.16)] hover:shadow-[0_14px_24px_rgba(28,36,48,0.05)]",
                        )}
                        href={buildDiscussionHref(requestedFilter, thread.id)}
                        key={thread.id}
                      >
                        <div className="flex flex-1 flex-col px-4 pt-4 pb-3">
                          {/* Status badge */}
                          <span className={cn(
                            "self-start rounded-full border px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.14em]",
                            meta.badgeColor,
                          )}>
                            {meta.label}
                          </span>

                          {/* Title */}
                          <p className="mt-2.5 text-[0.9rem] font-bold leading-5 text-slate-900 transition-colors group-hover:text-primary">
                            {thread.title}
                          </p>

                          {/* Description */}
                          <p className="mt-2 line-clamp-2 flex-1 text-xs leading-5 text-slate-500">
                            {thread.prompt ?? "Open the thread to read the full discussion prompt."}
                          </p>

                          {/* Stats */}
                          <div className="mt-3 flex items-center gap-3 text-xs text-slate-400">
                            <span className="inline-flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {displayMeta?.participants ?? thread.postCount}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <FileText className="h-3 w-3" />
                              {displayMeta?.evidenceCount ?? thread.postCount}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <Lightbulb className="h-3 w-3" />
                              {displayMeta?.proposalCount ?? 0}
                            </span>
                          </div>

                          {/* Last activity + avatars */}
                          <div className="mt-2.5 flex items-center justify-between gap-2">
                            <span className="inline-flex items-center gap-1 text-[10px] text-slate-400">
                              <Clock3 className="h-3 w-3" />
                              {displayMeta?.lastActivity ?? new Date(thread.updatedAt).toLocaleDateString()}
                            </span>
                            <div className="flex items-center gap-1">
                              {avatarColors.map((bg, i) => (
                                <div
                                  className={cn("flex h-5 w-5 items-center justify-center rounded-full border-2 border-white text-[8px] font-bold text-white", bg)}
                                  key={i}
                                >
                                  {String.fromCharCode(65 + i)}
                                </div>
                              ))}
                              {displayMeta ? (
                                <span className="ml-0.5 text-[10px] font-medium text-slate-400">
                                  +{displayMeta.extraAvatars}
                                </span>
                              ) : null}
                            </div>
                          </div>
                        </div>

                        {/* Status colour bar */}
                        <div className={cn("h-1 w-full", meta.barColor)} />
                      </Link>
                    );
                  })}
                </div>

                <div className="flex justify-center pt-1">
                  <Link
                    className="inline-flex items-center gap-2 rounded-full border border-[rgba(28,36,48,0.1)] bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-[rgba(28,36,48,0.2)] hover:text-slate-900"
                    href={buildDiscussionHref(requestedFilter)}
                  >
                    View all discussions <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </>
            ) : (
              <div className="rounded-[1.25rem] border border-dashed border-[rgba(28,36,48,0.12)] bg-[rgba(246,244,238,0.48)] px-4 py-6 text-sm leading-7 text-slate-600">
                {filterEmptyMessage(requestedFilter, Boolean(currentUserId))}
              </div>
            )}

            {/* Inline thread reader */}
            {!isPrivateCircle && selectedThreadId ? (
              <DiscussionThread
                seededThreadId={selectedSeededThreadId}
                threadId={selectedSeededThreadId ? undefined : selectedThreadId}
              />
            ) : null}
          </SoftPanel>
        </div>

        {/* RIGHT SIDEBAR ──────────────────────────────────────────────── */}
        <div className="space-y-5">

          {/* HOW WE DELIBERATE */}
          <SoftPanel className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-base font-semibold text-slate-900">How we deliberate</h2>
              <Link
                className="text-xs font-semibold text-primary transition hover:text-slate-900"
                href="/learn"
              >
                Learn more <span aria-hidden>{"→"}</span>
              </Link>
            </div>
            <ol className="space-y-0.5">
              {DELIBERATION_PIPELINE.map(({ color, desc, icon: Icon, label }, i) => (
                <li className="flex items-center gap-3 rounded-[0.85rem] px-2 py-2" key={label}>
                  <div className={cn("relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full border", color)}>
                    <Icon className="h-3 w-3" />
                    {i < DELIBERATION_PIPELINE.length - 1 ? (
                      <span className="absolute -bottom-[0.6rem] left-1/2 h-2.5 w-px -translate-x-1/2 bg-[rgba(28,36,48,0.1)]" />
                    ) : null}
                  </div>
                  <div className="min-w-0">
                    <span className="text-sm font-semibold text-slate-900">{label}</span>
                    <span className="ml-1.5 text-xs text-slate-500">{desc}</span>
                  </div>
                </li>
              ))}
            </ol>
          </SoftPanel>

          {/* TEST YOUR ARGUMENT */}
          <AgentPanel defaultOpen topic={DEMO_TOPIC} recentPosts={EMPTY_POSTS} />

          {/* STUDY CIRCLES */}
          <PrivateCirclesPanel selectedThreadId={selectedThreadId} />
          {selectedThreadId && !selectedSeededThreadId ? (
            <PrivateCircleParticipantsPanel threadId={selectedThreadId} />
          ) : null}

        </div>
      </div>
    </AtlasPage>
  );
}

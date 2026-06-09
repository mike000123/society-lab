import Link from "next/link";
import {
  ArrowRight,
  BookOpenText,
  Clock3,
  Lightbulb,
  MessageSquare,
  Scale,
  Sparkles,
  Users,
} from "lucide-react";

import { AtlasPage } from "@/components/atlas/AtlasPage";
import { IllustratedTabHero } from "@/components/atlas/IllustratedTabHero";
import { SoftPanel } from "@/components/atlas/SoftPanel";
import { PrivateCircleParticipantsPanel } from "@/components/discussion/PrivateCircleParticipantsPanel";
import { AgentPanel } from "@/components/discussion/AgentPanel";
import { PrivateCirclesPanel } from "@/components/discussion/PrivateCirclesPanel";
import { PublicDiscussionStarter } from "@/components/discussion/PublicDiscussionStarter";
import { DiscussionThread } from "@/components/discussion/discussion-thread";
import { Button } from "@/components/ui/button";
import { summarizeBackgroundFilters } from "@/lib/community/profile-options";
import type { Database } from "@/lib/database.types";
import { isSeededPublicThreadId, SEEDED_PUBLIC_THREADS } from "@/lib/discussion/seeded-public-threads";
import { LEARNING_TRACKS } from "@/lib/tracks/config";
import { createOptionalClient } from "@/lib/supabase/server";

const DEMO_TOPIC =
  "How do financial, political, and social systems create and sustain inequality — and what leverage points exist for change?";

const RELATED_MODULES = [
  {
    slug: "why-gdp-is-not-the-same-as-wellbeing",
    title: "Why GDP does not equal wellbeing",
    tag: "Economy",
  },
  {
    slug: "how-wealth-compounds-faster-than-wages",
    title: "How wealth compounds faster than wages",
    tag: "Inequality",
  },
  {
    slug: "how-electoral-rules-shape-political-power",
    title: "How electoral rules shape political power",
    tag: "Governance",
  },
];

const DISCUSSION_ROLES = [
  {
    icon: MessageSquare,
    title: "Make a claim",
    description: "State the position clearly so the thread has something precise to test.",
    tone: "text-amber-600 border-amber-200 bg-amber-50/80",
  },
  {
    icon: BookOpenText,
    title: "Add evidence",
    description: "Ground the point in a module, dataset, article, or concrete case.",
    tone: "text-cyan-600 border-cyan-200 bg-cyan-50/80",
  },
  {
    icon: Scale,
    title: "Test the counterclaim",
    description: "Engage the strongest alternative explanation before you conclude too fast.",
    tone: "text-rose-600 border-rose-200 bg-rose-50/80",
  },
  {
    icon: Lightbulb,
    title: "Synthesize",
    description: "Pull the useful parts together and move the conversation forward.",
    tone: "text-violet-600 border-violet-200 bg-violet-50/80",
  },
];

const EMPTY_POSTS: { kind: string; content: string; author: string }[] = [];

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

function buildDiscussionHref(filter: DiscussionFilter, threadId?: string) {
  const params = new URLSearchParams();
  params.set("filter", filter);
  if (threadId) {
    params.set("thread", threadId);
  }
  return `/discussions?${params.toString()}`;
}

function trackIdsForVisitedModules(moduleSlugs: Set<string>) {
  return new Set(
    LEARNING_TRACKS.filter((track) => track.moduleSlugs.some((slug) => moduleSlugs.has(slug))).map((track) => track.id),
  );
}

function filterEmptyMessage(filter: DiscussionFilter, signedIn: boolean) {
  if (!signedIn) {
    return "Sign in to see the discussions you follow or have contributed to. For now, browse public threads.";
  }

  if (filter === "following") {
    return "No followed discussions yet. Open a module or track you studied, or start a thread tied to it.";
  }

  if (filter === "mine") {
    return "You have not contributed to a public discussion yet. Start with a claim, a question, or a counterpoint.";
  }

  return "No public thread selected yet. Showing example posts for now.";
}

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
    const {
      data: { user },
    } = await supabase.auth.getUser();
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
    const publicThreadIds = threadRows.map((thread) => thread.id);

    let visitedModuleSlugs = new Set<string>();
    if (currentUserId) {
      const { data: progressRows } = await supabase
        .from("user_module_progress")
        .select("module_slug")
        .eq("user_id", currentUserId)
        .eq("visited", true);

      visitedModuleSlugs = new Set((progressRows ?? []).map((row) => row.module_slug));
    }

    const visitedTrackIds = trackIdsForVisitedModules(visitedModuleSlugs);

    const [postRowsResult, profileRowsResult] = await Promise.all([
      publicThreadIds.length > 0
        ? supabase.from("posts").select("thread_id,author_id").in("thread_id", publicThreadIds)
        : Promise.resolve({ data: [], error: null }),
      threadRows.length > 0
        ? supabase
            .from("profiles")
            .select("id,full_name,username")
            .in(
              "id",
              Array.from(new Set(threadRows.map((thread) => thread.author_id))),
            )
        : Promise.resolve({ data: [], error: null }),
    ]);

    const postRows = postRowsResult.data ?? [];
    const profileRows = profileRowsResult.data ?? [];
    const authorMap = new Map(
      profileRows.map((profile) => [
        profile.id,
        profile.full_name ?? profile.username ?? "Society Lab member",
      ]),
    );

    const postCountByThread = new Map<string, number>();
    const contributedThreadIds = new Set<string>();

    for (const post of postRows) {
      postCountByThread.set(post.thread_id, (postCountByThread.get(post.thread_id) ?? 0) + 1);
      if (currentUserId && post.author_id === currentUserId) {
        contributedThreadIds.add(post.thread_id);
      }
    }

    const liveThreads = threadRows.map((thread) => {
      const contextSlug = thread.context_slug;
      const participationSummary = summarizeBackgroundFilters({
        academicLevels: thread.desired_academic_levels,
        expertiseDomains: thread.desired_expertise_domains,
        professionalStages: thread.desired_professional_stages,
      });
      const hasUserContribution =
        Boolean(currentUserId) &&
        (contributedThreadIds.has(thread.id) || thread.author_id === currentUserId);
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

  let activeThread:
    | {
        id: string;
        kind: "private_circle" | "public_discussion";
      }
    | null = null;

  if (requestedThreadId && isSeededPublicThreadId(requestedThreadId)) {
    activeThread = {
      id: requestedThreadId,
      kind: "public_discussion",
    };
  }

  if (supabase && requestedThreadId && !activeThread) {
    const { data } = await supabase
      .from("threads")
      .select("id, kind")
      .eq("id", requestedThreadId)
      .maybeSingle();

    if (data) {
      activeThread = data;
    }
  }

  if (!activeThread) {
    const firstFilteredThread = filteredPublicThreads[0];
    if (firstFilteredThread) {
      activeThread = {
        id: firstFilteredThread.id,
        kind: "public_discussion",
      };
    }
  }

  const selectedThreadId = activeThread?.id;
  const selectedSeededThreadId =
    selectedThreadId && isSeededPublicThreadId(selectedThreadId) ? selectedThreadId : undefined;
  const isPrivateCircle = activeThread?.kind === "private_circle";
  const showFilteredPublicThreads = !isPrivateCircle;
  const visibleThreads = filteredPublicThreads.slice(0, 6);
  const hasFilteredResults = visibleThreads.length > 0;

  return (
    <AtlasPage className="space-y-8 pb-14">
      <IllustratedTabHero
        actions={
          <>
            <Button asChild className="rounded-full px-5">
              <a href="#start-discussion">
                Start a discussion
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
            <Link
              className="inline-flex items-center gap-2 rounded-full border border-[rgba(28,36,48,0.12)] bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-[rgba(28,36,48,0.22)] hover:text-slate-900"
              href="/learn"
            >
              Explore related modules
              <BookOpenText className="h-4 w-4" />
            </Link>
          </>
        }
        description="Structured conversations for collective clarity, not for winning arguments. Bring a claim, back it up, face the strongest counterpoint, and keep the thread useful for the next person."
        eyebrow="Discuss"
        imageAlt="People gathered around an outdoor table discussing the future of society."
        imageSrc="/atlas/discuss-hero.png"
        title="Discuss what shapes our future"
      >
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {DISCUSSION_ROLES.map(({ description, icon: Icon, title, tone }) => (
            <div
              className="rounded-[1.25rem] border border-[rgba(28,36,48,0.08)] bg-white/92 px-4 py-3 shadow-[0_10px_24px_rgba(28,36,48,0.035)]"
              key={title}
            >
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 flex h-9 w-9 flex-none items-center justify-center rounded-full border ${tone}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900">{title}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-600">{description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </IllustratedTabHero>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_20rem]">
        <SoftPanel className="space-y-6" id="discussion-board">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="atlas-kicker">Conversation board</p>
              <h2 className="atlas-display mt-2 text-3xl text-slate-900">
                {isPrivateCircle ? "Private study circle" : "Current discussions"}
              </h2>
              <p className="atlas-copy mt-3 max-w-3xl text-sm">
                {isPrivateCircle
                  ? "This space now supports small private circles tied to modules and tracks, alongside the broader public discussion culture."
                  : "Threads should feel more like civic workshops than comment feeds. The structure is simple on purpose: make the reasoning visible and keep each contribution legible for the next reader."}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {(
                [
                  { label: "All discussions", value: "all" },
                  { label: "Following", value: "following" },
                  { label: "My contributions", value: "mine" },
                ] satisfies { label: string; value: DiscussionFilter }[]
              ).map(({ label, value }) => (
                <Link
                  className={`rounded-full border px-3 py-2 text-sm font-medium transition ${
                    requestedFilter === value
                      ? "border-[rgba(59,130,246,0.25)] bg-[rgba(59,130,246,0.1)] text-slate-900"
                      : "border-[rgba(28,36,48,0.1)] bg-white/90 text-slate-500 hover:text-slate-800"
                  }`}
                  href={buildDiscussionHref(value)}
                  key={label}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {showFilteredPublicThreads ? (
            hasFilteredResults ? (
              <div className="grid gap-3 md:grid-cols-2">
                {visibleThreads.map((thread) => {
                  const isSelected = thread.id === selectedThreadId;

                  return (
                    <Link
                      className={`rounded-[1.25rem] border px-4 py-4 transition ${
                        isSelected
                          ? "border-[rgba(59,130,246,0.28)] bg-[rgba(59,130,246,0.08)]"
                          : "border-[rgba(28,36,48,0.08)] bg-[rgba(246,244,238,0.68)] hover:border-[rgba(28,36,48,0.16)] hover:bg-white"
                      }`}
                      href={buildDiscussionHref(requestedFilter, thread.id)}
                      key={thread.id}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${
                                thread.participationMode === "background_guided"
                                  ? "border-amber-200 bg-amber-50 text-amber-700"
                                  : "border-emerald-200 bg-emerald-50 text-emerald-700"
                              }`}
                            >
                              {thread.participationMode === "background_guided" ? "Guided participation" : "Open participation"}
                            </span>
                          </div>
                          <p className="text-sm font-semibold text-slate-900">{thread.title}</p>
                          <p className="mt-2 text-sm leading-6 text-slate-600">
                            {thread.prompt ?? "Open the thread to read the full discussion prompt."}
                          </p>
                          {thread.participationMode === "background_guided" ? (
                            <p className="mt-2 text-xs leading-5 text-slate-500">
                              Seeking: {thread.participationSummary}
                            </p>
                          ) : null}
                        </div>
                        <ArrowRight className="mt-0.5 h-4 w-4 flex-none text-slate-400" />
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                        <span className="font-medium text-slate-700">{thread.authorLabel}</span>
                        <span className="inline-flex items-center gap-1">
                          <MessageSquare className="h-3.5 w-3.5" />
                          {thread.postCount} posts
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Clock3 className="h-3.5 w-3.5" />
                          {new Date(thread.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-[1.25rem] border border-dashed border-[rgba(28,36,48,0.12)] bg-[rgba(246,244,238,0.48)] px-4 py-4 text-sm leading-7 text-slate-600">
                {filterEmptyMessage(requestedFilter, Boolean(currentUserId))}
              </div>
            )
          ) : null}

          {!isPrivateCircle ? <PublicDiscussionStarter /> : null}

          {!isPrivateCircle && !hasFilteredResults ? null : (
            <DiscussionThread
              seededThreadId={selectedSeededThreadId}
              threadId={selectedSeededThreadId ? undefined : selectedThreadId}
            />
          )}
        </SoftPanel>

        <div className="space-y-6">
          <PrivateCirclesPanel selectedThreadId={selectedThreadId} />
          {selectedThreadId && !selectedSeededThreadId ? (
            <PrivateCircleParticipantsPanel threadId={selectedThreadId} />
          ) : null}

          <SoftPanel>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-amber-200 bg-amber-50 text-amber-600">
                <Users className="h-4 w-4" />
              </div>
              <div>
                <p className="atlas-kicker">Roles</p>
                <h2 className="atlas-display text-2xl text-slate-900">What makes a good thread</h2>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {DISCUSSION_ROLES.map(({ description, title }) => (
                <div
                  className="rounded-[1.15rem] border border-[rgba(28,36,48,0.08)] bg-white/86 px-4 py-3"
                  key={title}
                >
                  <p className="text-sm font-semibold text-slate-900">{title}</p>
                  <p className="mt-1.5 text-sm leading-6 text-slate-600">{description}</p>
                </div>
              ))}
            </div>
          </SoftPanel>

          <SoftPanel tone="blue">
            <p className="atlas-kicker">Prepare your thinking</p>
            <h2 className="atlas-display mt-2 text-2xl text-slate-900">Start from shared material</h2>
            <div className="mt-4 space-y-3">
              {RELATED_MODULES.map((module) => (
                <Link
                  className="flex items-center justify-between gap-3 rounded-[1.2rem] border border-[rgba(28,36,48,0.08)] bg-white/88 px-4 py-3 transition hover:border-[rgba(28,36,48,0.18)]"
                  href={`/learn/${module.slug}`}
                  key={module.slug}
                >
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">{module.tag}</p>
                    <p className="mt-1 text-sm font-semibold text-slate-800">{module.title}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-400" />
                </Link>
              ))}
            </div>
          </SoftPanel>

          <AgentPanel topic={DEMO_TOPIC} recentPosts={EMPTY_POSTS} />
        </div>
      </div>
    </AtlasPage>
  );
}

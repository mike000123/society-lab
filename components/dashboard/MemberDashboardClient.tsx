"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  Bookmark,
  ChevronRight,
  Clock3,
  ListChecks,
  ShieldCheck,
  Trophy,
} from "lucide-react";

import { signOutAction } from "@/app/auth/actions";
import { AtlasPage } from "@/components/atlas/AtlasPage";
import { SoftPanel } from "@/components/atlas/SoftPanel";
import { Button } from "@/components/ui/button";
import { getLearningModuleBySlug, learningModules } from "@/lib/learn/modules";
import { LEARNING_JOURNEYS } from "@/lib/learn/journeys";
import { getLevelProgress, LEVELS } from "@/lib/progress/levels";
import { useProgress } from "@/lib/progress/store";
import { LEARNING_TRACKS } from "@/lib/tracks/config";
import { useSubmissions, useVotes } from "@/lib/governance/votes";
import { cn } from "@/lib/utils";

type DashboardProfile = {
  avatarUrl: string | null;
  bio: string | null;
  displayName: string;
  email: string | null;
  providers: string;
  reputationScore: number;
  userId: string;
  username: string | null;
};

type DashboardStats = {
  discussionCount: number;
  proposalCount: number;
  simulationCount: number;
  threadCount: number;
};

type DashboardRecentItem = {
  createdAt: string;
  kind: "proposal" | "simulation" | "thread";
  title: string;
};

type DashboardTab = "overview" | "achievements" | "activity" | "bookmarks" | "lists";

const DASHBOARD_TABS: Array<{ id: DashboardTab; label: string }> = [
  { id: "overview", label: "Overview" },
  { id: "achievements", label: "Achievements" },
  { id: "activity", label: "Activity" },
  { id: "bookmarks", label: "Bookmarks" },
  { id: "lists", label: "Lists" },
];

const FEATURED_JOURNEY_IDS = [
  "understand-modern-money",
  "fixing-democracy-and-governance",
  "build-a-wellbeing-economy",
];

const ALL_TRACK_SLUGS = LEARNING_TRACKS.flatMap((track) => track.moduleSlugs);

function getInitials(name: string) {
  const parts = name
    .split(/\s+/)
    .map((part) => part.trim())
    .filter(Boolean)
    .slice(0, 2);

  if (parts.length === 0) return "SL";

  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("");
}

function formatRelativeTime(timestamp: string | null) {
  if (!timestamp) return "Recently";

  const diffMs = Date.now() - new Date(timestamp).getTime();

  if (!Number.isFinite(diffMs) || diffMs < 0) return "Recently";

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diffMs < hour) {
    const mins = Math.max(1, Math.round(diffMs / minute));
    return `${mins} min ago`;
  }

  if (diffMs < day) {
    const hours = Math.max(1, Math.round(diffMs / hour));
    return `${hours} hr ago`;
  }

  const days = Math.max(1, Math.round(diffMs / day));
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

function StatTile({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) {
  return (
    <div className="space-y-1">
      <p className="text-[1.9rem] font-semibold leading-none text-slate-900 md:text-[2.2rem]">{value}</p>
      <p className="text-xs uppercase tracking-[0.16em] text-slate-500">{label}</p>
    </div>
  );
}

function PanelTitle({
  action,
  title,
}: {
  action?: React.ReactNode;
  title: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      {action}
    </div>
  );
}

export function MemberDashboardClient({
  profile,
  recentItems,
  schemaMessage,
  schemaReady,
  stats,
}: {
  profile: DashboardProfile;
  recentItems: DashboardRecentItem[];
  schemaMessage?: string;
  schemaReady: boolean;
  stats: DashboardStats;
}) {
  const [activeTab, setActiveTab] = useState<DashboardTab>("overview");
  const { getModule, getNextUnlocked, getTotalCompleted } = useProgress();
  const { voteCount } = useVotes();
  const { submissions } = useSubmissions();

  const totalCompleted = getTotalCompleted();
  const nextSlug = getNextUnlocked(ALL_TRACK_SLUGS);
  const nextModule = nextSlug ? getLearningModuleBySlug(nextSlug) : undefined;
  const nextTrack = nextSlug
    ? LEARNING_TRACKS.find((track) => track.moduleSlugs.includes(nextSlug))
    : undefined;

  const levelSummary = getLevelProgress(totalCompleted);
  const overallPct = learningModules.length === 0 ? 0 : Math.round((totalCompleted / learningModules.length) * 100);
  const levelIndex = LEVELS.findIndex((level) => level.id === levelSummary.level.id) + 1;

  const featuredJourneys = LEARNING_JOURNEYS.filter((journey) => FEATURED_JOURNEY_IDS.includes(journey.id));

  const journeyCards = useMemo(
    () =>
      featuredJourneys.map((journey) => {
        const completed = journey.moduleSlugs.filter((slug) => getModule(slug).quizPassed).length;
        const percent = Math.round((completed / journey.moduleSlugs.length) * 100);
        const nextJourneySlug =
          journey.moduleSlugs.find((slug, index) => {
            if (getModule(slug).quizPassed) return false;
            if (index === 0) return true;
            return getModule(journey.moduleSlugs[index - 1]).quizPassed;
          }) ?? journey.moduleSlugs[0];

        return {
          completed,
          href: `/learn/${nextJourneySlug}`,
          percent,
          title: journey.title.replace("Fixing ", "").replace("Build a ", ""),
          total: journey.moduleSlugs.length,
        };
      }),
    [featuredJourneys, getModule],
  );

  const completedModules = useMemo(
    () =>
      ALL_TRACK_SLUGS.map((slug) => {
        const progress = getModule(slug);
        const learningModule = getLearningModuleBySlug(slug);

        return {
          completedAt: progress.completedAt,
          quizPassed: progress.quizPassed,
          slug,
          title: learningModule?.title ?? slug,
        };
      })
        .filter((item) => item.quizPassed && item.completedAt)
        .sort((a, b) => new Date(b.completedAt ?? 0).getTime() - new Date(a.completedAt ?? 0).getTime()),
    [getModule],
  );

  const achievements = useMemo(
    () => [
      {
        achieved: totalCompleted >= 1,
        description: totalCompleted >= 1 ? "Completed your first module quiz" : "Pass your first module quiz",
        iconTone: "text-amber-500",
        id: "systems-explorer",
        title: "Systems Explorer",
      },
      {
        achieved: stats.discussionCount >= 1 || stats.threadCount >= 1,
        description:
          stats.discussionCount >= 1 || stats.threadCount >= 1
            ? "Joined the public conversation"
            : "Contribute to a discussion thread",
        iconTone: "text-emerald-500",
        id: "insight-sharer",
        title: "Insight Sharer",
      },
      {
        achieved: totalCompleted >= 2,
        description: totalCompleted >= 2 ? "Reached Systems Thinker level" : "Complete 2 module quizzes",
        iconTone: "text-sky-500",
        id: "critical-thinker",
        title: "Critical Thinker",
      },
      {
        achieved: voteCount + submissions.length + stats.proposalCount >= 1,
        description:
          voteCount + submissions.length + stats.proposalCount >= 1
            ? "Took part in collective governance"
            : "Vote on or draft your first proposal",
        iconTone: "text-violet-500",
        id: "civic-contributor",
        title: "Civic Contributor",
      },
    ],
    [stats.discussionCount, stats.proposalCount, stats.threadCount, submissions.length, totalCompleted, voteCount],
  );

  const recentAchievements = achievements.filter((achievement) => achievement.achieved).slice(0, 3);
  const visibleAchievements = recentAchievements.length > 0 ? recentAchievements : achievements.slice(0, 3);

  const activityItems = useMemo(() => {
    const items: Array<{ label: string; time: string; tone: string }> = [];

    for (const item of completedModules.slice(0, 2)) {
      items.push({
        label: `Completed module: ${item.title}`,
        time: formatRelativeTime(item.completedAt),
        tone: "text-emerald-600",
      });
    }

    for (const item of recentItems.slice(0, 3)) {
      const prefix =
        item.kind === "thread"
          ? "Started discussion"
          : item.kind === "proposal"
            ? "Created proposal"
            : "Saved simulation";

      items.push({
        label: `${prefix}: ${item.title}`,
        time: formatRelativeTime(item.createdAt),
        tone: item.kind === "proposal" ? "text-violet-600" : item.kind === "simulation" ? "text-sky-600" : "text-emerald-600",
      });
    }

    return items.slice(0, 4);
  }, [completedModules, recentItems]);

  return (
    <AtlasPage className="space-y-8 md:space-y-10">
      {!schemaReady ? (
        <SoftPanel className="border-amber-200/80 bg-amber-50/90 text-amber-900" tone="gold">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">Setup note</p>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-amber-900/85">{schemaMessage}</p>
        </SoftPanel>
      ) : null}

      <SoftPanel className="overflow-hidden bg-[linear-gradient(115deg,rgba(236,248,239,0.92),rgba(255,255,255,0.96)_42%,rgba(242,249,255,0.92))] px-5 py-6 sm:px-7 sm:py-7">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(20rem,0.9fr)] lg:items-start">
          <div className="flex items-start gap-4 sm:gap-5">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-[1.7rem] border border-white/80 bg-[linear-gradient(145deg,#c5eadc,#9fd0ee)] shadow-[0_18px_40px_rgba(28,36,48,0.08)] sm:h-24 sm:w-24">
              {profile.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img alt={profile.displayName} className="h-full w-full object-cover" src={profile.avatarUrl} />
              ) : (
                <span className="atlas-display text-3xl text-slate-900">{getInitials(profile.displayName)}</span>
              )}
            </div>

            <div className="min-w-0 flex-1 space-y-4">
              <div className="space-y-2">
                <h1 className="atlas-display text-[2.1rem] leading-[1.05] text-slate-900 sm:text-[2.5rem]">
                  Welcome back, {profile.displayName}
                  <span className="ml-2 inline-block text-xl text-emerald-500">✦</span>
                </h1>
                <p className="max-w-2xl text-sm leading-7 text-slate-600 sm:text-[15px]">
                  Keep learning. Keep building the future. Your dashboard now reflects your progress across the atlas, the labs,
                  and the conversations you are helping shape.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Button asChild variant="outline">
                  <a href="#profile-details">Edit profile</a>
                </Button>
                <form action={signOutAction}>
                  <Button size="sm" variant="ghost">Sign out</Button>
                </form>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <StatTile label="Modules completed" value={totalCompleted} />
              <StatTile label="Simulations saved" value={stats.simulationCount} />
              <StatTile label="Discussion contributions" value={stats.discussionCount} />
              <StatTile label="Proposals voted" value={voteCount} />
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Learning progress</p>
                  <p className="text-sm font-medium text-slate-700">
                    Level {levelIndex} · {levelSummary.level.label}
                  </p>
                </div>
                <p className="text-sm font-semibold text-slate-700">{overallPct}%</p>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-white/80">
                <div
                  className="h-full rounded-full bg-[linear-gradient(90deg,#1fb7a6,#51c2b2,#3B82F6)] transition-all duration-700"
                  style={{ width: `${overallPct}%` }}
                />
              </div>
              <p className="text-xs text-slate-500">
                {levelSummary.remaining === 0
                  ? "You have reached the highest current learning level."
                  : `${levelSummary.remaining} more passed quizzes until the next level.`}
              </p>
            </div>
          </div>
        </div>
      </SoftPanel>

      <div className="border-b border-[rgba(28,36,48,0.1)]">
        <div className="flex flex-wrap gap-5 sm:gap-7">
          {DASHBOARD_TABS.map((tab) => {
            const isActive = tab.id === activeTab;

            return (
              <button
                className={cn(
                  "border-b-2 pb-3 text-sm font-medium transition-colors",
                  isActive
                    ? "border-primary text-primary"
                    : "border-transparent text-slate-500 hover:text-slate-800",
                )}
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                type="button"
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {activeTab === "overview" ? (
        <>
          <section className="grid gap-5 lg:grid-cols-3">
            <SoftPanel className="space-y-6 bg-white/92">
              <PanelTitle title="Continue learning" />
              {nextModule ? (
                <>
                  <div className="space-y-2">
                    <Link className="text-base font-semibold text-slate-900 hover:text-primary" href={`/learn/${nextModule.slug}`}>
                      {nextModule.title}
                    </Link>
                    <p className="text-sm text-slate-500">
                      {nextTrack ? `Next in ${nextTrack.title}` : "Recommended next module"}
                    </p>
                  </div>

                  <Button asChild>
                    <Link href={`/learn/${nextModule.slug}`}>Continue</Link>
                  </Button>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>{overallPct}% complete</span>
                      <span>{totalCompleted}/{learningModules.length} modules</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-slate-200">
                      <div className="h-full rounded-full bg-[linear-gradient(90deg,#27c2a6,#3B82F6)]" style={{ width: `${overallPct}%` }} />
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm leading-7 text-slate-600">
                    You have completed every unlocked module. Browse the journeys again or step into a simulator to test what you learned.
                  </p>
                  <Button asChild>
                    <Link href="/learn">Browse journeys</Link>
                  </Button>
                </div>
              )}
            </SoftPanel>

            <SoftPanel className="space-y-5 bg-white/92">
              <PanelTitle
                action={
                  <button
                    className="inline-flex items-center gap-1 text-sm font-medium text-primary"
                    onClick={() => setActiveTab("achievements")}
                    type="button"
                  >
                    View all achievements
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                }
                title="Recent achievements"
              />
              <div className="space-y-4">
                {visibleAchievements.map((achievement) => (
                  <div className="flex items-start gap-3" key={achievement.id}>
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50">
                      <Trophy className={cn("h-5 w-5", achievement.iconTone)} />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{achievement.title}</p>
                      <p className="text-sm leading-6 text-slate-500">{achievement.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </SoftPanel>

            <SoftPanel className="space-y-5 bg-white/92">
              <PanelTitle
                action={
                  <button
                    className="inline-flex items-center gap-1 text-sm font-medium text-primary"
                    onClick={() => setActiveTab("activity")}
                    type="button"
                  >
                    View all activity
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                }
                title="Your activity"
              />
              <div className="space-y-4">
                {activityItems.length > 0 ? (
                  activityItems.map((item, index) => (
                    <div className="flex items-start justify-between gap-3" key={`${item.label}-${index}`}>
                      <div className="flex min-w-0 items-start gap-3">
                        <span className={cn("mt-1 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-current/20", item.tone)}>
                          <span className={cn("h-1.5 w-1.5 rounded-full bg-current", item.tone)} />
                        </span>
                        <p className="text-sm leading-6 text-slate-700">{item.label}</p>
                      </div>
                      <span className="shrink-0 text-xs text-slate-400">{item.time}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm leading-7 text-slate-600">
                    Your activity log will fill up as you complete modules, join discussions, save simulations, and draft proposals.
                  </p>
                )}
              </div>
            </SoftPanel>
          </section>

          <section className="space-y-4">
            <PanelTitle title="Your paths" />
            <div className="grid gap-5 md:grid-cols-3">
              {journeyCards.map((journey) => (
                <SoftPanel className="space-y-5 bg-white/92" key={journey.title}>
                  <div className="space-y-2">
                    <p className="font-semibold text-slate-900">{journey.title}</p>
                    <p className="text-sm text-slate-500">
                      {journey.completed} of {journey.total} completed
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm text-slate-600">
                      <span>{journey.percent}%</span>
                      <span>{journey.total} modules</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-slate-200">
                      <div className="h-full rounded-full bg-[linear-gradient(90deg,#27c2a6,#5fd2c0)]" style={{ width: `${journey.percent}%` }} />
                    </div>
                  </div>
                  <Link className="inline-flex items-center gap-2 text-sm font-medium text-primary" href={journey.href}>
                    Continue
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </SoftPanel>
              ))}
            </div>
          </section>

          <SoftPanel className="bg-white/92" id="profile-details">
            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(15rem,0.85fr)]">
              <div className="space-y-4">
                <PanelTitle title="Profile details" />
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Email</p>
                    <p className="mt-2 text-sm font-medium text-slate-900">{profile.email ?? "Not available"}</p>
                  </div>
                  <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Providers</p>
                    <p className="mt-2 text-sm font-medium capitalize text-slate-900">{profile.providers}</p>
                  </div>
                  <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Username</p>
                    <p className="mt-2 text-sm font-medium text-slate-900">{profile.username ?? "Not set yet"}</p>
                  </div>
                  <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Reputation</p>
                    <p className="mt-2 text-sm font-medium text-slate-900">{profile.reputationScore}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-[1.8rem] border border-[rgba(28,36,48,0.1)] bg-[linear-gradient(180deg,rgba(244,250,246,0.9),rgba(255,255,255,0.9))] p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(28,36,48,0.12)] bg-white text-slate-700">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <div className="space-y-2">
                    <p className="font-semibold text-slate-900">Account foundation is live</p>
                    <p className="text-sm leading-7 text-slate-600">
                      Your protected account is already connected to learning progress, discussions, simulations, and governance signals. Profile editing,
                      bookmarks, and lists can now grow from this member surface.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </SoftPanel>
        </>
      ) : null}

      {activeTab === "achievements" ? (
        <section className="grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(19rem,0.85fr)]">
          <SoftPanel className="space-y-5 bg-white/92">
            <PanelTitle title="Achievement board" />
            <div className="grid gap-4 sm:grid-cols-2">
              {achievements.map((achievement) => (
                <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-4" key={achievement.id}>
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white">
                      <Trophy className={cn("h-5 w-5", achievement.iconTone)} />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{achievement.title}</p>
                      <p className="mt-1 text-sm leading-6 text-slate-500">{achievement.description}</p>
                      <p className={cn("mt-2 text-xs font-semibold uppercase tracking-[0.16em]", achievement.achieved ? "text-emerald-600" : "text-slate-400")}>
                        {achievement.achieved ? "Unlocked" : "In progress"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SoftPanel>

          <SoftPanel className="space-y-5 bg-white/92">
            <PanelTitle title="Level ladder" />
            <div className="space-y-4">
              {LEVELS.map((level, index) => {
                const reached = totalCompleted >= level.minPassed;

                return (
                  <div className="flex gap-3" key={level.id}>
                    <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border", reached ? "border-emerald-200 bg-emerald-50" : "border-slate-200 bg-slate-50")}>
                      <span className="text-lg">{level.emoji}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">
                        Level {index + 1} · {level.label}
                      </p>
                      <p className="text-sm leading-6 text-slate-500">{level.tagline}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-400">
                        Unlocks at {level.minPassed} passed quiz{level.minPassed === 1 ? "" : "zes"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </SoftPanel>
        </section>
      ) : null}

      {activeTab === "activity" ? (
        <section className="grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(19rem,0.85fr)]">
          <SoftPanel className="space-y-5 bg-white/92">
            <PanelTitle title="Activity timeline" />
            <div className="space-y-4">
              {activityItems.length > 0 ? (
                activityItems.map((item, index) => (
                  <div className="flex items-start gap-4 rounded-[1.5rem] border border-slate-200 bg-slate-50/70 p-4" key={`${item.label}-${index}`}>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700">
                      <Clock3 className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium leading-6 text-slate-800">{item.label}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-400">{item.time}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm leading-7 text-slate-600">
                  Once you start completing modules and contributing to the platform, your activity timeline will appear here.
                </p>
              )}
            </div>
          </SoftPanel>

          <SoftPanel className="space-y-4 bg-white/92">
            <PanelTitle title="Quick links" />
            <Link className="flex items-center justify-between rounded-[1.5rem] border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm font-medium text-slate-800 hover:bg-slate-100" href="/learn">
              Continue a learning journey
              <ArrowRight className="h-4 w-4 text-slate-400" />
            </Link>
            <Link className="flex items-center justify-between rounded-[1.5rem] border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm font-medium text-slate-800 hover:bg-slate-100" href="/simulator">
              Open a simulator lab
              <ArrowRight className="h-4 w-4 text-slate-400" />
            </Link>
            <Link className="flex items-center justify-between rounded-[1.5rem] border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm font-medium text-slate-800 hover:bg-slate-100" href="/discussions">
              Join a discussion
              <ArrowRight className="h-4 w-4 text-slate-400" />
            </Link>
            <Link className="flex items-center justify-between rounded-[1.5rem] border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm font-medium text-slate-800 hover:bg-slate-100" href="/governance">
              Explore governance proposals
              <ArrowRight className="h-4 w-4 text-slate-400" />
            </Link>
          </SoftPanel>
        </section>
      ) : null}

      {activeTab === "bookmarks" ? (
        <SoftPanel className="bg-white/92">
          <div className="mx-auto max-w-2xl space-y-4 py-6 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-600">
              <Bookmark className="h-6 w-6" />
            </div>
            <h2 className="atlas-display text-3xl text-slate-900">Bookmarks are the next layer</h2>
            <p className="text-sm leading-7 text-slate-600">
              This space is reserved for saved modules, studies, discussions, and proposals. For now, the best way to keep a learning trail is to continue from your paths and recent activity.
            </p>
            <Button asChild>
              <Link href="/study">Browse the Study Library</Link>
            </Button>
          </div>
        </SoftPanel>
      ) : null}

      {activeTab === "lists" ? (
        <SoftPanel className="bg-white/92">
          <div className="mx-auto max-w-2xl space-y-4 py-6 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-600">
              <ListChecks className="h-6 w-6" />
            </div>
            <h2 className="atlas-display text-3xl text-slate-900">Curated lists can grow from here</h2>
            <p className="text-sm leading-7 text-slate-600">
              The dashboard already knows your paths, progress, and governance activity. The next step is turning that into personal lists: saved modules, reading queues, proposal bundles, and simulation comparisons.
            </p>
            <Button asChild variant="outline">
              <Link href="/learn">Return to Learn</Link>
            </Button>
          </div>
        </SoftPanel>
      ) : null}
    </AtlasPage>
  );
}

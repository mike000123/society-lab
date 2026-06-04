"use client";

import { useEffect, useMemo, useState, type ElementType } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Banknote,
  BookOpenText,
  Brain,
  Building2,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ClipboardCheck,
  Clock3,
  Landmark,
  Leaf,
  LibraryBig,
  Lock,
  Play,
  ScrollText,
  Search,
  Sparkles,
  Zap,
} from "lucide-react";

import { AtlasPage } from "@/components/atlas/AtlasPage";
import { IllustratedTabHero } from "@/components/atlas/IllustratedTabHero";
import { InsightBlock } from "@/components/atlas/InsightBlock";
import { SoftPanel } from "@/components/atlas/SoftPanel";
import { DevModeToggle } from "@/components/learn/DevModeToggle";
import { ProgressBanner } from "@/components/learn/ProgressBanner";
import { foundationalReferences, learningModules, type AccentTone, type LearningModule } from "@/lib/learn/modules";
import { LEARNING_JOURNEYS, type LearningJourney } from "@/lib/learn/journeys";
import { useProgress } from "@/lib/progress/store";
import { getQuizBySlug } from "@/lib/quiz/questions";
import { LEARNING_TRACKS, type LearningTrack } from "@/lib/tracks/config";
import { cn } from "@/lib/utils";

type LearnView = "journeys" | "tracks" | "modules";

const TRACK_ICONS: Record<string, ElementType> = {
  Banknote,
  Brain,
  Building2,
  Landmark,
  Leaf,
  ScrollText,
};

const ACCENT_BADGE: Record<AccentTone, string> = {
  amber: "border-amber-300 bg-amber-50 text-amber-700",
  cyan: "border-cyan-300 bg-cyan-50 text-cyan-700",
  emerald: "border-emerald-300 bg-emerald-50 text-emerald-700",
  rose: "border-rose-300 bg-rose-50 text-rose-700",
};

const ACCENT_DOT: Record<AccentTone, string> = {
  amber: "border-amber-300 bg-amber-100 text-amber-700",
  cyan: "border-cyan-300 bg-cyan-100 text-cyan-700",
  emerald: "border-emerald-300 bg-emerald-100 text-emerald-700",
  rose: "border-rose-300 bg-rose-100 text-rose-700",
};

const ACCENT_ICON: Record<AccentTone, string> = {
  amber: "border-amber-200 bg-amber-50 text-amber-600",
  cyan: "border-cyan-200 bg-cyan-50 text-cyan-600",
  emerald: "border-emerald-200 bg-emerald-50 text-emerald-600",
  rose: "border-rose-200 bg-rose-50 text-rose-600",
};

const ACCENT_BAR: Record<AccentTone, string> = {
  amber: "bg-amber-500",
  cyan: "bg-cyan-500",
  emerald: "bg-emerald-500",
  rose: "bg-rose-500",
};

const VIEW_OPTIONS: { id: LearnView; label: string }[] = [
  { id: "journeys", label: "Journeys" },
  { id: "tracks", label: "Tracks" },
  { id: "modules", label: "All Modules" },
];

const TRACK_RELATED_LABS: Record<string, { href: string; label: string }> = {
  "cities-and-everyday-life": { href: "/simulator/purchasing-power", label: "Open city and income lab" },
  "ecology-and-limits": { href: "/simulator/world3", label: "Open World3" },
  "financial-history": { href: "/simulator/financial-crisis", label: "Open crisis lab" },
  "information-and-attention": { href: "/simulator/social-movements", label: "Open movement lab" },
  "money-and-wealth": { href: "/simulator/macro-economy", label: "Open macro economy lab" },
  "power-and-politics": { href: "/simulator/political-talent", label: "Open governance lab" },
};

const ALL_SLUGS = LEARNING_TRACKS.flatMap((track) => track.moduleSlugs);

function ModulePathItem({
  module,
  index,
  quizScore,
  quizPassed,
  showLine,
  showTrack,
  track,
  unlocked,
}: {
  module: LearningModule;
  index: number;
  quizScore: number | null;
  quizPassed: boolean;
  showLine: boolean;
  showTrack?: boolean;
  track: LearningTrack;
  unlocked: boolean;
}) {
  const hasQuiz = Boolean(getQuizBySlug(module.slug));
  const hasSimulator = Boolean(module.simulatorSlug);
  const moduleHref = `/learn/${module.slug}`;

  return (
    <div className="relative pl-14">
      {showLine ? <div className="absolute bottom-[-1.25rem] left-[1.15rem] top-12 w-px bg-[rgba(28,36,48,0.12)]" /> : null}
      <div
        className={cn(
          "absolute left-0 top-1 flex h-9 w-9 items-center justify-center rounded-full border text-xs font-semibold",
          unlocked ? ACCENT_DOT[track.accent] : "border-slate-200 bg-slate-100 text-slate-400",
        )}
      >
        {index + 1}
      </div>

      <div
        className={cn(
          "rounded-[1.6rem] border px-5 py-4 transition-colors",
          unlocked ? "border-[rgba(28,36,48,0.08)] bg-white/76" : "border-slate-200 bg-slate-50/90 opacity-70",
        )}
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className={cn("rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em]", ACCENT_BADGE[track.accent])}>
                {module.eyebrow}
              </span>
              {showTrack ? (
                <span className="rounded-full border border-[rgba(28,36,48,0.08)] bg-white/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                  {track.title}
                </span>
              ) : null}
            </div>
            <h3 className={cn("atlas-display text-[1.9rem] leading-tight", unlocked ? "text-slate-900" : "text-slate-500")}>
              {unlocked ? (
                <Link
                  className="transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-[0.35rem]"
                  href={moduleHref}
                >
                  {module.title}
                </Link>
              ) : (
                module.title
              )}
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {quizPassed ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-300 bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700">
                <CheckCircle2 className="h-3.5 w-3.5" />
                {quizScore ?? 100}% passed
              </span>
            ) : !unlocked ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-500">
                <Lock className="h-3.5 w-3.5" />
                Locked
              </span>
            ) : null}
          </div>
        </div>

        {unlocked ? (
          <Link
            className="mt-3 block rounded-[1rem] transition-colors hover:bg-[rgba(59,130,246,0.04)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            href={moduleHref}
          >
            <p className="atlas-copy text-sm leading-7">{module.summary}</p>
          </Link>
        ) : (
          <p className="atlas-copy mt-3 text-sm leading-7">{module.summary}</p>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] font-medium text-slate-500">
          <span className="inline-flex items-center gap-1 rounded-full border border-[rgba(28,36,48,0.08)] bg-white/80 px-2.5 py-1">
            <Clock3 className="h-3 w-3" />
            {module.readingTime}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-[rgba(28,36,48,0.08)] bg-white/80 px-2.5 py-1">
            <BookOpenText className="h-3 w-3" />
            {module.difficulty}
          </span>
          {hasQuiz ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-violet-200 bg-violet-50 px-2.5 py-1 text-violet-700">
              <ClipboardCheck className="h-3 w-3" />
              Quiz
            </span>
          ) : null}
          {hasSimulator ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-amber-700">
              <Zap className="h-3 w-3" />
              Simulator
            </span>
          ) : null}
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          {unlocked ? (
            <Link
              className="inline-flex items-center gap-2 rounded-full border border-[rgba(59,130,246,0.22)] bg-[rgba(59,130,246,0.10)] px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-[rgba(59,130,246,0.16)] hover:text-blue-700"
              href={moduleHref}
            >
              Read module
              <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-500">
              Complete the previous quiz to unlock
            </span>
          )}

          {unlocked && module.simulatorSlug ? (
            <Link
              className="inline-flex items-center gap-2 rounded-full border border-[rgba(28,36,48,0.12)] bg-white/85 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-[rgba(28,36,48,0.22)] hover:text-slate-900"
              href={`/simulator/${module.simulatorSlug}`}
            >
              Open simulator
              <Play className="h-4 w-4" />
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function JourneyCard({
  completed,
  isSelected,
  journey,
  onPreview,
  startHref,
}: {
  completed: number;
  isSelected: boolean;
  journey: LearningJourney;
  onPreview: () => void;
  startHref: string;
}) {
  return (
    <div
      className={cn(
        "flex h-full flex-col justify-between rounded-[1.5rem] border bg-white px-4 py-4 text-left transition-all",
        isSelected
          ? "border-primary shadow-[0_16px_36px_rgba(59,130,246,0.10)]"
          : "border-[rgba(28,36,48,0.08)] hover:border-[rgba(28,36,48,0.16)] hover:shadow-[0_16px_30px_rgba(28,36,48,0.06)]",
      )}
    >
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-[rgba(28,36,48,0.08)] bg-[rgba(246,244,238,0.8)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
            {journey.moduleSlugs.length} modules
          </span>
          <span className="rounded-full border border-[rgba(28,36,48,0.08)] bg-[rgba(246,244,238,0.8)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
            {journey.duration}
          </span>
        </div>
        <div className="space-y-2">
          <h3 className="atlas-display text-[1.55rem] leading-tight text-slate-900">{journey.title}</h3>
          <p className="text-sm font-medium text-slate-600">{journey.tagline}</p>
          <p className="atlas-copy text-sm">{journey.summary}</p>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-4">
        <span className="text-xs font-medium text-slate-500">{completed}/{journey.moduleSlugs.length} complete</span>
        <div className="flex items-center gap-2">
          <button
            className="inline-flex items-center gap-2 rounded-full border border-[rgba(28,36,48,0.12)] bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition hover:border-[rgba(28,36,48,0.22)] hover:text-slate-900"
            onClick={onPreview}
            type="button"
          >
            Preview
          </button>
          <Link
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-slate-700"
            href={startHref}
          >
            Start
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function TrackTile({
  isSelected,
  onSelect,
  track,
}: {
  isSelected: boolean;
  onSelect: () => void;
  track: LearningTrack;
}) {
  const Icon = TRACK_ICONS[track.icon] ?? Sparkles;

  return (
    <button
      className={cn(
        "rounded-[1.35rem] border bg-white px-4 py-4 text-left transition-all",
        isSelected
          ? "border-primary shadow-[0_16px_34px_rgba(59,130,246,0.10)]"
          : "border-[rgba(28,36,48,0.08)] hover:border-[rgba(28,36,48,0.16)] hover:shadow-[0_16px_30px_rgba(28,36,48,0.05)]",
      )}
      onClick={onSelect}
      type="button"
    >
      <div className={cn("flex h-11 w-11 items-center justify-center rounded-full border", ACCENT_ICON[track.accent])}>
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-4 text-sm font-semibold text-slate-900">{track.title}</h3>
      <p className="mt-1 text-xs text-slate-500">{track.moduleSlugs.length} modules</p>
    </button>
  );
}

export default function LearnPage() {
  const [activeView, setActiveView] = useState<LearnView>("journeys");
  const [refsOpen, setRefsOpen] = useState(false);
  const [selectedJourneyId, setSelectedJourneyId] = useState(LEARNING_JOURNEYS[0]?.id ?? "");
  const [selectedTrackId, setSelectedTrackId] = useState(LEARNING_TRACKS[0]?.id ?? "");
  const [moduleQuery, setModuleQuery] = useState("");
  const [moduleTrackFilter, setModuleTrackFilter] = useState("all");
  const [expandedTrackIds, setExpandedTrackIds] = useState<string[]>([]);

  const { getModule, getNextUnlocked, isUnlocked, trackProgress } = useProgress();

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const requestedView = new URLSearchParams(window.location.search).get("view");
    if (requestedView === "tracks" || requestedView === "modules" || requestedView === "journeys") {
      setActiveView(requestedView);
    }
  }, []);

  const moduleLookup = useMemo(
    () =>
      Object.fromEntries(
        learningModules.map((module) => [module.slug, module]),
      ) as Record<string, LearningModule>,
    [],
  );

  const trackLookup = useMemo(
    () =>
      Object.fromEntries(
        LEARNING_TRACKS.map((track) => [track.id, track]),
      ) as Record<string, LearningTrack>,
    [],
  );

  const trackBySlug = useMemo(
    () =>
      Object.fromEntries(
        LEARNING_TRACKS.flatMap((track) => track.moduleSlugs.map((slug) => [slug, track])),
      ) as Record<string, LearningTrack>,
    [],
  );

  const selectedJourney = LEARNING_JOURNEYS.find((journey) => journey.id === selectedJourneyId) ?? LEARNING_JOURNEYS[0];
  const selectedTrack = LEARNING_TRACKS.find((track) => track.id === selectedTrackId) ?? LEARNING_TRACKS[0];
  const nextGlobalSlug = getNextUnlocked(ALL_SLUGS) ?? "why-gdp-is-not-the-same-as-wellbeing";

  const selectedJourneyModules = selectedJourney.moduleSlugs
    .map((slug) => moduleLookup[slug])
    .filter(Boolean);

  const selectedJourneyStats = selectedJourney.moduleSlugs.reduce(
    (acc, slug) => {
      if (getModule(slug).quizPassed) {
        acc.completed += 1;
      }
      return acc;
    },
    { completed: 0, total: selectedJourney.moduleSlugs.length },
  );

  const selectedJourneyNextSlug =
    selectedJourney.moduleSlugs.find((slug) => {
      const progress = getModule(slug);
      const track = trackBySlug[slug];
      return !progress.quizPassed && track ? isUnlocked(slug, track.moduleSlugs) : false;
    }) ?? selectedJourney.moduleSlugs[0];

  const selectedTrackModules = selectedTrack.moduleSlugs
    .map((slug) => moduleLookup[slug])
    .filter(Boolean);

  const selectedTrackProgress = trackProgress(selectedTrack.moduleSlugs);
  const selectedTrackPct =
    selectedTrackProgress.total === 0
      ? 0
      : Math.round((selectedTrackProgress.completed / selectedTrackProgress.total) * 100);

  const selectedTrackNextSlug =
    selectedTrack.moduleSlugs.find((slug) => {
      const progress = getModule(slug);
      return !progress.quizPassed && isUnlocked(slug, selectedTrack.moduleSlugs);
    }) ?? selectedTrack.moduleSlugs[0];

  const filteredTrackGroups = LEARNING_TRACKS.map((track) => {
    const filteredSlugs = track.moduleSlugs.filter((slug) => {
      if (moduleTrackFilter !== "all" && track.id !== moduleTrackFilter) {
        return false;
      }

      if (!moduleQuery.trim()) {
        return true;
      }

      const lesson = moduleLookup[slug];
      const haystack = `${lesson.title} ${lesson.summary} ${lesson.eyebrow} ${track.title} ${track.tagline}`.toLowerCase();
      return haystack.includes(moduleQuery.trim().toLowerCase());
    });

    return { track, slugs: filteredSlugs };
  }).filter((group) => group.slugs.length > 0);

  const toggleTrackExpansion = (trackId: string) => {
    setExpandedTrackIds((current) =>
      current.includes(trackId) ? current.filter((id) => id !== trackId) : [...current, trackId],
    );
  };

  const relatedTrackLab = TRACK_RELATED_LABS[selectedTrack.id] ?? { href: "/simulator", label: "Open related lab" };

  return (
    <AtlasPage className="space-y-8 pb-14">
      <header className="space-y-3">
        <h1 className="atlas-display text-[3.6rem] leading-[0.94] text-slate-900 sm:text-[4.3rem]">Learn</h1>
        <p className="atlas-copy max-w-2xl text-base text-slate-600">Understand the systems that shape our world.</p>
      </header>

      <div className="flex flex-wrap items-center gap-5 border-b border-[rgba(28,36,48,0.08)] pb-3">
        {VIEW_OPTIONS.map((option) => (
          <button
            className={cn(
              "border-b-2 pb-2 text-sm font-medium transition-colors",
              activeView === option.id
                ? "border-primary text-primary"
                : "border-transparent text-slate-500 hover:text-slate-900",
            )}
            key={option.id}
            onClick={() => setActiveView(option.id)}
            type="button"
          >
            {option.label}
          </button>
        ))}

        <div className="ml-auto hidden items-center gap-4 lg:flex">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
            {LEARNING_JOURNEYS.length} journeys · {LEARNING_TRACKS.length} tracks · {learningModules.length} modules
          </p>
          <DevModeToggle editorial />
        </div>
      </div>

      {activeView === "journeys" ? (
        <>
          <IllustratedTabHero
            actions={
              <>
                <Link
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(59,130,246,0.18)] transition hover:bg-blue-500"
                  href={`/learn/${selectedJourneyNextSlug}`}
                >
                  {selectedJourneyStats.completed > 0 ? "Continue journey" : "Start journey"}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                {selectedJourney.simulatorHref ? (
                  <Link
                    className="inline-flex items-center gap-2 rounded-full border border-[rgba(28,36,48,0.12)] bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-[rgba(28,36,48,0.22)] hover:text-slate-900"
                    href={selectedJourney.simulatorHref}
                  >
                    {selectedJourney.simulatorLabel ?? "Open related lab"}
                    <Play className="h-4 w-4" />
                  </Link>
                ) : null}
                <Link
                  className="inline-flex items-center gap-2 rounded-full border border-[rgba(28,36,48,0.12)] bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-[rgba(28,36,48,0.22)] hover:text-slate-900"
                  href="/study"
                >
                  Open study library
                  <LibraryBig className="h-4 w-4" />
                </Link>
              </>
            }
            description="Follow a route that already connects the ideas for you. The goal is not to collect isolated modules. It is to build one mental model you can actually use."
            eyebrow="Selected journey"
            imageAlt="Travelers walking through a mountainous landscape toward a shared horizon."
            imageClassName="object-cover object-center"
            imageSrc="/atlas/learn-hero.png"
            title="Systemic understanding. Practical wisdom. Collective progress."
          >
            <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_21rem]">
              <div className="rounded-[1.6rem] border border-[rgba(28,36,48,0.08)] bg-white/90 px-5 py-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-[rgba(28,36,48,0.08)] bg-[rgba(246,244,238,0.88)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                    {selectedJourney.duration}
                  </span>
                  <span className="rounded-full border border-[rgba(28,36,48,0.08)] bg-[rgba(246,244,238,0.88)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                    {selectedJourneyStats.completed}/{selectedJourneyStats.total} complete
                  </span>
                </div>
                <h2 className="atlas-display mt-4 text-[2.2rem] leading-tight text-slate-900">{selectedJourney.title}</h2>
                <p className="mt-2 text-sm font-medium text-slate-600">{selectedJourney.tagline}</p>
                <p className="atlas-copy mt-3 text-sm">{selectedJourney.summary}</p>

                <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  {selectedJourneyModules.map((module, index) => (
                    <div className="rounded-[1.2rem] border border-[rgba(28,36,48,0.08)] bg-[rgba(246,244,238,0.7)] px-3 py-3" key={module.slug}>
                      <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">Step {index + 1}</span>
                      <p className="mt-2 text-sm font-semibold leading-6 text-slate-900">{module.title}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[1.6rem] border border-[rgba(28,36,48,0.08)] bg-white/90 px-5 py-5">
                <p className="atlas-kicker">What you leave with</p>
                <p className="mt-3 text-sm leading-7 text-slate-600">{selectedJourney.outcome}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {selectedJourney.relatedTrackIds.map((trackId) => (
                    <span
                      className="rounded-full border border-[rgba(28,36,48,0.08)] bg-[rgba(246,244,238,0.88)] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500"
                      key={trackId}
                    >
                      {trackLookup[trackId]?.title}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </IllustratedTabHero>

          <ProgressBanner editorial />

          <section className="space-y-4">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="atlas-display text-[2.2rem] leading-tight text-slate-900">Recommended Journeys</h2>
                <p className="mt-2 text-sm text-slate-600">Start with one strong path instead of trying to decode the whole atlas at once.</p>
              </div>
              <button
                className="text-sm font-semibold text-primary transition hover:text-blue-700"
                onClick={() => setActiveView("tracks")}
                type="button"
              >
                Explore by track →
              </button>
            </div>

            <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
              {LEARNING_JOURNEYS.map((journey) => {
                const completed = journey.moduleSlugs.filter((slug) => getModule(slug).quizPassed).length;
                const primarySlug =
                  journey.moduleSlugs.find((slug) => {
                    const track = trackBySlug[slug];
                    return track && !getModule(slug).quizPassed && isUnlocked(slug, track.moduleSlugs);
                  }) ?? journey.moduleSlugs[0];

                return (
                  <JourneyCard
                    completed={completed}
                    isSelected={selectedJourney.id === journey.id}
                    journey={journey}
                    key={journey.id}
                    onPreview={() => setSelectedJourneyId(journey.id)}
                    startHref={`/learn/${primarySlug}`}
                  />
                );
              })}
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="atlas-display text-[2.2rem] leading-tight text-slate-900">Explore by Track</h2>
                <p className="mt-2 text-sm text-slate-600">Open one region of the atlas at a time, then follow its route module by module.</p>
              </div>
              <button
                className="text-sm font-semibold text-primary transition hover:text-blue-700"
                onClick={() => setActiveView("modules")}
                type="button"
              >
                Open full library →
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
              {LEARNING_TRACKS.map((track) => (
                <TrackTile
                  isSelected={selectedTrack.id === track.id}
                  key={track.id}
                  onSelect={() => {
                    setSelectedTrackId(track.id);
                    setActiveView("tracks");
                  }}
                  track={track}
                />
              ))}
            </div>
          </section>

          <div className="grid gap-5 xl:grid-cols-2">
            <SoftPanel tone="green">
              <p className="atlas-kicker">Featured simulator</p>
              <h3 className="atlas-display mt-2 text-3xl leading-tight text-slate-900">World3 is the big systems bridge.</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Once the concepts click, World3 is where the whole picture becomes testable: population, production,
                pollution, resources, and wellbeing in one long-run model.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(59,130,246,0.18)] transition hover:bg-blue-500"
                  href="/simulator/world3"
                >
                  Open World3
                  <Play className="h-4 w-4" />
                </Link>
                <Link
                  className="inline-flex items-center gap-2 rounded-full border border-[rgba(28,36,48,0.12)] bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-[rgba(28,36,48,0.22)] hover:text-slate-900"
                  href="/simulator"
                >
                  Browse simulators
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </SoftPanel>

            <SoftPanel>
              <p className="atlas-kicker">Keep going</p>
              <h3 className="atlas-display mt-2 text-3xl leading-tight text-slate-900">Use the study library when you want depth.</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                The library extends the same atlas themes with books, papers, data projects, and public resources, so
                the next step feels connected instead of random.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  className="inline-flex items-center gap-2 rounded-full border border-[rgba(28,36,48,0.12)] bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-[rgba(28,36,48,0.22)] hover:text-slate-900"
                  href="/study"
                >
                  Open study library
                  <LibraryBig className="h-4 w-4" />
                </Link>
                <Link
                  className="inline-flex items-center gap-2 rounded-full border border-[rgba(28,36,48,0.12)] bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-[rgba(28,36,48,0.22)] hover:text-slate-900"
                  href={`/learn/${nextGlobalSlug}`}
                >
                  Continue learning
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </SoftPanel>
          </div>
        </>
      ) : null}

      {activeView === "tracks" ? (
        <>
          <IllustratedTabHero
            actions={
              <>
                <Link
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(59,130,246,0.18)] transition hover:bg-blue-500"
                  href={`/learn/${selectedTrackNextSlug}`}
                >
                  Open next module
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  className="inline-flex items-center gap-2 rounded-full border border-[rgba(28,36,48,0.12)] bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-[rgba(28,36,48,0.22)] hover:text-slate-900"
                  href={relatedTrackLab.href}
                >
                  {relatedTrackLab.label}
                  <Play className="h-4 w-4" />
                </Link>
              </>
            }
            description={selectedTrack.description}
            eyebrow="Selected track"
            imageAlt="Travelers walking through a mountainous landscape toward a shared horizon."
            imageClassName="object-cover object-center"
            imageSrc="/atlas/learn-hero.png"
            title={selectedTrack.title}
          >
            <div className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_18rem]">
              <div className="rounded-[1.6rem] border border-[rgba(28,36,48,0.08)] bg-white/90 px-5 py-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={cn("rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em]", ACCENT_BADGE[selectedTrack.accent])}>
                    {selectedTrack.moduleSlugs.length} modules
                  </span>
                  <span className="rounded-full border border-[rgba(28,36,48,0.08)] bg-[rgba(246,244,238,0.88)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                    {selectedTrackProgress.completed}/{selectedTrackProgress.total} complete
                  </span>
                </div>
                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-200">
                  <div className={cn("h-full rounded-full", ACCENT_BAR[selectedTrack.accent])} style={{ width: `${selectedTrackPct}%` }} />
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  {selectedTrackModules.slice(0, 3).map((module, index) => (
                    <div className="rounded-[1.2rem] border border-[rgba(28,36,48,0.08)] bg-[rgba(246,244,238,0.7)] px-3 py-3" key={module.slug}>
                      <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">Module {index + 1}</span>
                      <p className="mt-2 text-sm font-semibold leading-6 text-slate-900">{module.title}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[1.6rem] border border-[rgba(28,36,48,0.08)] bg-white/90 px-5 py-5">
                <p className="atlas-kicker">How this track works</p>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Move through the modules in sequence and pass each quiz to unlock the next lesson in the route.
                </p>
              </div>
            </div>
          </IllustratedTabHero>

          <ProgressBanner editorial />

          <section className="space-y-4">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="atlas-display text-[2.2rem] leading-tight text-slate-900">Explore by Track</h2>
                <p className="mt-2 text-sm text-slate-600">Choose a region of the atlas, then follow its route in order.</p>
              </div>
              <button
                className="text-sm font-semibold text-primary transition hover:text-blue-700"
                onClick={() => setActiveView("journeys")}
                type="button"
              >
                Back to journeys →
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
              {LEARNING_TRACKS.map((track) => (
                <TrackTile
                  isSelected={selectedTrack.id === track.id}
                  key={track.id}
                  onSelect={() => setSelectedTrackId(track.id)}
                  track={track}
                />
              ))}
            </div>
          </section>

          <SoftPanel className="space-y-6" tone="blue">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="atlas-display text-[2.2rem] leading-tight text-slate-900">{selectedTrack.title} path</h2>
                <p className="mt-2 text-sm text-slate-600">{selectedTrack.tagline}</p>
              </div>
              <Link
                className="inline-flex items-center gap-2 rounded-full border border-[rgba(28,36,48,0.12)] bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-[rgba(28,36,48,0.22)] hover:text-slate-900"
                href={relatedTrackLab.href}
              >
                {relatedTrackLab.label}
                <Play className="h-4 w-4" />
              </Link>
            </div>

            <div className="space-y-4">
              {selectedTrackModules.map((module, index) => {
                const progress = getModule(module.slug);

                return (
                  <ModulePathItem
                    index={index}
                    key={module.slug}
                    module={module}
                    quizPassed={progress.quizPassed}
                    quizScore={progress.quizScore}
                    showLine={index < selectedTrackModules.length - 1}
                    track={selectedTrack}
                    unlocked={isUnlocked(module.slug, selectedTrack.moduleSlugs)}
                  />
                );
              })}
            </div>
          </SoftPanel>
        </>
      ) : null}

      {activeView === "modules" ? (
        <>
          <IllustratedTabHero
            actions={
              <>
                <Link
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(59,130,246,0.18)] transition hover:bg-blue-500"
                  href={`/learn/${nextGlobalSlug}`}
                >
                  Continue learning
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <button
                  className="inline-flex items-center gap-2 rounded-full border border-[rgba(28,36,48,0.12)] bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-[rgba(28,36,48,0.22)] hover:text-slate-900"
                  onClick={() => setActiveView("journeys")}
                  type="button"
                >
                  Return to journeys
                  <Sparkles className="h-4 w-4" />
                </button>
              </>
            }
            description="Every module is still here. The difference is that the full library only appears when you intentionally want the full library."
            eyebrow="All modules"
            imageAlt="Travelers walking through a mountainous landscape toward a shared horizon."
            imageClassName="object-cover object-center"
            imageSrc="/atlas/learn-hero.png"
            title="Open the full learning library when you need it."
          >
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { label: "Journeys", value: String(LEARNING_JOURNEYS.length) },
                { label: "Tracks", value: String(LEARNING_TRACKS.length) },
                { label: "Modules", value: String(learningModules.length) },
              ].map((item) => (
                <div className="rounded-[1.2rem] border border-[rgba(28,36,48,0.08)] bg-white/90 px-4 py-4" key={item.label}>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">{item.label}</p>
                  <p className="atlas-display mt-2 text-3xl text-slate-900">{item.value}</p>
                </div>
              ))}
            </div>
          </IllustratedTabHero>

          <ProgressBanner editorial />

          <SoftPanel className="space-y-5" tone="gold">
            <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-end">
              <div className="space-y-3">
                <label className="block">
                  <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Search modules</span>
                  <div className="flex items-center gap-3 rounded-full border border-[rgba(28,36,48,0.08)] bg-white/82 px-4 py-3">
                    <Search className="h-4 w-4 text-slate-400" />
                    <input
                      className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                      onChange={(event) => setModuleQuery(event.target.value)}
                      placeholder="Search by title, summary, or track..."
                      value={moduleQuery}
                    />
                  </div>
                </label>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                    moduleTrackFilter === "all"
                      ? "border-primary bg-[rgba(59,130,246,0.08)] text-slate-900"
                      : "border-[rgba(28,36,48,0.1)] bg-white/80 text-slate-600 hover:border-[rgba(28,36,48,0.18)] hover:text-slate-900",
                  )}
                  onClick={() => setModuleTrackFilter("all")}
                  type="button"
                >
                  All tracks
                </button>
                {LEARNING_TRACKS.map((track) => (
                  <button
                    className={cn(
                      "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                      moduleTrackFilter === track.id
                        ? "border-primary bg-[rgba(59,130,246,0.08)] text-slate-900"
                        : "border-[rgba(28,36,48,0.1)] bg-white/80 text-slate-600 hover:border-[rgba(28,36,48,0.18)] hover:text-slate-900",
                    )}
                    key={track.id}
                    onClick={() => setModuleTrackFilter(track.id)}
                    type="button"
                  >
                    {track.title}
                  </button>
                ))}
              </div>
            </div>
          </SoftPanel>

          <div className="space-y-5">
            {filteredTrackGroups.map(({ track, slugs }) => {
              const autoExpanded = Boolean(moduleQuery.trim()) || moduleTrackFilter !== "all";
              const expanded = autoExpanded || expandedTrackIds.includes(track.id);
              const visibleSlugs = expanded ? slugs : slugs.slice(0, 3);

              return (
                <SoftPanel key={track.id}>
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="space-y-2">
                      <span className={cn("rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em]", ACCENT_BADGE[track.accent])}>
                        {slugs.length} matching modules
                      </span>
                      <h3 className="atlas-display text-3xl text-slate-900">{track.title}</h3>
                      <p className="atlas-copy text-sm">{track.tagline}</p>
                    </div>

                    {!autoExpanded && slugs.length > 3 ? (
                      <button
                        className="inline-flex items-center gap-2 rounded-full border border-[rgba(28,36,48,0.12)] bg-white/80 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-[rgba(28,36,48,0.22)] hover:text-slate-900"
                        onClick={() => toggleTrackExpansion(track.id)}
                        type="button"
                      >
                        {expanded ? "Show fewer" : `Show all ${slugs.length}`}
                        {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </button>
                    ) : null}
                  </div>

                  <div className="mt-6 space-y-4">
                    {visibleSlugs.map((slug, index) => {
                      const lesson = moduleLookup[slug];
                      const progress = getModule(slug);

                      return (
                        <ModulePathItem
                          index={index}
                          key={slug}
                          module={lesson}
                          quizPassed={progress.quizPassed}
                          quizScore={progress.quizScore}
                          showLine={index < visibleSlugs.length - 1}
                          track={track}
                          unlocked={isUnlocked(slug, track.moduleSlugs)}
                        />
                      );
                    })}
                  </div>
                </SoftPanel>
              );
            })}
          </div>
        </>
      ) : null}

      <section className="space-y-4">
        <div className="max-w-3xl space-y-2">
          <p className="atlas-kicker">Foundations</p>
          <h2 className="atlas-display text-[2.2rem] leading-tight text-slate-900">The intellectual shelf behind the journeys</h2>
          <p className="text-sm leading-7 text-slate-600">
            Systems thinking, political economy, civic design, and long-range analysis sit underneath the modules.
            Keep this section quiet until you want the deeper sources.
          </p>
        </div>

        <SoftPanel>
          <button
            className="flex w-full items-center justify-between gap-4 text-left"
            onClick={() => setRefsOpen((value) => !value)}
            type="button"
          >
            <div>
              <p className="atlas-kicker">Reference shelf</p>
              <h3 className="atlas-display mt-2 text-3xl text-slate-900">Open the books under the floorboards</h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                Meadows, World3, causal loops, systemic political economy, and design lenses for institutions.
              </p>
            </div>
            {refsOpen ? (
              <ChevronUp className="h-5 w-5 flex-none text-slate-500" />
            ) : (
              <ChevronDown className="h-5 w-5 flex-none text-slate-500" />
            )}
          </button>

          {refsOpen ? (
            <div className="mt-8 grid gap-4 lg:grid-cols-2">
              {foundationalReferences.map((reference) => (
                <InsightBlock
                  description={
                    <>
                      <p>{reference.summary}</p>
                      <p className="mt-3 text-xs uppercase tracking-[0.16em] text-slate-500">Why it matters here</p>
                      <p className="mt-1">{reference.focus}</p>
                    </>
                  }
                  key={reference.title}
                  title={reference.title}
                  tone={reference.status === "Active lens" ? "blue" : "neutral"}
                />
              ))}
            </div>
          ) : null}
        </SoftPanel>
      </section>
    </AtlasPage>
  );
}

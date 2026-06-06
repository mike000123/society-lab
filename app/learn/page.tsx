"use client";

import { useEffect, useMemo, useState, type ElementType } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Banknote,
  BookOpenText,
  Brain,
  Building2,
  CirclePlay,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ClipboardCheck,
  Clock3,
  Eye,
  Flame,
  Landmark,
  Leaf,
  Lightbulb,
  LibraryBig,
  Lock,
  Network,
  Play,
  ScrollText,
  Search,
  SlidersHorizontal,
  Sparkles,
  Zap,
} from "lucide-react";

import { AtlasPage } from "@/components/atlas/AtlasPage";
import { IllustratedTabHero } from "@/components/atlas/IllustratedTabHero";
import { InsightBlock } from "@/components/atlas/InsightBlock";
import { SoftPanel } from "@/components/atlas/SoftPanel";
import { DevModeToggle } from "@/components/learn/DevModeToggle";
import { ProgressBanner } from "@/components/learn/ProgressBanner";
import { SharedLearnersPanel } from "@/components/social/SharedLearnersPanel";
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
  economy: { href: "/simulator/macro-economy", label: "Open macro economy lab" },
  "politics-and-democracy": { href: "/simulator/political-talent", label: "Open governance lab" },
  "cities-and-ecology": { href: "/simulator/world3", label: "Open World3" },
  "media-and-information": { href: "/simulator/social-movements", label: "Open movement lab" },
};

const ALL_SLUGS = LEARNING_TRACKS.flatMap((track) => track.moduleSlugs);

const LEARNING_STEP_FLOW: { description: string; icon: ElementType; title: string }[] = [
  {
    description: "Start with the core idea and why it matters.",
    icon: Eye,
    title: "See the big picture",
  },
  {
    description: "Explore feedback loops, drivers, and trade-offs.",
    icon: Network,
    title: "Map the system",
  },
  {
    description: "Dive into real data, examples, and context.",
    icon: ClipboardCheck,
    title: "Learn with evidence",
  },
  {
    description: "Use mini simulations to explore outcomes.",
    icon: SlidersHorizontal,
    title: "Test your intuition",
  },
  {
    description: "Apply insights, discuss, or explore next steps.",
    icon: Lightbulb,
    title: "Act & go deeper",
  },
];

const FEATURED_TRACK_IDS = [
  "economy",
  "politics-and-democracy",
  "cities-and-ecology",
  "media-and-information",
] as const;

const FEATURED_TRACK_ART: Record<string, string> = {
  economy: "/atlas/learn-track-money-wealth.png",
  "politics-and-democracy": "/atlas/learn-track-power-politics.png",
  "cities-and-ecology": "/atlas/learn-track-ecology-limits.png",
  "media-and-information": "/atlas/learn-track-information-attention.png",
};

function parseReadingMinutes(readingTime: string): number {
  const match = readingTime.match(/(\d+)/);
  return match ? Number(match[1]) : 0;
}

function formatLearningTime(totalMinutes: number): string {
  if (totalMinutes <= 0) return "0m";
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours <= 0) return `${minutes}m`;
  return `${hours}h ${minutes}m`;
}

function toIsoDay(value: string): string {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date.toISOString().slice(0, 10);
}

function calculateStreak(completedAt: string[]): number {
  if (completedAt.length === 0) return 0;
  const days = new Set(completedAt.map(toIsoDay));
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  let streak = 0;

  while (days.has(cursor.toISOString().slice(0, 10))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

function buildWeeklyCompletionBars(completedAt: string[]): number[] {
  const counts = new Map<string, number>();
  completedAt.forEach((value) => {
    const day = toIsoDay(value);
    counts.set(day, (counts.get(day) ?? 0) + 1);
  });

  return Array.from({ length: 7 }, (_, index) => {
    const day = new Date();
    day.setHours(0, 0, 0, 0);
    day.setDate(day.getDate() - (6 - index));
    return counts.get(day.toISOString().slice(0, 10)) ?? 0;
  });
}

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

function LearningStepCard({
  description,
  icon: Icon,
  isLast,
  title,
}: {
  description: string;
  icon: ElementType;
  isLast: boolean;
  title: string;
}) {
  return (
    <div className="relative flex flex-col items-start gap-4">
      <div className="flex h-14 w-14 flex-none items-center justify-center rounded-full border border-[rgba(28,36,48,0.08)] bg-[rgba(246,244,238,0.8)] text-primary">
        <Icon className="h-6 w-6" />
      </div>
      <div className="max-w-[10.5rem] space-y-1.5">
        <p className="text-sm font-semibold text-slate-900">{title}</p>
        <p className="text-xs leading-6 text-slate-600">{description}</p>
      </div>
      {!isLast ? (
        <span className="absolute -right-2 top-5 hidden text-slate-300 2xl:block">
          <ArrowRight className="h-4 w-4" />
        </span>
      ) : null}
    </div>
  );
}

function JourneyOverviewCard({
  completed,
  icon: Icon,
  isSelected,
  journey,
  onSelect,
  progressPct,
  startHref,
  tone,
}: {
  completed: number;
  icon: ElementType;
  isSelected: boolean;
  journey: LearningJourney;
  onSelect: () => void;
  progressPct: number;
  startHref: string;
  tone: AccentTone;
}) {
  return (
    <div
      className={cn(
        "rounded-[1.5rem] border bg-white px-4 py-4 shadow-[0_12px_28px_rgba(28,36,48,0.04)] transition-all",
        isSelected
          ? "border-primary shadow-[0_18px_38px_rgba(59,130,246,0.10)]"
          : "border-[rgba(28,36,48,0.08)] hover:border-[rgba(28,36,48,0.16)] hover:shadow-[0_18px_34px_rgba(28,36,48,0.06)]",
      )}
    >
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className={cn("mt-0.5 flex h-11 w-11 flex-none items-center justify-center rounded-full border", ACCENT_ICON[tone])}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">{journey.moduleSlugs.length} lessons</p>
            <h3 className="text-[1.02rem] font-semibold leading-6 text-slate-900">{journey.title}</h3>
          </div>
        </div>

        <p className="text-sm leading-6 text-slate-600">{journey.tagline}</p>

        <div className="space-y-2">
          <div className="h-1.5 overflow-hidden rounded-full bg-slate-200">
            <div className={cn("h-full rounded-full", ACCENT_BAR[tone])} style={{ width: `${progressPct}%` }} />
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>{completed}/{journey.moduleSlugs.length} complete</span>
            <span>{progressPct}%</span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <button
            className="text-sm font-semibold text-slate-600 transition hover:text-slate-900"
            onClick={onSelect}
            type="button"
          >
            Preview
          </button>
          <Link className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:text-blue-700" href={startHref}>
            Start
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function FeaturedTrackRow({
  href,
  imageSrc,
  modulesLabel,
  progressPct,
  summary,
  title,
}: {
  href: string;
  imageSrc: string;
  modulesLabel: string;
  progressPct: number;
  summary: string;
  title: string;
}) {
  return (
    <Link
      className="group grid min-h-[9.75rem] overflow-hidden rounded-[1.45rem] border border-[rgba(28,36,48,0.08)] bg-white shadow-[0_10px_26px_rgba(28,36,48,0.04)] transition hover:border-[rgba(28,36,48,0.14)] hover:shadow-[0_16px_34px_rgba(28,36,48,0.06)] md:grid-cols-[minmax(0,1fr)_15rem] lg:grid-cols-[minmax(0,1fr)_17rem] xl:grid-cols-[minmax(0,1fr)_18rem]"
      href={href}
    >
      <div className="relative z-10 space-y-2 px-4 py-4 lg:px-5">
        <h3 className="text-[1.05rem] font-semibold leading-6 text-slate-900 transition group-hover:text-primary">{title}</h3>
        <p className="text-sm leading-6 text-slate-600">{summary}</p>
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span>{modulesLabel}</span>
          <span>•</span>
          <span>Intermediate</span>
        </div>
        <div className="flex items-center gap-3 pt-1">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200">
            <div className="h-full rounded-full bg-emerald-500" style={{ width: `${progressPct}%` }} />
          </div>
          <span className="text-xs font-semibold text-slate-500">{progressPct}%</span>
        </div>
      </div>
      <div className="relative hidden min-h-[9.75rem] overflow-hidden border-l border-[rgba(28,36,48,0.06)] bg-white md:block">
        <Image
          alt=""
          aria-hidden="true"
          className="object-cover object-right"
          fill
          sizes="(min-width: 1280px) 288px, (min-width: 1024px) 272px, (min-width: 768px) 240px, 0px"
          src={imageSrc}
        />
        <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-white/14 via-white/6 to-transparent" />
      </div>
    </Link>
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

  const { getModule, getNextUnlocked, getTotalCompleted, isUnlocked, trackProgress } = useProgress();

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const requestedView = params.get("view");
    const requestedTrack = params.get("track");
    const requestedJourney = params.get("journey");
    if (requestedView === "tracks" || requestedView === "modules" || requestedView === "journeys") {
      setActiveView(requestedView);
    }

    if (requestedTrack && LEARNING_TRACKS.some((track) => track.id === requestedTrack)) {
      setSelectedTrackId(requestedTrack);
    }

    if (requestedJourney && LEARNING_JOURNEYS.some((journey) => journey.id === requestedJourney)) {
      setSelectedJourneyId(requestedJourney);
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

  const completedModuleRecords = useMemo(
    () =>
      ALL_SLUGS.map((slug) => ({
        module: moduleLookup[slug],
        progress: getModule(slug),
      })).filter((entry) => entry.progress.quizPassed && entry.progress.completedAt),
    [getModule, moduleLookup],
  );

  const completedDates = completedModuleRecords
    .map((entry) => entry.progress.completedAt)
    .filter((value): value is string => Boolean(value));

  const totalCompleted = getTotalCompleted();
  const totalLearningMinutes = learningModules.reduce((sum, module) => sum + parseReadingMinutes(module.readingTime), 0);
  const completedLearningMinutes = completedModuleRecords.reduce(
    (sum, entry) => sum + parseReadingMinutes(entry.module.readingTime),
    0,
  );
  const snapshotPct = learningModules.length === 0 ? 0 : Math.round((totalCompleted / learningModules.length) * 100);
  const currentStreak = calculateStreak(completedDates);
  const weeklyCompletionBars = buildWeeklyCompletionBars(completedDates);
  const recentCompletedModule = [...completedModuleRecords].sort((a, b) =>
    (b.progress.completedAt ?? "").localeCompare(a.progress.completedAt ?? ""),
  )[0];
  const nextGlobalModule = moduleLookup[nextGlobalSlug];

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

  const featuredTracks = FEATURED_TRACK_IDS
    .map((trackId) => LEARNING_TRACKS.find((track) => track.id === trackId))
    .filter((track): track is LearningTrack => Boolean(track))
    .map((track) => {
      const progress = trackProgress(track.moduleSlugs);
      const pct = progress.total === 0 ? 0 : Math.round((progress.completed / progress.total) * 100);
      const firstSlug =
        track.moduleSlugs.find((slug) => !getModule(slug).quizPassed && isUnlocked(slug, track.moduleSlugs)) ??
        track.moduleSlugs[0];

        return {
          href: `/learn/${firstSlug}`,
          imageSrc: FEATURED_TRACK_ART[track.id],
          progressPct: pct,
          summary: track.featuredSummary ?? track.description,
          title: track.title,
          track,
        };
      });

  const viewSwitcher = (
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
  );

  return (
    <AtlasPage className="space-y-8 pb-14">
      {activeView === "journeys" ? (
        <div className="space-y-6">
          <IllustratedTabHero
            actions={
              <>
                <Link
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(59,130,246,0.18)] transition hover:bg-blue-500"
                  href={`/learn/${selectedJourneyNextSlug}`}
                >
                  {selectedJourneyStats.completed > 0 ? "Continue selected journey" : "Start selected journey"}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <button
                  className="inline-flex items-center gap-2 rounded-full border border-[rgba(28,36,48,0.12)] bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-[rgba(28,36,48,0.22)] hover:text-slate-900"
                  onClick={() => setActiveView("tracks")}
                  type="button"
                >
                  Browse all tracks
                  <ArrowRight className="h-4 w-4" />
                </button>
              </>
            }
            description="Learn the hidden structures behind today&apos;s biggest challenges. From money and power to ecology and technology, master the systems that shape civilization."
            eyebrow="Learn"
            imageAlt="Open book, globe, and city skyline representing a civilization atlas."
            imageClassName="object-cover object-[90%_44%]"
            imageSrc="/atlas/learn-hero.png"
            title="Understand the systems. Change the future."
          >
            <div className="grid gap-4 md:grid-cols-3">
              {[
                {
                  icon: BookOpenText,
                  label: "Lessons",
                  value: `${learningModules.length}+`,
                },
                {
                  icon: LibraryBig,
                  label: "System tracks",
                  value: String(LEARNING_TRACKS.length),
                },
                {
                  icon: Clock3,
                  label: "Learning time",
                  value: `${Math.max(1, Math.round(totalLearningMinutes / 60))}h+`,
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    className="rounded-[1.4rem] border border-[rgba(28,36,48,0.08)] bg-white/88 px-4 py-4 shadow-[0_14px_32px_rgba(28,36,48,0.04)]"
                    key={item.label}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(28,36,48,0.08)] bg-[rgba(246,244,238,0.8)] text-slate-700">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-[1.95rem] font-semibold leading-none text-slate-900">{item.value}</p>
                        <p className="text-sm text-slate-500">{item.label}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </IllustratedTabHero>

          {viewSwitcher}

          <div className="grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.9fr)]">
            <section className="rounded-[2rem] border border-[rgba(28,36,48,0.08)] bg-white px-5 py-5 shadow-[0_18px_40px_rgba(28,36,48,0.05)] sm:px-6">
              <div className="space-y-1">
                <h2 className="atlas-display text-[2rem] leading-tight text-slate-900">How learning works here</h2>
                <p className="text-sm text-slate-500">Each lesson follows the same proven system to turn complexity into clarity.</p>
              </div>

              <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
                {LEARNING_STEP_FLOW.map((step, index) => (
                  <LearningStepCard
                    description={step.description}
                    icon={step.icon}
                    isLast={index === LEARNING_STEP_FLOW.length - 1}
                    key={step.title}
                    title={`${index + 1}. ${step.title}`}
                  />
                ))}
              </div>
            </section>

            <section className="rounded-[2rem] border border-[rgba(28,36,48,0.08)] bg-white px-5 py-5 shadow-[0_18px_40px_rgba(28,36,48,0.05)] sm:px-6">
              <div className="flex items-center justify-between gap-3">
                <h2 className="atlas-display text-[2rem] leading-tight text-slate-900">Your learning snapshot</h2>
                <button
                  className="text-sm font-semibold text-primary transition hover:text-blue-700"
                  onClick={() => setActiveView("modules")}
                  type="button"
                >
                  View all
                </button>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded-[1.3rem] border border-[rgba(28,36,48,0.08)] bg-[rgba(246,244,238,0.7)] px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Lessons completed</p>
                  <p className="mt-3 text-[2rem] font-semibold leading-none text-slate-900">{totalCompleted}</p>
                  <p className="mt-1 text-sm text-slate-500">of {learningModules.length}</p>
                  <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-200">
                    <div className="h-full rounded-full bg-emerald-500" style={{ width: `${snapshotPct}%` }} />
                  </div>
                </div>

                <div className="rounded-[1.3rem] border border-[rgba(28,36,48,0.08)] bg-[rgba(246,244,238,0.7)] px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Current streak</p>
                  <div className="mt-3 flex items-end justify-between gap-3">
                    <div>
                      <p className="text-[2rem] font-semibold leading-none text-slate-900">{currentStreak}</p>
                      <p className="mt-1 text-sm text-slate-500">days</p>
                    </div>
                    <Flame className="h-5 w-5 text-rose-500" />
                  </div>
                </div>

                <div className="rounded-[1.3rem] border border-[rgba(28,36,48,0.08)] bg-[rgba(246,244,238,0.7)] px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Time spent learning</p>
                  <p className="mt-3 text-[2rem] font-semibold leading-none text-slate-900">{formatLearningTime(completedLearningMinutes)}</p>
                  <div className="mt-3 flex items-end gap-1">
                    {weeklyCompletionBars.map((value, index) => (
                      <span
                        className={cn(
                          "w-3 rounded-t-full bg-emerald-500/85",
                          value === 0 ? "opacity-25" : "opacity-100",
                        )}
                        key={index}
                        style={{ height: `${Math.max(0.35, value * 0.55 + 0.35)}rem` }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-5 flex items-end justify-between gap-4 border-t border-[rgba(28,36,48,0.08)] pt-4">
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Recent lesson</p>
                  <p className="text-sm font-semibold text-slate-900">
                    {recentCompletedModule?.module.title ?? nextGlobalModule?.title ?? "Start your first lesson"}
                  </p>
                </div>
                <Link className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:text-blue-700" href={`/learn/${nextGlobalSlug}`}>
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </section>
          </div>
        </div>
      ) : null}

      {activeView === "journeys" ? (
        <>
          <div className="grid gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(22rem,0.95fr)]">
            <section className="rounded-[2rem] border border-[rgba(28,36,48,0.08)] bg-white px-5 py-5 shadow-[0_18px_40px_rgba(28,36,48,0.05)] sm:px-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="atlas-display text-[2rem] leading-tight text-slate-900">Explore Journeys</h2>
                  <p className="mt-1 text-sm text-slate-500">Browse all systems and start learning what matters most.</p>
                </div>
                <button
                  className="text-sm font-semibold text-primary transition hover:text-blue-700"
                  onClick={() => setActiveView("tracks")}
                  type="button"
                >
                  View all topics
                </button>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {LEARNING_JOURNEYS.map((journey) => {
                  const completed = journey.moduleSlugs.filter((slug) => getModule(slug).quizPassed).length;
                  const primarySlug =
                    journey.moduleSlugs.find((slug) => {
                      const track = trackBySlug[slug];
                      return track && !getModule(slug).quizPassed && isUnlocked(slug, track.moduleSlugs);
                    }) ?? journey.moduleSlugs[0];
                  const primaryTrack = trackLookup[journey.relatedTrackIds[0]];
                  const Icon = TRACK_ICONS[primaryTrack?.icon ?? ""] ?? Sparkles;
                  const progressPct =
                    journey.moduleSlugs.length === 0
                      ? 0
                      : Math.round((completed / journey.moduleSlugs.length) * 100);

                  return (
                    <JourneyOverviewCard
                      completed={completed}
                      icon={Icon}
                      isSelected={selectedJourney.id === journey.id}
                      journey={journey}
                      key={journey.id}
                      onSelect={() => setSelectedJourneyId(journey.id)}
                      progressPct={progressPct}
                      startHref={`/learn/${primarySlug}`}
                      tone={primaryTrack?.accent ?? "emerald"}
                    />
                  );
                })}
              </div>
            </section>

            <section className="rounded-[2rem] border border-[rgba(28,36,48,0.08)] bg-white px-5 py-5 shadow-[0_18px_40px_rgba(28,36,48,0.05)] sm:px-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="atlas-display text-[2rem] leading-tight text-slate-900">Featured learning tracks</h2>
                  <p className="mt-1 text-sm text-slate-500">Start with the strongest system maps in the library.</p>
                </div>
                <button
                  className="text-sm font-semibold text-primary transition hover:text-blue-700"
                  onClick={() => setActiveView("tracks")}
                  type="button"
                >
                  View all tracks
                </button>
              </div>

              <div className="mt-6 space-y-4">
                {featuredTracks.map((item) => (
                  <FeaturedTrackRow
                    href={item.href}
                    imageSrc={item.imageSrc}
                    key={item.track.id}
                    modulesLabel={`${item.track.moduleSlugs.length} lessons`}
                    progressPct={item.progressPct}
                    summary={item.summary}
                    title={item.title}
                  />
                ))}
              </div>
            </section>
          </div>

          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_repeat(3,minmax(0,0.6fr))]">
            <section className="rounded-[1.9rem] border border-[rgba(28,36,48,0.08)] bg-[rgba(246,244,238,0.76)] px-5 py-5 shadow-[0_14px_32px_rgba(28,36,48,0.04)]">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-2">
                  <h2 className="atlas-display text-[1.85rem] leading-tight text-slate-900">Not sure where to start?</h2>
                  <p className="text-sm leading-7 text-slate-600">Answer a few questions and we&apos;ll suggest the best first lessons for you.</p>
                </div>
                <Link
                  className="inline-flex items-center gap-2 rounded-full border border-[rgba(28,36,48,0.12)] bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-[rgba(28,36,48,0.22)] hover:text-slate-900"
                  href={`/learn/${selectedJourneyNextSlug}`}
                >
                  Find my path
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </section>

            {[
              {
                description: "Every lesson is grounded in real data and research.",
                icon: ClipboardCheck,
                title: "Evidence-first",
              },
              {
                description: "See the whole, not just the parts.",
                icon: Network,
                title: "Systems thinking",
              },
              {
                description: "Simulate, visualize, and learn by doing.",
                icon: CirclePlay,
                title: "Interactive learning",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <section
                  className="rounded-[1.9rem] border border-[rgba(28,36,48,0.08)] bg-white px-5 py-5 shadow-[0_14px_32px_rgba(28,36,48,0.04)]"
                  key={item.title}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 flex-none items-center justify-center rounded-full border border-[rgba(28,36,48,0.08)] bg-[rgba(246,244,238,0.8)] text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-[1.05rem] font-semibold text-slate-900">{item.title}</h3>
                      <p className="text-sm leading-6 text-slate-600">{item.description}</p>
                    </div>
                  </div>
                </section>
              );
            })}
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

          {viewSwitcher}

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

          <SharedLearnersPanel
            contextSlug={selectedTrack.id}
            contextTitle={selectedTrack.title}
            contextType="track"
            moduleSlugs={selectedTrack.moduleSlugs}
          />
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

          {viewSwitcher}

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

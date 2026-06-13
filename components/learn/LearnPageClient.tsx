"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState, type ElementType } from "react";
import { useSearchParams } from "next/navigation";
import {
  ArrowRight,
  Banknote,
  BookOpenText,
  Brain,
  Building2,
  ChartColumnBig,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Clock3,
  Landmark,
  Leaf,
  MessagesSquare,
  Search,
  Sparkles,
  X,
} from "lucide-react";

import { AtlasPage } from "@/components/atlas/AtlasPage";
import { SoftPanel } from "@/components/atlas/SoftPanel";
import { DevModeToggle } from "@/components/learn/DevModeToggle";
import { Button } from "@/components/ui/button";
import type {
  LearningPathCard,
  LearningTopicId,
  PopularQuestionCard,
} from "@/lib/learn/discovery";
import type { LearningTrack } from "@/lib/tracks/config";
import { useProgress } from "@/lib/progress/store";
import { cn } from "@/lib/utils";
import { CardCarousel } from "@/components/ui/CardCarousel";

// ─── Slim module type (metadata only — full LearningModule not needed here) ────
export type ModuleSummary = {
  accent: string;
  readingTime: string;
  slug: string;
  summary: string;
  title: string;
};

export type TopicSummary = {
  href: string;
  id: string;
  modules: number;
  paths: number;
  title: string;
};

export type LearnPageClientProps = {
  featuredPathIds: string[];
  learningPaths: LearningPathCard[];
  learningTracks: Pick<LearningTrack, "id" | "moduleSlugs" | "title">[];
  moduleBySlug: Record<string, ModuleSummary>;
  pathModuleTitles: Record<string, string[]>;
  popularQuestions: PopularQuestionCard[];
  topicSummaries: TopicSummary[];
  totalModules: number;
};

// ─── Static lookup tables ───────────────────────────────────────────────────────
const QUESTION_ICONS: Record<PopularQuestionCard["icon"], ElementType> = {
  banking: Banknote,
  city: Building2,
  ecology: Leaf,
  media: MessagesSquare,
  metrics: ChartColumnBig,
  politics: Landmark,
};

const QUESTION_CARD_TONES: Record<
  PopularQuestionCard["icon"],
  { card: string; icon: string }
> = {
  banking: {
    card: "bg-[linear-gradient(180deg,rgba(240,252,244,0.95),rgba(255,255,255,0.98))]",
    icon: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  city: {
    card: "bg-[linear-gradient(180deg,rgba(255,247,237,0.96),rgba(255,255,255,0.98))]",
    icon: "border-amber-200 bg-amber-50 text-amber-700",
  },
  ecology: {
    card: "bg-[linear-gradient(180deg,rgba(240,253,250,0.96),rgba(255,255,255,0.98))]",
    icon: "border-cyan-200 bg-cyan-50 text-cyan-700",
  },
  media: {
    card: "bg-[linear-gradient(180deg,rgba(254,242,242,0.96),rgba(255,255,255,0.98))]",
    icon: "border-rose-200 bg-rose-50 text-rose-700",
  },
  metrics: {
    card: "bg-[linear-gradient(180deg,rgba(239,246,255,0.96),rgba(255,255,255,0.98))]",
    icon: "border-blue-200 bg-blue-50 text-blue-700",
  },
  politics: {
    card: "bg-[linear-gradient(180deg,rgba(245,243,255,0.96),rgba(255,255,255,0.98))]",
    icon: "border-violet-200 bg-violet-50 text-violet-700",
  },
};

const TOPIC_ICONS: Record<string, ElementType> = {
  economy: Banknote,
  "politics-and-democracy": Landmark,
  "cities-and-ecology": Leaf,
  "media-and-information": Brain,
};

const TOPIC_BADGE_STYLES: Record<string, string> = {
  economy:                  "border-emerald-200 bg-emerald-50 text-emerald-700",
  "politics-and-democracy": "border-violet-200 bg-violet-50 text-violet-700",
  "cities-and-ecology":     "border-teal-200 bg-teal-50 text-teal-700",
  "media-and-information":  "border-amber-200 bg-amber-50 text-amber-700",
};

const TOPIC_TAGLINES: Record<string, string> = {
  economy: "Money, inequality, banking, and the rules of growth.",
  "politics-and-democracy": "Power, institutions, accountability, and collective action.",
  "cities-and-ecology": "Climate, pollution, housing, and the systems of everyday life.",
  "media-and-information": "Attention, narratives, platforms, and opinion formation.",
};

const TOPIC_CARD_IMAGES: Record<string, string> = {
  economy: "/atlas/home-domain-economy.png",
  "politics-and-democracy": "/atlas/home-domain-politics-democracy.png",
  "cities-and-ecology": "/atlas/home-domain-cities-everyday-life.png",
  "media-and-information": "/atlas/home-domain-media-information.png",
};

const VALUE_POINTS = [
  {
    description: "Every lesson is grounded in real data, research, and expert work.",
    icon: BookOpenText,
    title: "Evidence-first",
  },
  {
    description: "See the whole system, not just one isolated symptom.",
    icon: Sparkles,
    title: "Systems thinking",
  },
  {
    description: "Simulate, visualize, and test ideas yourself.",
    icon: ChartColumnBig,
    title: "Interactive learning",
  },
  {
    description: "Discuss with others and build better solutions together.",
    icon: MessagesSquare,
    title: "Learn together",
  },
];

// ─── Helpers ────────────────────────────────────────────────────────────────────
function matchesQuery(values: Array<string | undefined>, query: string) {
  if (!query.trim()) return true;
  const normalizedQuery = query.trim().toLowerCase();
  return values.some((value) => value?.toLowerCase().includes(normalizedQuery));
}

function getPathStartSlug(
  path: LearningPathCard,
  getModule: ReturnType<typeof useProgress>["getModule"],
) {
  return path.moduleSlugs.find((slug) => !getModule(slug).quizPassed) ?? path.moduleSlugs[0];
}

function getPathProgress(
  path: LearningPathCard,
  getModule: ReturnType<typeof useProgress>["getModule"],
) {
  const completed = path.moduleSlugs.filter((slug) => getModule(slug).quizPassed).length;
  const percent =
    path.moduleSlugs.length === 0 ? 0 : Math.round((completed / path.moduleSlugs.length) * 100);
  return { completed, percent };
}

// ─── Sub-components ─────────────────────────────────────────────────────────────
function ModuleCard({ module }: { module: ModuleSummary }) {
  const accentBg =
    module.accent === "amber"   ? "bg-amber-400"   :
    module.accent === "cyan"    ? "bg-cyan-500"    :
    module.accent === "emerald" ? "bg-emerald-500" :
    module.accent === "rose"    ? "bg-rose-400"    : "bg-slate-400";
  return (
    <Link
      className="group flex flex-col overflow-hidden rounded-[1.3rem] border border-[rgba(28,36,48,0.08)] bg-white transition hover:border-[rgba(28,36,48,0.16)] hover:shadow-[0_12px_24px_rgba(28,36,48,0.06)]"
      href={`/learn/${module.slug}`}
    >
      <div className={cn("relative h-24 w-full overflow-hidden", accentBg)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          src={`/atlas/modules/${module.slug}.png`}
          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
        />
      </div>
      <div className="flex flex-1 flex-col px-3 py-3">
        <p className="text-[0.82rem] font-semibold leading-5 text-slate-900 transition-colors group-hover:text-primary">
          {module.title}
        </p>
        <p className="mt-auto pt-2 text-[11px] text-slate-400">{module.readingTime}</p>
      </div>
    </Link>
  );
}

/** Paged 2-row grid (8 per page) with animated left / right arrow navigation. */
function ModuleGridCarousel({ modules }: { modules: ModuleSummary[] }) {
  const [page, setPage] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const [fromDir, setFromDir] = useState<"right" | "left">("right");
  const perPage = 8;
  const totalPages = Math.ceil(modules.length / perPage);
  const visible = modules.slice(page * perPage, (page + 1) * perPage);

  function navigate(dir: 1 | -1) {
    setFromDir(dir === 1 ? "right" : "left");
    setPage((p) => Math.max(0, Math.min(totalPages - 1, p + dir)));
    setAnimKey((k) => k + 1);
  }

  return (
    <>
      {/* eslint-disable-next-line react/no-danger */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes mgc-from-right { from { transform: translateX(52px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes mgc-from-left  { from { transform: translateX(-52px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        .mgc-slide-right { animation: mgc-from-right 0.28s cubic-bezier(0.25,0.46,0.45,0.94) both; }
        .mgc-slide-left  { animation: mgc-from-left  0.28s cubic-bezier(0.25,0.46,0.45,0.94) both; }
      `}} />

      <div className="relative">
        {/* Left arrow */}
        <button
          aria-label="Previous"
          className={cn(
            "absolute -left-5 top-1/2 z-10 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(28,36,48,0.12)] bg-white shadow-[0_4px_14px_rgba(28,36,48,0.12)] transition hover:shadow-[0_6px_18px_rgba(28,36,48,0.18)]",
            page === 0 && "pointer-events-none opacity-0",
          )}
          onClick={() => navigate(-1)}
          type="button"
        >
          <ChevronLeft className="h-4 w-4 text-slate-600" />
        </button>

        {/* 2-row grid — key changes on every navigation to re-trigger the animation */}
        <div
          key={animKey}
          className={cn(
            "grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
            fromDir === "right" ? "mgc-slide-right" : "mgc-slide-left",
          )}
        >
          {visible.map((module) => (
            <ModuleCard key={module.slug} module={module} />
          ))}
        </div>

        {/* Right arrow */}
        <button
          aria-label="Next"
          className={cn(
            "absolute -right-5 top-1/2 z-10 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(28,36,48,0.12)] bg-white shadow-[0_4px_14px_rgba(28,36,48,0.12)] transition hover:shadow-[0_6px_18px_rgba(28,36,48,0.18)]",
            page >= totalPages - 1 && "pointer-events-none opacity-0",
          )}
          onClick={() => navigate(1)}
          type="button"
        >
          <ChevronRight className="h-4 w-4 text-slate-600" />
        </button>
      </div>
    </>
  );
}

function QuestionCard({
  isSelected,
  onSelect,
  question,
  startHref,
}: {
  isSelected: boolean;
  onSelect: () => void;
  question: PopularQuestionCard;
  startHref: string;
}) {
  const Icon = QUESTION_ICONS[question.icon];
  const tone = QUESTION_CARD_TONES[question.icon];

  return (
    <Link
      className={cn(
        "flex h-full flex-col justify-between rounded-[1.65rem] border px-4 py-4 text-left shadow-[0_14px_28px_rgba(28,36,48,0.04)] transition-all",
        tone.card,
        isSelected
          ? "border-primary shadow-[0_18px_38px_rgba(59,130,246,0.10)]"
          : "border-[rgba(28,36,48,0.08)] hover:border-[rgba(28,36,48,0.18)] hover:shadow-[0_18px_36px_rgba(28,36,48,0.06)]",
      )}
      href={startHref}
    >
      <div className="space-y-4">
        <div className={cn("flex h-11 w-11 items-center justify-center rounded-full border", tone.icon)}>
          <Icon className="h-5 w-5" />
        </div>

        <div className="space-y-3">
          <h3 className="text-[1.05rem] font-semibold leading-7 text-slate-900">{question.title}</h3>
          <p className="text-sm leading-6 text-slate-600">{question.description}</p>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3 text-sm">
        <div className="flex items-center gap-3 text-slate-500">
          <button
            className="font-medium text-slate-500 underline decoration-slate-300 transition hover:text-slate-800"
            onClick={(event) => { event.preventDefault(); onSelect(); }}
            type="button"
          >
            {question.moduleCount} modules
          </button>
          <span className="inline-flex items-center gap-1 rounded-full bg-[rgba(246,244,238,0.88)] px-2.5 py-1 text-xs font-medium text-slate-600">
            +{question.learnerCount}
          </span>
        </div>
        <span className="inline-flex items-center gap-1 font-semibold text-primary">
          Open
          <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}

function PathRow({
  href,
  imageSrc,
  isSelected,
  onTopicClick,
  path,
  progressLabel,
}: {
  href: string;
  imageSrc: string;
  isSelected: boolean;
  onTopicClick: (topicId: string) => void;
  path: LearningPathCard;
  progressLabel: string;
}) {
  const topics = path.topicIds.map((id) => ({
    id,
    Icon: TOPIC_ICONS[id] ?? Brain,
    badge: TOPIC_BADGE_STYLES[id] ?? "border-slate-200 bg-slate-50 text-slate-600",
  }));

  return (
    <article
      className={cn(
        "grid gap-4 rounded-[1.7rem] border bg-white p-3.5 shadow-[0_14px_26px_rgba(28,36,48,0.04)] transition-all md:grid-cols-[11rem_minmax(0,1fr)_10rem_auto] md:items-center md:p-4",
        isSelected
          ? "border-primary shadow-[0_20px_44px_rgba(59,130,246,0.10)]"
          : "border-[rgba(28,36,48,0.08)]",
      )}
    >
      {/* Image */}
      <div className="relative h-[8.35rem] overflow-hidden rounded-[1.2rem] md:h-full md:min-h-[7.5rem]">
        <Image alt={path.title} className="object-cover object-center" fill sizes="220px" src={imageSrc} />
      </div>

      {/* Title + description + tags */}
      <div className="space-y-3">
        <div className="space-y-1">
          <h3 className="text-[1.22rem] font-semibold leading-7 text-slate-900">{path.title}</h3>
          <p className="text-[0.94rem] leading-6 text-slate-600">{path.description}</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {path.tags.map((tag) => (
            <span
              className="rounded-full border border-[rgba(28,36,48,0.08)] bg-[rgba(246,244,238,0.76)] px-2.5 py-1 text-[0.72rem] font-medium tracking-[0.01em] text-slate-600"
              key={tag}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Stats + topic icons — centre column */}
      <div className="hidden space-y-2.5 md:block">
        <div className="space-y-1.5 text-sm text-slate-500">
          <span className="flex items-center gap-1.5">
            <BookOpenText className="h-3.5 w-3.5 text-slate-400" />
            {path.moduleSlugs.length} lessons
          </span>
          <span className="flex items-center gap-1.5">
            <Clock3 className="h-3.5 w-3.5 text-slate-400" />
            {path.duration}
          </span>
          <span className="flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-slate-400" />
            {topics.length} topic{topics.length === 1 ? "" : "s"}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {topics.map(({ id, Icon, badge }) => (
            <div className="group relative" key={id}>
              <button
                className={cn("flex h-8 w-8 items-center justify-center rounded-full border shadow-sm transition hover:scale-110 hover:shadow-md", badge)}
                onClick={() => onTopicClick(id)}
                title={id}
                type="button"
              >
                <Icon className="h-3.5 w-3.5" />
              </button>
              <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-[rgba(28,36,48,0.08)] bg-white px-2.5 py-1.5 text-[0.72rem] font-semibold text-slate-700 shadow-[0_4px_14px_rgba(28,36,48,0.10)] opacity-0 transition-opacity group-hover:opacity-100">
                {id === "economy" ? "Economy" : id === "politics-and-democracy" ? "Politics & Democracy" : id === "cities-and-ecology" ? "Cities & Ecology" : "Media & Information"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Action */}
      <div className="flex items-center md:self-center">
        <Button asChild className="rounded-full px-5 whitespace-nowrap">
          <Link href={href}>
            Start path
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </article>
  );
}

function TopicCard({
  isSelected,
  modules,
  onSelect,
  paths,
  title,
  topicId,
}: {
  isSelected: boolean;
  modules: number;
  onSelect: () => void;
  paths: number;
  title: string;
  topicId: string;
}) {
  const Icon = TOPIC_ICONS[topicId] ?? Brain;
  const imageSrc = TOPIC_CARD_IMAGES[topicId] ?? "";

  return (
    <button
      className={cn(
        "relative flex h-full min-h-[13rem] w-full flex-col justify-between overflow-hidden rounded-[1.45rem] border bg-white px-4 py-4 text-left shadow-[0_12px_24px_rgba(28,36,48,0.04)] transition-all",
        isSelected
          ? "border-primary shadow-[0_20px_44px_rgba(59,130,246,0.10)]"
          : "border-[rgba(28,36,48,0.08)] hover:border-[rgba(28,36,48,0.16)] hover:shadow-[0_18px_36px_rgba(28,36,48,0.06)]",
      )}
      onClick={onSelect}
      type="button"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <Image
          alt={title}
          className="object-cover object-center"
          fill
          sizes="(min-width: 1280px) 22vw, (min-width: 768px) 45vw, 100vw"
          src={imageSrc}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0.10)_40%,rgba(255,255,255,0.22)_100%)]" />
      </div>

      <div className="relative z-10 space-y-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(28,36,48,0.12)] bg-white/92 text-primary">
          <Icon className="h-5 w-5" />
        </div>

        <div className="space-y-2">
          <h3 className="text-[1.03rem] font-semibold leading-6 text-slate-900">{title}</h3>
          <p className="text-sm leading-6 text-slate-600">{TOPIC_TAGLINES[topicId] ?? ""}</p>
          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <span>{modules} modules</span>
            <span className="text-slate-300">•</span>
            <span>{paths} paths</span>
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-5 h-px w-full bg-[rgba(28,36,48,0.08)]" />
      {isSelected ? (
        <div className="relative z-10 mt-3 flex items-center gap-1.5 text-xs font-semibold text-primary">
          <ChevronDown className="h-3.5 w-3.5" />
          See modules
        </div>
      ) : null}
    </button>
  );
}

// ─── Main export ─────────────────────────────────────────────────────────────────
export function LearnPageClient({
  featuredPathIds,
  learningPaths,
  learningTracks,
  moduleBySlug,
  pathModuleTitles,
  popularQuestions: allPopularQuestions,
  topicSummaries,
  totalModules,
}: LearnPageClientProps) {
  const searchParams = useSearchParams();
  const { getModule } = useProgress();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedQuestionId, setSelectedQuestionId] = useState(allPopularQuestions[0]?.id ?? "");
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);
  const [selectedPathId, setSelectedPathId] = useState(featuredPathIds[0] ?? learningPaths[0]?.id ?? "");
  const [showAllPaths, setShowAllPaths] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);

  useEffect(() => {
    const requestedQuestion = searchParams.get("question");
    const requestedPath = searchParams.get("path") ?? searchParams.get("journey");
    const requestedTopic = searchParams.get("topic") ?? searchParams.get("track");
    const requestedLibrary = searchParams.get("showLibrary");

    const questionMatch = requestedQuestion
      ? allPopularQuestions.find((q) => q.id === requestedQuestion)
      : null;
    const pathMatch = requestedPath ? learningPaths.find((p) => p.id === requestedPath) : null;
    const topicMatch = requestedTopic ? learningTracks.find((t) => t.id === requestedTopic) : null;

    if (questionMatch) {
      setSelectedQuestionId(questionMatch.id);
      setSelectedPathId(questionMatch.pathId);
      setShowAllPaths(true);
    } else if (pathMatch) {
      setSelectedPathId(pathMatch.id);
      setShowAllPaths(true);
      const relatedQuestion = allPopularQuestions.find((q) => q.pathId === pathMatch.id);
      if (relatedQuestion) setSelectedQuestionId(relatedQuestion.id);
    }

    if (topicMatch && !questionMatch && !pathMatch) {
      const firstTopicPath = learningPaths.find((p) => p.topicIds.includes(topicMatch.id as LearningTopicId));
      if (firstTopicPath) {
        setSelectedPathId(firstTopicPath.id);
        setShowAllPaths(true);
      }
    }

    if (requestedLibrary === "1") setShowLibrary(true);
  }, [searchParams, allPopularQuestions, learningPaths, learningTracks]);

  const pathLookup = useMemo(
    () => new Map(learningPaths.map((p) => [p.id, p])),
    [learningPaths],
  );

  const pathByModuleSlug = useMemo(() => {
    const map = new Map<string, LearningPathCard>();
    for (const p of learningPaths) {
      for (const slug of p.moduleSlugs) {
        if (!map.has(slug)) map.set(slug, p);
      }
    }
    return map;
  }, [learningPaths]);

  const popularQuestions = useMemo(
    () =>
      allPopularQuestions.filter((q) =>
        matchesQuery([q.title, q.description, pathLookup.get(q.pathId)?.title], searchQuery),
      ),
    [allPopularQuestions, pathLookup, searchQuery],
  );

  const matchingPaths = useMemo(
    () =>
      learningPaths.filter((path) =>
        matchesQuery(
          [path.title, path.summary, path.question, ...path.tags, ...(pathModuleTitles[path.id] ?? [])],
          searchQuery,
        ),
      ),
    [learningPaths, pathModuleTitles, searchQuery],
  );

  const selectedQuestion =
    allPopularQuestions.find((q) => q.id === selectedQuestionId) ??
    popularQuestions[0] ??
    allPopularQuestions[0];

  const displayedPaths = useMemo(() => {
    if (showAllPaths || searchQuery.trim()) return matchingPaths;
    return learningPaths.filter((p) => featuredPathIds.includes(p.id));
  }, [featuredPathIds, learningPaths, matchingPaths, searchQuery, showAllPaths]);

  const selectedPath =
    learningPaths.find((p) => p.id === selectedPathId) ?? displayedPaths[0] ?? learningPaths[0];

  const selectedTrack = selectedTrackId
    ? (learningTracks.find((t) => t.id === selectedTrackId) ?? null)
    : null;
  const selectedTrackModuleList = selectedTrack
    ? selectedTrack.moduleSlugs
        .map((slug) => moduleBySlug[slug])
        .filter((m): m is ModuleSummary => Boolean(m))
    : [];

  const selectedQuestionPath =
    learningPaths.find((p) => p.id === selectedQuestion?.pathId) ?? selectedPath;

  const selectedQuestionModules = (selectedQuestionPath?.moduleSlugs ?? [])
    .map((slug) => moduleBySlug[slug])
    .filter((m): m is ModuleSummary => Boolean(m));

  const libraryGroups = useMemo(
    () =>
      learningTracks
        .map((track) => ({
          modules: track.moduleSlugs
            .map((slug) => moduleBySlug[slug])
            .filter((m): m is ModuleSummary => Boolean(m))
            .filter((m) => matchesQuery([m.title, m.summary, track.title], searchQuery)),
          track,
        }))
        .filter((group) => group.modules.length > 0),
    [learningTracks, moduleBySlug, searchQuery],
  );

  return (
    <AtlasPage className="space-y-8 pb-16 md:space-y-10">
      <div className="flex items-center justify-between gap-4">
        <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
          Learn · {allPopularQuestions.length} questions · {learningPaths.length} paths · {learningTracks.length} topics · {totalModules} modules
        </div>
        <DevModeToggle />
      </div>

      <section className="relative ml-[calc(50%-50vw)] w-screen overflow-hidden border-y border-[rgba(28,36,48,0.08)] bg-white shadow-[0_24px_60px_rgba(28,36,48,0.05)]">
        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[58%] md:block lg:w-[55%] xl:w-[53%]">
          <Image
            alt="People looking toward a city while searching for the questions that matter."
            className="object-cover object-right-center"
            fill
            sizes="(min-width: 1280px) 53vw, (min-width: 1024px) 55vw, 58vw"
            src="/atlas/learn-hero.png"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,1)_0%,rgba(255,255,255,0.92)_14%,rgba(255,255,255,0.58)_34%,rgba(255,255,255,0.16)_56%,rgba(255,255,255,0)_74%)]" />
        </div>

        <div className="relative z-10 mx-auto max-w-[88rem] px-6 py-8 sm:px-10 sm:py-10 lg:px-16 lg:py-12">
          <div className="flex min-h-[19rem] max-w-[38rem] flex-col justify-center gap-5">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Learn</p>
            <div className="space-y-4">
              <h1 className="atlas-display max-w-[31rem] text-[2.7rem] leading-[0.95] text-slate-900 sm:text-[3.25rem] lg:text-[3.85rem]">
                Understand the systems behind the questions that matter.
              </h1>
              <p className="max-w-[30rem] text-[0.98rem] leading-8 text-slate-700">
                Start with a question. Follow a curated path of lessons, evidence, and real-world examples. Then join the discussion or test it in a simulation.
              </p>
            </div>

            <label className="flex max-w-[26rem] items-center gap-3 rounded-full border border-[rgba(28,36,48,0.08)] bg-white px-5 py-3 shadow-[0_12px_28px_rgba(28,36,48,0.06)]">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search questions, paths or lessons..."
                value={searchQuery}
              />
            </label>
          </div>
        </div>
      </section>

      <section className="space-y-4" id="popular-questions">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(28,36,48,0.12)] bg-[rgba(246,244,238,0.76)] text-primary">
                <Sparkles className="h-5 w-5" />
              </div>
              <h2 className="text-[1.85rem] font-semibold text-slate-900">Popular questions</h2>
            </div>
            <p className="text-sm leading-7 text-slate-600">Explore the questions people are asking right now.</p>
          </div>
          <button
            className="text-sm font-semibold text-primary transition hover:text-blue-700"
            onClick={() => setShowAllPaths(true)}
            type="button"
          >
            View all questions <span aria-hidden>→</span>
          </button>
        </div>

        <CardCarousel perPage={5} className="px-6">
          {popularQuestions.map((question) => {
            const path = pathLookup.get(question.pathId);
            const moduleListHref = `/learn?question=${question.id}#question-modules`;
            return (
              <QuestionCard
                isSelected={selectedQuestion?.id === question.id}
                key={question.id}
                onSelect={() => {
                  setSelectedQuestionId(question.id);
                  setSelectedPathId(question.pathId);
                  setShowAllPaths(true);
                  setTimeout(() => {
                    document.getElementById("question-modules")?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }, 50);
                }}
                question={{
                  ...question,
                  moduleCount: path?.moduleSlugs.length ?? question.moduleCount,
                }}
                startHref={
                  path?.moduleSlugs[0]
                    ? `/learn/${path.moduleSlugs[0]}?path=${question.pathId}`
                    : `/learn?question=${question.id}#question-modules`
                }
              />
            );
          })}
        </CardCarousel>
      </section>

      <section className="space-y-4" id="question-modules">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(28,36,48,0.12)] bg-[rgba(246,244,238,0.76)] text-primary">
              <BookOpenText className="h-5 w-5" />
            </div>
            <h2 className="text-[1.85rem] font-semibold text-slate-900">Modules behind this question</h2>
          </div>
        </div>
        <SoftPanel className="space-y-4" tone="blue">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[rgba(28,36,48,0.12)] bg-white text-primary">
                <BookOpenText className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  {selectedQuestionPath?.title ?? "Modules behind this question"}
                </h2>
                {selectedQuestionPath?.question ? (
                  <p className="text-xs text-slate-500">{selectedQuestionPath.question}</p>
                ) : null}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="rounded-full border border-[rgba(28,36,48,0.08)] bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                {selectedQuestionModules.length} modules
              </span>
              {selectedQuestionPath ? (
                <Link className="text-sm font-semibold text-primary transition hover:text-blue-700" href={`/learn?path=${selectedQuestionPath.id}#learning-paths`}>
                  View full path <span aria-hidden>→</span>
                </Link>
              ) : null}
            </div>
          </div>

          <CardCarousel perPage={3} className="px-6">
            {selectedQuestionModules.map((module, index) => (
              <Link
                className="rounded-[1.3rem] border border-[rgba(28,36,48,0.08)] bg-white px-4 py-4 shadow-[0_12px_24px_rgba(28,36,48,0.04)] transition hover:border-[rgba(28,36,48,0.16)] hover:shadow-[0_18px_32px_rgba(28,36,48,0.06)]"
                href={`/learn/${module.slug}`}
                key={module.slug}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full border border-[rgba(28,36,48,0.08)] bg-[rgba(246,244,238,0.82)] px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Module {index + 1}
                  </span>
                  <ArrowRight className="h-4 w-4 text-primary" />
                </div>
                <h4 className="mt-3 text-[1rem] font-semibold leading-7 text-slate-900">{module.title}</h4>
                <p className="mt-2 text-sm leading-6 text-slate-600">{module.summary}</p>
              </Link>
            ))}
          </CardCarousel>
        </SoftPanel>
      </section>

      <section className="space-y-4" id="learning-paths">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(28,36,48,0.12)] bg-[rgba(246,244,238,0.76)] text-primary">
                <BookOpenText className="h-5 w-5" />
              </div>
              <h2 className="text-[1.85rem] font-semibold text-slate-900">Learning paths</h2>
            </div>
            <p className="text-sm leading-7 text-slate-600">Curated paths that connect the dots across multiple topics and systems.</p>
          </div>
          <button
            className="text-sm font-semibold text-primary transition hover:text-blue-700"
            onClick={() => setShowAllPaths((v) => !v)}
            type="button"
          >
            {showAllPaths ? "Show featured paths" : "View all paths"} <span aria-hidden>→</span>
          </button>
        </div>

        <div className="space-y-3">
          {displayedPaths.map((path) => {
            const progress = getPathProgress(path, getModule);
            const startSlug = getPathStartSlug(path, getModule);
            return (
              <PathRow
                href={`/learn/${startSlug}?path=${path.id}`}
                imageSrc={path.imageSrc}
                isSelected={selectedPath?.id === path.id}
                key={path.id}
                onTopicClick={(topicId) => {
                  setSelectedTrackId(topicId);
                  setTimeout(() => {
                    document.getElementById("browse-by-topic")?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }, 50);
                }}
                path={path}
                progressLabel={`${progress.completed}/${path.moduleSlugs.length} complete`}
              />
            );
          })}
        </div>
      </section>

      <section className="space-y-4" id="browse-by-topic">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(28,36,48,0.12)] bg-[rgba(246,244,238,0.76)] text-primary">
                <Brain className="h-5 w-5" />
              </div>
              <h2 className="text-[1.85rem] font-semibold text-slate-900">Browse by topic</h2>
            </div>
            <p className="text-sm leading-7 text-slate-600">Prefer to explore by theme? Dive into the core systems shaping our world.</p>
          </div>
          <button
            className="text-sm font-semibold text-primary transition hover:text-blue-700"
            onClick={() => setShowLibrary(true)}
            type="button"
          >
            Open full library <span aria-hidden>→</span>
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {topicSummaries.map((topic) => (
            <TopicCard
              isSelected={selectedTrackId === topic.id}
              key={topic.id}
              modules={topic.modules}
              onSelect={() => {
                setSelectedTrackId((prev) => (prev === topic.id ? null : topic.id));
                setTimeout(() => {
                  document.getElementById("topic-modules")?.scrollIntoView({ behavior: "smooth", block: "start" });
                }, 50);
              }}
              paths={topic.paths}
              title={topic.title}
              topicId={topic.id}
            />
          ))}
        </div>

        {/* ── Inline track module panel ── */}
        {selectedTrack && selectedTrackModuleList.length > 0 ? (
          <SoftPanel className="space-y-5" id="topic-modules" tone="blue">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-2">
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  {TOPIC_TAGLINES[selectedTrack.id] ?? "Topic track"}
                </p>
                <h3 className="atlas-display text-[2rem] leading-tight text-slate-900">
                  {selectedTrack.title}
                </h3>
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-full border border-[rgba(28,36,48,0.08)] bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  {selectedTrackModuleList.length} modules
                </div>
                <button
                  aria-label="Close topic panel"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-[rgba(28,36,48,0.10)] bg-white text-slate-400 transition hover:text-slate-700"
                  onClick={() => setSelectedTrackId(null)}
                  type="button"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <CardCarousel perPage={3} className="px-6">
              {selectedTrackModuleList.map((module, index) => (
                <Link
                  className="flex h-full flex-col rounded-[1.3rem] border border-[rgba(28,36,48,0.08)] bg-white px-4 py-4 shadow-[0_12px_24px_rgba(28,36,48,0.04)] transition hover:border-[rgba(28,36,48,0.16)] hover:shadow-[0_18px_32px_rgba(28,36,48,0.06)]"
                  href={`/learn/${module.slug}`}
                  key={module.slug}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-full border border-[rgba(28,36,48,0.08)] bg-[rgba(246,244,238,0.82)] px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-slate-500">
                      Module {index + 1}
                    </span>
                    <ArrowRight className="h-4 w-4 text-primary" />
                  </div>
                  <h4 className="mt-3 text-[1rem] font-semibold leading-7 text-slate-900">{module.title}</h4>
                  <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{module.summary}</p>
                  {pathByModuleSlug.get(module.slug) ? (
                    <div className="mt-4 flex justify-end">
                      <span className="inline-flex items-center gap-1 rounded-full border border-[rgba(28,36,48,0.08)] bg-[rgba(246,244,238,0.70)] px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-slate-400">
                        {pathByModuleSlug.get(module.slug)!.title}
                      </span>
                    </div>
                  ) : null}
                </Link>
              ))}
            </CardCarousel>

            <div className="flex items-center gap-3">
              <Button asChild className="rounded-full px-5">
                <Link href={`/learn/${selectedTrackModuleList[0]?.slug}`}>
                  Start topic
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <button
                className="text-sm font-semibold text-slate-500 transition hover:text-slate-800"
                onClick={() => setSelectedTrackId(null)}
                type="button"
              >
                Dismiss
              </button>
            </div>
          </SoftPanel>
        ) : null}
      </section>

      <section className="grid gap-4 xl:grid-cols-4">
        {VALUE_POINTS.map((item) => {
          const Icon = item.icon;
          return (
            <div
              className="rounded-[1.55rem] border border-[rgba(28,36,48,0.08)] bg-white px-5 py-5 shadow-[0_12px_28px_rgba(28,36,48,0.04)]"
              key={item.title}
            >
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 flex-none items-center justify-center rounded-full border border-[rgba(28,36,48,0.12)] bg-[rgba(246,244,238,0.76)] text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-[1.02rem] font-semibold text-slate-900">{item.title}</h3>
                  <p className="text-sm leading-6 text-slate-600">{item.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      <SoftPanel className="space-y-4" tone="gold">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <h2 className="text-[1.55rem] font-semibold text-slate-900">Need every module?</h2>
            <p className="text-sm leading-7 text-slate-600">
              The question-first view is here to make the platform easier to enter. The full module library is still available whenever you want the entire shelf.
            </p>
          </div>
          <button
            className="inline-flex items-center gap-2 rounded-full border border-[rgba(28,36,48,0.12)] bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-[rgba(28,36,48,0.22)] hover:text-slate-900"
            onClick={() => setShowLibrary((v) => !v)}
            type="button"
          >
            {showLibrary ? "Hide module library" : "Open full module library"}
            {showLibrary ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>

        {showLibrary ? (
          <div className="space-y-8">
            {libraryGroups.map(({ modules, track }) => (
              <div key={track.id}>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h3 className="text-base font-semibold text-slate-900">{track.title}</h3>
                  <span className="text-xs font-medium text-slate-400">{modules.length} module{modules.length !== 1 ? "s" : ""}</span>
                </div>
                <div className="px-5">
                  <ModuleGridCarousel modules={modules} />
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </SoftPanel>
    </AtlasPage>
  );
}

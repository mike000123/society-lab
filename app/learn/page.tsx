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
  ChevronUp,
  Clock3,
  Landmark,
  Leaf,
  MessagesSquare,
  Search,
  Sparkles,
} from "lucide-react";

import { AtlasPage } from "@/components/atlas/AtlasPage";
import { SoftPanel } from "@/components/atlas/SoftPanel";
import { DevModeToggle } from "@/components/learn/DevModeToggle";
import { Button } from "@/components/ui/button";
import {
  FEATURED_PATH_IDS,
  LEARNING_PATHS,
  POPULAR_QUESTIONS,
  type LearningPathCard,
  type LearningTopicId,
  type PopularQuestionCard,
} from "@/lib/learn/discovery";
import { getLearningModuleBySlug, learningModules } from "@/lib/learn/modules";
import { useProgress } from "@/lib/progress/store";
import { LEARNING_TRACKS } from "@/lib/tracks/config";
import { cn } from "@/lib/utils";

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
  {
    card: string;
    icon: string;
  }
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

const TOPIC_ICONS: Record<LearningTopicId, ElementType> = {
  economy: Banknote,
  "politics-and-democracy": Landmark,
  "cities-and-ecology": Leaf,
  "media-and-information": Brain,
};

const TOPIC_LABELS: Record<LearningTopicId, string> = {
  economy: "Economy",
  "politics-and-democracy": "Politics",
  "cities-and-ecology": "Ecology",
  "media-and-information": "Media",
};

const TOPIC_CARD_IMAGES: Record<LearningTopicId, string> = {
  economy: "/atlas/home-domain-economy.png",
  "politics-and-democracy": "/atlas/home-domain-politics-democracy.png",
  "cities-and-ecology": "/atlas/home-domain-cities-everyday-life.png",
  "media-and-information": "/atlas/home-domain-media-information.png",
};

const TOPIC_TAGLINES: Record<LearningTopicId, string> = {
  economy: "Money, inequality, banking, and the rules of growth.",
  "politics-and-democracy": "Power, institutions, accountability, and collective action.",
  "cities-and-ecology": "Climate, pollution, housing, and the systems of everyday life.",
  "media-and-information": "Attention, narratives, platforms, and opinion formation.",
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

function matchesQuery(values: Array<string | undefined>, query: string) {
  if (!query.trim()) return true;
  const normalizedQuery = query.trim().toLowerCase();
  return values.some((value) => value?.toLowerCase().includes(normalizedQuery));
}

function getPathStartSlug(path: LearningPathCard, getModule: ReturnType<typeof useProgress>["getModule"]) {
  return path.moduleSlugs.find((slug) => !getModule(slug).quizPassed) ?? path.moduleSlugs[0];
}

function getPathProgress(path: LearningPathCard, getModule: ReturnType<typeof useProgress>["getModule"]) {
  const completed = path.moduleSlugs.filter((slug) => getModule(slug).quizPassed).length;
  const percent = path.moduleSlugs.length === 0 ? 0 : Math.round((completed / path.moduleSlugs.length) * 100);
  return { completed, percent };
}

function QuestionCard({
  isSelected,
  moduleCountHref,
  onSelect,
  openHref,
  question,
}: {
  isSelected: boolean;
  moduleCountHref: string;
  onSelect: () => void;
  openHref: string;
  question: PopularQuestionCard;
}) {
  const Icon = QUESTION_ICONS[question.icon];
  const tone = QUESTION_CARD_TONES[question.icon];

  return (
    <button
      className={cn(
        "flex h-full flex-col justify-between rounded-[1.65rem] border px-4 py-4 text-left shadow-[0_14px_28px_rgba(28,36,48,0.04)] transition-all",
        tone.card,
        isSelected
          ? "border-primary shadow-[0_18px_38px_rgba(59,130,246,0.10)]"
          : "border-[rgba(28,36,48,0.08)] hover:border-[rgba(28,36,48,0.18)] hover:shadow-[0_18px_36px_rgba(28,36,48,0.06)]",
      )}
      onClick={onSelect}
      type="button"
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
          <Link
            className="font-medium transition hover:text-slate-800"
            href={moduleCountHref}
            onClick={(event) => event.stopPropagation()}
          >
            {question.moduleCount} modules
          </Link>
          <span className="inline-flex items-center gap-1 rounded-full bg-[rgba(246,244,238,0.88)] px-2.5 py-1 text-xs font-medium text-slate-600">
            +{question.learnerCount}
          </span>
        </div>
        <Link
          className="inline-flex items-center gap-1 font-semibold text-primary"
          href={openHref}
          onClick={(event) => event.stopPropagation()}
        >
          Open
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </button>
  );
}

function PathRow({
  href,
  imageSrc,
  isSelected,
  onPreview,
  path,
  progressLabel,
}: {
  href: string;
  imageSrc: string;
  isSelected: boolean;
  onPreview: () => void;
  path: LearningPathCard;
  progressLabel: string;
}) {
  const pathTopics = path.topicIds.map((topicId) => TOPIC_LABELS[topicId]);

  return (
    <article
      className={cn(
        "grid gap-4 rounded-[1.7rem] border bg-white p-3.5 shadow-[0_14px_26px_rgba(28,36,48,0.04)] transition-all md:grid-cols-[12rem_minmax(0,1fr)_11rem] md:items-center md:p-4",
        isSelected
          ? "border-primary shadow-[0_20px_44px_rgba(59,130,246,0.10)]"
          : "border-[rgba(28,36,48,0.08)]",
      )}
    >
      <div className="relative h-[8.35rem] overflow-hidden rounded-[1.2rem] md:h-[7rem]">
        <Image alt={path.title} className="object-cover object-center" fill sizes="220px" src={imageSrc} />
      </div>

      <div className="space-y-3 md:space-y-2.5">
        <div className="space-y-1.5">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-slate-400">{path.question}</p>
          <h3 className="text-[1.22rem] font-semibold leading-7 text-slate-900">{path.title}</h3>
          <p className="max-w-[41rem] text-[0.94rem] leading-6 text-slate-600">{path.summary}</p>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
          <span className="inline-flex items-center gap-1.5">
            <BookOpenText className="h-3.5 w-3.5 text-slate-400" />
            {path.moduleSlugs.length} lessons
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock3 className="h-3.5 w-3.5 text-slate-400" />
            {path.duration}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-slate-400" />
            {pathTopics.length} topic{pathTopics.length === 1 ? "" : "s"}
          </span>
          <span className="text-slate-400">·</span>
          <span>{progressLabel}</span>
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

      <div className="flex flex-col items-start justify-between gap-3 md:h-full md:items-end">
        <div className="flex flex-wrap items-center gap-1.5 md:justify-end">
          {pathTopics.map((topic) => (
            <span
              className="rounded-full bg-[rgba(246,244,238,0.82)] px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-slate-500"
              key={topic}
            >
              {topic}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-3 md:flex-col md:items-end">
          <button
            className="text-sm font-semibold text-slate-600 transition hover:text-slate-900"
            onClick={onPreview}
            type="button"
          >
            Preview path
          </button>
          <Button asChild className="rounded-full px-5">
          <Link href={href}>
            Start path
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}

function TopicCard({
  href,
  lessons,
  paths,
  title,
  topicId,
}: {
  href: string;
  lessons: number;
  paths: number;
  title: string;
  topicId: LearningTopicId;
}) {
  const Icon = TOPIC_ICONS[topicId];
  const imageSrc = TOPIC_CARD_IMAGES[topicId];

  return (
    <Link
      className={cn(
        "relative flex h-full min-h-[13rem] flex-col justify-between overflow-hidden rounded-[1.45rem] border bg-white px-4 py-4 text-left shadow-[0_12px_24px_rgba(28,36,48,0.04)] transition-all",
        "border-[rgba(28,36,48,0.08)] hover:border-[rgba(28,36,48,0.16)] hover:shadow-[0_18px_36px_rgba(28,36,48,0.06)]",
      )}
      href={href}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <Image
          alt={title}
          className="object-cover object-center"
          fill
          sizes="(min-width: 1280px) 22vw, (min-width: 768px) 45vw, 100vw"
          src={imageSrc}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.66)_0%,rgba(255,255,255,0.52)_28%,rgba(255,255,255,0.28)_58%,rgba(255,255,255,0.4)_100%)]" />
      </div>

      <div className="relative z-10 space-y-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(28,36,48,0.12)] bg-white/92 text-primary">
          <Icon className="h-5 w-5" />
        </div>

        <div className="space-y-2">
          <h3 className="text-[1.03rem] font-semibold leading-6 text-slate-900">{title}</h3>
          <p className="text-sm leading-6 text-slate-600">{TOPIC_TAGLINES[topicId]}</p>
          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <span>{lessons} lessons</span>
            <span className="text-slate-300">•</span>
            <span>{paths} paths</span>
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-5 h-px w-full bg-[rgba(28,36,48,0.08)]" />
    </Link>
  );
}

export default function LearnPage() {
  const searchParams = useSearchParams();
  const { getModule } = useProgress();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedQuestionId, setSelectedQuestionId] = useState(POPULAR_QUESTIONS[0]?.id ?? "");
  const [selectedPathId, setSelectedPathId] = useState(FEATURED_PATH_IDS[0] ?? LEARNING_PATHS[0]?.id ?? "");
  const [showAllPaths, setShowAllPaths] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);

  useEffect(() => {
    const requestedQuestion = searchParams.get("question");
    const requestedPath = searchParams.get("path") ?? searchParams.get("journey");
    const requestedTopic = searchParams.get("topic") ?? searchParams.get("track");
    const requestedLibrary = searchParams.get("showLibrary");

    const questionMatch = requestedQuestion
      ? POPULAR_QUESTIONS.find((question) => question.id === requestedQuestion)
      : null;
    const pathMatch = requestedPath
      ? LEARNING_PATHS.find((path) => path.id === requestedPath)
      : null;
    const topicMatch = requestedTopic
      ? LEARNING_TRACKS.find((track) => track.id === requestedTopic)
      : null;

    if (questionMatch) {
      setSelectedQuestionId(questionMatch.id);
      setSelectedPathId(questionMatch.pathId);
      setShowAllPaths(true);
    } else if (pathMatch) {
      setSelectedPathId(pathMatch.id);
      setShowAllPaths(true);
      const relatedQuestion = POPULAR_QUESTIONS.find((question) => question.pathId === pathMatch.id);
      if (relatedQuestion) {
        setSelectedQuestionId(relatedQuestion.id);
      }
    }

    if (topicMatch && !questionMatch && !pathMatch) {
      const firstTopicPath = LEARNING_PATHS.find((path) => path.topicIds.includes(topicMatch.id));
      if (firstTopicPath) {
        setSelectedPathId(firstTopicPath.id);
        setShowAllPaths(true);
      }
    }

    if (requestedLibrary === "1") {
      setShowLibrary(true);
    }
  }, [searchParams]);

  const pathLookup = useMemo(
    () => new Map(LEARNING_PATHS.map((path) => [path.id, path])),
    [],
  );

  const popularQuestions = useMemo(
    () =>
      POPULAR_QUESTIONS.filter((question) =>
        matchesQuery(
          [question.title, question.description, pathLookup.get(question.pathId)?.title],
          searchQuery,
        ),
      ),
    [pathLookup, searchQuery],
  );

  const matchingPaths = useMemo(
    () =>
      LEARNING_PATHS.filter((path) =>
        matchesQuery(
          [
            path.title,
            path.summary,
            path.question,
            ...path.tags,
            ...path.moduleSlugs.map((slug) => getLearningModuleBySlug(slug)?.title),
          ],
          searchQuery,
        ),
      ),
    [searchQuery],
  );

  const selectedQuestion =
    POPULAR_QUESTIONS.find((question) => question.id === selectedQuestionId) ??
    popularQuestions[0] ??
    POPULAR_QUESTIONS[0];

  const displayedPaths = useMemo(() => {
    if (showAllPaths || searchQuery.trim()) {
      return matchingPaths;
    }

    return LEARNING_PATHS.filter((path) => FEATURED_PATH_IDS.includes(path.id));
  }, [matchingPaths, searchQuery, showAllPaths]);

  const selectedPath =
    LEARNING_PATHS.find((path) => path.id === selectedPathId) ??
    displayedPaths[0] ??
    LEARNING_PATHS[0];

  const selectedQuestionPath =
    LEARNING_PATHS.find((path) => path.id === selectedQuestion?.pathId) ??
    selectedPath;

  const selectedQuestionModules = (selectedQuestionPath?.moduleSlugs ?? [])
    .map((slug) => getLearningModuleBySlug(slug))
    .filter((module): module is NonNullable<typeof module> => Boolean(module));

  const topicSummaries = useMemo(
    () =>
      LEARNING_TRACKS.map((track) => {
        const matchingTopicPaths = LEARNING_PATHS.filter((path) => path.topicIds.includes(track.id));
        const firstTopicModule = track.moduleSlugs
          .map((slug) => getLearningModuleBySlug(slug))
          .find((module): module is NonNullable<typeof module> => Boolean(module));
        const fallbackTopicSlug = matchingTopicPaths[0]?.moduleSlugs[0];
        return {
          href: firstTopicModule?.slug
            ? `/learn/${firstTopicModule.slug}`
            : fallbackTopicSlug
              ? `/learn/${fallbackTopicSlug}`
              : "/learn#browse-by-topic",
          id: track.id,
          lessons: track.moduleSlugs.length,
          paths: matchingTopicPaths.length,
          title: TOPIC_LABELS[track.id],
        };
      }),
    [],
  );

  const libraryGroups = useMemo(
    () =>
      LEARNING_TRACKS.map((track) => ({
        modules: track.moduleSlugs
          .map((slug) => getLearningModuleBySlug(slug))
          .filter((module): module is NonNullable<typeof module> => Boolean(module))
          .filter((module) => matchesQuery([module.title, module.summary, track.title], searchQuery)),
        track,
      })).filter((group) => group.modules.length > 0),
    [searchQuery],
  );

  return (
    <AtlasPage className="space-y-8 pb-16 md:space-y-10">
      <div className="flex items-center justify-between gap-4">
        <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
          Learn · {POPULAR_QUESTIONS.length} questions · {LEARNING_PATHS.length} paths · {LEARNING_TRACKS.length} topics · {learningModules.length} modules
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

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
          {popularQuestions.map((question) => {
            const path = pathLookup.get(question.pathId);
            const moduleListHref = `/learn?question=${question.id}#question-modules`;

            return (
              <QuestionCard
                isSelected={selectedQuestion?.id === question.id}
                key={question.id}
                moduleCountHref={moduleListHref}
                onSelect={() => {
                  setSelectedQuestionId(question.id);
                  setSelectedPathId(question.pathId);
                  setShowAllPaths(true);
                  document.getElementById("question-modules")?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                openHref={moduleListHref}
                question={{
                  ...question,
                  moduleCount: path?.moduleSlugs.length ?? question.moduleCount,
                }}
              />
            );
          })}
        </div>
      </section>

      <section className="space-y-4" id="question-modules">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(28,36,48,0.12)] bg-[rgba(246,244,238,0.76)] text-primary">
                <BookOpenText className="h-5 w-5" />
              </div>
              <h2 className="text-[1.85rem] font-semibold text-slate-900">Modules behind this question</h2>
            </div>
            <p className="text-sm leading-7 text-slate-600">
              {selectedQuestion?.title
                ? `Start with the modules that unpack "${selectedQuestion.title}".`
                : "Start with the modules that unpack this question."}
            </p>
          </div>
          {selectedQuestionPath ? (
            <Link className="text-sm font-semibold text-primary transition hover:text-blue-700" href={`/learn?path=${selectedQuestionPath.id}#learning-paths`}>
              View full path <span aria-hidden>→</span>
            </Link>
          ) : null}
        </div>

        <SoftPanel className="space-y-5" tone="blue">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-2">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-slate-400">
                {selectedQuestionPath?.question ?? selectedQuestion?.title}
              </p>
              <h3 className="atlas-display text-[2rem] leading-tight text-slate-900">
                {selectedQuestionPath?.title ?? "Question modules"}
              </h3>
              <p className="max-w-[46rem] text-sm leading-7 text-slate-600">
                {selectedQuestionPath?.summary ??
                  "These modules are the clearest route into the system behind this question."}
              </p>
            </div>
            <div className="rounded-full border border-[rgba(28,36,48,0.08)] bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              {selectedQuestionModules.length} modules
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
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
          </div>
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
            onClick={() => setShowAllPaths((value) => !value)}
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
                href={`/learn/${startSlug}`}
                imageSrc={path.imageSrc}
                isSelected={selectedPath?.id === path.id}
                key={path.id}
                onPreview={() => setSelectedPathId(path.id)}
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
              href={topic.href}
              key={topic.id}
              lessons={topic.lessons}
              paths={topic.paths}
              title={topic.title}
              topicId={topic.id}
            />
          ))}
        </div>
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
            onClick={() => setShowLibrary((value) => !value)}
            type="button"
          >
            {showLibrary ? "Hide module library" : "Open full module library"}
            {showLibrary ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>

        {showLibrary ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {libraryGroups.map(({ modules, track }) => (
              <div
                className="rounded-[1.45rem] border border-[rgba(28,36,48,0.08)] bg-white px-4 py-4"
                key={track.id}
              >
                <h3 className="text-base font-semibold text-slate-900">{TOPIC_LABELS[track.id]}</h3>
                <p className="mt-1 text-sm text-slate-500">{modules.length} matching lessons</p>
                <div className="mt-4 space-y-2">
                  {modules.map((module) => (
                    <Link
                      className="block rounded-[1rem] border border-[rgba(28,36,48,0.08)] px-3 py-3 text-sm text-slate-700 transition hover:border-[rgba(28,36,48,0.16)] hover:text-slate-900"
                      href={`/learn/${module.slug}`}
                      key={module.slug}
                    >
                      {module.title}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </SoftPanel>
    </AtlasPage>
  );
}

"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  BookOpenText,
  BriefcaseBusiness,
  ChevronDown,
  ClipboardCheck,
  Clock3,
  Coins,
  ExternalLink,
  Factory,
  Globe2,
  HandCoins,
  HeartPulse,
  Home,
  Landmark,
  Leaf,
  MessageSquare,
  Network,
  Scale,
  ShieldCheck,
  Sparkles,
  TimerReset,
  Users,
  Wallet,
} from "lucide-react";

import { LessonInteractive } from "@/components/learn/LessonInteractive";
import { LessonSectionHeader } from "@/components/learn/LessonSectionHeader";
import { extractFirstSentence, getExpectedObservations, lessonAccentClasses } from "@/components/learn/lesson-theme";
import { isKnownBrokenLearningChartUrl } from "@/lib/learn/chart-health";
import type {
  LearningArticleBlock,
  LearningArticleCard,
  LearningArticleChart,
  LearningArticleDocument,
  LearningArticleSource,
} from "@/lib/learn/content";
import type {
  AccentTone,
  LearningEvidenceLink,
  LearningModule,
  MiniLessonConfig,
  MiniLessonMetric,
  ResolvedLearningModule,
  StaticMiniLesson,
} from "@/lib/learn/modules";
import { getLessonSimulationHref } from "@/lib/learn/simulator-routing";
import type { LearningTrack } from "@/lib/tracks/config";
import { cn, withQuery } from "@/lib/utils";

type ArticleSection = {
  blocks: LearningArticleBlock[];
  heading?: string;
};

const WHY_IT_MATTERS_ICONS = [HeartPulse, TimerReset, Home, ShieldCheck, Leaf, Wallet] as const;
const METRIC_TONE_CLASSES: Record<
  AccentTone,
  { fill: string; panel: string; value: string }
> = {
  amber: {
    fill: "from-amber-400 to-amber-300",
    panel: "border-amber-200/80 bg-amber-50/40",
    value: "text-amber-700",
  },
  cyan: {
    fill: "from-cyan-500 to-blue-500",
    panel: "border-cyan-200/80 bg-cyan-50/40",
    value: "text-cyan-700",
  },
  emerald: {
    fill: "from-emerald-500 to-green-500",
    panel: "border-emerald-200/80 bg-emerald-50/40",
    value: "text-emerald-700",
  },
  rose: {
    fill: "from-rose-400 to-orange-400",
    panel: "border-rose-200/80 bg-rose-50/40",
    value: "text-rose-700",
  },
};
const COUNTER_ICONS = [MessageSquare, BarChart3, ShieldCheck, Scale, Users] as const;
const COUNTER_ICON_TONES = [
  "border-blue-100 bg-blue-50 text-blue-600",
  "border-slate-100 bg-slate-50 text-slate-600",
  "border-emerald-100 bg-emerald-50 text-emerald-600",
  "border-violet-100 bg-violet-50 text-violet-600",
  "border-amber-100 bg-amber-50 text-amber-600",
] as const;
const ACTION_ICON_TONES = [
  "border-blue-100 bg-blue-50 text-blue-600",
  "border-emerald-100 bg-emerald-50 text-emerald-600",
  "border-slate-100 bg-slate-50 text-slate-600",
  "border-amber-100 bg-amber-50 text-amber-600",
] as const;
const PROPOSAL_IMAGE_TONES = [
  "from-emerald-50/20 via-white/75 to-white",
  "from-blue-50/20 via-white/78 to-white",
  "from-amber-50/18 via-white/78 to-white",
] as const;

const COMPARISON_CANVAS_META: Record<
  string,
  {
    broaderLabel: string;
    dominantLabel: string;
    mechanismTitle: string;
  }
> = {
  "how-capitalism-socialism-and-communism-differ": {
    broaderLabel: "What institutional comparison sees",
    dominantLabel: "What slogan politics sees",
    mechanismTitle: "the design choices beneath the labels",
  },
  "how-doughnut-economics-puts-the-economy-inside-limits": {
    broaderLabel: "What an inside-limits lens sees",
    dominantLabel: "What growth-first economics sees",
    mechanismTitle: "the inside-limits correction",
  },
  "why-decoupling-growth-from-emissions-is-so-hard": {
    broaderLabel: "What carbon-budget math sees",
    dominantLabel: "What green-growth optimism sees",
    mechanismTitle: "the arithmetic trap",
  },
  "why-gdp-is-not-the-same-as-wellbeing": {
    broaderLabel: "What a good-life lens sees",
    dominantLabel: "What GDP sees",
    mechanismTitle: "the mismatch",
  },
};

type ComparisonLayoutPresetName = "standard" | "compact-quick-map";

type ComparisonLayoutPreset = {
  outerGrid: string;
  quickMapCompact: boolean;
  relaxed: boolean;
};

const COMPARISON_LAYOUT_PRESETS: Record<ComparisonLayoutPresetName, ComparisonLayoutPreset> = {
  standard: {
    outerGrid: "items-stretch xl:grid-cols-[1fr_2fr]",
    quickMapCompact: false,
    relaxed: false,
  },
  "compact-quick-map": {
    outerGrid: "items-start xl:grid-cols-[minmax(0,1.42fr)_minmax(0,0.88fr)]",
    quickMapCompact: true,
    relaxed: true,
  },
};

const COMPARISON_LAYOUT_PRESET_BY_SLUG: Partial<Record<string, ComparisonLayoutPresetName>> = {
  "why-gdp-is-not-the-same-as-wellbeing": "standard",
  "how-doughnut-economics-puts-the-economy-inside-limits": "compact-quick-map",
  "how-capitalism-socialism-and-communism-differ": "standard",
  "why-decoupling-growth-from-emissions-is-so-hard": "standard",
};

function compactSentence(text: string | undefined) {
  return extractFirstSentence(text)?.replace(/\s+/g, " ").trim() ?? "";
}

function contentWeight(chunks: Array<string | undefined>) {
  return chunks.reduce((total, chunk) => total + (chunk?.replace(/\s+/g, " ").trim().length ?? 0), 0);
}

function humanizeEnumLabel(value: string) {
  return value
    .split(/[_-]/g)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function cleanSystemBugTitle(title: string) {
  return title.replace(/^system bug:\s*/i, "").trim();
}

function getQuickMapCards(article?: LearningArticleDocument | null): LearningArticleCard[] {
  const cardsBlock = article?.blocks.find(
    (block): block is Extract<LearningArticleBlock, { type: "cards" }> => block.type === "cards",
  );

  return cardsBlock?.items ?? [];
}

function getArticleSections(article?: LearningArticleDocument | null): ArticleSection[] {
  if (!article) {
    return [];
  }

  const sections: ArticleSection[] = [];
  let currentSection: ArticleSection = { blocks: [] };
  let skippedQuickMap = false;

  for (const block of article.blocks) {
    if (!skippedQuickMap && block.type === "cards") {
      skippedQuickMap = true;
      continue;
    }

    if (block.type === "heading" && block.level === 2) {
      if (currentSection.heading || currentSection.blocks.length) {
        sections.push(currentSection);
      }
      currentSection = { blocks: [], heading: block.text };
      continue;
    }

    if (block.type === "sources") {
      continue;
    }

    currentSection.blocks.push(block);
  }

  if (currentSection.heading || currentSection.blocks.length) {
    sections.push(currentSection);
  }

  return sections;
}

function getParagraphs(blocks: LearningArticleBlock[]) {
  return blocks
    .filter((block): block is Extract<LearningArticleBlock, { type: "paragraph" }> => block.type === "paragraph")
    .map((block) => block.text);
}

function getLists(blocks: LearningArticleBlock[]) {
  return blocks
    .filter((block): block is Extract<LearningArticleBlock, { type: "list" }> => block.type === "list")
    .flatMap((block) => block.items);
}

function getCallouts(blocks: LearningArticleBlock[]) {
  return blocks
    .filter((block): block is Extract<LearningArticleBlock, { type: "callout" }> => block.type === "callout")
    .map((block) => block.text);
}

function getCharts(blocks: LearningArticleBlock[]) {
  return blocks
    .filter((block): block is Extract<LearningArticleBlock, { type: "charts" }> => block.type === "charts")
    .flatMap((block) => block.items);
}

function renderSourceLink(link: LearningArticleSource | LearningEvidenceLink) {
  return (
    <a
      className="flex items-start justify-between gap-3 rounded-[1rem] border border-[rgba(28,36,48,0.08)] bg-white px-3.5 py-3 text-left transition hover:border-[rgba(28,36,48,0.16)]"
      href={link.url}
      key={link.url}
      rel="noreferrer"
      target="_blank"
    >
      <div>
        {"label" in link ? <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">{link.label}</p> : null}
        {"source" in link ? <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">{link.source}</p> : null}
        <p className="mt-1.5 text-sm font-semibold text-slate-900">{"title" in link ? link.title : ""}</p>
        {"note" in link ? <p className="mt-1.5 text-xs leading-6 text-slate-500">{link.note}</p> : null}
      </div>
      <ExternalLink className="mt-0.5 h-3.5 w-3.5 flex-none text-slate-400" />
    </a>
  );
}

function EmbeddedEvidenceChart({
  chart,
  sources,
}: {
  chart: LearningArticleChart;
  sources: Array<LearningArticleSource | LearningEvidenceLink>;
}) {
  const chartIsBroken = isKnownBrokenLearningChartUrl(chart.url);

  return (
    <article className="space-y-3 rounded-[1.45rem] border border-[rgba(28,36,48,0.08)] bg-white p-4 shadow-[0_10px_28px_rgba(28,36,48,0.04)]">
      <div>
        <h3 className="text-lg font-semibold leading-tight text-slate-900">{chart.title}</h3>
        {chart.note ? <p className="mt-2 text-sm leading-7 text-slate-600">{chart.note}</p> : null}
      </div>

      {chartIsBroken ? (
        <div className="rounded-[1.15rem] border border-[rgba(28,36,48,0.08)] bg-[rgba(241,245,249,0.84)] px-4 py-4">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 flex-none items-center justify-center rounded-full border border-[rgba(28,36,48,0.08)] bg-white text-slate-600">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold text-slate-900">This chart link needs a fresh mapping</p>
              <p className="text-sm leading-6 text-slate-600">
                The original embed no longer resolves reliably. The source trail still works below, and we can remap this lesson to a live local series next.
              </p>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-3">
            <a
              className="inline-flex items-center gap-2 rounded-full border border-[rgba(28,36,48,0.08)] bg-white px-3 py-2 text-xs font-medium text-slate-700 transition hover:border-[rgba(28,36,48,0.16)]"
              href={chart.url}
              rel="noreferrer"
              target="_blank"
            >
              Open original chart
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>

          {sources.length ? <div className="mt-4 grid gap-3">{sources.slice(0, 2).map((link) => renderSourceLink(link))}</div> : null}
        </div>
      ) : (
        <div className="overflow-hidden rounded-[1.15rem] border border-[rgba(28,36,48,0.08)] bg-white">
          <iframe
            allow="web-share; clipboard-write"
            className="w-full"
            loading="eager"
            referrerPolicy="strict-origin-when-cross-origin"
            src={chart.url}
            style={{ border: 0, height: Math.max(340, Math.min(chart.height, 420)) }}
            title={chart.title}
          />
        </div>
      )}
    </article>
  );
}

function semanticIcon(label: string, index: number) {
  const lower = label.toLowerCase();

  if (lower.includes("health") || lower.includes("wellbeing")) return HeartPulse;
  if (lower.includes("time")) return Clock3;
  if (lower.includes("housing")) return Home;
  if (lower.includes("trust") || lower.includes("voice")) return Users;
  if (lower.includes("ecolog") || lower.includes("climate") || lower.includes("biodiversity")) return Leaf;
  if (lower.includes("money") || lower.includes("income") || lower.includes("wealth")) return Coins;
  if (lower.includes("ownership") || lower.includes("investment")) return BriefcaseBusiness;
  if (lower.includes("market")) return HandCoins;
  if (lower.includes("energy") || lower.includes("emission")) return Factory;
  if (lower.includes("power")) return ShieldCheck;

  const fallbackIcons = [Sparkles, Globe2, Scale, Wallet];
  return fallbackIcons[index % fallbackIcons.length];
}

function isStaticMiniLesson(lesson: MiniLessonConfig | StaticMiniLesson): lesson is StaticMiniLesson {
  return "conclusion" in lesson;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function computeMiniMetric(metric: MiniLessonMetric, sliderValue: number) {
  const value = clamp(metric.base + metric.slope * sliderValue, metric.min, metric.max);
  const fill = ((value - metric.min) / (metric.max - metric.min || 1)) * 100;
  return { ...metric, fill, value };
}

function formatMiniMetric(metric: ReturnType<typeof computeMiniMetric>) {
  return `${Math.round(metric.value * 10) / 10}${metric.suffix ?? ""}`;
}

function DynamicComparisonInteractivePanel({
  accent,
  lesson,
  module,
}: {
  accent: (typeof lessonAccentClasses)[AccentTone];
  lesson: MiniLessonConfig;
  module: ResolvedLearningModule;
}) {
  const [sliderValue, setSliderValue] = useState(lesson.defaultValue);
  const metrics = useMemo(
    () => lesson.metrics.map((metric) => computeMiniMetric(metric, sliderValue)),
    [lesson.metrics, sliderValue],
  );
  const activeInsight =
    [...lesson.bands]
      .sort((left, right) => left.threshold - right.threshold)
      .filter((band) => sliderValue >= band.threshold)
      .at(-1)?.insight ?? lesson.bands[0]?.insight ?? module.heroHighlights[1];

  return (
    <section className="relative z-[2] min-w-0 space-y-4" id="interactive-exploration">
      <LessonSectionHeader
        accent={module.accent}
        compact
        id="interactive-exploration-heading"
        index={6}
        subtitle="Adjust the central variable, watch the outcomes move together, and test whether the comparison still holds."
        title="Interactive exploration"
      />

      <div className="rounded-[1.9rem] border border-[rgba(28,36,48,0.08)] bg-white/84 px-4 py-4 shadow-[0_16px_30px_rgba(28,36,48,0.04)] sm:px-5 sm:py-5">
        <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,0.46fr)_minmax(0,0.54fr)]">
          <div className="min-w-0 rounded-[1.35rem] border border-[rgba(28,36,48,0.08)] bg-[rgba(247,250,252,0.96)] px-4 py-4">
            <h3 className="text-base font-semibold text-slate-900">{lesson.title}</h3>
            <p className="mt-2 text-sm leading-7 text-slate-600">{lesson.description}</p>

            <div className="mt-5 flex items-end justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">{lesson.sliderLabel}</p>
                <p className="mt-2 atlas-display text-[2.85rem] leading-none text-slate-900">
                  {sliderValue}
                  <span className="text-[1.5rem]">{lesson.unit ?? ""}</span>
                </p>
              </div>
              <div className="text-right text-xs text-slate-400">
                <div>{lesson.lowLabel}</div>
                <div className="mt-1">{lesson.highLabel}</div>
              </div>
            </div>

            <input
              className="mt-5 h-2 w-full cursor-pointer appearance-none rounded-full bg-[rgba(28,36,48,0.12)]"
              max={lesson.valueMax}
              min={lesson.valueMin}
              onChange={(event) => setSliderValue(Number(event.target.value))}
              step={lesson.step}
              style={{ accentColor: "#3B82F6" }}
              type="range"
              value={sliderValue}
            />

            <div className="mt-2 flex justify-between text-xs text-slate-400">
              <span>
                {lesson.valueMin}
                {lesson.unit ?? ""}
              </span>
              <span>
                {lesson.valueMax}
                {lesson.unit ?? ""}
              </span>
            </div>

            <div className={cn("mt-5 rounded-[1.2rem] border px-4 py-4 ring-1", accent.panel, accent.line, accent.ring)}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">What changes here</p>
              <p className="mt-2 text-sm leading-6 text-slate-700">{activeInsight}</p>
            </div>
          </div>

          <div className="grid min-w-0 content-start gap-3">
            <p className="text-[0.98rem] font-semibold tracking-[0.02em] text-slate-700">Illustrative outcomes</p>
            {metrics.map((metric) => {
              const tone = METRIC_TONE_CLASSES[metric.tone];
              const delta = metric.value - metric.base;
              const deltaStr = delta >= 0 ? `+${(Math.round(delta * 10) / 10)}` : String(Math.round(delta * 10) / 10);
              const deltaColor = delta > 0
                ? (metric.tone === "rose" ? "text-rose-600" : "text-emerald-600")
                : (metric.tone === "cyan" || metric.tone === "emerald" ? "text-rose-600" : "text-emerald-600");
              return (
                <article
                  className="flex min-w-0 items-center justify-between gap-3 rounded-[1.15rem] border border-[rgba(28,36,48,0.08)] bg-white px-4 py-3.5 shadow-[0_4px_10px_rgba(28,36,48,0.03)]"
                  key={metric.key}
                >
                  <div className="min-w-0">
                    <p className="text-[1rem] font-semibold leading-6 text-slate-700">{metric.label}</p>
                    {metric.description ? (
                      <p className="mt-0.5 truncate text-[0.92rem] leading-5 text-slate-500">{metric.description}</p>
                    ) : null}
                  </div>
                  <div className="flex min-w-[5rem] flex-none items-baseline justify-end gap-2">
                    <span className={cn("text-[1.6rem] font-bold leading-none tracking-tight", tone.value)}>
                      {formatMiniMetric(metric)}
                    </span>
                    <span className={cn("text-[0.94rem] font-semibold", deltaColor)}>{deltaStr}</span>
                  </div>
                </article>
              );
            })}

            <div className={cn("rounded-[1.2rem] border px-4 py-4", accent.panel, accent.line)}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Key lesson</p>
              <p className="mt-2 text-sm leading-7 text-slate-700">{module.heroHighlights[1] ?? module.systemBug.summary}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ComparisonInteractivePanel({ module }: { module: ResolvedLearningModule }) {
  const lesson = module.miniLesson;
  const accent = lessonAccentClasses[module.accent];

  if (isStaticMiniLesson(lesson)) {
    return <LessonInteractive compact indexOverride={6} module={module} />;
  }

  return <DynamicComparisonInteractivePanel accent={accent} lesson={lesson} module={module} />;
}

function ComparisonCounterargumentsSection({ module }: { module: ResolvedLearningModule }) {
  return (
    <section className="relative z-[1] min-w-0 space-y-4" id="counterarguments">
      <LessonSectionHeader
        accent={module.accent}
        compact
        id="counterarguments-heading"
        index={7}
        subtitle="Strong objections, shown in the same frame as the lesson so the disagreement stays concrete."
        title="Counterarguments"
      />

      <div className="overflow-hidden rounded-[1.8rem] border border-[rgba(28,36,48,0.08)] bg-white/84 shadow-[0_16px_30px_rgba(28,36,48,0.04)]">
        {module.counterArguments.map((argument, index) => {
          const Icon = COUNTER_ICONS[index % COUNTER_ICONS.length];
          const tone = COUNTER_ICON_TONES[index % COUNTER_ICON_TONES.length];

          return (
            <details
              className="group border-b border-[rgba(28,36,48,0.08)] last:border-b-0"
              key={argument.title}
              open={index === 0}
            >
              <summary className="flex cursor-pointer list-none items-start gap-3 px-4 py-4">
                <span className={cn("inline-flex h-9 w-9 flex-none items-center justify-center rounded-[0.7rem] border", tone)}>
                  <Icon className="h-4 w-4" />
                </span>
                <div className="flex flex-1 items-start justify-between gap-3">
                  <div>
                    <p className="text-[1.06rem] font-semibold leading-6 text-slate-900">{argument.title}</p>
                    <p className="mt-0.5 line-clamp-1 text-sm leading-5 text-slate-500">{argument.point}</p>
                  </div>
                  <span className="mt-0.5 inline-flex items-center justify-center text-slate-400 transition group-open:rotate-180">
                    <ChevronDown className="h-4 w-4 flex-none" />
                  </span>
                </div>
              </summary>

              <div className="border-t border-[rgba(28,36,48,0.08)] bg-[rgba(247,250,252,0.78)] px-4 py-4">
                <div className="grid gap-3 xl:grid-cols-[minmax(0,0.36fr)_minmax(0,0.64fr)]">
                  <div className="rounded-[1rem] border border-[rgba(28,36,48,0.08)] bg-white px-3.5 py-3.5">
                    <p className="text-[0.96rem] font-semibold tracking-[0.02em] text-slate-700">Claim</p>
                    <p className="mt-2 text-sm leading-6 text-slate-700">{argument.point}</p>
                  </div>

                  <div className="rounded-[1rem] border border-[rgba(28,36,48,0.08)] bg-white px-3.5 py-3.5">
                    <p className="text-[0.96rem] font-semibold tracking-[0.02em] text-slate-700">Why our answer holds</p>
                    <p className="mt-2 text-sm leading-6 text-slate-700">{argument.response}</p>
                    <p className="mt-2 text-xs leading-5 text-slate-500">
                      Re-read the evidence and case studies above to test whether this objection truly breaks the mechanism or simply names a tradeoff inside it.
                    </p>
                  </div>
                </div>
              </div>
            </details>
          );
        })}
      </div>
    </section>
  );
}

function ComparisonNextActionsSection({
  currentTrack,
  module,
  nextModule,
  quizQuestionCount,
}: {
  currentTrack?: LearningTrack | null;
  module: ResolvedLearningModule;
  nextModule?: LearningModule | null;
  quizQuestionCount?: number;
}) {
  const discussionHref = withQuery("/discussions", {
    module: module.slug,
    prompt: module.discussionPrompt,
  });
  const simulationHref = getLessonSimulationHref(module, currentTrack);
  const continueHref = nextModule ? `/learn/${nextModule.slug}` : "/learn?view=tracks";
  const quizHref = `/quiz/${module.slug}`;

  const actions = [
    {
      cta: "Go to discussions →",
      description: "Join a conversation with peers and share perspectives.",
      href: discussionHref,
      icon: MessageSquare,
      iconTone: ACTION_ICON_TONES[0],
      label: "Discuss this idea",
    },
    {
      cta: "Open simulator →",
      description: "Test scenarios and explore long-term impacts.",
      href: simulationHref,
      icon: Network,
      iconTone: ACTION_ICON_TONES[1],
      label: "Run a simulation",
    },
    {
      cta: "Open governance lab →",
      description: "See proposals and reforms that could reshape the system.",
      href: module.proposals?.length ? "#what-could-change" : "/governance",
      icon: Landmark,
      iconTone: ACTION_ICON_TONES[2],
      label: "Explore reforms",
    },
    {
      cta: "Go to study library →",
      description: "Find readings, videos, and data to go deeper.",
      href: "/study",
      icon: BookOpenText,
      iconTone: ACTION_ICON_TONES[3],
      label: "Study more",
    },
  ];

  return (
    <section className="space-y-4" id="next-actions">
      <div className="rounded-[1.75rem] border border-[rgba(28,36,48,0.08)] bg-white px-5 py-5 shadow-[0_16px_32px_rgba(28,36,48,0.045)]">
        <div className="flex items-start justify-between gap-4">
          <LessonSectionHeader
            accent={module.accent}
            compact
            id="next-actions-heading"
            index={9}
            subtitle="Choose your next step."
            title="Choose your next step"
          />
          {quizQuestionCount ? (
            <Link
              className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(37,99,235,0.18)] transition hover:bg-blue-700"
              href={quizHref}
            >
              Quiz
              <ClipboardCheck className="h-4 w-4" />
            </Link>
          ) : null}
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                className="flex min-h-[11rem] flex-col rounded-[1.2rem] border border-[rgba(28,36,48,0.08)] bg-white px-4 py-4 transition hover:border-[rgba(28,36,48,0.16)]"
                href={action.href}
                key={action.label}
              >
                <div className="flex items-start gap-3">
                  <div className={cn("flex h-9 w-9 flex-none items-center justify-center rounded-full border", action.iconTone)}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">{action.label}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{action.description}</p>
                  </div>
                </div>
                <p className="mt-auto pt-3 text-sm font-semibold text-primary">{action.cta}</p>
              </Link>
            );
          })}
        </div>

        <div className="mt-3 flex items-center justify-between rounded-[1rem] border border-[rgba(28,36,48,0.08)] bg-white px-4 py-3">
          <p className="text-sm text-slate-600">
            {nextModule ? `Continue with ${nextModule.title}.` : "Open the broader track and keep exploring from here."}
          </p>
          <Link className="inline-flex items-center gap-2 text-sm font-semibold text-primary" href={continueHref}>
            {nextModule ? "Continue the track" : "Open track explorer"}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function ComparisonReformsSection({
  heroImageSrc,
  module,
  supportImageSrc,
}: {
  heroImageSrc: string;
  module: ResolvedLearningModule;
  supportImageSrc: string;
}) {
  if (!module.proposals?.length) {
    return null;
  }

  const governanceHref = `/governance/submit?module=${module.slug}`;
  const proposalImages = [supportImageSrc, heroImageSrc, supportImageSrc];
  const proposalCount = module.proposals.length;
  const proposalGridClass =
    proposalCount <= 1
      ? "xl:grid-cols-1"
      : proposalCount === 2
        ? "xl:grid-cols-2"
        : "xl:grid-cols-2 2xl:grid-cols-3";

  return (
    <section className="space-y-4" id="what-could-change">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[rgba(236,253,245,0.95)] text-xs font-semibold text-slate-700">
              10
            </span>
            <h2 className="atlas-display text-[1.75rem] leading-tight text-slate-900">What could change this?</h2>
            <span className="text-sm font-medium text-slate-500">Proven and emerging reforms</span>
          </div>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            Each proposal below addresses a root cause identified in this module and has at least one documented precedent.
          </p>
        </div>

        <Link
          className="inline-flex items-center gap-2 rounded-full border border-[rgba(28,36,48,0.12)] bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-[0_10px_22px_rgba(28,36,48,0.05)] transition hover:border-[rgba(28,36,48,0.18)] hover:text-slate-900"
          href={governanceHref}
        >
          Add your proposal
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className={cn("grid gap-4", proposalGridClass)}>
        {module.proposals.map((proposal, index) => (
          <article
            className={cn(
              "relative overflow-hidden rounded-[1.45rem] border border-[rgba(28,36,48,0.08)] bg-white px-4 py-4 shadow-[0_14px_30px_rgba(28,36,48,0.05)]",
              proposalCount === 3 && index === 2 ? "xl:col-span-2 2xl:col-span-1" : "",
            )}
            key={proposal.title}
          >
            <div className={cn("pointer-events-none absolute inset-0 bg-gradient-to-br", PROPOSAL_IMAGE_TONES[index % PROPOSAL_IMAGE_TONES.length])} />
            <div className="relative z-[1] pr-28">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex rounded-full border border-[rgba(28,36,48,0.08)] bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                  {humanizeEnumLabel(proposal.feasibility)}
                </span>
                <span className="inline-flex rounded-full border border-[rgba(28,36,48,0.08)] bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                  {humanizeEnumLabel(proposal.actor)}
                </span>
                <span className="inline-flex rounded-full border border-[rgba(28,36,48,0.08)] bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                  {humanizeEnumLabel(proposal.domain)}
                </span>
              </div>

              <h3 className="mt-3 text-[1.05rem] font-semibold leading-6 text-slate-900">{proposal.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{proposal.summary}</p>

              {proposal.precedents?.length ? (
                <div className="mt-4 space-y-2">
                  <p className="text-[0.98rem] font-semibold tracking-[0.02em] text-slate-700">Exploring today</p>
                  {proposal.precedents.slice(0, 2).map((precedent) => (
                    <div className="rounded-[0.95rem] border border-[rgba(28,36,48,0.08)] bg-white/90 px-3 py-2.5" key={`${proposal.title}-${precedent.place}-${precedent.year}`}>
                      <p className="text-[1rem] font-semibold text-slate-700">
                        {precedent.place}
                        <span className="ml-1.5 text-[0.92rem] font-normal text-slate-400">{precedent.year}</span>
                      </p>
                      <p className="mt-1 text-[0.94rem] leading-6 text-slate-500">{precedent.outcome}</p>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="absolute bottom-0 right-0 h-32 w-32 overflow-hidden rounded-tl-[1.4rem] border-l border-t border-[rgba(28,36,48,0.06)]">
              <Image
                alt={proposal.title}
                className="object-cover"
                fill
                sizes="180px"
                src={proposalImages[index % proposalImages.length]}
              />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent via-white/10 to-white/90" />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function ComparisonLessonCanvas({
  article,
  currentTrack,
  heroImageSrc,
  module,
  nextModule,
  quizQuestionCount,
  supportImageSrc,
}: {
  article?: LearningArticleDocument | null;
  currentTrack?: LearningTrack | null;
  heroImageSrc: string;
  module: ResolvedLearningModule;
  nextModule?: LearningModule | null;
  quizQuestionCount?: number;
  supportImageSrc: string;
}) {
  const accent = lessonAccentClasses[module.accent];
  const quickMapCards = getQuickMapCards(article).slice(0, 4);
  const sections = getArticleSections(article);
  const evidenceSectionIndex = sections.findIndex(
    (section) =>
      /evidence/i.test(section.heading ?? "") ||
      section.blocks.some((block) => block.type === "charts"),
  );
  const evidenceSection = evidenceSectionIndex >= 0 ? sections[evidenceSectionIndex] : undefined;
  const bigPictureSection = sections[0];
  const supportingSections = sections.filter((_, index) => index !== 0 && index !== evidenceSectionIndex);
  const mechanismSupportSection = supportingSections[0];
  const askInsteadSection = supportingSections.find((section) => /ask instead/i.test(section.heading ?? ""));
  const trailingInsightSections = supportingSections.filter(
    (section) => section !== mechanismSupportSection && section !== askInsteadSection,
  );
  const remainingInsightSections = askInsteadSection ? trailingInsightSections : trailingInsightSections.slice(1);
  const evidenceSources =
    article?.blocks.find(
      (block): block is Extract<LearningArticleBlock, { type: "sources" }> => block.type === "sources",
    )?.items ?? module.evidenceLinks ?? [];
  const evidenceCharts = evidenceSection ? getCharts(evidenceSection.blocks) : [];
  const evidenceLeadParagraphs = evidenceSection ? getParagraphs(evidenceSection.blocks) : [];
  const evidenceLeadBullets = evidenceSection ? getLists(evidenceSection.blocks) : [];
  const bigPictureParagraphs = bigPictureSection ? getParagraphs(bigPictureSection.blocks) : module.simpleExplanation.slice(0, 2);
  const bigPictureCallout = bigPictureSection ? getCallouts(bigPictureSection.blocks)[0] : undefined;
  const comparisonMeta = COMPARISON_CANVAS_META[module.slug] ?? {
    broaderLabel: "What a fuller lens sees",
    dominantLabel: "What the dominant lens sees",
    mechanismTitle: cleanSystemBugTitle(module.systemBug.title),
  };
  const whyItMattersCards = module.betterMetrics.slice(0, 3);
  const whyItMattersWeight = contentWeight(
    whyItMattersCards.flatMap((metric) => [metric.label, compactSentence(metric.description)]),
  );
  const whyItMattersAverageWeight = whyItMattersCards.length > 0 ? whyItMattersWeight / whyItMattersCards.length : 0;
  const quickMapSeedCards =
    quickMapCards.length
      ? quickMapCards
      : module.heroHighlights.slice(0, 4).map((item, index) => ({
          body: item,
          title: `Lens ${index + 1}`,
        }));
  const quickMapWeight = contentWeight(
    quickMapSeedCards.flatMap((card) => [card.title, compactSentence(card.body)]),
  );
  const quickMapAverageWeight = quickMapSeedCards.length > 0 ? quickMapWeight / quickMapSeedCards.length : 0;
  const topRowShouldRelax =
    quickMapSeedCards.length >= 4 &&
    (quickMapWeight < whyItMattersWeight * 0.92 ||
      quickMapAverageWeight < whyItMattersAverageWeight * 0.72);
  const fallbackLayoutPresetName: ComparisonLayoutPresetName = topRowShouldRelax && quickMapSeedCards.length >= 4
    ? "compact-quick-map"
    : "standard";
  const layoutPresetName = COMPARISON_LAYOUT_PRESET_BY_SLUG[module.slug] ?? fallbackLayoutPresetName;
  const layoutPreset = COMPARISON_LAYOUT_PRESETS[layoutPresetName];
  const quickMapShouldUseCompactGrid = layoutPreset.quickMapCompact && quickMapSeedCards.length >= 4;
  const dominantLensPoints = module.heroHighlights.slice(0, 3);
  const broaderLensPoints = module.betterMetrics.slice(0, 5);
  const expectedObservations = getExpectedObservations(module);
  const evidenceNotes = [
    {
      body: module.systemBug.summary,
      title: "Claim",
    },
    {
      body:
        expectedObservations.length > 0
          ? expectedObservations.join(" ")
          : "If this explanation is right, the charts should reveal the same mismatch across the strongest available indicators.",
      title: "What would we expect to observe?",
    },
  ];
  const realWorldImages = [supportImageSrc, heroImageSrc, supportImageSrc, heroImageSrc];

  return (
    <div className="space-y-6 xl:space-y-7">
      <div
        className={cn(
          "grid gap-6",
          layoutPreset.outerGrid,
        )}
      >
        <section
          className={cn(
            "space-y-4",
            layoutPreset.relaxed ? "" : "flex h-full flex-col",
          )}
          id="why-this-matters"
        >
          <LessonSectionHeader
            accent={module.accent}
            compact
            id="why-this-matters-heading"
            index={1}
            subtitle="Three practical reasons this distinction matters before we get into the evidence and mechanism."
            title="Why this matters"
          />

          <div
            className={cn(
              "rounded-[1.8rem] border border-[rgba(28,36,48,0.08)] bg-white/84 px-4 py-4 shadow-[0_16px_30px_rgba(28,36,48,0.04)] sm:px-5 sm:py-5",
              layoutPreset.relaxed ? "" : "flex h-full",
            )}
          >
            <div className="grid gap-3 md:grid-cols-3">
              {whyItMattersCards.map((metric, index) => {
                const Icon = WHY_IT_MATTERS_ICONS[index % WHY_IT_MATTERS_ICONS.length];
                return (
                  <article
                    className="flex h-full flex-col rounded-[1.25rem] border border-[rgba(28,36,48,0.08)] bg-white px-4 py-4 shadow-[0_4px_12px_rgba(28,36,48,0.02)]"
                    key={metric.label}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-[0.75rem] border border-[rgba(28,36,48,0.09)] bg-[rgba(246,244,238,0.8)] text-slate-600">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-3 text-base font-semibold leading-tight text-slate-900">{metric.label}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{compactSentence(metric.description)}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section
          className={cn(
            "space-y-4",
            layoutPreset.relaxed ? "" : "flex h-full flex-col",
          )}
          id="quick-map"
        >
          <LessonSectionHeader
            accent={module.accent}
            compact
            id="quick-map-heading"
            index={2}
            subtitle="A fast orienting view before the deeper argument and evidence trail."
            title="Quick map"
          />

          <div
            className={cn(
              "rounded-[1.8rem] border border-[rgba(28,36,48,0.08)] bg-white/84 px-4 py-4 shadow-[0_16px_30px_rgba(28,36,48,0.04)] sm:px-5 sm:py-5",
              layoutPreset.relaxed ? "" : "flex h-full",
            )}
          >
            <div
              className={cn(
                "grid gap-3 md:grid-cols-2",
                quickMapShouldUseCompactGrid ? "xl:grid-cols-2" : "xl:grid-cols-4",
              )}
            >
              {quickMapSeedCards.map((card, index) => {
                return (
                  <article
                    className={cn(
                      "flex flex-col rounded-[1.25rem] border border-[rgba(28,36,48,0.08)] bg-white px-4 py-4 shadow-[0_4px_12px_rgba(28,36,48,0.02)]",
                      layoutPreset.relaxed ? "" : "h-full",
                    )}
                    key={`${card.title}-${index}`}
                  >
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-[0.5rem] bg-slate-900 text-xs font-semibold text-white">
                      {index + 1}
                    </span>
                    <h3 className="mt-3 text-sm font-semibold leading-tight text-slate-900">{card.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{card.body}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      </div>

      <div className="grid items-stretch gap-6 xl:grid-cols-[1fr_2fr]">
        <section className="flex h-full flex-col gap-4" id="big-picture">
          <LessonSectionHeader
            accent={module.accent}
            compact
            id="big-picture-heading"
            index={3}
            subtitle="The core narrative before we start comparing what each lens notices and what it hides."
            title="Big picture"
          />

          <div className="flex flex-1 flex-col overflow-hidden rounded-[1.8rem] border border-[rgba(28,36,48,0.08)] bg-white/84 shadow-[0_16px_30px_rgba(28,36,48,0.04)]">
            <div className="space-y-3 px-4 py-4 sm:px-5 sm:py-5">
              {bigPictureSection?.heading && !/^big picture$/i.test(bigPictureSection.heading) ? (
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{bigPictureSection.heading}</p>
              ) : null}

              {bigPictureParagraphs.map((paragraph) => (
                <p className="text-[0.95rem] leading-7 text-slate-700" key={paragraph}>
                  {paragraph}
                </p>
              ))}

              {bigPictureCallout ? (
                <div className={cn("rounded-[1.25rem] border px-4 py-4 ring-1", accent.panel, accent.line, accent.ring)}>
                  <p className="text-sm leading-7 text-slate-800">{bigPictureCallout}</p>
                </div>
              ) : null}
            </div>

            <div className="relative min-h-[12rem] flex-1 border-t border-[rgba(28,36,48,0.08)]">
              <Image
                alt={`${module.title} supporting illustration`}
                className="object-cover"
                fill
                sizes="(min-width: 1280px) 520px, 100vw"
                src={supportImageSrc}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white/10 via-transparent to-transparent" />
            </div>
          </div>
        </section>

        <section className="flex h-full flex-col gap-4" id="core-mechanism">
          <LessonSectionHeader
            accent={module.accent}
            compact
            id="core-mechanism-heading"
            index={4}
            subtitle="The compare module works by showing what the dominant frame notices, what it misses, and why the blind spot keeps repeating."
            title={`Core mechanism: ${comparisonMeta.mechanismTitle}`}
          />

          <div className="flex flex-1 flex-col rounded-[1.8rem] border border-[rgba(28,36,48,0.08)] bg-white/84 px-4 py-4 shadow-[0_16px_30px_rgba(28,36,48,0.04)] sm:px-5 sm:py-5">
            <div className="grid flex-1 gap-4 xl:grid-cols-3">
              <article className="flex h-full flex-col rounded-[1.3rem] border border-[rgba(28,36,48,0.08)] bg-[rgba(244,248,252,0.92)] px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
                <h3 className="text-[1rem] font-semibold text-slate-900">{comparisonMeta.dominantLabel}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{compactSentence(module.simpleExplanation[1] ?? module.summary)}</p>
                <ul className="mt-4 space-y-2.5">
                  {dominantLensPoints.map((point, index) => {
                    const Icon = semanticIcon(point, index);
                    return (
                      <li className="flex items-start gap-2.5 text-sm leading-6 text-slate-700" key={point}>
                        <span className="mt-0.5 inline-flex h-7 w-7 flex-none items-center justify-center rounded-[0.5rem] border border-[rgba(28,36,48,0.09)] bg-[rgba(246,244,238,0.8)] text-slate-500">
                          <Icon className="h-3.5 w-3.5" />
                        </span>
                        <span>{point}</span>
                      </li>
                    );
                  })}
                </ul>
              </article>

              <article className="flex h-full flex-col rounded-[1.3rem] border border-[rgba(28,36,48,0.08)] bg-white px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
                <h3 className="text-[1rem] font-semibold text-slate-900">{comparisonMeta.broaderLabel}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{compactSentence(module.simpleExplanation[3] ?? module.summary)}</p>
                <ul className="mt-4 space-y-2.5">
                  {broaderLensPoints.map((metric, index) => {
                    const Icon = semanticIcon(metric.label, index);
                    return (
                      <li className="flex items-start gap-2.5 text-sm leading-6 text-slate-700" key={metric.label}>
                        <span className="mt-0.5 inline-flex h-7 w-7 flex-none items-center justify-center rounded-[0.5rem] border border-[rgba(28,36,48,0.09)] bg-[rgba(246,244,238,0.8)] text-slate-500">
                          <Icon className="h-3.5 w-3.5" />
                        </span>
                        <div>
                          <p className="font-semibold text-slate-900">{metric.label}</p>
                          <p className="text-slate-600">{compactSentence(metric.description)}</p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </article>

              <article className="flex h-full flex-col rounded-[1.3rem] border border-[rgba(28,36,48,0.08)] bg-[rgba(244,248,252,0.92)] px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
                <h3 className="text-[1rem] font-semibold text-slate-900">
                  {mechanismSupportSection?.heading ?? "Why this keeps repeating"}
                </h3>
                <div className="mt-3 space-y-3 text-sm leading-6 text-slate-600">
                  {(
                    getParagraphs(mechanismSupportSection?.blocks ?? []).length
                      ? getParagraphs(mechanismSupportSection?.blocks ?? [])
                      : module.systemBug.signals
                  )
                    .slice(0, 3)
                    .map((item) => (
                      <p key={item}>{item}</p>
                    ))}
                </div>
              </article>
            </div>
          </div>
        </section>
      </div>

      <section className="space-y-4" id="evidence">
        <LessonSectionHeader
          accent={module.accent}
          compact
          id="evidence-heading"
          index={5}
          subtitle="What the evidence layer shows once the strongest indicators are read together instead of one by one."
          title={evidenceSection?.heading ?? "What the evidence layer shows"}
        />

        <div className="rounded-[1.9rem] border border-[rgba(28,36,48,0.08)] bg-white/84 px-4 py-4 shadow-[0_16px_30px_rgba(28,36,48,0.04)] sm:px-5 sm:py-5">
          <div className="grid gap-4 xl:grid-cols-[11.25rem_minmax(0,1fr)]">
            <div className="space-y-3">
              {evidenceNotes.map((note) => (
                <article className="rounded-[1.15rem] border border-[rgba(28,36,48,0.08)] bg-[rgba(241,245,249,0.88)] px-4 py-4" key={note.title}>
                  <p className="text-[0.98rem] font-semibold tracking-[0.02em] text-slate-700">{note.title}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-700">{note.body}</p>
                </article>
              ))}
            </div>

            <div className="space-y-4">
              <div className={cn("grid gap-4", evidenceCharts.length > 1 ? "xl:grid-cols-2" : "")}>
                {evidenceCharts.slice(0, 2).map((chart) => (
                  <EmbeddedEvidenceChart chart={chart} key={chart.url} sources={evidenceSources} />
                ))}
              </div>

              {evidenceCharts.length > 2 ? (
                <EmbeddedEvidenceChart chart={evidenceCharts[2]} sources={evidenceSources} />
              ) : null}

              <div
                className={cn(
                  "grid gap-4",
                  evidenceLeadBullets.length
                    ? "xl:grid-cols-[minmax(0,0.31fr)_minmax(0,0.36fr)_minmax(0,0.33fr)]"
                    : "xl:grid-cols-[minmax(0,0.52fr)_minmax(0,0.48fr)]",
                )}
              >
                {evidenceLeadBullets.length ? (
                  <article className="rounded-[1.25rem] border border-[rgba(28,36,48,0.08)] bg-[rgba(247,250,252,0.96)] px-4 py-4 shadow-[0_12px_24px_rgba(28,36,48,0.03)]">
                    <p className="text-[0.98rem] font-semibold tracking-[0.02em] text-slate-700">What the data is correcting</p>
                    <ul className="mt-3 space-y-2.5">
                      {evidenceLeadBullets.map((item) => (
                        <li className="flex items-start gap-2.5 text-sm leading-6 text-slate-700" key={item}>
                          <span className={cn("mt-1 inline-flex h-5 w-5 flex-none items-center justify-center rounded-full border", accent.icon)}>
                            <Sparkles className="h-3 w-3" />
                          </span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </article>
                ) : null}

                <div className="space-y-3">
                  <article className="overflow-hidden rounded-[1.25rem] border border-[rgba(28,36,48,0.08)] bg-white shadow-[0_12px_24px_rgba(28,36,48,0.04)]">
                    <div className="relative h-32">
                      <Image
                        alt={`${module.title} evidence insight`}
                        className="object-cover"
                        fill
                        sizes="(min-width: 1280px) 460px, 100vw"
                        src={supportImageSrc}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[rgba(15,23,42,0.35)] via-transparent to-transparent" />
                    </div>
                    <div className="px-4 py-4">
                      <p className="text-[0.98rem] font-semibold tracking-[0.02em] text-slate-700">Wider insight</p>
                      <p className="mt-2 text-sm leading-6 text-slate-700">
                        {compactSentence(
                          evidenceLeadParagraphs[evidenceLeadParagraphs.length - 1] ??
                            module.heroHighlights[0] ??
                            module.summary,
                        )}
                      </p>
                    </div>
                  </article>

                  {evidenceSources.length ? (
                    <div className="grid gap-3">
                      {evidenceSources.slice(0, 4).map((source) => renderSourceLink(source))}
                    </div>
                  ) : null}
                </div>

                {askInsteadSection ? (
                  <article className="overflow-hidden rounded-[1.25rem] border border-[rgba(28,36,48,0.08)] bg-[rgba(247,250,252,0.94)] shadow-[0_12px_24px_rgba(28,36,48,0.03)]">
                    <div className="relative h-24">
                      <Image
                        alt={`${module.title} what to ask instead`}
                        className="object-cover"
                        fill
                        sizes="(min-width: 1280px) 360px, 100vw"
                        src={heroImageSrc}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[rgba(255,255,255,0.92)] via-[rgba(255,255,255,0.28)] to-transparent" />
                    </div>
                    <div className="px-4 py-4">
                      <h3 className="text-base font-semibold text-slate-900">{askInsteadSection.heading}</h3>
                      <div className="mt-2 space-y-2 text-sm leading-6 text-slate-600">
                        {getParagraphs(askInsteadSection.blocks).slice(0, 2).map((paragraph) => (
                          <p key={paragraph}>{paragraph}</p>
                        ))}
                      </div>
                    </div>
                  </article>
                ) : trailingInsightSections.length ? (
                  <article className="overflow-hidden rounded-[1.25rem] border border-[rgba(28,36,48,0.08)] bg-[rgba(247,250,252,0.94)] shadow-[0_12px_24px_rgba(28,36,48,0.03)]">
                    <div className="relative h-24">
                      <Image
                        alt={`${module.title} follow-up prompt`}
                        className="object-cover"
                        fill
                        sizes="(min-width: 1280px) 360px, 100vw"
                        src={heroImageSrc}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[rgba(255,255,255,0.92)] via-[rgba(255,255,255,0.28)] to-transparent" />
                    </div>
                    <div className="px-4 py-4">
                      <h3 className="text-base font-semibold text-slate-900">{trailingInsightSections[0].heading}</h3>
                      <div className="mt-2 space-y-2 text-sm leading-6 text-slate-600">
                        {getParagraphs(trailingInsightSections[0].blocks).slice(0, 2).map((paragraph) => (
                          <p key={paragraph}>{paragraph}</p>
                        ))}
                      </div>
                    </div>
                  </article>
                ) : null}
              </div>
            </div>
          </div>

          {remainingInsightSections.length ? (
            <div className="mt-4 grid gap-4 xl:grid-cols-2">
              {remainingInsightSections.map((section) => (
                <article
                  className="rounded-[1.25rem] border border-[rgba(28,36,48,0.08)] bg-[rgba(247,250,252,0.94)] px-4 py-4"
                  key={section.heading}
                >
                  <h3 className="text-base font-semibold text-slate-900">{section.heading}</h3>
                  <div className="mt-2 space-y-2 text-sm leading-6 text-slate-600">
                    {getParagraphs(section.blocks).slice(0, 2).map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.04fr)_minmax(0,0.96fr)]">
        <ComparisonInteractivePanel module={module} />
        <ComparisonCounterargumentsSection module={module} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]">
        <section className="space-y-4" id="real-world-examples">
          <LessonSectionHeader
            accent={module.accent}
            compact
            id="real-world-examples-heading"
            index={8}
            subtitle="History and lived cases where the same pattern becomes visible in the world."
            title="Real world examples"
          />

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {module.realWorldExamples.map((example, index) => (
              <article
                className="overflow-hidden rounded-[1.45rem] border border-[rgba(28,36,48,0.08)] bg-white shadow-[0_14px_26px_rgba(28,36,48,0.04)]"
                key={example.title}
              >
                <div className="relative h-28">
                  <Image
                    alt={example.title}
                    className="object-cover"
                    fill
                    sizes="(min-width: 1280px) 250px, 100vw"
                    src={realWorldImages[index % realWorldImages.length]}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[rgba(15,23,42,0.55)] via-[rgba(15,23,42,0.08)] to-transparent" />
                  <span
                    className={cn(
                      "absolute left-3 top-3 inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em]",
                      accent.chip,
                    )}
                  >
                    Example {index + 1}
                  </span>
                </div>

                <div className="space-y-3 px-4 py-4">
                  <h3 className="text-base font-semibold leading-tight text-slate-900">{example.title}</h3>
                  <p className="text-sm leading-6 text-slate-600">{compactSentence(example.outcome) || example.outcome}</p>
                  <div className="rounded-[1rem] border border-[rgba(28,36,48,0.08)] bg-[rgba(241,245,249,0.86)] px-3 py-3">
                    <p className="text-[0.98rem] font-semibold tracking-[0.02em] text-slate-700">What it teaches</p>
                    <p className="mt-2 text-sm leading-6 text-slate-700">{compactSentence(example.insight) || example.insight}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <ComparisonNextActionsSection
          currentTrack={currentTrack}
          module={module}
          nextModule={nextModule}
          quizQuestionCount={quizQuestionCount}
        />
      </div>

      <ComparisonReformsSection heroImageSrc={heroImageSrc} module={module} supportImageSrc={supportImageSrc} />
    </div>
  );
}

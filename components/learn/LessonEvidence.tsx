"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, ExternalLink } from "lucide-react";

import { LessonSectionHeader } from "@/components/learn/LessonSectionHeader";
import { extractFirstSentence, getExpectedObservations, lessonAccentClasses } from "@/components/learn/lesson-theme";
import type {
  LearningArticleBlock,
  LearningArticleChart,
  LearningArticleDocument,
  LearningArticleSource,
} from "@/lib/learn/content";
import { isKnownBrokenLearningChartUrl } from "@/lib/learn/chart-health";
import type { AccentTone, LearningEvidenceLink, LearningModule , ResolvedLearningModule} from "@/lib/learn/modules";
import { cn } from "@/lib/utils";

function renderSourceLink(link: LearningArticleSource | LearningEvidenceLink) {
  return (
    <a
      className="flex items-start justify-between gap-3 rounded-[1.2rem] border border-[rgba(28,36,48,0.08)] bg-white/88 px-4 py-4 transition hover:border-[rgba(28,36,48,0.16)]"
      href={link.url}
      key={link.url}
      rel="noreferrer"
      target="_blank"
    >
      <div>
        {"label" in link ? <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{link.label}</p> : null}
        {"source" in link ? <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{link.source}</p> : null}
        <p className="mt-2 text-sm font-medium text-slate-900">{"title" in link ? link.title : ""}</p>
        {"note" in link ? <p className="mt-2 text-sm leading-7 text-slate-600">{link.note}</p> : null}
      </div>
      <ExternalLink className="mt-0.5 h-4 w-4 flex-none text-slate-400" />
    </a>
  );
}

function ArticleChart({
  chart,
  sources,
}: {
  chart: LearningArticleChart;
  sources?: Array<LearningArticleSource | LearningEvidenceLink>;
}) {
  const chartIsBroken = isKnownBrokenLearningChartUrl(chart.url);

  return (
    <article className="space-y-4" key={chart.url}>
      <div className="space-y-2">
        <h4 className="text-xl font-semibold leading-tight text-slate-900">{chart.title}</h4>
        {chart.note ? <p className="atlas-copy text-sm leading-7">{chart.note}</p> : null}
      </div>
      {chartIsBroken ? (
        <div className="rounded-[1.4rem] border border-[rgba(28,36,48,0.08)] bg-[rgba(241,245,249,0.84)] px-5 py-5 shadow-[0_14px_32px_rgba(28,36,48,0.04)]">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full border border-[rgba(28,36,48,0.08)] bg-[rgba(247,250,252,0.94)] text-slate-600">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold text-slate-900">This external chart link has gone stale</p>
              <p className="text-sm leading-7 text-slate-600">
                I checked this lesson chart and the current Our World in Data grapher link no longer resolves correctly.
                The evidence trail below still works, and we can remap this module to a live replacement dataset next.
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <a
              className="inline-flex items-center gap-2 rounded-full border border-[rgba(28,36,48,0.08)] bg-white px-3 py-2 text-xs font-medium text-slate-700 transition hover:border-[rgba(28,36,48,0.16)] hover:text-slate-900"
              href={chart.url}
              rel="noreferrer"
              target="_blank"
            >
              Open original chart link
              <ExternalLink className="h-3.5 w-3.5 flex-none" />
            </a>
          </div>

          {sources?.length ? (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {sources.slice(0, 4).map((item) => renderSourceLink(item))}
            </div>
          ) : null}
        </div>
      ) : (
        <div className="overflow-hidden rounded-[1.4rem] border border-[rgba(28,36,48,0.08)] bg-white shadow-[0_14px_32px_rgba(28,36,48,0.04)]">
          <iframe
            allow="web-share; clipboard-write"
            className="w-full"
            loading="eager"
            referrerPolicy="strict-origin-when-cross-origin"
            src={chart.url}
            style={{ border: 0, height: chart.height }}
            title={chart.title}
          />
        </div>
      )}
    </article>
  );
}

function ArticleFlow({
  accent,
  article,
  evidenceLinks,
  fallbackMetrics,
  fallbackSummary,
  fallbackSignals,
}: {
  accent: AccentTone;
  article?: LearningArticleDocument | null;
  evidenceLinks?: LearningEvidenceLink[];
  fallbackMetrics: LearningModule["betterMetrics"];
  fallbackSummary: string;
  fallbackSignals: string[];
}) {
  const articleSourceItems = article?.blocks.find(
    (block): block is Extract<LearningArticleBlock, { type: "sources" }> => block.type === "sources",
  )?.items;
  const chartSources = articleSourceItems?.length ? articleSourceItems : evidenceLinks;

  if (!article) {
    return (
      <div className="space-y-8">
        <div className="space-y-4">
          <p className="atlas-copy text-[1.02rem] leading-8 text-slate-700">{fallbackSummary}</p>
          <ul className="space-y-3 pl-5 text-[1rem] leading-8 text-slate-700">
            {fallbackSignals.map((signal) => (
              <li className="list-disc" key={signal}>
                {signal}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="atlas-display text-[1.8rem] leading-tight text-slate-900">What to watch instead</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {fallbackMetrics.map((metric) => (
              <article className="rounded-[1.35rem] bg-[rgba(241,245,249,0.78)] px-4 py-4" key={metric.label}>
                <h4 className="text-base font-semibold text-slate-900">{metric.label}</h4>
                <p className="mt-2 text-sm leading-7 text-slate-700">{metric.description}</p>
              </article>
            ))}
          </div>
        </div>

        {evidenceLinks && evidenceLinks.length > 0 ? (
          <div className="space-y-4 border-t border-[rgba(28,36,48,0.08)] pt-8">
            <h3 className="atlas-display text-[1.8rem] leading-tight text-slate-900">Evidence trail</h3>
            <div className="grid gap-4 sm:grid-cols-2">{evidenceLinks.map((link) => renderSourceLink(link))}</div>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {article.blocks.map((block, index) => {
        if (block.type === "heading") {
          const HeadingTag = block.level === 2 ? "h3" : "h4";
          return (
            <HeadingTag
              className={
                block.level === 2
                  ? "atlas-display pt-2 text-[1.95rem] leading-tight font-semibold tracking-tight text-slate-900"
                  : "pt-1 text-[1.15rem] font-semibold tracking-tight text-slate-900"
              }
              key={`${block.type}-${index}-${block.text}`}
            >
              {block.text}
            </HeadingTag>
          );
        }

        if (block.type === "paragraph") {
          return (
            <p className="atlas-copy text-[1.02rem] leading-8 text-slate-700" key={`${block.type}-${index}`}>
              {block.text}
            </p>
          );
        }

        if (block.type === "list") {
          return (
            <ul className="space-y-3 pl-5 text-[1rem] leading-8 text-slate-700" key={`${block.type}-${index}`}>
              {block.items.map((item) => (
                <li className="list-disc" key={item}>
                  {item}
                </li>
              ))}
            </ul>
          );
        }

        if (block.type === "callout") {
          const calloutBorder =
            accent === "amber"
              ? "border-amber-300"
              : accent === "cyan"
                ? "border-cyan-300"
                : accent === "emerald"
                  ? "border-emerald-300"
                  : "border-rose-300";
          return (
            <blockquote
              className={`border-l-4 ${calloutBorder} pl-5 text-[1rem] italic leading-8 text-slate-700`}
              key={`${block.type}-${index}`}
            >
              {block.text}
            </blockquote>
          );
        }

        if (block.type === "cards") {
          return (
            <div className="space-y-4" key={`${block.type}-${index}`}>
              {block.title ? (
                <h3 className="atlas-display text-[1.8rem] leading-tight text-slate-900">{block.title}</h3>
              ) : null}
              <div className="grid gap-4 sm:grid-cols-2">
                {block.items.map((item) => (
                  <article
                    className="rounded-[1.35rem] bg-[rgba(241,245,249,0.78)] px-4 py-4"
                    key={`${item.title}-${item.body}`}
                  >
                    <h4 className="text-base font-semibold text-slate-900">{item.title}</h4>
                    <p className="mt-2 text-sm leading-7 text-slate-700">{item.body}</p>
                  </article>
                ))}
              </div>
            </div>
          );
        }

        if (block.type === "charts") {
          return (
            <div className="space-y-5" key={`${block.type}-${index}`}>
              {block.title ? (
                <h3 className="atlas-display text-[1.8rem] leading-tight text-slate-900">{block.title}</h3>
              ) : null}
              {block.items.map((chart) => (
                <ArticleChart chart={chart} key={`${chart.title}-${chart.url}`} sources={chartSources} />
              ))}
            </div>
          );
        }

        if (block.type === "sources") {
          return (
            <div className="space-y-4" key={`${block.type}-${index}`}>
              <h3 className="atlas-display text-[1.8rem] leading-tight text-slate-900">{block.title ?? "Sources"}</h3>
              <div className="grid gap-4 sm:grid-cols-2">{block.items.map((item) => renderSourceLink(item))}</div>
            </div>
          );
        }

        return null;
      })}

      {evidenceLinks && evidenceLinks.length > 0 ? (
        <div className="space-y-4 border-t border-[rgba(28,36,48,0.08)] pt-8">
          <h3 className="atlas-display text-[1.8rem] leading-tight text-slate-900">Evidence trail</h3>
          <div className="grid gap-4 sm:grid-cols-2">{evidenceLinks.map((link) => renderSourceLink(link))}</div>
        </div>
      ) : null}
    </div>
  );
}

export function LessonEvidence({
  article,
  compact = false,
  module,
}: {
  article?: LearningArticleDocument | null;
  compact?: boolean;
  module: ResolvedLearningModule;
}) {
  const accent = lessonAccentClasses[module.accent];
  const expectedObservations = getExpectedObservations(module);
  const chartBlock = useMemo(
    () => article?.blocks.find((block): block is Extract<LearningArticleBlock, { type: "charts" }> => block.type === "charts"),
    [article],
  );
  const sourceBlock = useMemo(
    () => article?.blocks.find((block): block is Extract<LearningArticleBlock, { type: "sources" }> => block.type === "sources"),
    [article],
  );
  const evidenceNotes = useMemo(
    () => [
      {
        body:
          "If the explanation is right, reserve dominance should decline over time while systemic stress rises and confidence in the order erodes.",
        title: "What would we expect to observe?",
      },
      {
        body:
          extractFirstSentence(module.systemBug.summary) ||
          "The claim is that monetary systems redistribute wealth and power whenever the rules are rewritten.",
        title: "What is the core claim?",
      },
      {
        body:
          extractFirstSentence(module.betterMetrics[0]?.description) ||
          "The key is to watch the structure beneath inflation headlines: who sets the rules, who absorbs stress, and who gets the gains.",
        title: "Why this matters",
      },
    ],
    [module],
  );
  const [activeNoteIndex, setActiveNoteIndex] = useState(0);
  const activeNote = evidenceNotes[activeNoteIndex];

  if (compact) {
    return (
      <section className="space-y-4" id="evidence">
        <LessonSectionHeader
          accent={module.accent}
          compact
          id="evidence-heading"
          index={4}
          subtitle="What the data shows across monetary regimes."
          title="Evidence"
        />

        <div className="relative overflow-visible rounded-[1.8rem] border border-[rgba(28,36,48,0.08)] bg-white/84 px-4 py-4 shadow-[0_16px_30px_rgba(28,36,48,0.04)] sm:px-5 sm:py-5">
          <div className="grid gap-4 xl:grid-cols-[15.5rem_minmax(0,1fr)]">
            <div className="space-y-3">
              <article className="rounded-[1.25rem] border border-[rgba(28,36,48,0.08)] bg-white/92 px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Claim</p>
                <p className="mt-3 text-sm leading-6 text-slate-700">{module.systemBug.summary}</p>
              </article>

              <div className="space-y-2">
                {evidenceNotes.map((note, index) => (
                  <button
                    className={cn(
                      "flex w-full items-center justify-between rounded-[1rem] border px-3 py-3 text-left text-sm font-medium transition",
                      index === activeNoteIndex
                        ? cn("text-slate-900 shadow-[0_10px_20px_rgba(28,36,48,0.05)]", accent.chip, accent.line)
                        : "border-[rgba(28,36,48,0.08)] bg-white/88 text-slate-600 hover:border-[rgba(28,36,48,0.16)] hover:text-slate-900",
                    )}
                    key={note.title}
                    onClick={() => setActiveNoteIndex(index)}
                    type="button"
                  >
                    <span>{note.title}</span>
                    <span className="text-slate-400">↗</span>
                  </button>
                ))}
              </div>

              <article className={cn("rounded-[1.25rem] border px-4 py-4", accent.panel, accent.line)}>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Why it matters</p>
                <p className="mt-3 text-sm leading-6 text-slate-700">{module.betterMetricsTitle}</p>
              </article>
            </div>

            <div className="min-w-0 space-y-4">
              {chartBlock?.items?.[0] ? (
                <ArticleChart chart={chartBlock.items[0]} sources={sourceBlock?.items?.length ? sourceBlock.items : module.evidenceLinks} />
              ) : null}

              {sourceBlock?.items?.length ? (
                <div className="grid gap-3 md:grid-cols-2">
                  {sourceBlock.items.slice(0, 4).map((item) => renderSourceLink(item))}
                </div>
              ) : module.evidenceLinks?.length ? (
                <div className="grid gap-3 md:grid-cols-2">
                  {module.evidenceLinks.slice(0, 4).map((link) => renderSourceLink(link))}
                </div>
              ) : null}
            </div>
          </div>

          <aside className="mt-4 rounded-[1.4rem] border border-[rgba(28,36,48,0.1)] bg-white px-4 py-4 shadow-[0_18px_30px_rgba(28,36,48,0.06)] xl:absolute xl:bottom-[-1.25rem] xl:left-[-2.6rem] xl:mt-0 xl:w-[16rem]">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-slate-900">{activeNote.title}</p>
              <span className="text-xs text-slate-400">
                {activeNoteIndex + 1} of {evidenceNotes.length}
              </span>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">{activeNote.body}</p>
            {activeNoteIndex === 0 ? (
              <ul className="mt-3 space-y-1.5">
                {expectedObservations.map((observation) => (
                  <li className="text-sm leading-6 text-slate-600" key={observation}>
                    • {observation}
                  </li>
                ))}
              </ul>
            ) : null}
          </aside>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6" id="evidence">
      <LessonSectionHeader
        accent={module.accent}
        id="evidence-heading"
        index={3}
        subtitle="If this explanation is right, we should be able to see its fingerprints in data, institutional patterns, and long-run social outcomes."
        title="Evidence"
      />

      <div className="grid gap-4 xl:grid-cols-3">
        <article className="rounded-[1.5rem] border border-[rgba(28,36,48,0.08)] bg-white/82 px-4 py-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Claim</p>
          <p className="mt-3 text-sm leading-7 text-slate-700">{module.systemBug.summary}</p>
        </article>
        <article className="rounded-[1.5rem] border border-[rgba(28,36,48,0.08)] bg-white/82 px-4 py-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            What we would expect to observe
          </p>
          <ul className="mt-3 space-y-2">
            {expectedObservations.map((observation) => (
              <li className="text-sm leading-7 text-slate-700" key={observation}>
                • {observation}
              </li>
            ))}
          </ul>
        </article>
        <article className={`rounded-[1.5rem] border border-[rgba(28,36,48,0.08)] ${accent.panel} px-4 py-4`}>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Why it matters</p>
          <p className="mt-3 text-sm leading-7 text-slate-700">{module.betterMetricsTitle}</p>
        </article>
      </div>

      <div className="mx-auto max-w-[52rem]">
        <ArticleFlow
          accent={module.accent}
          article={article}
          evidenceLinks={module.evidenceLinks}
          fallbackMetrics={module.betterMetrics}
          fallbackSignals={module.systemBug.signals}
          fallbackSummary={module.systemBug.summary}
        />
      </div>
    </section>
  );
}

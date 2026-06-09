import { ExternalLink } from "lucide-react";

import { LessonSectionHeader } from "@/components/learn/LessonSectionHeader";
import { getExpectedObservations, lessonAccentClasses } from "@/components/learn/lesson-theme";
import type {
  LearningArticleChart,
  LearningArticleDocument,
  LearningArticleSource,
} from "@/lib/learn/content";
import type { AccentTone, LearningEvidenceLink, LearningModule } from "@/lib/learn/modules";

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

function ArticleChart({ chart }: { chart: LearningArticleChart }) {
  return (
    <article className="space-y-4" key={chart.url}>
      <div className="space-y-2">
        <h4 className="text-xl font-semibold leading-tight text-slate-900">{chart.title}</h4>
        {chart.note ? <p className="atlas-copy text-sm leading-7">{chart.note}</p> : null}
      </div>
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
              <article className="rounded-[1.35rem] bg-[rgba(246,244,238,0.7)] px-4 py-4" key={metric.label}>
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
                    className="rounded-[1.35rem] bg-[rgba(246,244,238,0.72)] px-4 py-4"
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
                <ArticleChart chart={chart} key={`${chart.title}-${chart.url}`} />
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
  module,
}: {
  article?: LearningArticleDocument | null;
  module: LearningModule;
}) {
  const accent = lessonAccentClasses[module.accent];
  const expectedObservations = getExpectedObservations(module);

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

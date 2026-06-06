import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpenText,
  ClipboardCheck,
  Clock3,
  Compass,
  ExternalLink,
  Layers3,
  Download,
  MessageSquare,
  Play,
} from "lucide-react";

import { AtlasPage } from "@/components/atlas/AtlasPage";
import { CausalLoopDiagram } from "@/components/learn/CausalLoopDiagram";
import { LearningTimeline } from "@/components/learn/LearningTimeline";
import { MiniLesson } from "@/components/learn/MiniLesson";
import { SharedLearnersPanel } from "@/components/social/SharedLearnersPanel";
import { Button } from "@/components/ui/button";
import type {
  LearningArticleBlock,
  LearningArticleChart,
  LearningArticleDocument,
  LearningArticleSource,
} from "@/lib/learn/content";
import type {
  AccentTone,
  CounterArgument,
  LearningEvidenceLink,
  LearningModule,
  RealWorldExample,
} from "@/lib/learn/modules";
import type { LearningTrack } from "@/lib/tracks/config";
import { cn, withQuery } from "@/lib/utils";

const accentClasses: Record<
  AccentTone,
  {
    badge: string;
    chip: string;
    icon: string;
    line: string;
    soft: string;
    step: string;
  }
> = {
  amber: {
    badge: "border-amber-300 bg-amber-50 text-amber-700",
    chip: "border-amber-200 bg-amber-50/80 text-amber-700",
    icon: "border-amber-200 bg-amber-50 text-amber-600",
    line: "border-amber-200/80",
    soft: "bg-amber-50/65",
    step: "bg-amber-100 text-amber-700",
  },
  cyan: {
    badge: "border-cyan-300 bg-cyan-50 text-cyan-700",
    chip: "border-cyan-200 bg-cyan-50/80 text-cyan-700",
    icon: "border-cyan-200 bg-cyan-50 text-cyan-600",
    line: "border-cyan-200/80",
    soft: "bg-cyan-50/65",
    step: "bg-cyan-100 text-cyan-700",
  },
  emerald: {
    badge: "border-emerald-300 bg-emerald-50 text-emerald-700",
    chip: "border-emerald-200 bg-emerald-50/80 text-emerald-700",
    icon: "border-emerald-200 bg-emerald-50 text-emerald-600",
    line: "border-emerald-200/80",
    soft: "bg-emerald-50/65",
    step: "bg-emerald-100 text-emerald-700",
  },
  rose: {
    badge: "border-rose-300 bg-rose-50 text-rose-700",
    chip: "border-rose-200 bg-rose-50/80 text-rose-700",
    icon: "border-rose-200 bg-rose-50 text-rose-600",
    line: "border-rose-200/80",
    soft: "bg-rose-50/65",
    step: "bg-rose-100 text-rose-700",
  },
};

const TRACK_RELATED_LABS: Record<string, { href: string; label: string }> = {
  economy: { href: "/simulator/macro-economy", label: "Run a simulation" },
  "politics-and-democracy": { href: "/simulator/political-talent", label: "Open governance lab" },
  "cities-and-ecology": { href: "/simulator/world3", label: "Open World3" },
  "media-and-information": { href: "/simulator/social-movements", label: "Open movement lab" },
};

type LessonSectionLink = {
  id: string;
  label: string;
};

function LessonSectionHeader({
  accent,
  id,
  index,
  subtitle,
  title,
}: {
  accent: AccentTone;
  id: string;
  index: number;
  subtitle?: string;
  title: string;
}) {
  return (
    <header className="space-y-3" id={id}>
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold",
            accentClasses[accent].step,
          )}
        >
          {index}
        </span>
        <h2 className="atlas-display text-[2rem] leading-tight text-slate-900 sm:text-[2.25rem]">{title}</h2>
      </div>
      {subtitle ? <p className="atlas-copy max-w-3xl text-base leading-8">{subtitle}</p> : null}
    </header>
  );
}

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
        <p className="mt-2 text-sm font-medium text-slate-900">
          {"title" in link ? link.title : ""}
        </p>
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
          <p className="atlas-copy text-[1.05rem] leading-9 text-slate-700">{fallbackSummary}</p>
          <ul className="space-y-3 pl-5 text-[1.02rem] leading-8 text-slate-700">
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
              className={cn(
                "font-semibold tracking-tight text-slate-900",
                block.level === 2 ? "atlas-display pt-2 text-[1.95rem] leading-tight" : "pt-1 text-[1.15rem]",
              )}
              key={`${block.type}-${index}-${block.text}`}
            >
              {block.text}
            </HeadingTag>
          );
        }

        if (block.type === "paragraph") {
          return (
            <p className="atlas-copy text-[1.05rem] leading-9 text-slate-700" key={`${block.type}-${index}`}>
              {block.text}
            </p>
          );
        }

        if (block.type === "list") {
          return (
            <ul className="space-y-3 pl-5 text-[1.02rem] leading-8 text-slate-700" key={`${block.type}-${index}`}>
              {block.items.map((item) => (
                <li className="list-disc" key={item}>
                  {item}
                </li>
              ))}
            </ul>
          );
        }

        if (block.type === "callout") {
          return (
            <blockquote
              className={cn(
                "border-l-4 pl-5 text-[1.02rem] italic leading-8 text-slate-700",
                accent === "amber"
                  ? "border-amber-300"
                  : accent === "cyan"
                    ? "border-cyan-300"
                    : accent === "emerald"
                      ? "border-emerald-300"
                      : "border-rose-300",
              )}
              key={`${block.type}-${index}`}
            >
              {block.text}
            </blockquote>
          );
        }

        if (block.type === "cards") {
          return (
            <div className="space-y-4" key={`${block.type}-${index}`}>
              {block.title ? <h3 className="atlas-display text-[1.8rem] leading-tight text-slate-900">{block.title}</h3> : null}
              <div className="grid gap-4 sm:grid-cols-2">
                {block.items.map((item) => (
                  <article className="rounded-[1.35rem] bg-[rgba(246,244,238,0.72)] px-4 py-4" key={`${item.title}-${item.body}`}>
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
              {block.title ? <h3 className="atlas-display text-[1.8rem] leading-tight text-slate-900">{block.title}</h3> : null}
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

function RealWorldExamplesSection({
  accent,
  examples,
}: {
  accent: AccentTone;
  examples: RealWorldExample[];
}) {
  if (examples.length >= 4) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {examples.map((example, index) => (
          <article
            className="rounded-[1.45rem] border border-[rgba(28,36,48,0.08)] bg-white/84 px-4 py-4 shadow-[0_12px_26px_rgba(28,36,48,0.04)]"
            key={example.title}
          >
            <div className="flex items-start justify-between gap-3">
              <span
                className={cn(
                  "inline-flex h-8 w-8 flex-none items-center justify-center rounded-full text-xs font-semibold",
                  accentClasses[accent].step,
                )}
              >
                {index + 1}
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Example</span>
            </div>

            <h3 className="mt-4 atlas-display text-[1.45rem] leading-tight text-slate-900">{example.title}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-700">{example.outcome}</p>

            <div className="mt-4 rounded-[1rem] bg-[rgba(246,244,238,0.72)] px-3 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Why it matters</p>
              <p className="mt-2 text-sm leading-6 text-slate-700">{example.insight}</p>
            </div>
          </article>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {examples.map((example, index) => (
        <article
          className={cn(
            "grid gap-4 border-t border-[rgba(28,36,48,0.08)] pt-5 md:grid-cols-[2.4rem_minmax(0,1fr)_18rem]",
            index === 0 ? "border-t-0 pt-0" : "",
          )}
          key={example.title}
        >
          <div
            className={cn(
              "inline-flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold",
              accentClasses[accent].step,
            )}
          >
            {index + 1}
          </div>

          <div className="space-y-3">
            <h3 className="atlas-display text-[1.7rem] leading-tight text-slate-900">{example.title}</h3>
            <p className="atlas-copy text-base leading-8 text-slate-700">{example.outcome}</p>
          </div>

          <div className="rounded-[1.3rem] bg-[rgba(246,244,238,0.7)] px-4 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Why it matters</p>
            <p className="mt-2 text-sm leading-7 text-slate-700">{example.insight}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

function CounterargumentsList({
  accent,
  counterArguments,
}: {
  accent: AccentTone;
  counterArguments: CounterArgument[];
}) {
  return (
    <div className="divide-y divide-[rgba(28,36,48,0.08)] overflow-hidden rounded-[1.6rem] border border-[rgba(28,36,48,0.08)] bg-white/82">
      {counterArguments.map((argument, index) => (
        <details className="group" key={argument.title} open={index === 0}>
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4">
            <div className="flex items-start gap-3">
              <span
                className={cn(
                  "mt-0.5 inline-flex h-7 w-7 flex-none items-center justify-center rounded-full text-xs font-semibold",
                  accentClasses[accent].step,
                )}
              >
                {index + 1}
              </span>
              <div>
                <p className="text-base font-semibold text-slate-900">{argument.title}</p>
                <p className="mt-1 text-sm leading-7 text-slate-600">{argument.point}</p>
              </div>
            </div>
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 transition group-open:rotate-180">
              ˅
            </span>
          </summary>
          <div className="px-5 pb-5 pl-[4.4rem]">
            <div className="rounded-[1.15rem] bg-[rgba(246,244,238,0.72)] px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Response</p>
              <p className="mt-2 text-sm leading-7 text-slate-700">{argument.response}</p>
            </div>
          </div>
        </details>
      ))}
    </div>
  );
}

function NextActionsSection({
  currentTrack,
  discussionPrompt,
  module,
  nextModule,
  quizQuestionCount,
}: {
  currentTrack?: LearningTrack | null;
  discussionPrompt: string;
  module: LearningModule;
  nextModule?: LearningModule | null;
  quizQuestionCount?: number;
}) {
  const simulatorBase = module.simulatorSlug ? `/simulator/${module.simulatorSlug}` : TRACK_RELATED_LABS[currentTrack?.id ?? ""]?.href ?? "/simulator";
  const simulationHref = withQuery(simulatorBase, {
    focus: module.simulationPrompt,
    module: module.slug,
  });
  const discussionHref = withQuery("/discussions", {
    module: module.slug,
    prompt: discussionPrompt,
  });
  const quizHref = `/quiz/${module.slug}`;
  const continueHref = nextModule ? `/learn/${nextModule.slug}` : "/learn?view=tracks";

  const actions = [
    {
      description: discussionPrompt,
      href: discussionHref,
      icon: MessageSquare,
      label: "Discuss this idea",
    },
    {
      description: module.simulationPrompt,
      href: simulationHref,
      icon: Play,
      label: module.simulatorSlug ? "Run a simulation" : "Explore a related lab",
    },
    {
      description: nextModule ? `Continue with ${nextModule.title}.` : "Open the broader track path and explore where this lesson sits.",
      href: continueHref,
      icon: ArrowRight,
      label: nextModule ? "Continue the track" : "Open track explorer",
    },
    {
      description: "Read books, papers, tools, and curated references connected to this lesson.",
      href: "/study",
      icon: BookOpenText,
      label: "Study more",
    },
  ];

  return (
    <div className="space-y-6">
      {quizQuestionCount ? (
        <div className="flex flex-col gap-4 rounded-[1.5rem] bg-[rgba(246,244,238,0.74)] px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-900">Close the loop with a checkpoint</p>
            <p className="mt-1 text-sm leading-7 text-slate-600">
              {quizQuestionCount} questions with immediate feedback so the lesson ends as a real learning step.
            </p>
          </div>
          <Button asChild className="h-auto rounded-full px-5 py-3">
            <Link href={quizHref}>
              Take the quiz
              <ClipboardCheck className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              className="group rounded-[1.5rem] border border-[rgba(28,36,48,0.08)] bg-white/84 px-5 py-5 transition hover:border-[rgba(28,36,48,0.16)] hover:shadow-[0_16px_34px_rgba(28,36,48,0.05)]"
              href={action.href}
              key={action.label}
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full border border-[rgba(28,36,48,0.08)] bg-[rgba(246,244,238,0.78)] text-slate-700">
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-900">{action.label}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{action.description}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary transition group-hover:text-blue-700">
                    Open
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function SidebarNav({
  currentIndex,
  currentTrack,
  module,
  sectionLinks,
  trackModules,
}: {
  currentIndex: number;
  currentTrack?: LearningTrack | null;
  module: LearningModule;
  sectionLinks: LessonSectionLink[];
  trackModules: LearningModule[];
}) {
  return (
    <aside className="hidden xl:block">
      <div className="sticky top-24 space-y-6">
        <Link className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-800" href="/learn">
          <ArrowLeft className="h-4 w-4" />
          Back to Learn
        </Link>

        {currentTrack ? (
          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{currentTrack.title}</p>
              <p className="mt-2 text-sm leading-7 text-slate-600">{module.eyebrow}</p>
              <p className="mt-3 text-sm font-medium text-slate-500">
                Lesson {currentIndex + 1} of {trackModules.length}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {trackModules.map((trackModule, index) => (
                <span
                  className={cn(
                    "h-2.5 flex-1 rounded-full",
                    index < currentIndex
                      ? "bg-[rgba(59,130,246,0.45)]"
                      : index === currentIndex
                        ? "bg-[rgb(var(--atlas-primary))]"
                        : "bg-[rgba(28,36,48,0.12)]",
                  )}
                  key={trackModule.slug}
                />
              ))}
            </div>

            <div className="space-y-3">
              {trackModules.map((trackModule, index) => {
                const isCurrent = trackModule.slug === module.slug;
                return (
                  <Link
                    className={cn(
                      "flex items-start gap-3 rounded-[1.15rem] px-3 py-3 transition",
                      isCurrent ? "bg-[rgba(59,130,246,0.08)] text-slate-900" : "hover:bg-[rgba(246,244,238,0.72)] text-slate-600",
                    )}
                    href={`/learn/${trackModule.slug}`}
                    key={trackModule.slug}
                  >
                    <span
                      className={cn(
                        "mt-0.5 inline-flex h-6 w-6 flex-none items-center justify-center rounded-full text-[11px] font-semibold",
                        isCurrent ? "bg-[rgb(var(--atlas-primary))] text-white" : "bg-[rgba(246,244,238,0.95)] text-slate-500",
                      )}
                    >
                      {index + 1}
                    </span>
                    <span className="text-sm leading-6">{trackModule.title}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ) : null}

        <div className="rounded-[1.45rem] bg-[rgba(246,244,238,0.72)] px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(28,36,48,0.08)] bg-white/90 text-slate-700">
              <Compass className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">In this lesson</p>
              <p className="text-sm font-semibold text-slate-900">Section guide</p>
            </div>
          </div>

          <nav className="mt-4 space-y-2">
            {sectionLinks.map((section) => (
              <a
                className="flex items-center justify-between rounded-[1rem] px-3 py-2 text-sm text-slate-600 transition hover:bg-white/88 hover:text-slate-900"
                href={`#${section.id}`}
                key={section.id}
              >
                <span>{section.label}</span>
                <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
              </a>
            ))}
          </nav>
        </div>

        <div className="rounded-[1.45rem] border border-[rgba(28,36,48,0.08)] bg-white/82 px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(28,36,48,0.08)] bg-[rgba(246,244,238,0.9)] text-slate-700">
              <Download className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Lesson resources</p>
              <p className="text-sm font-semibold text-slate-900">Go deeper</p>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <Link
              className="flex items-center justify-between rounded-[1rem] px-3 py-2 text-sm text-slate-600 transition hover:bg-[rgba(246,244,238,0.72)] hover:text-slate-900"
              href="/study"
            >
              <span>Open study library</span>
              <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
            </Link>
            <Link
              className="flex items-center justify-between rounded-[1rem] px-3 py-2 text-sm text-slate-600 transition hover:bg-[rgba(246,244,238,0.72)] hover:text-slate-900"
              href="/learn?view=tracks"
            >
              <span>Open track explorer</span>
              <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}

export function AtlasLessonPage({
  article,
  currentIndex,
  currentTrack,
  heroImageSrc,
  module,
  nextModule,
  previousModule,
  quizQuestionCount,
  trackModules,
}: {
  article?: LearningArticleDocument | null;
  currentIndex: number;
  currentTrack?: LearningTrack | null;
  heroImageSrc: string;
  module: LearningModule;
  nextModule?: LearningModule | null;
  previousModule?: LearningModule | null;
  quizQuestionCount?: number;
  trackModules: LearningModule[];
}) {
  const accent = accentClasses[module.accent];
  const sectionLinks: LessonSectionLink[] = [
    { id: "big-picture", label: "Big picture" },
    { id: "interactive-diagram", label: "Interactive diagram" },
    { id: "guided-reading", label: "Guided reading" },
    { id: "real-world-examples", label: "Real world examples" },
    { id: "interactive-experiment", label: "Interactive experiment" },
    { id: "counterarguments", label: "Counterarguments" },
    { id: "next-actions", label: "Next actions" },
  ];

  return (
    <AtlasPage className="pb-20">
      <div className="mx-auto grid max-w-[76rem] gap-8 xl:grid-cols-[15rem_minmax(0,53.125rem)] xl:gap-10">
        <SidebarNav
          currentIndex={currentIndex}
          currentTrack={currentTrack}
          module={module}
          sectionLinks={sectionLinks}
          trackModules={trackModules}
        />

        <main className="min-w-0 space-y-12">
          <section className="relative overflow-hidden rounded-[2.6rem] border border-[rgba(28,36,48,0.08)] bg-white shadow-[0_30px_70px_rgba(28,36,48,0.06)]">
            <div className="relative min-h-[28rem] overflow-hidden sm:min-h-[30rem] lg:min-h-[32rem]">
              <Image
                alt={module.title}
                className="object-cover object-right"
                fill
                priority={false}
                sizes="(min-width: 1280px) 850px, 100vw"
                src={heroImageSrc}
              />
              <div className="absolute inset-y-0 left-0 w-[70%] bg-[linear-gradient(90deg,rgba(255,255,255,0.985)_0%,rgba(255,255,255,0.97)_28%,rgba(255,255,255,0.9)_48%,rgba(255,255,255,0.54)_70%,rgba(255,255,255,0)_100%)] sm:w-[65%]" />
              <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[rgba(255,255,255,0.14)] to-transparent" />

              <div className="relative z-10 flex min-h-[28rem] flex-col justify-center px-6 py-8 sm:min-h-[30rem] sm:px-8 lg:min-h-[32rem] lg:px-10">
                <div className="max-w-[31rem] space-y-5">
                  <Link
                    className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-800 xl:hidden"
                    href="/learn"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Learn
                  </Link>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className={cn("inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]", accent.badge)}>
                      {module.eyebrow}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full border border-[rgba(28,36,48,0.08)] bg-white/82 px-3 py-1 text-xs font-medium text-slate-500">
                      <Clock3 className="h-3.5 w-3.5" />
                      {module.readingTime}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full border border-[rgba(28,36,48,0.08)] bg-white/82 px-3 py-1 text-xs font-medium text-slate-500">
                      <Layers3 className="h-3.5 w-3.5" />
                      {module.difficulty}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <h1 className="atlas-display max-w-[29rem] text-[2.55rem] leading-[0.94] text-slate-900 sm:text-[3.4rem] lg:text-[4rem]">
                      {module.title}
                    </h1>
                    <p className="atlas-lede max-w-[27rem] text-base leading-8 text-slate-700">{module.summary}</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {module.relatedFrameworks.map((framework) => (
                      <span className={cn("inline-flex rounded-full border px-3 py-1 text-xs font-medium", accent.chip)} key={framework}>
                        {framework}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {quizQuestionCount ? (
                      <Button asChild className="h-auto rounded-full px-5 py-3">
                        <Link href={`/quiz/${module.slug}`}>
                          Take the quiz
                          <ClipboardCheck className="h-4 w-4" />
                        </Link>
                      </Button>
                    ) : null}
                    {module.simulatorSlug ? (
                      <Link
                        className="inline-flex items-center gap-2 rounded-full border border-[rgba(28,36,48,0.12)] bg-white/88 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-[rgba(28,36,48,0.22)] hover:text-slate-900"
                        href={`/simulator/${module.simulatorSlug}`}
                      >
                        Open simulator
                        <Play className="h-4 w-4" />
                      </Link>
                    ) : null}
                    <Link
                      className="inline-flex items-center gap-2 rounded-full border border-[rgba(28,36,48,0.12)] bg-white/88 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-[rgba(28,36,48,0.22)] hover:text-slate-900"
                      href="/study"
                    >
                      Open study resources
                      <BookOpenText className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10 border-t border-[rgba(28,36,48,0.08)] bg-white/88 px-6 py-5 backdrop-blur-sm sm:px-8 lg:px-10">
              <div className="grid gap-4 sm:grid-cols-3">
                {module.heroHighlights.map((highlight) => (
                  <div className="flex gap-3" key={highlight}>
                    <div className={cn("mt-1 h-10 w-1.5 rounded-full", accent.soft)} />
                    <p className="text-sm leading-7 text-slate-700">{highlight}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="space-y-8" id="big-picture">
            <LessonSectionHeader
              accent={module.accent}
              id="big-picture-heading"
              index={1}
              subtitle="Start with the main logic in plain language before moving into system maps, evidence, and experiments."
              title="Big picture"
            />

            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem]">
              <div className="space-y-5">
                {module.simpleExplanation.map((paragraph) => (
                  <p className="atlas-copy text-[1.08rem] leading-9 text-slate-700" key={paragraph}>
                    {paragraph}
                  </p>
                ))}

                {previousModule || nextModule ? (
                  <div className="flex flex-wrap gap-3 pt-2">
                    {previousModule ? (
                      <Link
                        className="inline-flex items-center gap-2 rounded-full border border-[rgba(28,36,48,0.12)] bg-white/82 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-[rgba(28,36,48,0.22)] hover:text-slate-900"
                        href={`/learn/${previousModule.slug}`}
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Previous lesson
                      </Link>
                    ) : null}
                    {nextModule ? (
                      <Link
                        className="inline-flex items-center gap-2 rounded-full border border-[rgba(28,36,48,0.12)] bg-white/82 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-[rgba(28,36,48,0.22)] hover:text-slate-900"
                        href={`/learn/${nextModule.slug}`}
                      >
                        Next lesson
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    ) : null}
                  </div>
                ) : null}
              </div>

              <div className="space-y-4">
                <div className="rounded-[1.5rem] bg-[rgba(246,244,238,0.7)] px-5 py-5">
                  <div className="flex items-center gap-3">
                    <div className={cn("flex h-10 w-10 items-center justify-center rounded-full border", accent.icon)}>
                      <Compass className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Hidden assumption</p>
                      <h3 className="text-lg font-semibold text-slate-900">{module.systemBug.title}</h3>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-slate-700">{module.systemBug.summary}</p>
                  <ul className="mt-4 space-y-2">
                    {module.systemBug.signals.map((signal) => (
                      <li className="text-sm leading-7 text-slate-700" key={signal}>
                        • {signal}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{module.betterMetricsTitle}</p>
                  {module.betterMetrics.map((item) => (
                    <div className="border-t border-[rgba(28,36,48,0.08)] pt-3" key={item.label}>
                      <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                      <p className="mt-1 text-sm leading-7 text-slate-600">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {module.timeline ? <LearningTimeline accent={module.accent} timeline={module.timeline} /> : null}
          </section>

          <section className="space-y-6" id="interactive-diagram">
            <LessonSectionHeader
              accent={module.accent}
              id="interactive-diagram-heading"
              index={2}
              subtitle="Use the visual system map to follow causes, feedback loops, and the places where the system reinforces itself."
              title="Interactive diagram"
            />
            <CausalLoopDiagram
              accent={module.accent}
              description={module.causalLoop.description}
              edges={module.causalLoop.edges}
              loops={module.causalLoop.loops}
              nodes={module.causalLoop.nodes}
              title={module.causalLoop.title}
            />
          </section>

          <section className="space-y-6" id="guided-reading">
            <LessonSectionHeader
              accent={module.accent}
              id="guided-reading-heading"
              index={3}
              subtitle="Read the lesson as a connected argument, with evidence and diagrams woven into the flow instead of split across separate widgets."
              title="Guided reading"
            />
            <ArticleFlow
              accent={module.accent}
              article={article}
              evidenceLinks={module.evidenceLinks}
              fallbackMetrics={module.betterMetrics}
              fallbackSignals={module.systemBug.signals}
              fallbackSummary={module.systemBug.summary}
            />
          </section>

          <section className="space-y-6" id="real-world-examples">
            <LessonSectionHeader
              accent={module.accent}
              id="real-world-examples-heading"
              index={4}
              subtitle="These examples show where the same structure appears in the world and what it changes when it does."
              title="Real world examples"
            />
            <RealWorldExamplesSection accent={module.accent} examples={module.realWorldExamples} />
          </section>

          <section className="space-y-6" id="interactive-experiment">
            <LessonSectionHeader
              accent={module.accent}
              id="interactive-experiment-heading"
              index={5}
              subtitle="Move a variable, compare outcomes, and test whether the lesson logic still holds when conditions change."
              title="Interactive experiment"
            />
            <MiniLesson accent={module.accent} lesson={module.miniLesson} />
          </section>

          <section className="space-y-6" id="counterarguments">
            <LessonSectionHeader
              accent={module.accent}
              id="counterarguments-heading"
              index={6}
              subtitle="A useful lesson should face its strongest objections directly and answer them without reducing them to straw men."
              title="Counterarguments"
            />
            <CounterargumentsList accent={module.accent} counterArguments={module.counterArguments} />
          </section>

          <section className="space-y-6" id="next-actions">
            <LessonSectionHeader
              accent={module.accent}
              id="next-actions-heading"
              index={7}
              subtitle="Keep the lesson moving by testing the idea, discussing it, continuing the track, or going deeper into the supporting material."
              title="Next actions"
            />
            <NextActionsSection
              currentTrack={currentTrack}
              discussionPrompt={module.discussionPrompt}
              module={module}
              nextModule={nextModule}
              quizQuestionCount={quizQuestionCount}
            />

            <SharedLearnersPanel
              contextSlug={module.slug}
              contextTitle={module.title}
              contextType="module"
            />
          </section>
        </main>
      </div>
    </AtlasPage>
  );
}

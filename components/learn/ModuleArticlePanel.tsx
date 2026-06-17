import { AlertTriangle, BookOpenText, ExternalLink } from "lucide-react";

import { isKnownBrokenLearningChartUrl } from "@/lib/learn/chart-health";
import type { LearningArticleDocument } from "@/lib/learn/content";
import type { AccentTone } from "@/lib/learn/modules";
import { cn } from "@/lib/utils";

const accentStyles: Record<
  AccentTone,
  {
    badge: string;
    callout: string;
    heading: string;
    icon: string;
    source: string;
  }
> = {
  amber: {
    badge: "border-amber-300 bg-amber-50 text-amber-700",
    callout: "border-amber-200 bg-amber-50/65 text-slate-700",
    heading: "text-amber-700",
    icon: "border-amber-200 bg-amber-50 text-amber-600",
    source: "text-amber-700 hover:text-amber-900",
  },
  cyan: {
    badge: "border-cyan-300 bg-cyan-50 text-cyan-700",
    callout: "border-cyan-200 bg-cyan-50/65 text-slate-700",
    heading: "text-cyan-700",
    icon: "border-cyan-200 bg-cyan-50 text-cyan-600",
    source: "text-cyan-700 hover:text-cyan-900",
  },
  emerald: {
    badge: "border-emerald-300 bg-emerald-50 text-emerald-700",
    callout: "border-emerald-200 bg-emerald-50/65 text-slate-700",
    heading: "text-emerald-700",
    icon: "border-emerald-200 bg-emerald-50 text-emerald-600",
    source: "text-emerald-700 hover:text-emerald-900",
  },
  rose: {
    badge: "border-rose-300 bg-rose-50 text-rose-700",
    callout: "border-rose-200 bg-rose-50/65 text-slate-700",
    heading: "text-rose-700",
    icon: "border-rose-200 bg-rose-50 text-rose-600",
    source: "text-rose-700 hover:text-rose-900",
  },
};

export function ModuleArticlePanel({
  accent,
  article,
}: {
  accent: AccentTone;
  article: LearningArticleDocument;
}) {
  const styles = accentStyles[accent];
  const sourceItems = article.blocks.find((block) => block.type === "sources")?.items ?? [];

  return (
    <section className="rounded-[1.9rem] border border-[rgba(28,36,48,0.08)] bg-white/74 p-5 shadow-[0_18px_40px_rgba(28,36,48,0.05)] sm:p-6">
      <div className="max-w-4xl">
        <span className={cn("inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]", styles.badge)}>
          Guided reading
        </span>
        <div className="mt-4 flex items-center gap-3">
          <div className={cn("flex h-10 w-10 items-center justify-center rounded-full border", styles.icon)}>
            <BookOpenText className="h-5 w-5" />
          </div>
          <div>
            <h2 className="atlas-display text-3xl text-slate-900">A connected explanation, not just isolated points</h2>
          </div>
        </div>
        <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-600">
          This section keeps the core logic, evidence, and practical implications together so learners do not need to
          leave the platform just to understand the topic.
        </p>
      </div>

      <div className="mt-7 space-y-6">
        {article.blocks.map((block, index) => {
          if (block.type === "heading") {
            const HeadingTag = block.level === 2 ? "h3" : "h4";

            return (
              <HeadingTag
                className={cn(
                  "font-semibold tracking-tight",
                  block.level === 2 ? "atlas-display text-3xl text-slate-900" : "text-xl text-slate-900",
                  block.level === 2 ? "" : styles.heading,
                )}
                key={`${block.type}-${index}-${block.text}`}
              >
                {block.text}
              </HeadingTag>
            );
          }

          if (block.type === "paragraph") {
            return (
              <p className="max-w-4xl text-base leading-8 text-slate-600" key={`${block.type}-${index}`}>
                {block.text}
              </p>
            );
          }

          if (block.type === "list") {
            return (
              <ul className="grid gap-3" key={`${block.type}-${index}`}>
                {block.items.map((item) => (
                  <li
                    className="rounded-[1.3rem] border border-[rgba(28,36,48,0.08)] bg-white/84 px-4 py-3 text-sm leading-7 text-slate-600"
                    key={item}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            );
          }

          if (block.type === "callout") {
            return (
              <div
                className={cn("rounded-[1.5rem] border px-4 py-4 text-sm leading-7 sm:text-base", styles.callout)}
                key={`${block.type}-${index}`}
              >
                {block.text}
              </div>
            );
          }

          if (block.type === "cards") {
            return (
              <div className="space-y-4" key={`${block.type}-${index}`}>
                {block.title ? <p className="atlas-kicker">{block.title}</p> : null}
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {block.items.map((item) => (
                    <article
                      className="rounded-[1.5rem] border border-[rgba(28,36,48,0.08)] bg-white/84 p-5"
                      key={`${item.title}-${item.body}`}
                    >
                      <h3 className="atlas-display text-2xl leading-tight text-slate-900">{item.title}</h3>
                      <p className="mt-3 text-sm leading-7 text-slate-600">{item.body}</p>
                    </article>
                  ))}
                </div>
              </div>
            );
          }

          if (block.type === "charts") {
            return (
              <div className="space-y-4" key={`${block.type}-${index}`}>
                <p className="atlas-kicker">{block.title ?? "Embedded charts"}</p>
                <div className="space-y-5">
                  {block.items.map((item) => (
                    <article
                      className="rounded-[1.5rem] border border-[rgba(28,36,48,0.08)] bg-white/84 p-4 sm:p-5"
                      key={`${item.title}-${item.url}`}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="max-w-3xl">
                          <h3 className="atlas-display text-2xl leading-tight text-slate-900">{item.title}</h3>
                          {item.note ? <p className="mt-2 text-sm leading-7 text-slate-600">{item.note}</p> : null}
                        </div>
                        <a
                          className="inline-flex items-center gap-2 rounded-full border border-[rgba(28,36,48,0.08)] bg-white/88 px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-[rgba(28,36,48,0.16)]"
                          href={item.url}
                          rel="noreferrer"
                          target="_blank"
                        >
                          Open full chart
                          <ExternalLink className={cn("h-3.5 w-3.5 flex-none", styles.source)} />
                        </a>
                      </div>
                      {isKnownBrokenLearningChartUrl(item.url) ? (
                        <div className="mt-4 rounded-[1.25rem] border border-[rgba(28,36,48,0.08)] bg-[rgba(241,245,249,0.84)] px-4 py-4">
                          <div className="flex items-start gap-3">
                            <div className={cn("flex h-9 w-9 flex-none items-center justify-center rounded-full border", styles.icon)}>
                              <AlertTriangle className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-slate-900">This external chart link is currently stale</p>
                              <p className="mt-2 text-sm leading-7 text-slate-600">
                                The evidence source is still relevant, but the old grapher embed no longer resolves correctly.
                              </p>
                            </div>
                          </div>
                          {sourceItems.length ? (
                            <div className="mt-4 grid gap-3 md:grid-cols-2">
                              {sourceItems.slice(0, 4).map((source) => (
                                <a
                                  className="flex items-start justify-between gap-3 rounded-[1.1rem] border border-[rgba(28,36,48,0.08)] bg-white/92 px-4 py-3 transition hover:border-[rgba(28,36,48,0.16)]"
                                  href={source.url}
                                  key={`${source.label}-${source.title}`}
                                  rel="noreferrer"
                                  target="_blank"
                                >
                                  <div>
                                    <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{source.label}</p>
                                    <p className="mt-2 text-sm font-medium text-slate-900">{source.title}</p>
                                  </div>
                                  <ExternalLink className={cn("mt-0.5 h-4 w-4 flex-none", styles.source)} />
                                </a>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      ) : (
                        <div className="mt-4 overflow-hidden rounded-[1.25rem] border border-[rgba(28,36,48,0.08)] bg-white">
                          <iframe
                            allow="web-share; clipboard-write"
                            className="w-full"
                            loading="eager"
                            referrerPolicy="strict-origin-when-cross-origin"
                            src={item.url}
                            style={{ border: 0, height: item.height }}
                            title={item.title}
                          />
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              </div>
            );
          }

          if (block.type === "sources") {
            return (
              <div className="space-y-4" key={`${block.type}-${index}`}>
                <p className="atlas-kicker">{block.title ?? "Sources"}</p>
                <div className="grid gap-3 md:grid-cols-2">
                  {block.items.map((item) => (
                    <a
                      className="flex items-start justify-between gap-3 rounded-[1.3rem] border border-[rgba(28,36,48,0.08)] bg-white/84 px-4 py-4 transition hover:border-[rgba(28,36,48,0.16)]"
                      href={item.url}
                      key={`${item.label}-${item.title}`}
                      rel="noreferrer"
                      target="_blank"
                    >
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{item.label}</p>
                        <p className="mt-2 text-sm font-medium text-slate-900">{item.title}</p>
                      </div>
                      <ExternalLink className={cn("mt-0.5 h-4 w-4 flex-none", styles.source)} />
                    </a>
                  ))}
                </div>
              </div>
            );
          }

          return null;
        })}
      </div>
    </section>
  );
}

import { BookOpenText, ExternalLink } from "lucide-react";

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
    badge: "border-amber-300/25 bg-amber-400/10 text-amber-100",
    callout: "border-amber-300/20 bg-amber-400/8 text-amber-50",
    heading: "text-amber-200",
    icon: "text-amber-200",
    source: "text-amber-200 hover:text-amber-100",
  },
  cyan: {
    badge: "border-cyan-300/25 bg-cyan-400/10 text-cyan-100",
    callout: "border-cyan-300/20 bg-cyan-400/8 text-cyan-50",
    heading: "text-cyan-200",
    icon: "text-cyan-200",
    source: "text-cyan-200 hover:text-cyan-100",
  },
  emerald: {
    badge: "border-emerald-300/25 bg-emerald-400/10 text-emerald-100",
    callout: "border-emerald-300/20 bg-emerald-400/8 text-emerald-50",
    heading: "text-emerald-200",
    icon: "text-emerald-200",
    source: "text-emerald-200 hover:text-emerald-100",
  },
  rose: {
    badge: "border-rose-300/25 bg-rose-400/10 text-rose-100",
    callout: "border-rose-300/20 bg-rose-400/8 text-rose-50",
    heading: "text-rose-200",
    icon: "text-rose-200",
    source: "text-rose-200 hover:text-rose-100",
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

  return (
    <section className="rounded-[1.75rem] border border-slate-800 bg-panel/90 p-5 sm:p-6">
      <div className="max-w-4xl">
        <span className={cn("inline-flex rounded-full border px-3 py-1 text-xs font-medium", styles.badge)}>
          Guided reading
        </span>
        <div className="mt-4 flex items-center gap-2">
          <BookOpenText className={cn("h-5 w-5", styles.icon)} />
          <h2 className="text-2xl font-semibold text-slate-50">A connected explanation, not just isolated points</h2>
        </div>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          This section turns the module into an in-platform lesson. The goal is to keep the core logic, evidence, and
          practical implications together so learners do not have to jump across sites just to understand the topic.
        </p>
      </div>

      <div className="mt-6 space-y-6">
        {article.blocks.map((block, index) => {
          if (block.type === "heading") {
            const HeadingTag = block.level === 2 ? "h3" : "h4";

            return (
              <HeadingTag
                className={cn(
                  "font-semibold tracking-tight",
                  block.level === 2 ? "text-2xl text-slate-50" : "text-lg text-slate-100",
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
              <p className="max-w-4xl text-sm leading-7 text-slate-300 sm:text-base" key={`${block.type}-${index}`}>
                {block.text}
              </p>
            );
          }

          if (block.type === "list") {
            return (
              <ul className="grid gap-3" key={`${block.type}-${index}`}>
                {block.items.map((item) => (
                  <li
                    className="rounded-2xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-sm leading-6 text-slate-300"
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
                className={cn("rounded-[1.5rem] border px-4 py-4 text-sm leading-6 sm:text-base", styles.callout)}
                key={`${block.type}-${index}`}
              >
                {block.text}
              </div>
            );
          }

          if (block.type === "cards") {
            return (
              <div className="space-y-4" key={`${block.type}-${index}`}>
                {block.title ? <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{block.title}</p> : null}
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {block.items.map((item) => (
                    <article
                      className="rounded-[1.5rem] border border-slate-800 bg-slate-950/60 p-5"
                      key={`${item.title}-${item.body}`}
                    >
                      <h3 className="text-lg font-semibold text-slate-50">{item.title}</h3>
                      <p className="mt-3 text-sm leading-6 text-slate-300">{item.body}</p>
                    </article>
                  ))}
                </div>
              </div>
            );
          }

          if (block.type === "charts") {
            return (
              <div className="space-y-4" key={`${block.type}-${index}`}>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                  {block.title ?? "Embedded charts"}
                </p>
                <div className="space-y-5">
                  {block.items.map((item) => (
                    <article
                      className="rounded-[1.5rem] border border-slate-800 bg-slate-950/60 p-4 sm:p-5"
                      key={`${item.title}-${item.url}`}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="max-w-3xl">
                          <h3 className="text-lg font-semibold text-slate-50">{item.title}</h3>
                          {item.note ? <p className="mt-2 text-sm leading-6 text-slate-300">{item.note}</p> : null}
                        </div>
                        <a
                          className="inline-flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-900/70 px-3 py-2 text-xs font-medium text-slate-200 transition hover:border-slate-700"
                          href={item.url}
                          rel="noreferrer"
                          target="_blank"
                        >
                          Open full chart
                          <ExternalLink className={cn("h-3.5 w-3.5 flex-none", styles.source)} />
                        </a>
                      </div>
                      <div className="mt-4 overflow-hidden rounded-[1.25rem] border border-slate-800 bg-slate-950">
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
                    </article>
                  ))}
                </div>
              </div>
            );
          }

          if (block.type === "sources") {
            return (
              <div className="space-y-4" key={`${block.type}-${index}`}>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{block.title ?? "Sources"}</p>
                <div className="grid gap-3 md:grid-cols-2">
                  {block.items.map((item) => (
                    <a
                      className="flex items-start justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-950/60 px-4 py-4 transition hover:border-slate-700"
                      href={item.url}
                      key={`${item.label}-${item.title}`}
                      rel="noreferrer"
                      target="_blank"
                    >
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{item.label}</p>
                        <p className="mt-2 text-sm font-medium text-slate-50">{item.title}</p>
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

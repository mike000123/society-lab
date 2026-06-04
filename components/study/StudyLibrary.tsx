"use client";

import { useDeferredValue, useEffect, useMemo, useState, type ReactNode } from "react";
import { ExternalLink, LibraryBig, Search, SlidersHorizontal } from "lucide-react";

import { SoftPanel } from "@/components/atlas/SoftPanel";
import { Button } from "@/components/ui/button";
import {
  STUDY_CATEGORIES,
  STUDY_FORMATS,
  type StudyAccess,
  type StudyAccent,
  type StudyCategory,
  type StudyFormat,
  type StudyResource,
} from "@/lib/study/catalog";
import { cn } from "@/lib/utils";

const ACCESS_OPTIONS: Array<"All" | StudyAccess> = ["All", "Free", "Mixed", "Paid"];

const accentStyles: Record<
  StudyAccent,
  {
    badge: string;
    card: string;
    surface: string;
    text: string;
  }
> = {
  amber: {
    badge: "border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-400/25 dark:bg-amber-400/10 dark:text-amber-100",
    card: "hover:border-amber-300/70",
    surface: "bg-amber-50 dark:bg-amber-400/12",
    text: "text-amber-700 dark:text-amber-200",
  },
  cyan: {
    badge: "border-cyan-300 bg-cyan-50 text-cyan-700 dark:border-cyan-400/25 dark:bg-cyan-400/10 dark:text-cyan-100",
    card: "hover:border-cyan-300/70",
    surface: "bg-cyan-50 dark:bg-cyan-400/12",
    text: "text-cyan-700 dark:text-cyan-200",
  },
  emerald: {
    badge: "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-400/25 dark:bg-emerald-400/10 dark:text-emerald-100",
    card: "hover:border-emerald-300/70",
    surface: "bg-emerald-50 dark:bg-emerald-400/12",
    text: "text-emerald-700 dark:text-emerald-200",
  },
  rose: {
    badge: "border-rose-300 bg-rose-50 text-rose-700 dark:border-rose-400/25 dark:bg-rose-400/10 dark:text-rose-100",
    card: "hover:border-rose-300/70",
    surface: "bg-rose-50 dark:bg-rose-400/12",
    text: "text-rose-700 dark:text-rose-200",
  },
};

function matchesQuery(resource: StudyResource, query: string) {
  if (!query) {
    return true;
  }

  const haystack = [
    resource.title,
    resource.source,
    resource.summary,
    resource.format,
    resource.level,
    resource.access,
    ...resource.tags,
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(query);
}

function FilterChip({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      className={cn(
        "rounded-full border px-3 py-2 text-xs font-medium transition sm:text-sm",
        active
          ? "border-[rgba(59,130,246,0.28)] bg-[rgba(59,130,246,0.1)] text-slate-900 dark:text-cyan-100"
          : "border-[rgba(28,36,48,0.12)] bg-white/80 text-slate-600 hover:border-[rgba(59,130,246,0.26)] hover:bg-white hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300 dark:hover:bg-slate-800",
      )}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

function ResourceCard({
  accent,
  resource,
}: {
  accent: StudyAccent;
  resource: StudyResource;
}) {
  const styles = accentStyles[accent];

  return (
    <article className="grid gap-4 py-5 first:pt-0 last:pb-0 xl:grid-cols-[minmax(0,1fr)_10rem]">
      <div>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-[rgba(28,36,48,0.08)] bg-white/90 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-slate-600 dark:border-slate-700 dark:bg-slate-950/70 dark:text-slate-300">
            {resource.format}
          </span>
          <span className="rounded-full border border-[rgba(28,36,48,0.08)] bg-white/90 px-3 py-1 text-[11px] font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-950/70 dark:text-slate-300">
            {resource.level}
          </span>
          <span className={cn("rounded-full border px-3 py-1 text-[11px] font-medium", styles.badge)}>
            {resource.access}
          </span>
        </div>

        <p className="mt-3 text-xs uppercase tracking-[0.22em] text-slate-500">{resource.source}</p>
        <h3 className="mt-2 text-xl font-semibold leading-7 text-slate-900 dark:text-slate-50">{resource.title}</h3>
        <p className="mt-3 atlas-copy text-sm">{resource.summary}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {resource.tags.map((tag) => (
            <span
              className="rounded-full border border-[rgba(28,36,48,0.08)] bg-white/88 px-3 py-1 text-xs text-slate-500 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-400"
              key={tag}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-start justify-between gap-3 xl:flex-col xl:items-end">
        <span className={cn("rounded-full border px-3 py-1 text-xs font-medium", styles.badge)}>{resource.source}</span>
        <a
          aria-label={`Open ${resource.title}`}
          className={cn(
            "inline-flex items-center gap-2 rounded-full border border-[rgba(28,36,48,0.08)] bg-white/88 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:text-slate-900 dark:border-slate-700 dark:bg-slate-950/70 dark:text-slate-300 dark:hover:text-slate-50",
            styles.surface,
          )}
          href={resource.url}
          rel="noreferrer"
          target="_blank"
        >
          Open
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </article>
  );
}

function CategorySection({ category }: { category: StudyCategory }) {
  const styles = accentStyles[category.accent];

  return (
    <SoftPanel className="space-y-6" id={category.id}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-3xl">
          <span className={cn("inline-flex rounded-full border px-3 py-1 text-xs font-medium", styles.badge)}>
            {category.items.length} resources
          </span>
          <h2 className="mt-3 atlas-display text-3xl text-slate-900 sm:text-4xl dark:text-slate-50">{category.title}</h2>
          <p className="mt-3 atlas-copy text-sm sm:text-base">{category.description}</p>
        </div>
        <a
          className={cn("text-sm font-medium transition hover:text-slate-900 dark:hover:text-slate-50", styles.text)}
          href={`#${category.id}`}
        >
          Jump here
        </a>
      </div>

      <div className="divide-y divide-[rgba(28,36,48,0.08)] rounded-[1.45rem] border border-[rgba(28,36,48,0.08)] bg-white/72 px-5 dark:border-slate-700 dark:bg-slate-950/40">
        {category.items.map((resource) => (
          <ResourceCard accent={category.accent} key={resource.id} resource={resource} />
        ))}
      </div>
    </SoftPanel>
  );
}

export function StudyLibrary({
  initialCategory = "all",
}: {
  initialCategory?: "all" | StudyCategory["id"];
}) {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"all" | StudyCategory["id"]>("all");
  const [selectedFormat, setSelectedFormat] = useState<"All" | StudyFormat>("All");
  const [selectedAccess, setSelectedAccess] = useState<"All" | StudyAccess>("All");
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());

  useEffect(() => {
    setSelectedCategory(initialCategory);
  }, [initialCategory]);

  const filteredCategories = useMemo(() => {
    return STUDY_CATEGORIES.map((category) => {
      const items = category.items.filter((resource) => {
        const categoryMatch = selectedCategory === "all" || category.id === selectedCategory;
        const formatMatch = selectedFormat === "All" || resource.format === selectedFormat;
        const accessMatch = selectedAccess === "All" || resource.access === selectedAccess;

        return categoryMatch && formatMatch && accessMatch && matchesQuery(resource, deferredQuery);
      });

      return {
        ...category,
        items,
      };
    }).filter((category) => category.items.length > 0);
  }, [deferredQuery, selectedAccess, selectedCategory, selectedFormat]);

  const matchedResourceCount = filteredCategories.reduce((total, category) => total + category.items.length, 0);

  const hasFilters =
    query.trim().length > 0 || selectedCategory !== "all" || selectedFormat !== "All" || selectedAccess !== "All";

  return (
    <div className="space-y-6">
      <SoftPanel className="space-y-6">
        <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(28,36,48,0.08)] bg-white/80 px-3 py-1 text-xs font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200">
              <LibraryBig className="h-4 w-4 text-primary" />
              Filter the library
            </div>
            <div>
              <h2 className="atlas-display text-3xl text-slate-900 sm:text-4xl dark:text-slate-50">Browse by topic, type, or depth</h2>
              <p className="mt-3 max-w-2xl atlas-copy text-sm sm:text-base">
                Mix starter explainers with deeper books, papers, and datasets. The goal is to help people keep
                learning after each module instead of bouncing back to generic search results.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-[1.35rem] border border-[rgba(28,36,48,0.08)] bg-white/82 px-4 py-4 dark:border-slate-700 dark:bg-panel/85">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Matches</p>
                <p className="mt-2 atlas-display text-3xl text-slate-900 dark:text-slate-50">{matchedResourceCount}</p>
              </div>
              <div className="rounded-[1.35rem] border border-[rgba(28,36,48,0.08)] bg-white/82 px-4 py-4 dark:border-slate-700 dark:bg-panel/85">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Visible topics</p>
                <p className="mt-2 atlas-display text-3xl text-slate-900 dark:text-slate-50">{filteredCategories.length}</p>
              </div>
              <div className="rounded-[1.35rem] border border-[rgba(28,36,48,0.08)] bg-white/82 px-4 py-4 dark:border-slate-700 dark:bg-panel/85">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Formats</p>
                <p className="mt-2 atlas-display text-3xl text-slate-900 dark:text-slate-50">{STUDY_FORMATS.length}</p>
              </div>
            </div>
          </div>

          <div className="space-y-5 rounded-[1.7rem] border border-[rgba(28,36,48,0.08)] bg-white/82 p-4 sm:p-5 dark:border-slate-700 dark:bg-panel/85">
            <label className="block">
              <span className="mb-2 inline-flex items-center gap-2 text-sm font-medium text-slate-800 dark:text-slate-200">
                <Search className="h-4 w-4 text-primary" />
                Search the library
              </span>
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  className="w-full rounded-[1.35rem] border border-[rgba(28,36,48,0.12)] bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-500 focus:border-primary dark:border-slate-700 dark:bg-slate-950/80 dark:text-slate-100"
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search by topic, source, tag, or format"
                  value={query}
                />
              </div>
            </label>

            <div className="space-y-4">
              <div>
                <div className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-800 dark:text-slate-200">
                  <SlidersHorizontal className="h-4 w-4 text-primary" />
                  Format
                </div>
                <div className="flex flex-wrap gap-2">
                  <FilterChip active={selectedFormat === "All"} onClick={() => setSelectedFormat("All")}>
                    All formats
                  </FilterChip>
                  {STUDY_FORMATS.map((format) => (
                    <FilterChip
                      active={selectedFormat === format}
                      key={format}
                      onClick={() => setSelectedFormat(format)}
                    >
                      {format}
                    </FilterChip>
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-2 text-sm font-medium text-slate-800 dark:text-slate-200">Access</div>
                <div className="flex flex-wrap gap-2">
                  {ACCESS_OPTIONS.map((access) => (
                    <FilterChip
                      active={selectedAccess === access}
                      key={access}
                      onClick={() => setSelectedAccess(access)}
                    >
                      {access}
                    </FilterChip>
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-2 text-sm font-medium text-slate-800 dark:text-slate-200">Topic</div>
                <div className="flex flex-wrap gap-2">
                  <FilterChip active={selectedCategory === "all"} onClick={() => setSelectedCategory("all")}>
                    All topics
                  </FilterChip>
                  {STUDY_CATEGORIES.map((category) => (
                    <FilterChip
                      active={selectedCategory === category.id}
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      {category.title}
                    </FilterChip>
                  ))}
                </div>
              </div>
            </div>

            {hasFilters ? (
              <Button
                className="rounded-full"
                onClick={() => {
                  setQuery("");
                  setSelectedAccess("All");
                  setSelectedCategory("all");
                  setSelectedFormat("All");
                }}
                variant="outline"
              >
                Clear filters
              </Button>
            ) : null}
          </div>
        </div>
      </SoftPanel>

      {filteredCategories.length > 0 ? (
        <div className="space-y-5">
          {filteredCategories.map((category) => (
            <CategorySection category={category} key={category.id} />
          ))}
        </div>
      ) : (
        <SoftPanel className="border-dashed px-6 py-10 text-center">
          <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">No resources match those filters yet.</p>
          <p className="mt-2 atlas-copy text-sm">
            Try a broader keyword or clear one of the format, access, or topic filters.
          </p>
        </SoftPanel>
      )}
    </div>
  );
}

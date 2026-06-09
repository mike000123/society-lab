"use client";

import { useDeferredValue, useEffect, useMemo, useState, type ReactNode } from "react";
import { ChevronDown, LibraryBig, Search, SlidersHorizontal } from "lucide-react";

import { SoftPanel } from "@/components/atlas/SoftPanel";
import { Button } from "@/components/ui/button";
import { ResourceListItem } from "@/components/study/ResourceListItem";
import {
  STUDY_ACCESS_OPTIONS,
  STUDY_FORMATS,
  type StudyAccess,
  type StudyCategory,
  type StudyFormat,
  type StudyResource,
} from "@/lib/study/catalog";
import { mergeStudyCategories, type CommunityStudyResource } from "@/lib/study/community";
import { cn } from "@/lib/utils";

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
          ? "border-[rgba(59,130,246,0.26)] bg-[rgba(59,130,246,0.08)] text-slate-900"
          : "border-[rgba(28,36,48,0.1)] bg-white text-slate-600 hover:border-[rgba(28,36,48,0.18)] hover:text-slate-900",
      )}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

function LibraryCategorySection({ category }: { category: StudyCategory }) {
  return (
    <section className="space-y-4" id={category.id}>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-[rgba(28,36,48,0.08)] bg-white px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              {category.items.length} resources
            </span>
          </div>
          <h3 className="mt-3 atlas-display text-[1.95rem] leading-tight text-slate-900">{category.title}</h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{category.description}</p>
        </div>
      </div>

      <div className="rounded-[1.55rem] border border-[rgba(28,36,48,0.08)] bg-white px-5 py-5 shadow-[0_16px_38px_rgba(28,36,48,0.04)]">
        <div className="divide-y divide-[rgba(28,36,48,0.08)]">
          {category.items.map((resource) => (
            <ResourceListItem
              accent={category.accent}
              categoryId={category.id}
              categoryTitle={category.title}
              key={resource.id}
              resource={resource}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export function StudyLibrary({
  communityResources = [],
  initialCategory = "all",
}: {
  communityResources?: CommunityStudyResource[];
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

  const mergedCategories = useMemo(() => mergeStudyCategories(communityResources), [communityResources]);

  const categoriesWithoutFormatFilter = useMemo(() => {
    return mergedCategories
      .map((category) => {
        const items = category.items.filter((resource) => {
          const categoryMatch = selectedCategory === "all" || category.id === selectedCategory;
          const accessMatch = selectedAccess === "All" || resource.access === selectedAccess;

          return categoryMatch && accessMatch && matchesQuery(resource, deferredQuery);
        });

        return {
          ...category,
          items,
        };
      })
      .filter((category) => category.items.length > 0);
  }, [deferredQuery, mergedCategories, selectedAccess, selectedCategory]);

  const filteredCategories = useMemo(() => {
    return categoriesWithoutFormatFilter
      .map((category) => {
        const items = category.items.filter((resource) => {
          const formatMatch = selectedFormat === "All" || resource.format === selectedFormat;

          return formatMatch;
        });

        return {
          ...category,
          items,
        };
      })
      .filter((category) => category.items.length > 0);
  }, [categoriesWithoutFormatFilter, selectedFormat]);

  const matchedResourceCount = filteredCategories.reduce((total, category) => total + category.items.length, 0);
  const allMatchedResourceCount = categoriesWithoutFormatFilter.reduce((total, category) => total + category.items.length, 0);
  const formatCounts = useMemo(() => {
    const counts = new Map<string, number>();
    categoriesWithoutFormatFilter.forEach((category) => {
      category.items.forEach((resource) => {
        counts.set(resource.format, (counts.get(resource.format) ?? 0) + 1);
      });
    });
    return counts;
  }, [categoriesWithoutFormatFilter]);

  const resourceTypeCounts = useMemo(() => {
    return [
      { key: "All", label: "All resources", value: allMatchedResourceCount },
      ...STUDY_FORMATS.map((format) => ({
        key: format,
        label: format === "Article" ? "Articles" : format === "Book" ? "Books" : format === "Paper" ? "Papers" : format === "Report" ? "Reports" : format === "Website" ? "Websites" : format === "Course" ? "Courses" : format === "Dataset" ? "Datasets" : format === "Channel" ? "Channels" : format === "Podcast" ? "Podcasts" : "Tools",
        value: formatCounts.get(format) ?? 0,
      })),
    ];
  }, [allMatchedResourceCount, formatCounts]);

  const hasFilters =
    query.trim().length > 0 || selectedCategory !== "all" || selectedFormat !== "All" || selectedAccess !== "All";

  return (
    <div className="space-y-6">
      <SoftPanel className="space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="atlas-kicker">Full Library</p>
            <h2 className="atlas-display mt-2 text-[2rem] leading-tight text-slate-900">Search everything. Filter, discover, and open the resources you need.</h2>
          </div>
          <div className="rounded-full border border-[rgba(28,36,48,0.08)] bg-white px-4 py-2 text-sm font-semibold text-slate-600">
            {matchedResourceCount} results
          </div>
        </div>

        <div className="space-y-3 rounded-[1.5rem] border border-[rgba(28,36,48,0.08)] bg-white px-4 py-4 shadow-[0_12px_28px_rgba(28,36,48,0.03)]">
          <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-center">
            <label className="block">
              <span className="sr-only">Search resources</span>
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  className="w-full rounded-[1rem] border border-[rgba(28,36,48,0.12)] bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-500 focus:border-primary"
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search resources, topics, authors..."
                  value={query}
                />
              </div>
            </label>

            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(28,36,48,0.08)] bg-[rgba(246,244,238,0.82)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                <LibraryBig className="h-3.5 w-3.5 text-primary" />
                How the library works
              </div>
              {hasFilters ? (
                <button
                  className="rounded-full border border-[rgba(28,36,48,0.12)] bg-white px-3 py-2 text-sm font-semibold text-slate-600 transition hover:border-[rgba(28,36,48,0.2)] hover:text-slate-900"
                  onClick={() => {
                    setQuery("");
                    setSelectedAccess("All");
                    setSelectedCategory("all");
                    setSelectedFormat("All");
                  }}
                  type="button"
                >
                  Clear all
                </button>
              ) : null}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <div className="inline-flex items-center gap-1 rounded-full border border-[rgba(28,36,48,0.08)] bg-[rgba(246,244,238,0.82)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Resource type
                <ChevronDown className="h-3.5 w-3.5" />
              </div>
              <div className="inline-flex items-center gap-1 rounded-full border border-[rgba(28,36,48,0.08)] bg-[rgba(246,244,238,0.82)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                {selectedFormat === "All" ? "All formats" : selectedFormat}
              </div>
              <div className="inline-flex items-center gap-1 rounded-full border border-[rgba(28,36,48,0.08)] bg-[rgba(246,244,238,0.82)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                {selectedCategory === "all" ? "All topics" : mergedCategories.find((category) => category.id === selectedCategory)?.title}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
            {STUDY_ACCESS_OPTIONS.map((access) => (
              <FilterChip active={selectedAccess === access} key={access} onClick={() => setSelectedAccess(access)}>
                {access}
              </FilterChip>
            ))}
            </div>

            <div className="flex flex-wrap gap-2">
              <FilterChip active={selectedCategory === "all"} onClick={() => setSelectedCategory("all")}>
                All topics
              </FilterChip>
              {mergedCategories.map((category) => (
              <FilterChip active={selectedCategory === category.id} key={category.id} onClick={() => setSelectedCategory(category.id)}>
                {category.title}
              </FilterChip>
            ))}
            </div>
          </div>
        </div>
      </SoftPanel>

      <div className="grid gap-6 xl:grid-cols-[13rem_minmax(0,1fr)]">
        <aside className="space-y-4 xl:sticky xl:top-24 xl:self-start">
          <SoftPanel className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
              <SlidersHorizontal className="h-4 w-4 text-primary" />
              Resource types
            </div>

            <div className="space-y-1">
              {resourceTypeCounts.map((item) => {
                const isActive = item.key === "All" ? selectedFormat === "All" : selectedFormat === item.key;

                return (
                  <button
                    className={cn(
                      "flex w-full items-center justify-between rounded-[0.95rem] px-3 py-2 text-left text-sm transition",
                      isActive ? "bg-[rgba(59,130,246,0.08)] text-slate-900" : "text-slate-600 hover:bg-[rgba(246,244,238,0.82)] hover:text-slate-900",
                    )}
                    key={item.key}
                    onClick={() => setSelectedFormat(item.key === "All" ? "All" : (item.key as StudyFormat))}
                    type="button"
                  >
                    <span className="font-medium">{item.label}</span>
                    <span className="text-xs font-semibold text-slate-400">{item.value}</span>
                  </button>
                );
              })}
            </div>
          </SoftPanel>
        </aside>

        <div className="space-y-6">
          {filteredCategories.length > 0 ? (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3 px-1">
                <p className="text-sm font-semibold text-slate-600">{matchedResourceCount} results</p>
                <div className="rounded-full border border-[rgba(28,36,48,0.08)] bg-white px-3 py-1.5 text-sm font-medium text-slate-500">
                  Sort by: Relevance
                </div>
              </div>

              {filteredCategories.map((category) => (
                <LibraryCategorySection category={category} key={category.id} />
              ))}
            </>
          ) : (
            <SoftPanel className="border-dashed px-6 py-10 text-center">
              <p className="text-lg font-semibold text-slate-900">No resources match those filters yet.</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Try a broader keyword or clear one of the format, access, or topic filters.
              </p>
            </SoftPanel>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useMemo, useState, type ElementType } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Banknote,
  BarChart3,
  BookOpenText,
  Brain,
  Building2,
  Compass,
  Database,
  Globe2,
  Landmark,
  Leaf,
  Monitor,
  Sparkles,
} from "lucide-react";

import { AtlasPage } from "@/components/atlas/AtlasPage";
import { IllustratedTabHero } from "@/components/atlas/IllustratedTabHero";
import { SoftPanel } from "@/components/atlas/SoftPanel";
import { StudyLibrary } from "@/components/study/StudyLibrary";
import { STUDY_CATEGORIES, STUDY_FORMATS, STUDY_RESOURCES, type StudyAccent, type StudyCategory, type StudyResource } from "@/lib/study/catalog";
import { STUDY_PATHS, type StudyPath } from "@/lib/study/paths";
import { cn } from "@/lib/utils";

type StudyView = "paths" | "topics" | "library";

const VIEW_OPTIONS: { id: StudyView; label: string }[] = [
  { id: "paths", label: "Paths" },
  { id: "topics", label: "Topics" },
  { id: "library", label: "Library" },
];

const CATEGORY_ICONS: Record<string, ElementType> = {
  "cities-housing": Building2,
  "corruption-development": Landmark,
  "data-research": Database,
  "democracy-governance": Compass,
  "ecology-climate": Leaf,
  "media-surveillance": Monitor,
  "money-banking": Banknote,
  "owid-shortlist": Globe2,
  "political-economy": BarChart3,
  "systems-thinking": Brain,
};

const ACCENT_BADGE: Record<StudyAccent, string> = {
  amber: "border-amber-300 bg-amber-50 text-amber-700",
  cyan: "border-cyan-300 bg-cyan-50 text-cyan-700",
  emerald: "border-emerald-300 bg-emerald-50 text-emerald-700",
  rose: "border-rose-300 bg-rose-50 text-rose-700",
};

function PathCard({
  isSelected,
  onPreview,
  path,
}: {
  isSelected: boolean;
  onPreview: () => void;
  path: StudyPath;
}) {
  return (
    <button
      className={cn(
        "flex h-full flex-col justify-between rounded-[1.5rem] border bg-white px-4 py-4 text-left transition-all",
        isSelected
          ? "border-primary shadow-[0_16px_36px_rgba(59,130,246,0.10)]"
          : "border-[rgba(28,36,48,0.08)] hover:border-[rgba(28,36,48,0.16)] hover:shadow-[0_16px_30px_rgba(28,36,48,0.06)]",
      )}
      onClick={onPreview}
      type="button"
    >
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-[rgba(28,36,48,0.08)] bg-[rgba(246,244,238,0.8)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
            {path.duration}
          </span>
          <span className="rounded-full border border-[rgba(28,36,48,0.08)] bg-[rgba(246,244,238,0.8)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
            {path.resourceIds.length} resources
          </span>
        </div>
        <div className="space-y-2">
          <h3 className="atlas-display text-[1.55rem] leading-tight text-slate-900">{path.title}</h3>
          <p className="text-sm font-medium text-slate-600">{path.tagline}</p>
          <p className="atlas-copy text-sm">{path.summary}</p>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-4">
        <span className="text-xs font-medium text-slate-500">{path.relatedCategoryIds.length} linked topics</span>
        <span className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white">
          Preview
          <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </button>
  );
}

function TopicTile({
  category,
  isSelected,
  onSelect,
}: {
  category: StudyCategory;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const Icon = CATEGORY_ICONS[category.id] ?? BookOpenText;

  return (
    <button
      className={cn(
        "rounded-[1.35rem] border bg-white px-4 py-4 text-left transition-all",
        isSelected
          ? "border-primary shadow-[0_16px_34px_rgba(59,130,246,0.10)]"
          : "border-[rgba(28,36,48,0.08)] hover:border-[rgba(28,36,48,0.16)] hover:shadow-[0_16px_30px_rgba(28,36,48,0.05)]",
      )}
      onClick={onSelect}
      type="button"
    >
      <div className={cn("flex h-11 w-11 items-center justify-center rounded-full border", ACCENT_BADGE[category.accent])}>
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-4 text-sm font-semibold text-slate-900">{category.title}</h3>
      <p className="mt-1 text-xs text-slate-500">{category.items.length} resources</p>
    </button>
  );
}

export function StudyHubPage() {
  const [activeView, setActiveView] = useState<StudyView>("paths");
  const [selectedPathId, setSelectedPathId] = useState(STUDY_PATHS[0]?.id ?? "");
  const [selectedCategoryId, setSelectedCategoryId] = useState<StudyCategory["id"]>(STUDY_CATEGORIES[0]?.id ?? "systems-thinking");

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const requestedView = new URLSearchParams(window.location.search).get("view");
    if (requestedView === "paths" || requestedView === "topics" || requestedView === "library") {
      setActiveView(requestedView);
    }
  }, []);

  const resourceLookup = useMemo(
    () =>
      Object.fromEntries(
        STUDY_RESOURCES.map((resource) => [resource.id, resource]),
      ) as Record<string, StudyResource>,
    [],
  );

  const categoryLookup = useMemo(
    () =>
      Object.fromEntries(
        STUDY_CATEGORIES.map((category) => [category.id, category]),
      ) as Record<string, StudyCategory>,
    [],
  );

  const selectedPath = STUDY_PATHS.find((path) => path.id === selectedPathId) ?? STUDY_PATHS[0];
  const selectedCategory = STUDY_CATEGORIES.find((category) => category.id === selectedCategoryId) ?? STUDY_CATEGORIES[0];
  const selectedPathResources = selectedPath.resourceIds.map((resourceId) => resourceLookup[resourceId]).filter(Boolean);

  useEffect(() => {
    const primaryCategoryId = selectedPath.relatedCategoryIds[0] as StudyCategory["id"] | undefined;
    if (primaryCategoryId) {
      setSelectedCategoryId(primaryCategoryId);
    }
  }, [selectedPath]);

  const viewSwitcher = (
    <div className="flex flex-wrap items-center gap-5 border-b border-[rgba(28,36,48,0.08)] pb-3">
      {VIEW_OPTIONS.map((option) => (
        <button
          className={cn(
            "border-b-2 pb-2 text-sm font-medium transition-colors",
            activeView === option.id
              ? "border-primary text-primary"
              : "border-transparent text-slate-500 hover:text-slate-900",
          )}
          key={option.id}
          onClick={() => setActiveView(option.id)}
          type="button"
        >
          {option.label}
        </button>
      ))}

      <div className="ml-auto hidden items-center gap-4 lg:flex">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
          {STUDY_PATHS.length} paths · {STUDY_CATEGORIES.length} topics · {STUDY_RESOURCES.length} resources
        </p>
      </div>
    </div>
  );

  return (
    <AtlasPage className="space-y-8 pb-14">
      {activeView === "paths" ? (
        <>
          <IllustratedTabHero
            actions={
              <>
                <button
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(59,130,246,0.18)] transition hover:bg-blue-500"
                  onClick={() => setActiveView("library")}
                  type="button"
                >
                  Open the library
                  <ArrowRight className="h-4 w-4" />
                </button>
                <Link
                  className="inline-flex items-center gap-2 rounded-full border border-[rgba(28,36,48,0.12)] bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-[rgba(28,36,48,0.22)] hover:text-slate-900"
                  href="/learn"
                >
                  Return to learning
                  <Compass className="h-4 w-4" />
                </Link>
              </>
            }
            description="Follow a curated reading path that mixes explainers, books, papers, datasets, and public knowledge projects without forcing the user to assemble the sequence alone."
            eyebrow="Selected path"
            imageAlt="A quiet library interior with a chair, shelves, and warm afternoon light."
            imageSrc="/atlas/study-hero.png"
            title="Go deeper without turning into your own search engine"
          >
            <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_21rem]">
              <div className="rounded-[1.6rem] border border-[rgba(28,36,48,0.08)] bg-white/90 px-5 py-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-[rgba(28,36,48,0.08)] bg-[rgba(246,244,238,0.88)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                    {selectedPath.duration}
                  </span>
                  <span className="rounded-full border border-[rgba(28,36,48,0.08)] bg-[rgba(246,244,238,0.88)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                    {selectedPath.resourceIds.length} resources
                  </span>
                </div>
                <h2 className="atlas-display mt-4 text-[2.2rem] leading-tight text-slate-900">{selectedPath.title}</h2>
                <p className="mt-2 text-sm font-medium text-slate-600">{selectedPath.tagline}</p>
                <p className="atlas-copy mt-3 text-sm">{selectedPath.summary}</p>

                <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {selectedPathResources.slice(0, 6).map((resource) => (
                    <div className="rounded-[1.2rem] border border-[rgba(28,36,48,0.08)] bg-[rgba(246,244,238,0.7)] px-3 py-3" key={resource.id}>
                      <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">{resource.format}</span>
                      <p className="mt-2 text-sm font-semibold leading-6 text-slate-900">{resource.title}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[1.6rem] border border-[rgba(28,36,48,0.08)] bg-white/90 px-5 py-5">
                <p className="atlas-kicker">What this path builds</p>
                <p className="mt-3 text-sm leading-7 text-slate-600">{selectedPath.outcome}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {selectedPath.relatedCategoryIds.map((categoryId) => (
                    <span
                      className="rounded-full border border-[rgba(28,36,48,0.08)] bg-[rgba(246,244,238,0.88)] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500"
                      key={categoryId}
                    >
                      {categoryLookup[categoryId]?.title}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </IllustratedTabHero>

          {viewSwitcher}

          <section className="space-y-4">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="atlas-display text-[2.2rem] leading-tight text-slate-900">Recommended Study Paths</h2>
                <p className="mt-2 text-sm text-slate-600">Use a curated sequence when you want guidance rather than a giant list.</p>
              </div>
              <button
                className="text-sm font-semibold text-primary transition hover:text-blue-700"
                onClick={() => setActiveView("topics")}
                type="button"
              >
                Browse by topic →
              </button>
            </div>

            <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
              {STUDY_PATHS.map((path) => (
                <PathCard
                  isSelected={selectedPath.id === path.id}
                  key={path.id}
                  onPreview={() => setSelectedPathId(path.id)}
                  path={path}
                />
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="atlas-display text-[2.2rem] leading-tight text-slate-900">Browse by Topic</h2>
                <p className="mt-2 text-sm text-slate-600">The same atlas regions as Learn, extended into books, papers, datasets, and deeper tools.</p>
              </div>
              <button
                className="text-sm font-semibold text-primary transition hover:text-blue-700"
                onClick={() => setActiveView("library")}
                type="button"
              >
                Open full library →
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
              {STUDY_CATEGORIES.map((category) => (
                <TopicTile
                  category={category}
                  isSelected={selectedCategory.id === category.id}
                  key={category.id}
                  onSelect={() => {
                    setSelectedCategoryId(category.id);
                    setActiveView("topics");
                  }}
                />
              ))}
            </div>
          </section>
        </>
      ) : null}

      {activeView === "topics" ? (
        <>
          <IllustratedTabHero
            actions={
              <>
                <button
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(59,130,246,0.18)] transition hover:bg-blue-500"
                  onClick={() => setActiveView("library")}
                  type="button"
                >
                  Open filtered library
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  className="inline-flex items-center gap-2 rounded-full border border-[rgba(28,36,48,0.12)] bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-[rgba(28,36,48,0.22)] hover:text-slate-900"
                  onClick={() => setActiveView("paths")}
                  type="button"
                >
                  Return to paths
                  <Sparkles className="h-4 w-4" />
                </button>
              </>
            }
            description={selectedCategory.description}
            eyebrow="Selected topic"
            imageAlt="A quiet library interior with a chair, shelves, and warm afternoon light."
            imageSrc="/atlas/study-hero.png"
            title={selectedCategory.title}
          >
            <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_19rem]">
              <div className="rounded-[1.6rem] border border-[rgba(28,36,48,0.08)] bg-white/90 px-5 py-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={cn("rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em]", ACCENT_BADGE[selectedCategory.accent])}>
                    {selectedCategory.items.length} resources
                  </span>
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {selectedCategory.items.slice(0, 6).map((resource) => (
                    <a
                      className="rounded-[1.2rem] border border-[rgba(28,36,48,0.08)] bg-[rgba(246,244,238,0.7)] px-3 py-3 transition hover:border-[rgba(28,36,48,0.16)]"
                      href={resource.url}
                      key={resource.id}
                      rel="noreferrer"
                      target="_blank"
                    >
                      <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">{resource.format}</span>
                      <p className="mt-2 text-sm font-semibold leading-6 text-slate-900">{resource.title}</p>
                    </a>
                  ))}
                </div>
              </div>

              <div className="rounded-[1.6rem] border border-[rgba(28,36,48,0.08)] bg-white/90 px-5 py-5">
                <p className="atlas-kicker">Good for</p>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Use this topic when you want to go deeper in one region before opening the full resource catalog.
                </p>
              </div>
            </div>
          </IllustratedTabHero>

          {viewSwitcher}

          <section className="space-y-4">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="atlas-display text-[2.2rem] leading-tight text-slate-900">Browse by Topic</h2>
                <p className="mt-2 text-sm text-slate-600">Choose one region, then open its strongest resources.</p>
              </div>
              <button
                className="text-sm font-semibold text-primary transition hover:text-blue-700"
                onClick={() => setActiveView("library")}
                type="button"
              >
                Open full library →
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
              {STUDY_CATEGORIES.map((category) => (
                <TopicTile
                  category={category}
                  isSelected={selectedCategory.id === category.id}
                  key={category.id}
                  onSelect={() => setSelectedCategoryId(category.id)}
                />
              ))}
            </div>
          </section>

          <div className="grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
            <SoftPanel tone="green">
              <p className="atlas-kicker">Selected topic shelf</p>
              <div className="mt-4 space-y-4">
                {selectedCategory.items.slice(0, 3).map((resource) => (
                  <a
                    className="block rounded-[1.3rem] border border-[rgba(28,36,48,0.08)] bg-white/88 px-4 py-4 transition hover:border-[rgba(28,36,48,0.16)]"
                    href={resource.url}
                    key={resource.id}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-[rgba(28,36,48,0.08)] bg-[rgba(246,244,238,0.88)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                        {resource.format}
                      </span>
                      <span className="rounded-full border border-[rgba(28,36,48,0.08)] bg-[rgba(246,244,238,0.88)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                        {resource.level}
                      </span>
                    </div>
                    <h3 className="mt-3 text-lg font-semibold leading-7 text-slate-900">{resource.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-slate-600">{resource.summary}</p>
                  </a>
                ))}
              </div>
            </SoftPanel>

            <SoftPanel>
              <p className="atlas-kicker">How it relates to Learn</p>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                The topic view is the Study equivalent of Learn&apos;s track explorer: one region at a time, with enough
                context to choose the right next resource before opening the full catalog.
              </p>
            </SoftPanel>
          </div>
        </>
      ) : null}

      {activeView === "library" ? (
        <>
          <IllustratedTabHero
            actions={
              <>
                <button
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(59,130,246,0.18)] transition hover:bg-blue-500"
                  onClick={() => setActiveView("paths")}
                  type="button"
                >
                  Return to paths
                  <Sparkles className="h-4 w-4" />
                </button>
                <button
                  className="inline-flex items-center gap-2 rounded-full border border-[rgba(28,36,48,0.12)] bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-[rgba(28,36,48,0.22)] hover:text-slate-900"
                  onClick={() => setActiveView("topics")}
                  type="button"
                >
                  Browse topics
                  <Compass className="h-4 w-4" />
                </button>
              </>
            }
            description="Every resource is still here. The difference is that the full catalog only appears when you intentionally want the full catalog."
            eyebrow="Full library"
            imageAlt="A quiet library interior with a chair, shelves, and warm afternoon light."
            imageSrc="/atlas/study-hero.png"
            title="Open the full study library when you need the whole shelf."
          >
            <div className="grid gap-3 sm:grid-cols-4">
              {[
                { label: "Resources", value: String(STUDY_RESOURCES.length) },
                { label: "Topics", value: String(STUDY_CATEGORIES.length) },
                { label: "Paths", value: String(STUDY_PATHS.length) },
                { label: "Formats", value: String(STUDY_FORMATS.length) },
              ].map((item) => (
                <div className="rounded-[1.2rem] border border-[rgba(28,36,48,0.08)] bg-white/90 px-4 py-4" key={item.label}>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">{item.label}</p>
                  <p className="atlas-display mt-2 text-3xl text-slate-900">{item.value}</p>
                </div>
              ))}
            </div>
          </IllustratedTabHero>

          {viewSwitcher}

          <div id="study-library">
            <StudyLibrary initialCategory={selectedCategoryId} />
          </div>
        </>
      ) : null}
    </AtlasPage>
  );
}

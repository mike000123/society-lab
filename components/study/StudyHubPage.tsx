"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpenText, Link2, MessageSquare, Sparkles, X } from "lucide-react";

import { AtlasPage } from "@/components/atlas/AtlasPage";
import { SoftPanel } from "@/components/atlas/SoftPanel";
import { KnowledgeThemeTile } from "@/components/study/KnowledgeThemeTile";
import { RecommendedNext } from "@/components/study/RecommendedNext";
import { StudyContributionPanel } from "@/components/study/StudyContributionPanel";
import { StudyHero } from "@/components/study/StudyHero";
import { StudyJourneyCard } from "@/components/study/StudyJourneyCard";
import { StudyLibrary } from "@/components/study/StudyLibrary";
import { StudyTabs } from "@/components/study/StudyTabs";
import { STUDY_CATEGORIES, type StudyCategory, type StudyResource } from "@/lib/study/catalog";
import { PublicDiscussionStarter } from "@/components/discussion/PublicDiscussionStarter";
import {
  buildPathDiscussionHref,
  buildResourceDiscussionHref,
  buildTopicDiscussionHref,
  isExternalStudyUrl,
} from "@/lib/study/discussions";
import { flattenStudyResources, mergeStudyCategories, type CommunityStudyResource } from "@/lib/study/community";
import { STUDY_PATHS } from "@/lib/study/paths";
import { hasSupabaseEnv } from "@/lib/supabase/public-env";

type StudyView = "paths" | "topics";
type ContributionModalState = "closed" | "link" | "article";
type DiscussionModalConfig = { title: string; prompt: string } | null;

const LIBRARY_SECTION_ID = "study-full-library";

const JOURNEY_PROGRESS: Record<string, number> = {
  "climate-and-ecological-limits": 0,
  "democracy-and-better-governance": 15,
  "inequality-and-power": 10,
  "understanding-modern-money": 25,
};

const JOURNEY_IMAGES: Record<string, string> = {
  "climate-and-ecological-limits": "/atlas/study-climate-ecology.png",
  "democracy-and-better-governance": "/atlas/study-democracy-better-governenemt.png",
  "inequality-and-power": "/atlas/study-inequality_and_power.png",
  "understanding-modern-money": "/atlas/study-understand_modern_money.png",
};

const TOPIC_IMAGES: Record<string, string> = {
  "cities-housing": "/atlas/home-domain-cities-everyday-life.png",
  "corruption-development": "/atlas/society and politics.png",
  "data-research": "/atlas/home-world-map.png",
  "democracy-governance": "/atlas/home-domain-politics-democracy.png",
  "ecology-climate": "/atlas/learn-track-ecology-limits.png",
  "media-surveillance": "/atlas/home-domain-media-information.png",
  "money-banking": "/atlas/learn-track-money-wealth.png",
  "owid-shortlist": "/atlas/home-world-map.png",
  "political-economy": "/atlas/home-domain-economy.png",
  "systems-thinking": "/atlas/home-world3-card.png",
};

function getResourceHref(resource: StudyResource) {
  return resource.url;
}

function ResourceShelfItem({
  contextLabel,
  resource,
}: {
  contextLabel: string;
  resource: StudyResource;
}) {
  const resourceHref = getResourceHref(resource);
  const external = isExternalStudyUrl(resourceHref);

  return (
    <article className="rounded-[1.2rem] border border-[rgba(28,36,48,0.08)] bg-white px-4 py-4 shadow-[0_10px_24px_rgba(28,36,48,0.03)]">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-[rgba(28,36,48,0.08)] bg-[rgba(246,244,238,0.82)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
          {resource.format}
        </span>
        <span className="rounded-full border border-[rgba(28,36,48,0.08)] bg-[rgba(246,244,238,0.82)] px-2.5 py-1 text-[10px] font-medium text-slate-500">
          {resource.level}
        </span>
      </div>
      <a
        className="mt-3 block text-base font-semibold leading-7 text-slate-900 underline-offset-4 transition hover:text-primary hover:underline"
        href={resourceHref}
        rel={external ? "noreferrer" : undefined}
        target={external ? "_blank" : undefined}
      >
        {resource.title}
      </a>
      <p className="mt-2 text-sm leading-6 text-slate-600">{resource.summary}</p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Link className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition hover:text-blue-700" href={buildResourceDiscussionHref(resource, contextLabel)}>
          Start a discussion
          <MessageSquare className="h-4 w-4" />
        </Link>
        <a
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 transition hover:text-slate-900"
          href={resourceHref}
          rel={external ? "noreferrer" : undefined}
          target={external ? "_blank" : undefined}
        >
          {resource.communityKind === "article" ? "Read article" : "Open"}
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </article>
  );
}

export function StudyHubPage({
  initialCommunityResources = [],
}: {
  initialCommunityResources?: CommunityStudyResource[];
}) {
  const [activeView, setActiveView] = useState<StudyView>("paths");
  const [communityResources, setCommunityResources] = useState<CommunityStudyResource[]>(initialCommunityResources);
  const [contributionModal, setContributionModal] = useState<ContributionModalState>("closed");
  const [discussionModal, setDiscussionModal] = useState<DiscussionModalConfig>(null);
  const [selectedPathId, setSelectedPathId] = useState(STUDY_PATHS[0]?.id ?? "");
  const [selectedCategoryId, setSelectedCategoryId] = useState<StudyCategory["id"]>(STUDY_CATEGORIES[0]?.id ?? "systems-thinking");

  const scrollToSection = useCallback((id: string) => {
    if (typeof window === "undefined") {
      return;
    }

    window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 40);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    if (contributionModal === "closed") {
      document.body.style.removeProperty("overflow");
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [contributionModal]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const requestedView = params.get("view");
    const requestedPath = params.get("path");
    const requestedCategory = params.get("category");

    if (requestedView === "paths" || requestedView === "topics") {
      setActiveView(requestedView);
    }

    if (requestedView === "library") {
      setActiveView("paths");
      scrollToSection(LIBRARY_SECTION_ID);
    }

    if (requestedPath && STUDY_PATHS.some((path) => path.id === requestedPath)) {
      setSelectedPathId(requestedPath);
    }

    if (requestedCategory && STUDY_CATEGORIES.some((category) => category.id === requestedCategory)) {
      setSelectedCategoryId(requestedCategory as StudyCategory["id"]);
    }
  }, [scrollToSection]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const url = new URL(window.location.href);
    url.searchParams.set("view", activeView);

    if (selectedPathId) {
      url.searchParams.set("path", selectedPathId);
    }

    if (selectedCategoryId) {
      url.searchParams.set("category", selectedCategoryId);
    }

    window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
  }, [activeView, selectedCategoryId, selectedPathId]);

  const refreshCommunityResources = useCallback(async () => {
    if (!hasSupabaseEnv) {
      return;
    }

    try {
      const response = await fetch("/api/study/resources", {
        cache: "no-store",
        headers: { Accept: "application/json" },
      });

      if (!response.ok) {
        return;
      }

      const payload = (await response.json()) as {
        resources?: CommunityStudyResource[];
      };

      setCommunityResources(payload.resources ?? []);
    } catch {
      // Keep the curated library if the live fetch fails.
    }
  }, []);

  useEffect(() => {
    if (initialCommunityResources.length > 0 || !hasSupabaseEnv) {
      return;
    }

    void refreshCommunityResources();
  }, [initialCommunityResources.length, refreshCommunityResources]);

  const mergedCategories = useMemo(() => mergeStudyCategories(communityResources), [communityResources]);
  const mergedResources = useMemo(() => flattenStudyResources(mergedCategories), [mergedCategories]);

  const resourceLookup = useMemo(
    () =>
      Object.fromEntries(
        mergedResources.map((resource) => [resource.id, resource]),
      ) as Record<string, StudyResource>,
    [mergedResources],
  );

  const categoryLookup = useMemo(
    () =>
      Object.fromEntries(
        mergedCategories.map((category) => [category.id, category]),
      ) as Record<string, StudyCategory>,
    [mergedCategories],
  );

  const selectedPath = STUDY_PATHS.find((path) => path.id === selectedPathId) ?? STUDY_PATHS[0];
  const selectedCategory = mergedCategories.find((category) => category.id === selectedCategoryId) ?? mergedCategories[0];
  const selectedPathResources = selectedPath.resourceIds.map((resourceId) => resourceLookup[resourceId]).filter(Boolean);
  const relatedPaths = STUDY_PATHS.filter((path) => path.relatedCategoryIds.includes(selectedCategory.id));

  const countsLabel = `${STUDY_PATHS.length} journeys · ${mergedCategories.length} themes · ${mergedResources.length} resources`;

  const recommendedItems = [
    {
      description: "Follow overshoot, delay, tipping points, and the evidence base behind planetary limits.",
      href: "/study?view=paths&path=climate-and-ecological-limits",
      imageSrc: "/atlas/study-climate-ecology.png",
      label: "Based on World3",
      meta: "6 resources · 4-7 hrs",
      title: "Climate & Ecological Limits",
    },
    {
      description: "Move from who creates money to the hierarchy of credit and the rules that decide who gets first access.",
      href: "/study?view=paths&path=understanding-modern-money",
      imageSrc: "/atlas/study-understand_modern_money.png",
      label: "Based on money topics",
      meta: "6 resources · 4-6 hrs",
      title: "Understanding Modern Money",
    },
    {
      description: "Compare participatory design, accountability systems, and practical governance reform cases.",
      href: "/study?view=paths&path=democracy-and-better-governance",
      imageSrc: "/atlas/study-democracy-better-governenemt.png",
      label: "Based on governance",
      meta: "7 resources · 4-6 hrs",
      title: "Democracy & Better Governance",
    },
    {
      description: "Browse the themes atlas when you want to jump sideways instead of going deeper in the same path.",
      href: "/study?view=topics",
      imageSrc: "/atlas/home-world-map.png",
      label: "Explore another area",
      meta: "10 themes",
      title: "Browse the wider bookshelf",
    },
  ];

  return (
    <AtlasPage className="space-y-8 pb-14">
      <StudyHero
        onBrowseJourneys={() => setActiveView("paths")}
        onExploreThemes={() => setActiveView("topics")}
        pathCount={STUDY_PATHS.length}
        resourceCount={mergedResources.length}
        themeCount={mergedCategories.length}
      />

      <StudyTabs activeView={activeView} countsLabel={countsLabel} onChange={setActiveView} />

      {activeView === "paths" ? (
        <>
          <section className="space-y-4" id="study-journeys">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="atlas-display text-[2.15rem] leading-tight text-slate-900">Study Journeys</h2>
                <p className="mt-2 text-sm text-slate-600">Curated paths that connect the most important ideas, evidence, and public knowledge projects.</p>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
              {STUDY_PATHS.map((path) => (
                <StudyJourneyCard
                  description={path.tagline}
                  imageSrc={JOURNEY_IMAGES[path.id] ?? "/atlas/study-hero.png"}
                  key={path.id}
                  linkedTopics={path.relatedCategoryIds.map((categoryId) => categoryLookup[categoryId]?.title).filter(Boolean)}
                  onDiscuss={() => {
                    const cfg = buildPathDiscussionHref(path);
                    const url = new URL(cfg, "https://x");
                    setDiscussionModal({ title: url.searchParams.get("title") ?? path.title, prompt: url.searchParams.get("prompt") ?? "" });
                  }}
                  onPreview={() => setSelectedPathId(path.id)}
                  path={path}
                  progress={JOURNEY_PROGRESS[path.id] ?? 0}
                  startHref={path.resourceIds[0] ? getResourceHref(resourceLookup[path.resourceIds[0]]) : undefined}
                />
              ))}
            </div>
          </section>

          <section className="grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
            <SoftPanel className="space-y-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="atlas-kicker">Journey preview</p>
                  <h3 className="atlas-display mt-2 text-[2rem] leading-tight text-slate-900">{selectedPath.title}</h3>
                  <p className="mt-2 text-sm font-medium text-slate-600">{selectedPath.tagline}</p>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{selectedPath.summary}</p>
                </div>
                <div className="rounded-full border border-[rgba(28,36,48,0.08)] bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  {selectedPath.duration}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {selectedPathResources.map((resource) => (
                  <ResourceShelfItem contextLabel={selectedPath.title} key={resource.id} resource={resource} />
                ))}
              </div>
            </SoftPanel>

            <SoftPanel className="space-y-5" tone="blue">
              <div>
                <p className="atlas-kicker">What this journey builds</p>
                <p className="mt-3 text-sm leading-7 text-slate-600">{selectedPath.outcome}</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                  <BookOpenText className="h-4 w-4 text-primary" />
                  Linked themes
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedPath.relatedCategoryIds.map((categoryId) => (
                    <button
                      className="rounded-full border border-[rgba(28,36,48,0.08)] bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 transition hover:border-[rgba(28,36,48,0.16)] hover:text-slate-800"
                      key={categoryId}
                      onClick={() => {
                        setSelectedCategoryId(categoryId as StudyCategory["id"]);
                        setActiveView("topics");
                      }}
                      type="button"
                    >
                      {categoryLookup[categoryId]?.title}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3 rounded-[1.35rem] border border-[rgba(28,36,48,0.08)] bg-white px-4 py-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Journey actions
                </div>
                <div className="flex flex-wrap gap-2">
                  <a
                    className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                    href={selectedPathResources[0] ? getResourceHref(selectedPathResources[0]) : "#"}
                    rel={selectedPathResources[0] && isExternalStudyUrl(getResourceHref(selectedPathResources[0])) ? "noreferrer" : undefined}
                    target={selectedPathResources[0] && isExternalStudyUrl(getResourceHref(selectedPathResources[0])) ? "_blank" : undefined}
                  >
                    Start journey
                    <ArrowRight className="h-4 w-4" />
                  </a>
                  <button
                    className="inline-flex items-center gap-2 rounded-full border border-[rgba(28,36,48,0.12)] bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-[rgba(28,36,48,0.2)] hover:text-slate-900"
                    onClick={() => {
                      const cfg = buildPathDiscussionHref(selectedPath);
                      const url = new URL(cfg, "https://x");
                      setDiscussionModal({ title: url.searchParams.get("title") ?? selectedPath.title, prompt: url.searchParams.get("prompt") ?? "" });
                    }}
                    type="button"
                  >
                    Discuss
                    <MessageSquare className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </SoftPanel>
          </section>

          <RecommendedNext items={recommendedItems} />

          <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]" id={LIBRARY_SECTION_ID}>
            <div className="space-y-6">
              <StudyLibrary communityResources={communityResources} initialCategory="all" />
            </div>

            <aside className="space-y-4 xl:sticky xl:top-24 xl:self-start">
              <SoftPanel className="space-y-4">
                <div>
                  <p className="atlas-kicker">Contribute to the library</p>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    Help build the world&apos;s best public knowledge shelf without interrupting the main browsing experience.
                  </p>
                </div>

                <button
                  className="flex w-full items-start justify-between rounded-[1.2rem] border border-[rgba(28,36,48,0.08)] bg-white px-4 py-4 text-left transition hover:border-[rgba(28,36,48,0.16)]"
                  onClick={() => setContributionModal("link")}
                  type="button"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Suggest a resource</p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">Share a link, dataset, paper, or tool.</p>
                  </div>
                  <Link2 className="mt-0.5 h-4 w-4 text-primary" />
                </button>

                <button
                  className="flex w-full items-start justify-between rounded-[1.2rem] border border-[rgba(28,36,48,0.08)] bg-white px-4 py-4 text-left transition hover:border-[rgba(28,36,48,0.16)]"
                  onClick={() => setContributionModal("article")}
                  type="button"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Write a study article</p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">Publish an original explainer or analysis.</p>
                  </div>
                  <BookOpenText className="mt-0.5 h-4 w-4 text-primary" />
                </button>
              </SoftPanel>

              <SoftPanel className="space-y-3">
                <div>
                  <p className="atlas-kicker">Need help finding something?</p>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    Ask the community or start a discussion to get help locating the right evidence or book.
                  </p>
                </div>
                <Link className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:text-blue-700" href="/discussions">
                  Go to discussions
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </SoftPanel>
            </aside>
          </section>

        </>
      ) : null}

      {activeView === "topics" ? (
        <>
          <section className="space-y-4" id="knowledge-themes">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="atlas-display text-[2.15rem] leading-tight text-slate-900">Knowledge Themes (Atlas)</h2>
                <p className="mt-2 text-sm text-slate-600">Explore the strongest resources and conversations by idea region, not just by format.</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              {mergedCategories.map((category) => (
                <KnowledgeThemeTile
                  category={category}
                  imageSrc={TOPIC_IMAGES[category.id] ?? "/atlas/study-hero.png"}
                  isSelected={selectedCategory.id === category.id}
                  key={category.id}
                  onDiscuss={() => {
                    const cfg = buildTopicDiscussionHref(category.title, category.description);
                    const url = new URL(cfg, "https://x");
                    setDiscussionModal({ title: url.searchParams.get("title") ?? category.title, prompt: url.searchParams.get("prompt") ?? "" });
                  }}
                  onOpenTopic={() => setSelectedCategoryId(category.id)}
                />
              ))}
            </div>
          </section>

          <section className="grid gap-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
            <SoftPanel className="space-y-5" tone="green">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="atlas-kicker">Selected theme shelf</p>
                  <h3 className="atlas-display mt-2 text-[2rem] leading-tight text-slate-900">{selectedCategory.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{selectedCategory.description}</p>
                </div>
                <button
                  className="inline-flex items-center gap-2 rounded-full border border-[rgba(28,36,48,0.12)] bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-[rgba(28,36,48,0.2)] hover:text-slate-900"
                  onClick={() => {
                    const cfg = buildTopicDiscussionHref(selectedCategory.title, selectedCategory.description);
                    const url = new URL(cfg, "https://x");
                    setDiscussionModal({ title: url.searchParams.get("title") ?? selectedCategory.title, prompt: url.searchParams.get("prompt") ?? "" });
                  }}
                  type="button"
                >
                  Discuss
                  <MessageSquare className="h-4 w-4" />
                </button>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {selectedCategory.items.slice(0, 4).map((resource) => (
                  <ResourceShelfItem contextLabel={selectedCategory.title} key={resource.id} resource={resource} />
                ))}
              </div>
            </SoftPanel>

            <SoftPanel className="space-y-5">
              <div>
                <p className="atlas-kicker">Paths that use this theme</p>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  These journeys are the easiest way to move from one useful resource to a structured reading sequence.
                </p>
              </div>

              <div className="space-y-3">
                {relatedPaths.length > 0 ? (
                  relatedPaths.map((path) => (
                    <button
                      className="w-full rounded-[1.2rem] border border-[rgba(28,36,48,0.08)] bg-white px-4 py-4 text-left transition hover:border-[rgba(28,36,48,0.16)]"
                      key={path.id}
                      onClick={() => {
                        setSelectedPathId(path.id);
                        setActiveView("paths");
                      }}
                      type="button"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-base font-semibold text-slate-900">{path.title}</p>
                          <p className="mt-1 text-sm leading-6 text-slate-600">{path.tagline}</p>
                        </div>
                        <span className="rounded-full border border-[rgba(28,36,48,0.08)] bg-[rgba(246,244,238,0.82)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                          {path.duration}
                        </span>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="rounded-[1.2rem] border border-[rgba(28,36,48,0.08)] bg-white px-4 py-4 text-sm text-slate-500">
                    No curated journey points here yet, but the full library on the main Study page still contains this shelf.
                  </div>
                )}
              </div>

              <button
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:text-blue-700"
                onClick={() => {
                  setActiveView("paths");
                  scrollToSection(LIBRARY_SECTION_ID);
                }}
                type="button"
              >
                Open this shelf in the full library
                <ArrowRight className="h-4 w-4" />
              </button>
            </SoftPanel>
          </section>
        </>
      ) : null}

      {discussionModal ? (
        <div
          aria-modal
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          role="dialog"
        >
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setDiscussionModal(null)}
          />
          <div
            className="relative z-10 flex w-full max-w-2xl flex-col overflow-hidden rounded-[2rem] bg-white shadow-[0_40px_80px_rgba(28,36,48,0.22)]"
            style={{ maxHeight: "90dvh" }}
          >
            <div className="flex flex-none items-start justify-between gap-4 border-b border-[rgba(28,36,48,0.08)] px-6 py-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Start a discussion</p>
                <h2 className="mt-0.5 text-base font-semibold leading-6 text-slate-900">{discussionModal.title}</h2>
              </div>
              <button
                aria-label="Close dialog"
                className="flex h-9 w-9 flex-none items-center justify-center rounded-full border border-[rgba(28,36,48,0.10)] bg-white text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                onClick={() => setDiscussionModal(null)}
                type="button"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <div className="p-6">
                <PublicDiscussionStarter
                  compact
                  contextType="general"
                  initialPrompt={discussionModal.prompt}
                  initialTitle={discussionModal.title}
                  onSuccess={() => setDiscussionModal(null)}
                />
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {contributionModal !== "closed" ? (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-[rgba(15,23,42,0.45)] px-4 py-6 backdrop-blur-[2px]">
          <div className="relative max-h-[92vh] w-full max-w-[78rem] overflow-hidden rounded-[2.3rem] border border-[rgba(255,255,255,0.6)] bg-white shadow-[0_28px_70px_rgba(15,23,42,0.28)]">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-[linear-gradient(180deg,rgba(255,249,238,0.95)_0%,rgba(255,255,255,0.84)_70%,rgba(255,255,255,0)_100%)]" />
            <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[34%] lg:block">
              <Image
                alt="Study library contribution artwork"
                className="object-cover object-right"
                fill
                sizes="(min-width: 1024px) 26rem, 0px"
                src="/atlas/study-hero.png"
              />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.02)_0%,rgba(255,255,255,0.14)_18%,rgba(255,255,255,0.9)_100%)]" />
            </div>
            <button
              aria-label="Close contribution window"
              className="absolute right-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(28,36,48,0.08)] bg-white/95 text-slate-600 shadow-[0_8px_22px_rgba(28,36,48,0.08)] transition hover:text-slate-900"
              onClick={() => setContributionModal("closed")}
              type="button"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="relative max-h-[92vh] overflow-y-auto p-3 sm:p-4 lg:p-5">
              <StudyContributionPanel
                initialSubmissionKind={contributionModal === "article" ? "article" : "link"}
                onResourcesChanged={refreshCommunityResources}
                variant="modal"
              />
            </div>
          </div>
        </div>
      ) : null}
    </AtlasPage>
  );
}

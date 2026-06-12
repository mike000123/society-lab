import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LearningModulePage } from "@/components/learn/LearningModulePage";
import { getLearningArticleBySlug } from "@/lib/learn/content";
import { getLearningModuleBySlug, learningModules } from "@/lib/learn/modules";

export const dynamicParams = false;

export function generateStaticParams() {
  return learningModules.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const mod = getLearningModuleBySlug(slug);
  if (!mod) return {};
  return {
    description: mod.summary,
    title: `${mod.title} | Society Lab Learn`,
  };
}

export default async function LearningModuleRoute({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ path?: string }>;
}) {
  const { slug } = await params;
  const { path: pathId } = await searchParams;
  const mod = getLearningModuleBySlug(slug);
  const article = getLearningArticleBySlug(slug);

  if (!mod) notFound();

  return <LearningModulePage article={article} module={mod} pathId={pathId} />;
}

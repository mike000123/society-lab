import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LearningModulePage } from "@/components/learn/LearningModulePage";
import { getLearningArticleBySlug } from "@/lib/learn/content";
import { getLearningModuleBySlug } from "@/lib/learn/modules";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const learningModule = getLearningModuleBySlug(slug);

  if (!learningModule) {
    return {};
  }

  return {
    description: learningModule.summary,
    title: `${learningModule.title} | Society Lab Learn`,
  };
}

export default async function LearningModuleRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const learningModule = getLearningModuleBySlug(slug);
  const article = getLearningArticleBySlug(slug);

  if (!learningModule) {
    notFound();
  }

  return <LearningModulePage article={article} module={learningModule} />;
}

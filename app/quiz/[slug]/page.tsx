import { notFound } from "next/navigation";
import { getQuizBySlug, getAllQuizSlugs } from "@/lib/quiz/questions";
import { getLearningModuleBySlug } from "@/lib/learn/modules";
import { QuizEngine } from "@/components/quiz/QuizEngine";

export async function generateStaticParams() {
  return getAllQuizSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const quiz = getQuizBySlug(slug);
  if (!quiz) return {};
  return { title: `${quiz.title} Quiz | Society Lab` };
}

export default async function QuizPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const quiz = getQuizBySlug(slug);
  const learningModule = getLearningModuleBySlug(slug);

  if (!quiz || !learningModule) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <QuizEngine quiz={quiz} moduleSlug={slug} />
    </div>
  );
}

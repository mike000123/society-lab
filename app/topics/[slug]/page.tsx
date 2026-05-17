import { notFound } from "next/navigation";
import { topics } from "@/data/topics";
import { DiscussionThread } from "@/components/discussion/discussion-thread";

export default async function TopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const topic = topics.find((t) => t.slug === slug);
  if (!topic) return notFound();

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-800 bg-panel p-6">
        <h1 className="text-2xl font-bold">{topic.title}</h1>
        <p className="mt-3 text-sm text-red-300">System bug: {topic.bug}</p>
        <p className="mt-2 text-sm text-emerald-300">Alternative: {topic.alternative}</p>
        <p className="mt-2 text-slate-300">Framing question: {topic.question}</p>
      </section>
      <DiscussionThread />
    </div>
  );
}

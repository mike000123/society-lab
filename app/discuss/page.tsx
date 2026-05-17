import { DiscussionThread } from "@/components/discussion/discussion-thread";

export default function DiscussPage() {
  return <div className="space-y-4"><h1 className="text-2xl font-bold">Discuss</h1><p className="text-slate-300">Structured claim → evidence → counterpoint flow (UI mock only).</p><DiscussionThread /></div>;
}

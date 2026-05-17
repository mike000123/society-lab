import { DiscussionThread } from "@/components/discussion/discussion-thread";

export default function DiscussionsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Structured Discussions</h1>
      <p className="text-slate-300">MVP placeholder for claim-evidence-counterargument flows, moderation, and consensus snapshots.</p>
      <DiscussionThread />
    </div>
  );
}

import { notFound } from "next/navigation";

import { AtlasPage } from "@/components/atlas/AtlasPage";
import { DiscussionDetailClient } from "@/components/discussion/DiscussionDetailClient";
import { getSeededPublicThreadById } from "@/lib/discussion/seeded-public-threads";

export default async function DiscussionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const thread = getSeededPublicThreadById(id);

  if (!thread) notFound();

  return (
    <AtlasPage className="space-y-0 pb-14">
      <DiscussionDetailClient thread={thread} />
    </AtlasPage>
  );
}

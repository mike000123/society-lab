import { NextResponse } from "next/server";

import { type CommunityStudyResource, mapStudySubmissionToResource } from "@/lib/study/community";
import { hasSupabaseEnv } from "@/lib/supabase/public-env";
import { createOptionalClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!hasSupabaseEnv) {
    return NextResponse.json({ configured: false, resources: [] satisfies CommunityStudyResource[] });
  }

  const supabase = await createOptionalClient();

  if (!supabase) {
    return NextResponse.json(
      { configured: false, error: "Supabase client is unavailable.", resources: [] satisfies CommunityStudyResource[] },
      { status: 503 },
    );
  }

  const { data: submissions, error } = await supabase
    .from("study_resource_submissions")
    .select("id, title, url, format, level, access, source, summary, tags, category_id, submitter_id, published_at, submission_kind")
    .eq("status", "approved")
    .order("published_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      {
        configured: true,
        error: error.message,
        resources: [] satisfies CommunityStudyResource[],
      },
      { status: error.code === "42P01" ? 503 : 500 },
    );
  }

  const submitterIds = Array.from(new Set((submissions ?? []).map((submission) => submission.submitter_id)));
  const profileMap = new Map<string, string | null>();

  if (submitterIds.length > 0) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name, username")
      .in("id", submitterIds);

    for (const profile of profiles ?? []) {
      profileMap.set(profile.id, profile.full_name ?? profile.username ?? null);
    }
  }

  const resources = (submissions ?? []).map((submission) =>
    mapStudySubmissionToResource(submission, profileMap.get(submission.submitter_id) ?? null),
  );

  return NextResponse.json({
    configured: true,
    resources,
  });
}

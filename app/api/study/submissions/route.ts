import { NextRequest, NextResponse } from "next/server";

import type { Database } from "@/lib/database.types";
import {
  isStudyAccess,
  isStudyCategoryId,
  isStudyFormat,
  isStudyLevel,
  type StudySubmissionKind,
  type StudySubmissionRow,
  type StudySubmissionStatus,
} from "@/lib/study/community";
import { hasSupabaseEnv } from "@/lib/supabase/public-env";
import { createOptionalClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type SubmissionPayload = {
  access?: string;
  bodyMarkdown?: string;
  categoryId?: string;
  format?: string;
  level?: string;
  rationale?: string;
  source?: string;
  submissionKind?: StudySubmissionKind;
  summary?: string;
  tags?: string[];
  title?: string;
  url?: string;
};

type ReviewerPayload = {
  id?: string;
  reviewerNotes?: string;
  status?: StudySubmissionStatus;
};

async function getAuthenticatedContext() {
  if (!hasSupabaseEnv) {
    return {
      error: NextResponse.json({ configured: false, error: "Supabase env is not configured." }, { status: 503 }),
    };
  }

  const supabase = await createOptionalClient();

  if (!supabase) {
    return {
      error: NextResponse.json({ configured: false, error: "Supabase client is unavailable." }, { status: 503 }),
    };
  }

  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData.user) {
    return {
      error: NextResponse.json({ configured: true, error: authError?.message ?? "Not authenticated." }, { status: 401 }),
    };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, full_name, username, can_review_study_resources")
    .eq("id", authData.user.id)
    .maybeSingle();

  if (profileError) {
    return {
      error: NextResponse.json({ configured: true, error: profileError.message }, { status: profileError.code === "42P01" ? 503 : 500 }),
    };
  }

  return {
    profile,
    supabase,
    user: authData.user,
  };
}

async function attachNames(
  supabase: NonNullable<Awaited<ReturnType<typeof createOptionalClient>>>,
  rows: StudySubmissionRow[],
) {
  const profileIds = Array.from(
    new Set(
      rows.flatMap((row) => [row.submitter_id, row.reviewer_id].filter((value): value is string => Boolean(value))),
    ),
  );

  const profileMap = new Map<string, string | null>();

  if (profileIds.length > 0) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name, username")
      .in("id", profileIds);

    for (const profile of profiles ?? []) {
      profileMap.set(profile.id, profile.full_name ?? profile.username ?? null);
    }
  }

  return rows.map((row) => ({
    ...row,
    reviewerName: row.reviewer_id ? profileMap.get(row.reviewer_id) ?? null : null,
    submitterName: profileMap.get(row.submitter_id) ?? null,
  }));
}

function parseUrl(url: string) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:" ? parsed.toString() : null;
  } catch {
    return null;
  }
}

export async function GET() {
  const context = await getAuthenticatedContext();

  if ("error" in context) {
    return context.error;
  }

  const { profile, supabase, user } = context;
  const canReview = profile?.can_review_study_resources === true;

  const { data: mySubmissions, error: myError } = await supabase
    .from("study_resource_submissions")
    .select("*")
    .eq("submitter_id", user.id)
    .order("created_at", { ascending: false });

  if (myError) {
    return NextResponse.json({ configured: true, error: myError.message }, { status: myError.code === "42P01" ? 503 : 500 });
  }

  let reviewQueue: StudySubmissionRow[] = [];

  if (canReview) {
    const { data: pendingRows, error: pendingError } = await supabase
      .from("study_resource_submissions")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: true });

    if (pendingError) {
      return NextResponse.json({ configured: true, error: pendingError.message }, { status: pendingError.code === "42P01" ? 503 : 500 });
    }

    reviewQueue = pendingRows ?? [];
  }

  return NextResponse.json({
    canReview,
    configured: true,
    mySubmissions: await attachNames(supabase, mySubmissions ?? []),
    reviewQueue: canReview ? await attachNames(supabase, reviewQueue) : [],
  });
}

export async function POST(request: NextRequest) {
  const context = await getAuthenticatedContext();

  if ("error" in context) {
    return context.error;
  }

  const { supabase, user } = context;
  const payload = (await request.json()) as SubmissionPayload;

  const title = payload.title?.trim() ?? "";
  const submissionKind = payload.submissionKind ?? "link";
  const source = payload.source?.trim() ?? "";
  const summary = payload.summary?.trim() ?? "";
  const rationale = payload.rationale?.trim() ?? "";
  const parsedUrl = payload.url ? parseUrl(payload.url.trim()) : null;
  const bodyMarkdown = payload.bodyMarkdown?.trim() ?? "";
  const tags = Array.from(new Set((payload.tags ?? []).map((tag) => tag.trim()).filter(Boolean))).slice(0, 8);

  if (!title || !summary || !rationale) {
    return NextResponse.json(
      { configured: true, error: "Title, summary, and rationale are required." },
      { status: 400 },
    );
  }

  if (!payload.categoryId || !isStudyCategoryId(payload.categoryId)) {
    return NextResponse.json({ configured: true, error: "Choose a valid study category." }, { status: 400 });
  }

  if (!payload.format || !isStudyFormat(payload.format)) {
    return NextResponse.json({ configured: true, error: "Choose a valid resource format." }, { status: 400 });
  }

  if (!payload.level || !isStudyLevel(payload.level)) {
    return NextResponse.json({ configured: true, error: "Choose a valid study level." }, { status: 400 });
  }

  if (!payload.access || !isStudyAccess(payload.access)) {
    return NextResponse.json({ configured: true, error: "Choose a valid access type." }, { status: 400 });
  }

  if (submissionKind !== "link" && submissionKind !== "article") {
    return NextResponse.json({ configured: true, error: "Choose a valid submission type." }, { status: 400 });
  }

  if (submissionKind === "link") {
    if (!source || !parsedUrl) {
      return NextResponse.json(
        { configured: true, error: "Links need a source label and a valid external URL." },
        { status: 400 },
      );
    }
  } else {
    if (bodyMarkdown.length < 200) {
      return NextResponse.json(
        { configured: true, error: "Articles need a substantial body before they can be submitted." },
        { status: 400 },
      );
    }
  }

  const insertPayload: Database["public"]["Tables"]["study_resource_submissions"]["Insert"] = {
    access: payload.access,
    body_markdown: submissionKind === "article" ? bodyMarkdown : null,
    category_id: payload.categoryId,
    format: payload.format,
    level: payload.level,
    rationale,
    source: submissionKind === "article" ? "Society Lab community" : source,
    submission_kind: submissionKind,
    submitter_id: user.id,
    summary,
    tags,
    title,
    url: submissionKind === "link" ? parsedUrl : null,
  };

  const { data, error } = await supabase
    .from("study_resource_submissions")
    .insert(insertPayload)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ configured: true, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ configured: true, submission: data }, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const context = await getAuthenticatedContext();

  if ("error" in context) {
    return context.error;
  }

  const { profile, supabase, user } = context;

  if (profile?.can_review_study_resources !== true) {
    return NextResponse.json({ configured: true, error: "Not authorized to review study submissions." }, { status: 403 });
  }

  const payload = (await request.json()) as ReviewerPayload;
  const status = payload.status;
  const id = payload.id?.trim();

  if (!id || (status !== "approved" && status !== "rejected")) {
    return NextResponse.json({ configured: true, error: "A valid submission id and review status are required." }, { status: 400 });
  }

  const reviewerNotes = payload.reviewerNotes?.trim() || null;
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("study_resource_submissions")
    .update({
      published_at: status === "approved" ? now : null,
      reviewed_at: now,
      reviewer_id: user.id,
      reviewer_notes: reviewerNotes,
      status,
    })
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ configured: true, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ configured: true, submission: data });
}

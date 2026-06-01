import { NextResponse } from "next/server";

import { hasSupabaseEnv } from "@/lib/supabase/public-env";
import { createOptionalClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!hasSupabaseEnv) {
    return NextResponse.json(
      {
        configured: false,
        error: "Supabase env is not configured.",
      },
      { status: 503 },
    );
  }

  const supabase = await createOptionalClient();

  if (!supabase) {
    return NextResponse.json(
      {
        configured: false,
        error: "Supabase client is unavailable.",
      },
      { status: 503 },
    );
  }

  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData.user) {
    return NextResponse.json(
      {
        configured: true,
        error: authError?.message ?? "Not authenticated.",
      },
      { status: 401 },
    );
  }

  const profileResult = await supabase
    .from("profiles")
    .select("id, full_name, username, avatar_url, bio, reputation_score, created_at, updated_at")
    .eq("id", authData.user.id)
    .maybeSingle();

  const schemaReady = !profileResult.error;

  return NextResponse.json({
    configured: true,
    profile: profileResult.data ?? null,
    schemaReady,
    schemaStatus: profileResult.error?.code === "42P01" ? "missing_schema" : "ok",
    user: {
      email: authData.user.email,
      id: authData.user.id,
      providers: authData.user.app_metadata.providers ?? ["email"],
      userMetadata: authData.user.user_metadata,
    },
  });
}

import { NextResponse } from "next/server";

import { hasSupabaseEnv } from "@/lib/supabase/public-env";
import { createClient } from "@/lib/supabase/server";
import { safeRedirectPath, withQuery } from "@/lib/utils";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const errorDescription = requestUrl.searchParams.get("error_description");
  const next = safeRedirectPath(requestUrl.searchParams.get("next") ?? undefined);

  if (!hasSupabaseEnv) {
    return NextResponse.redirect(
      new URL(
        withQuery("/auth", {
          message: "Supabase env is not configured yet.",
          type: "error",
        }),
        requestUrl.origin,
      ),
    );
  }

  if (errorDescription) {
    return NextResponse.redirect(
      new URL(
        withQuery("/auth", {
          message: errorDescription,
          next,
          type: "error",
        }),
        requestUrl.origin,
      ),
    );
  }

  if (!code) {
    return NextResponse.redirect(
      new URL(
        withQuery("/auth", {
          message: "Missing authentication code in callback.",
          next,
          type: "error",
        }),
        requestUrl.origin,
      ),
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(
      new URL(
        withQuery("/auth", {
          message: error.message,
          next,
          type: "error",
        }),
        requestUrl.origin,
      ),
    );
  }

  return NextResponse.redirect(new URL(next, requestUrl.origin));
}


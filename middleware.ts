import type { NextRequest } from "next/server";

import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    // Only run on navigational app routes — not static assets, not API routes.
    "/((?!_next|api|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)",
  ],
};

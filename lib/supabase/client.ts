"use client";

import { createBrowserClient } from "@supabase/ssr";

import type { Database } from "@/lib/database.types";
import { requireSupabasePublicEnv } from "@/lib/supabase/public-env";

let browserClient:
  | ReturnType<typeof createBrowserClient<Database>>
  | undefined;

export function createClient() {
  if (browserClient) {
    return browserClient;
  }

  const { publishableKey, url } = requireSupabasePublicEnv();

  browserClient = createBrowserClient<Database>(url, publishableKey);

  return browserClient;
}

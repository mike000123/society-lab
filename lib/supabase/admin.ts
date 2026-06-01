import "server-only";

import { createClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/database.types";
import { requireSupabaseAdminEnv } from "@/lib/supabase/server-env";

export function createAdminClient() {
  const { adminKey, url } = requireSupabaseAdminEnv();

  return createClient<Database>(url, adminKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

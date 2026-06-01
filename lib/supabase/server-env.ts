import "server-only";

import { getSupabasePublicEnv } from "@/lib/supabase/public-env";

export type SupabaseAdminEnv = {
  adminKey: string;
  publishableKey: string;
  url: string;
};

export function getSupabaseAdminEnv(): SupabaseAdminEnv | null {
  const publicEnv = getSupabasePublicEnv();
  const adminKey =
    process.env.SUPABASE_SECRET_KEY?.trim() ||
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!publicEnv || !adminKey) {
    return null;
  }

  return {
    ...publicEnv,
    adminKey,
  };
}

export function requireSupabaseAdminEnv() {
  const env = getSupabaseAdminEnv();

  if (!env) {
    throw new Error(
      "Missing Supabase admin environment variables. Set SUPABASE_SECRET_KEY or SUPABASE_SERVICE_ROLE_KEY for server-only jobs.",
    );
  }

  return env;
}

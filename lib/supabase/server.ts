import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import type { Database } from "@/lib/database.types";
import {
  getSupabasePublicEnv,
  requireSupabasePublicEnv,
} from "@/lib/supabase/public-env";

export async function createClient() {
  const { publishableKey, url } = requireSupabasePublicEnv();
  const cookieStore = await cookies();

  return createServerClient<Database>(url, publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, options, value } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Server Components can be read-only. Middleware covers refresh persistence.
        }
      },
    },
  });
}

export async function createOptionalClient() {
  if (!getSupabasePublicEnv()) {
    return null;
  }

  return createClient();
}

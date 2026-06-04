import Link from "next/link";
import { redirect } from "next/navigation";

import { AtlasPage } from "@/components/atlas/AtlasPage";
import { SoftPanel } from "@/components/atlas/SoftPanel";
import { MemberDashboardClient } from "@/components/dashboard/MemberDashboardClient";
import { Button } from "@/components/ui/button";
import type { Database } from "@/lib/database.types";
import { hasSupabaseEnv } from "@/lib/supabase/public-env";
import { createOptionalClient } from "@/lib/supabase/server";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

function redirectTo(pathname: string): never {
  redirect(pathname as never);
}

export default async function DashboardPage() {
  if (!hasSupabaseEnv) {
    return (
      <AtlasPage className="space-y-8">
        <SoftPanel className="bg-[linear-gradient(120deg,rgba(243,248,245,0.96),rgba(255,255,255,0.98))]">
          <div className="max-w-3xl space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Member dashboard</p>
            <h1 className="atlas-display text-4xl text-slate-900 sm:text-5xl">
              The account surface is ready, but Supabase still needs to be connected.
            </h1>
            <p className="text-sm leading-7 text-slate-600 sm:text-[15px]">
              Once the environment variables and bootstrap SQL are in place, this page becomes the real member home for learning progress, simulations, discussions, and governance activity.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/auth">Open auth setup</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="https://supabase.com/dashboard">Open Supabase Dashboard</Link>
              </Button>
            </div>
          </div>
        </SoftPanel>
      </AtlasPage>
    );
  }

  const supabase = await createOptionalClient();
  const { data: authData } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
  const user = authData.user;

  if (!user) {
    redirectTo("/auth?next=/dashboard");
  }

  let profile: Profile | null = null;
  let schemaReady = true;
  let schemaMessage = "";
  let stats = {
    discussionCount: 0,
    proposalCount: 0,
    simulationCount: 0,
    threadCount: 0,
  };
  let recentItems: Array<{ createdAt: string; kind: "proposal" | "simulation" | "thread"; title: string }> = [];

  if (supabase) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (error) {
      schemaReady = false;
      schemaMessage =
        error.code === "42P01"
          ? "The auth flow works, but the database schema is not bootstrapped yet. Run supabase/schema.sql in the Supabase SQL editor."
          : error.message;
    } else {
      profile = data;

      const [
        threadsCountResult,
        postsCountResult,
        simulationsCountResult,
        proposalsCountResult,
        latestThreadResult,
        latestSimulationResult,
        latestProposalResult,
      ] = await Promise.all([
        supabase.from("threads").select("*", { count: "exact", head: true }).eq("author_id", user.id),
        supabase.from("posts").select("*", { count: "exact", head: true }).eq("author_id", user.id),
        supabase.from("simulations").select("*", { count: "exact", head: true }).eq("owner_id", user.id),
        supabase.from("proposals").select("*", { count: "exact", head: true }).eq("author_id", user.id),
        supabase
          .from("threads")
          .select("title, created_at")
          .eq("author_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle(),
        supabase
          .from("simulations")
          .select("title, created_at")
          .eq("owner_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle(),
        supabase
          .from("proposals")
          .select("title, created_at")
          .eq("author_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle(),
      ]);

      stats = {
        discussionCount: postsCountResult.count ?? 0,
        proposalCount: proposalsCountResult.count ?? 0,
        simulationCount: simulationsCountResult.count ?? 0,
        threadCount: threadsCountResult.count ?? 0,
      };

      recentItems = [
        latestThreadResult.data
          ? {
              createdAt: latestThreadResult.data.created_at,
              kind: "thread" as const,
              title: latestThreadResult.data.title,
            }
          : null,
        latestSimulationResult.data
          ? {
              createdAt: latestSimulationResult.data.created_at,
              kind: "simulation" as const,
              title: latestSimulationResult.data.title,
            }
          : null,
        latestProposalResult.data
          ? {
              createdAt: latestProposalResult.data.created_at,
              kind: "proposal" as const,
              title: latestProposalResult.data.title,
            }
          : null,
      ]
        .filter((item): item is NonNullable<typeof item> => Boolean(item))
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  }

  const displayName =
    profile?.full_name ||
    (typeof user.user_metadata.full_name === "string" ? user.user_metadata.full_name : null) ||
    user.email?.split("@")[0] ||
    "Society Lab member";
  const providers = Array.isArray(user.app_metadata.providers)
    ? user.app_metadata.providers.join(", ")
    : "email";

  return (
    <MemberDashboardClient
      profile={{
        avatarUrl: profile?.avatar_url ?? (typeof user.user_metadata.avatar_url === "string" ? user.user_metadata.avatar_url : null),
        bio: profile?.bio ?? null,
        displayName,
        email: user.email ?? null,
        providers,
        reputationScore: profile?.reputation_score ?? 0,
        userId: user.id,
        username: profile?.username ?? null,
      }}
      recentItems={recentItems}
      schemaMessage={schemaMessage}
      schemaReady={schemaReady}
      stats={stats}
    />
  );
}

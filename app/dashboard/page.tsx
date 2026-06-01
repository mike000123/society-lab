import Link from "next/link";
import { redirect } from "next/navigation";
import {
  BookOpenText,
  DatabaseZap,
  FlaskConical,
  MessageSquareText,
  ShieldCheck,
  Vote,
} from "lucide-react";

import { signOutAction } from "@/app/auth/actions";
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
      <section className="space-y-4 rounded-3xl border border-slate-800 bg-panel p-6">
        <p className="text-cyan-300">Protected member area</p>
        <h1 className="text-3xl font-bold">Dashboard shell is ready, but Supabase is not connected yet</h1>
        <p className="max-w-3xl text-slate-300">
          Add your Supabase environment variables and run the bootstrap SQL before this route can protect real member sessions.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/auth">Open auth setup</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="https://supabase.com/dashboard">Open Supabase Dashboard</Link>
          </Button>
        </div>
      </section>
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
    proposalCount: 0,
    simulationCount: 0,
    threadCount: 0,
  };

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

      const [threadsResult, simulationsResult, proposalsResult] = await Promise.all([
        supabase.from("threads").select("*", { count: "exact", head: true }).eq("author_id", user.id),
        supabase.from("simulations").select("*", { count: "exact", head: true }).eq("owner_id", user.id),
        supabase.from("proposals").select("*", { count: "exact", head: true }).eq("author_id", user.id),
      ]);

      stats = {
        proposalCount: proposalsResult.count ?? 0,
        simulationCount: simulationsResult.count ?? 0,
        threadCount: threadsResult.count ?? 0,
      };
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
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="rounded-3xl border border-slate-800 bg-panel p-6 md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-3">
            <p className="text-cyan-300">Member dashboard</p>
            <h1 className="text-3xl font-bold md:text-4xl">Welcome, {displayName}</h1>
            <p className="max-w-3xl text-slate-300">
              This is the first protected Society Lab surface. Use it as the base for saved simulations, structured discussions, governance proposals, and later realtime collaboration.
            </p>
          </div>
          <form action={signOutAction}>
            <Button variant="outline">Sign out</Button>
          </form>
        </div>
      </section>

      {!schemaReady ? (
        <section className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-100">
          {schemaMessage}
        </section>
      ) : null}

      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-2xl border border-slate-800 bg-panel p-5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-cyan-300" />
            <h2 className="font-semibold">Verified identity</h2>
          </div>
          <div className="mt-3 space-y-2 text-sm text-slate-300">
            <p>Email: <span className="text-slate-100">{user.email}</span></p>
            <p>Providers: <span className="text-slate-100">{providers}</span></p>
            <p>User ID: <span className="break-all text-slate-100">{user.id}</span></p>
          </div>
        </article>

        <article className="rounded-2xl border border-slate-800 bg-panel p-5">
          <div className="flex items-center gap-2">
            <DatabaseZap className="h-4 w-4 text-cyan-300" />
            <h2 className="font-semibold">Profile row</h2>
          </div>
          <div className="mt-3 space-y-2 text-sm text-slate-300">
            <p>Full name: <span className="text-slate-100">{profile?.full_name ?? "Not set yet"}</span></p>
            <p>Username: <span className="text-slate-100">{profile?.username ?? "Not claimed yet"}</span></p>
            <p>Reputation: <span className="text-slate-100">{profile?.reputation_score ?? 0}</span></p>
          </div>
        </article>

        <article className="rounded-2xl border border-slate-800 bg-panel p-5">
          <div className="flex items-center gap-2">
            <BookOpenText className="h-4 w-4 text-cyan-300" />
            <h2 className="font-semibold">Backend sample route</h2>
          </div>
          <div className="mt-3 space-y-2 text-sm text-slate-300">
            <p>The protected JSON endpoint is already wired at <code>/api/me</code>.</p>
            <p>Use it as the starting point for member-only data fetches and frontend hydration.</p>
          </div>
        </article>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-2xl border border-slate-800 bg-panel p-5">
          <div className="flex items-center gap-2">
            <MessageSquareText className="h-4 w-4 text-cyan-300" />
            <h2 className="font-semibold">Threads</h2>
          </div>
          <p className="mt-3 text-3xl font-bold">{stats.threadCount}</p>
          <p className="mt-2 text-sm text-slate-400">Starter metric for structured discussions authored by this member.</p>
        </article>

        <article className="rounded-2xl border border-slate-800 bg-panel p-5">
          <div className="flex items-center gap-2">
            <FlaskConical className="h-4 w-4 text-cyan-300" />
            <h2 className="font-semibold">Simulations</h2>
          </div>
          <p className="mt-3 text-3xl font-bold">{stats.simulationCount}</p>
          <p className="mt-2 text-sm text-slate-400">Saved simulation scenarios will land here once the simulator starts persisting.</p>
        </article>

        <article className="rounded-2xl border border-slate-800 bg-panel p-5">
          <div className="flex items-center gap-2">
            <Vote className="h-4 w-4 text-cyan-300" />
            <h2 className="font-semibold">Proposals</h2>
          </div>
          <p className="mt-3 text-3xl font-bold">{stats.proposalCount}</p>
          <p className="mt-2 text-sm text-slate-400">Governance proposals and votes can now grow on top of the seed schema.</p>
        </article>
      </section>
    </div>
  );
}

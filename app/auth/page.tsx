import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, Database, KeyRound, Mail, ShieldCheck } from "lucide-react";

import {
  magicLinkAction,
  signInAction,
  signInWithProviderAction,
  signUpAction,
} from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { hasSupabaseEnv } from "@/lib/supabase/public-env";
import { createOptionalClient } from "@/lib/supabase/server";
import { safeRedirectPath } from "@/lib/utils";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function readSearchParam(params: Record<string, string | string[] | undefined>, key: string) {
  const value = params[key];

  return Array.isArray(value) ? value[0] : value;
}

function redirectTo(pathname: string): never {
  redirect(pathname as never);
}

function InputField({
  autoComplete,
  label,
  name,
  placeholder,
  required = true,
  type = "text",
}: {
  autoComplete?: string;
  label: string;
  name: string;
  placeholder: string;
  required?: boolean;
  type?: "email" | "password" | "text";
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-slate-200">{label}</span>
      <input
        autoComplete={autoComplete}
        className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400"
        name={name}
        placeholder={placeholder}
        required={required}
        type={type}
      />
    </label>
  );
}

export default async function AuthPage({ searchParams }: { searchParams: SearchParams }) {
  const resolvedSearchParams = await searchParams;
  const next = safeRedirectPath(readSearchParam(resolvedSearchParams, "next"), "/dashboard");
  const message = readSearchParam(resolvedSearchParams, "message");
  const type = readSearchParam(resolvedSearchParams, "type");

  if (hasSupabaseEnv) {
    const supabase = await createOptionalClient();
    const { data } = supabase ? await supabase.auth.getUser() : { data: { user: null } };

    if (data.user) {
      redirectTo(next);
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="rounded-3xl border border-slate-800 bg-panel p-6 md:p-8">
        <p className="text-cyan-300">Society Lab backend/auth foundation</p>
        <h1 className="mt-2 text-3xl font-bold md:text-4xl">Supabase-backed authentication, session handling, and protected app scaffolding</h1>
        <p className="mt-3 max-w-3xl text-slate-300">
          This layer gives you verified user sessions, password and magic-link auth, OAuth hooks, a protected dashboard, and a starter database shape for discussions, simulations, and governance.
        </p>
      </section>

      {!hasSupabaseEnv ? (
        <section className="rounded-3xl border border-amber-500/30 bg-amber-500/10 p-6">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-1 h-5 w-5 text-amber-300" />
            <div className="space-y-3">
              <h2 className="text-xl font-semibold text-amber-100">Finish the Supabase connection first</h2>
              <p className="text-sm text-amber-50/90">
                Copy <code>.env.example</code> to <code>.env.local</code>, add your Supabase project URL and publishable key, then run the SQL in <code>supabase/schema.sql</code>.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild>
                  <Link href="https://supabase.com/dashboard">Open Supabase Dashboard</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/dashboard">See protected dashboard shell</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {message ? (
        <section
          className={`rounded-2xl border p-4 text-sm ${
            type === "success"
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-100"
              : "border-rose-500/30 bg-rose-500/10 text-rose-100"
          }`}
        >
          {message}
        </section>
      ) : null}

      <div className="grid gap-5 xl:grid-cols-[1.05fr_.95fr]">
        <section className="space-y-5 rounded-3xl border border-slate-800 bg-panel p-6">
          <div className="flex items-center gap-2">
            <KeyRound className="h-5 w-5 text-cyan-300" />
            <h2 className="text-xl font-semibold">Sign in or create your account</h2>
          </div>

          <form action={signInWithProviderAction} className="grid gap-3 md:grid-cols-2">
            <input name="next" type="hidden" value={next} />
            <Button name="provider" value="github" variant="outline">Continue with GitHub</Button>
            <Button name="provider" value="google" variant="outline">Continue with Google</Button>
          </form>

          <div className="grid gap-5 lg:grid-cols-2">
            <form action={signInAction} className="space-y-4 rounded-2xl border border-slate-800 bg-slate-950/40 p-5">
              <div className="space-y-1">
                <h3 className="font-semibold text-slate-100">Password sign in</h3>
                <p className="text-sm text-slate-400">Best for returning members and admin accounts.</p>
              </div>
              <input name="next" type="hidden" value={next} />
              <InputField autoComplete="email" label="Email" name="email" placeholder="you@societylab.org" type="email" />
              <InputField autoComplete="current-password" label="Password" name="password" placeholder="Your password" type="password" />
              <Button className="w-full">Sign in</Button>
            </form>

            <form action={signUpAction} className="space-y-4 rounded-2xl border border-slate-800 bg-slate-950/40 p-5">
              <div className="space-y-1">
                <h3 className="font-semibold text-slate-100">Create account</h3>
                <p className="text-sm text-slate-400">Creates a Supabase user and a matching profile row after confirmation.</p>
              </div>
              <input name="next" type="hidden" value={next} />
              <InputField autoComplete="name" label="Full name" name="full_name" placeholder="Society Lab member" required={false} />
              <InputField autoComplete="email" label="Email" name="email" placeholder="you@societylab.org" type="email" />
              <InputField autoComplete="new-password" label="Password" name="password" placeholder="Choose a strong password" type="password" />
              <Button className="w-full">Create account</Button>
            </form>
          </div>

          <form action={magicLinkAction} className="space-y-4 rounded-2xl border border-slate-800 bg-slate-950/40 p-5">
            <div className="space-y-1">
              <h3 className="font-semibold text-slate-100">Passwordless magic link</h3>
              <p className="text-sm text-slate-400">Useful for fast onboarding, pilots, and community testers.</p>
            </div>
            <input name="next" type="hidden" value={next} />
            <InputField autoComplete="email" label="Email" name="email" placeholder="you@societylab.org" type="email" />
            <Button className="w-full" variant="outline">
              <Mail className="mr-2 h-4 w-4" />
              Send magic link
            </Button>
          </form>
        </section>

        <aside className="space-y-5 rounded-3xl border border-slate-800 bg-panel p-6">
          <div className="space-y-2">
            <p className="text-cyan-300">What this foundation adds</p>
            <h2 className="text-2xl font-semibold">Ready for the next build phase</h2>
          </div>

          <div className="space-y-3">
            <article className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-cyan-300" />
                <h3 className="font-semibold">Verified server sessions</h3>
              </div>
              <p className="mt-2 text-sm text-slate-400">App Router server helpers, callback handling, and request-time session refresh with middleware.</p>
            </article>

            <article className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-cyan-300" />
                <h3 className="font-semibold">Starter database shape</h3>
              </div>
              <p className="mt-2 text-sm text-slate-400">Profiles, topics, threads, posts, simulations, proposals, votes, RLS, and seed topics in one SQL bootstrap.</p>
            </article>

            <article className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
              <div className="flex items-center gap-2">
                <ArrowRight className="h-4 w-4 text-cyan-300" />
                <h3 className="font-semibold">Protected product surface</h3>
              </div>
              <p className="mt-2 text-sm text-slate-400">A protected dashboard and `/api/me` route give you the first real member-only surface to build on.</p>
            </article>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 text-sm text-slate-300">
            <p className="font-medium text-slate-100">Next after this</p>
            <ol className="mt-2 list-decimal space-y-2 pl-5">
              <li>Wire structured discussions to real `threads` and `posts` tables.</li>
              <li>Persist simulator scenarios per member via `simulations`.</li>
              <li>Add governance proposal creation and voting on top of `proposals` and `proposal_votes`.</li>
              <li>Introduce realtime rooms only after the core schema and auth flows are stable.</li>
            </ol>
          </div>

          <Button variant="ghost" asChild>
            <Link href="/dashboard">Open the protected dashboard shell</Link>
          </Button>
        </aside>
      </div>
    </div>
  );
}

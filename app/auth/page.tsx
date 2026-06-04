import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, Database, KeyRound, Mail, ShieldCheck, Sparkles } from "lucide-react";

import { magicLinkAction, signInAction, signUpAction } from "@/app/auth/actions";
import { AtlasPage } from "@/components/atlas/AtlasPage";
import { SoftPanel } from "@/components/atlas/SoftPanel";
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
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input
        autoComplete={autoComplete}
        className="w-full rounded-2xl border border-[rgba(28,36,48,0.14)] bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary"
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
    <AtlasPage className="space-y-8">
      <SoftPanel className="bg-[linear-gradient(115deg,rgba(245,250,246,0.95),rgba(255,255,255,0.98)_48%,rgba(242,248,255,0.95))]">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(18rem,0.85fr)] lg:items-end">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Society Lab account</p>
            <h1 className="atlas-display text-4xl leading-[1.02] text-slate-900 sm:text-5xl">
              Enter with your email.
              <br />
              Learn, simulate, discuss, and govern from one account.
            </h1>
            <p className="max-w-3xl text-sm leading-7 text-slate-600 sm:text-[15px]">
              We’ve simplified the account flow so it stays email-based only. You can create an account with your email and password, sign in with the same pair later, or use a secure email link if you prefer not to type a password.
            </p>
          </div>

          <div className="rounded-[1.8rem] border border-[rgba(28,36,48,0.1)] bg-white/78 p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[rgba(28,36,48,0.12)] bg-white text-primary">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">One simple flow</p>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  No GitHub and no Google. The account now stays fully email-based, with password access as the main path and magic links as an optional fallback.
                </p>
              </div>
            </div>
          </div>
        </div>
      </SoftPanel>

      {!hasSupabaseEnv ? (
        <SoftPanel className="border-amber-200/80 bg-amber-50/90 text-amber-900" tone="gold">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-1 h-5 w-5 text-amber-300" />
            <div className="space-y-3">
              <h2 className="text-xl font-semibold text-amber-900">Finish the Supabase connection first</h2>
              <p className="text-sm text-amber-900/85">
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
        </SoftPanel>
      ) : null}

      {message ? (
        <section
          className={`rounded-2xl border p-4 text-sm ${
            type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-rose-200 bg-rose-50 text-rose-800"
          }`}
        >
          {message}
        </section>
      ) : null}

      <div className="grid gap-5 xl:grid-cols-[1.05fr_.95fr]">
        <SoftPanel className="space-y-5 bg-white/92">
          <div className="flex items-center gap-2">
            <KeyRound className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold text-slate-900">Sign in or create your account</h2>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <form action={signInAction} className="space-y-4 rounded-[1.8rem] border border-[rgba(28,36,48,0.1)] bg-[linear-gradient(180deg,rgba(248,251,248,0.92),rgba(255,255,255,0.98))] p-5 sm:p-6">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-slate-900">Sign in</h3>
                <p className="text-sm leading-7 text-slate-600">
                  For returning members using their email and password.
                </p>
              </div>
              <input name="next" type="hidden" value={next} />
              <InputField autoComplete="email" label="Email" name="email" placeholder="you@societylab.org" type="email" />
              <InputField autoComplete="current-password" label="Password" name="password" placeholder="Your password" type="password" />
              <Button className="w-full">Sign in</Button>
            </form>

            <form action={signUpAction} className="space-y-4 rounded-[1.8rem] border border-[rgba(28,36,48,0.1)] bg-[linear-gradient(180deg,rgba(248,251,248,0.92),rgba(255,255,255,0.98))] p-5 sm:p-6">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-slate-900">Create account</h3>
                <p className="text-sm leading-7 text-slate-600">
                  Choose your email and set your own password for future sign-ins.
                </p>
              </div>
              <input name="next" type="hidden" value={next} />
              <InputField autoComplete="name" label="Full name" name="full_name" placeholder="Society Lab member" required={false} />
              <InputField autoComplete="email" label="Email" name="email" placeholder="you@societylab.org" type="email" />
              <InputField autoComplete="new-password" label="Password" name="password" placeholder="Choose a strong password" type="password" />
              <Button className="w-full">Create account</Button>
            </form>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-[1.5rem] border border-[rgba(28,36,48,0.1)] bg-slate-50/80 p-4">
              <p className="text-sm font-semibold text-slate-900">1. Use your email</p>
              <p className="mt-2 text-sm leading-6 text-slate-500">Your Society Lab account stays tied to your email address, not to a social provider.</p>
            </div>
            <div className="rounded-[1.5rem] border border-[rgba(28,36,48,0.1)] bg-slate-50/80 p-4">
              <p className="text-sm font-semibold text-slate-900">2. Set your password</p>
              <p className="mt-2 text-sm leading-6 text-slate-500">New members can create their own password and return with the same credentials later.</p>
            </div>
            <div className="rounded-[1.5rem] border border-[rgba(28,36,48,0.1)] bg-slate-50/80 p-4">
              <p className="text-sm font-semibold text-slate-900">3. Use magic links only if needed</p>
              <p className="mt-2 text-sm leading-6 text-slate-500">A secure email link is still available as a fallback when you want faster access.</p>
            </div>
          </div>

          <form action={magicLinkAction} className="space-y-4 rounded-[1.8rem] border border-dashed border-[rgba(28,36,48,0.14)] bg-slate-50/60 p-5 sm:p-6">
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-slate-900">Optional: sign in with a magic link</h3>
              <p className="text-sm leading-7 text-slate-600">
                Keep this as a lightweight fallback for pilots, testing, or password-free access.
              </p>
            </div>
            <input name="next" type="hidden" value={next} />
            <InputField autoComplete="email" label="Email" name="email" placeholder="you@societylab.org" type="email" />
            <Button className="w-full" variant="outline">
              <Mail className="mr-2 h-4 w-4" />
              Email me a secure link
            </Button>
          </form>
        </SoftPanel>

        <aside className="space-y-5 rounded-3xl border border-[rgba(28,36,48,0.1)] bg-white/92 p-6">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">What your account unlocks</p>
            <h2 className="text-2xl font-semibold text-slate-900">One identity across the whole atlas</h2>
          </div>

          <div className="space-y-3">
            <article className="rounded-2xl border border-[rgba(28,36,48,0.1)] bg-slate-50/75 p-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <h3 className="font-semibold text-slate-900">Verified member session</h3>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">The email link gives you a secure account session without forcing a social login or password flow.</p>
            </article>

            <article className="rounded-2xl border border-[rgba(28,36,48,0.1)] bg-slate-50/75 p-4">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-primary" />
                <h3 className="font-semibold text-slate-900">Protected member dashboard</h3>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">Your account becomes the home for learning progress, simulations, discussions, and governance activity.</p>
            </article>

            <article className="rounded-2xl border border-[rgba(28,36,48,0.1)] bg-slate-50/75 p-4">
              <div className="flex items-center gap-2">
                <ArrowRight className="h-4 w-4 text-primary" />
                <h3 className="font-semibold text-slate-900">Simple onboarding</h3>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">This keeps the account entry lightweight for community learning, pilots, and public onboarding.</p>
            </article>
          </div>

          <div className="rounded-2xl border border-[rgba(28,36,48,0.1)] bg-[linear-gradient(180deg,rgba(241,249,244,0.9),rgba(255,255,255,0.98))] p-4 text-sm text-slate-700">
            <p className="font-medium text-slate-900">Current setup</p>
            <ul className="mt-3 space-y-2 leading-6">
              <li>Accounts are email-first and email-only.</li>
              <li>Social login buttons are removed from the page.</li>
              <li>Users can create and keep their own password.</li>
              <li>Magic links remain available as an optional fallback.</li>
            </ul>
          </div>

          <Button variant="ghost" asChild>
            <Link href="/dashboard">Open the protected dashboard shell</Link>
          </Button>
        </aside>
      </div>
    </AtlasPage>
  );
}

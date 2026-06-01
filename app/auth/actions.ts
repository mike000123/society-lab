"use server";

import { redirect } from "next/navigation";

import { getAbsoluteUrl } from "@/lib/site-url";
import { hasSupabaseEnv } from "@/lib/supabase/public-env";
import { createClient } from "@/lib/supabase/server";
import { safeRedirectPath, withQuery } from "@/lib/utils";

type AuthView = "magic-link" | "sign-in" | "sign-up";
type OAuthProvider = "github" | "google";

function readString(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
}

function redirectToAuth(
  message: string,
  {
    next = "/dashboard",
    type = "error",
    view = "sign-in",
  }: {
    next?: string;
    type?: "error" | "success";
    view?: AuthView;
  } = {},
) {
  redirectTo(
    withQuery("/auth", {
      message,
      next,
      type,
      view,
    }),
  );
}

async function getEmailRedirectTo(next: string) {
  return getAbsoluteUrl(withQuery("/auth/callback", { next }));
}

function redirectTo(pathname: string): never {
  redirect(pathname as never);
}

export async function signInAction(formData: FormData) {
  const email = readString(formData, "email");
  const password = readString(formData, "password");
  const next = safeRedirectPath(readString(formData, "next"));

  if (!hasSupabaseEnv) {
    redirectToAuth("Supabase env is not configured yet.", { next });
  }

  if (!email || !password) {
    redirectToAuth("Email and password are required.", { next, view: "sign-in" });
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirectToAuth(error.message, { next, view: "sign-in" });
  }

  redirectTo(next);
}

export async function signUpAction(formData: FormData) {
  const email = readString(formData, "email");
  const password = readString(formData, "password");
  const fullName = readString(formData, "full_name");
  const next = safeRedirectPath(readString(formData, "next"));

  if (!hasSupabaseEnv) {
    redirectToAuth("Supabase env is not configured yet.", { next, view: "sign-up" });
  }

  if (!email || !password) {
    redirectToAuth("Email and password are required.", { next, view: "sign-up" });
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName || null,
      },
      emailRedirectTo: await getEmailRedirectTo(next),
    },
  });

  if (error) {
    redirectToAuth(error.message, { next, view: "sign-up" });
  }

  if (data.session) {
    redirectTo(next);
  }

  redirectToAuth("Check your email to confirm your account.", {
    next,
    type: "success",
    view: "sign-up",
  });
}

export async function magicLinkAction(formData: FormData) {
  const email = readString(formData, "email");
  const next = safeRedirectPath(readString(formData, "next"));

  if (!hasSupabaseEnv) {
    redirectToAuth("Supabase env is not configured yet.", { next, view: "magic-link" });
  }

  if (!email) {
    redirectToAuth("Email is required for a magic link.", { next, view: "magic-link" });
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: await getEmailRedirectTo(next),
    },
  });

  if (error) {
    redirectToAuth(error.message, { next, view: "magic-link" });
  }

  redirectToAuth("Magic link sent. Check your inbox.", {
    next,
    type: "success",
    view: "magic-link",
  });
}

export async function signInWithProviderAction(formData: FormData) {
  const provider = readString(formData, "provider") as OAuthProvider;
  const next = safeRedirectPath(readString(formData, "next"));

  if (!hasSupabaseEnv) {
    redirectToAuth("Supabase env is not configured yet.", { next, view: "sign-in" });
  }

  if (provider !== "github" && provider !== "google") {
    redirectToAuth("Unsupported OAuth provider.", { next, view: "sign-in" });
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: await getEmailRedirectTo(next),
    },
  });

  if (error || !data.url) {
    redirectToAuth(error?.message ?? "Unable to start OAuth sign-in.", {
      next,
      view: "sign-in",
    });
  }

  const providerUrl = data.url as string;

  redirectTo(providerUrl);
}

export async function signOutAction() {
  if (!hasSupabaseEnv) {
    redirectTo("/");
  }

  const supabase = await createClient();
  await supabase.auth.signOut();

  redirectTo(
    withQuery("/auth", {
      message: "Signed out successfully.",
      type: "success",
      view: "sign-in",
    }),
  );
}

import { headers } from "next/headers";

function isRoutableHost(hostname: string) {
  const normalized = hostname.trim().toLowerCase();

  return normalized !== "0.0.0.0" && normalized !== "::" && normalized !== "[::]";
}

function isRoutableUrl(candidate: string) {
  try {
    return isRoutableHost(new URL(candidate).hostname);
  } catch {
    return false;
  }
}

export async function getBaseUrl() {
  const headerStore = await headers();
  const origin = headerStore.get("origin");

  if (origin && isRoutableUrl(origin)) {
    return origin;
  }

  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host");

  if (host && isRoutableHost(host.split(":")[0] ?? host)) {
    const protocol =
      headerStore.get("x-forwarded-proto") ??
      (host.includes("localhost") || host.startsWith("127.") ? "http" : "https");

    return `${protocol}://${host}`;
  }

  const envUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim() ||
    process.env.VERCEL_URL?.trim();

  if (!envUrl) {
    return "http://127.0.0.1:3000";
  }

  return envUrl.startsWith("http") ? envUrl : `https://${envUrl}`;
}

export async function getAbsoluteUrl(pathname = "/") {
  return new URL(pathname, await getBaseUrl()).toString();
}

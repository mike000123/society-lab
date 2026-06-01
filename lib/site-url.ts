import { headers } from "next/headers";

export async function getBaseUrl() {
  const headerStore = await headers();
  const origin = headerStore.get("origin");

  if (origin) {
    return origin;
  }

  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host");

  if (host) {
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


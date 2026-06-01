import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function withQuery(
  pathname: string,
  params: Record<string, string | number | boolean | null | undefined>,
) {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === null || value === undefined || value === "") {
      continue;
    }

    searchParams.set(key, String(value));
  }

  const query = searchParams.toString();

  return query ? `${pathname}?${query}` : pathname;
}

export function safeRedirectPath(pathname: string | undefined, fallback = "/dashboard") {
  if (!pathname || !pathname.startsWith("/") || pathname.startsWith("//")) {
    return fallback;
  }

  return pathname;
}

import { existsSync } from "node:fs";
import path from "node:path";

const TRACK_FALLBACK_ART: Record<string, string> = {
  economy: "/atlas/learn-track-money-wealth.png",
  "politics-and-democracy": "/atlas/learn-track-power-politics.png",
  "cities-and-ecology": "/atlas/learn-track-ecology-limits.png",
  "media-and-information": "/atlas/learn-track-information-attention.png",
};

function publicCandidateToWebPath(candidate: string) {
  const idx = candidate.lastIndexOf(`${path.sep}public${path.sep}`);
  if (idx < 0) return null;
  const relative = candidate.slice(idx + `${path.sep}public`.length).split(path.sep).join("/");
  return relative.startsWith("/") ? relative : `/${relative}`;
}

export function getLessonHeroImage(slug: string, trackId?: string | null) {
  const candidates = [
    // ── New structured paths (preferred) ──────────────────────────────────
    path.join(process.cwd(), "public", "images", "learn", slug, "hero.webp"),
    path.join(process.cwd(), "public", "images", "learn", slug, "hero.png"),
    // ── Legacy atlas paths (backward-compatible) ───────────────────────────
    path.join(process.cwd(), "public", "atlas", "modules", `${slug}-hero.png`),
    path.join(process.cwd(), "public", "atlas", "modules", `${slug}.png`),
    path.join(process.cwd(), "public", "atlas", `${slug}-hero.png`),
    path.join(process.cwd(), "public", "atlas", `${slug}.png`),
  ];

  for (const candidate of candidates) {
    if (existsSync(candidate)) {
      return publicCandidateToWebPath(candidate) ?? "/atlas/learn-hero.png";
    }
  }

  if (trackId && TRACK_FALLBACK_ART[trackId]) {
    return TRACK_FALLBACK_ART[trackId];
  }

  return "/atlas/learn-hero.png";
}

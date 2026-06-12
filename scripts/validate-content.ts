#!/usr/bin/env tsx
/**
 * scripts/validate-content.ts
 *
 * Checks that every slug referenced in tracks/config.ts has:
 *   1. A matching lib/learn/modules/<slug>.ts file
 *   2. A matching content/learn/modules/<slug>.md file
 *   3. All 6 required frontmatter fields in the .md file
 *
 * Run:  npx tsx scripts/validate-content.ts
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const MODULES_DIR = path.join(ROOT, "lib/learn/modules");
const CONTENT_DIR = path.join(ROOT, "content/learn/modules");
const REQUIRED_FM = ["accent", "difficulty", "eyebrow", "readingTime", "summary", "title"] as const;

function extractSlugsFromConfig(): string[] {
  const source = readFileSync(path.join(ROOT, "lib/tracks/config.ts"), "utf-8");
  const slugs: string[] = [];
  for (const match of source.matchAll(/moduleSlugs:\s*\[([^\]]+)\]/g)) {
    for (const q of match[1].matchAll(/["']([^"']+)["']/g)) slugs.push(q[1]);
  }
  return [...new Set(slugs)];
}

function parseFrontmatter(filePath: string): Record<string, string> {
  const raw = readFileSync(filePath, "utf-8");
  if (!raw.startsWith("---\n")) return {};
  const close = raw.indexOf("\n---\n", 4);
  if (close === -1) return {};
  const meta: Record<string, string> = {};
  for (const line of raw.slice(4, close).split("\n")) {
    const colon = line.indexOf(": ");
    if (colon !== -1) meta[line.slice(0, colon).trim()] = line.slice(colon + 2).trim();
  }
  return meta;
}

const slugs = extractSlugsFromConfig();
let errors = 0;
let warnings = 0;

console.log(`\nValidating ${slugs.length} module slugs...\n`);

for (const slug of slugs) {
  if (!existsSync(path.join(MODULES_DIR, `${slug}.ts`))) {
    console.error(`  ✗ MISSING .ts  → lib/learn/modules/${slug}.ts`);
    errors++;
  }
  const mdPath = path.join(CONTENT_DIR, `${slug}.md`);
  if (!existsSync(mdPath)) {
    console.error(`  ✗ MISSING .md  → content/learn/modules/${slug}.md`);
    errors++;
    continue;
  }
  const meta = parseFrontmatter(mdPath);
  const missing = REQUIRED_FM.filter((f) => !meta[f]);
  if (missing.length > 0) {
    console.warn(`  ⚠ ${slug}.md missing frontmatter: ${missing.join(", ")}`);
    warnings++;
  }
}

// Orphaned modules — in modules/ but not referenced by any track
for (const f of readdirSync(MODULES_DIR).filter((f) => f.endsWith(".ts") && !f.startsWith("_") && f !== "index.ts")) {
  const slug = f.replace(/\.ts$/, "");
  if (!slugs.includes(slug)) {
    console.warn(`  ⚠ ORPHANED (not in any track): lib/learn/modules/${f}`);
    warnings++;
  }
}

if (errors === 0 && warnings === 0) {
  console.log("✓ All content checks passed.\n");
} else {
  console.log(`\nDone — ${errors} error(s), ${warnings} warning(s).\n`);
  if (errors > 0) process.exit(1);
}

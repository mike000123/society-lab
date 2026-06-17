#!/usr/bin/env tsx
/**
 * scripts/gen-metadata.ts
 *
 * Reads YAML frontmatter from every content/learn/modules/<slug>/<slug>.md and
 * legacy flat content/learn/modules/<slug>.md files, then
 * writes lib/learn/modules/_metadata.generated.ts.
 */
import { Dirent, readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CONTENT_DIR = path.join(ROOT, "content/learn/modules");
const OUT_FILE = path.join(ROOT, "lib/learn/modules/_metadata.generated.ts");

type Frontmatter = {
  accent: string;
  difficulty: string;
  eyebrow: string;
  readingTime: string;
  summary: string;
  title: string;
};

function parseFrontmatter(filePath: string): Partial<Frontmatter> {
  const raw = readFileSync(filePath, "utf-8");
  if (!raw.startsWith("---\n")) return {};
  const close = raw.indexOf("\n---\n", 4);
  if (close === -1) return {};
  const meta: Record<string, string> = {};
  for (const line of raw.slice(4, close).split("\n")) {
    const colon = line.indexOf(": ");
    if (colon !== -1) meta[line.slice(0, colon).trim()] = line.slice(colon + 2).trim();
  }
  return meta as Partial<Frontmatter>;
}

function q(s: string): string {
  return JSON.stringify(s);
}

function getArticleFiles() {
  const entries = readdirSync(CONTENT_DIR, { withFileTypes: true });
  const files: Array<{ fileName: string; filePath: string; slug: string }> = [];

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const folderPath = path.join(CONTENT_DIR, entry.name);
      const nestedEntries = readdirSync(folderPath, { withFileTypes: true })
        .filter((nestedEntry: Dirent) => nestedEntry.isFile() && nestedEntry.name.endsWith(".md"))
        .sort((a, b) => a.name.localeCompare(b.name));

      for (const nestedEntry of nestedEntries) {
        files.push({
          fileName: nestedEntry.name,
          filePath: path.join(folderPath, nestedEntry.name),
          slug: nestedEntry.name.replace(/\.md$/, ""),
        });
      }
      continue;
    }

    if (entry.isFile() && entry.name.endsWith(".md")) {
      files.push({
        fileName: entry.name,
        filePath: path.join(CONTENT_DIR, entry.name),
        slug: entry.name.replace(/\.md$/, ""),
      });
    }
  }

  return files.sort((a, b) => a.fileName.localeCompare(b.fileName));
}

const allFiles = getArticleFiles();
const fileSet = new Set(allFiles.map((file) => file.fileName));
const files = allFiles.filter((file) => {
  if (!file.fileName.endsWith("-final.md")) {
    return true;
  }

  const canonical = file.fileName.replace(/-final\.md$/, ".md");
  return !fileSet.has(canonical);
});

const entries: string[] = [];

for (const file of files) {
  const slug = file.slug;
  const meta = parseFrontmatter(file.filePath);

  const missing = (["accent", "difficulty", "eyebrow", "readingTime", "summary", "title"] as const).filter(
    (k) => !meta[k],
  );
  if (missing.length > 0) {
    console.warn(`  ${path.relative(ROOT, file.filePath)} missing frontmatter: ${missing.join(", ")}`);
  }

  entries.push(
    `  ${q(slug)}: {\n` +
    `    accent: ${q(meta.accent ?? "emerald")},\n` +
    `    difficulty: ${q(meta.difficulty ?? "")},\n` +
    `    eyebrow: ${q(meta.eyebrow ?? "")},\n` +
    `    readingTime: ${q(meta.readingTime ?? "")},\n` +
    `    summary: ${q(meta.summary ?? "")},\n` +
    `    title: ${q(meta.title ?? "")},\n` +
    `  }`,
  );
}

const output = `// AUTO-GENERATED — do not edit by hand.
// Source of truth: content/learn/modules/** frontmatter
// Regenerate: npm run gen:metadata
import type { AccentTone } from "./_types";

export type GeneratedMetadata = {
  accent: AccentTone;
  difficulty: string;
  eyebrow: string;
  readingTime: string;
  summary: string;
  title: string;
};

export const generatedMetadata: Record<string, GeneratedMetadata> = {
${entries.join(",\n")},
};
`;

writeFileSync(OUT_FILE, output, "utf-8");
console.log("Written " + entries.length + " entries to lib/learn/modules/_metadata.generated.ts");

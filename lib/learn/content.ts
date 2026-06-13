import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { cache } from "react";

export type LearningArticleCard = {
  body: string;
  title: string;
};

export type LearningArticleSource = {
  label: string;
  title: string;
  url: string;
};

export type LearningArticleChart = {
  height: number;
  note?: string;
  title: string;
  url: string;
};

export type LearningArticleBlock =
  | {
      level: 2 | 3;
      text: string;
      type: "heading";
    }
  | {
      text: string;
      type: "paragraph";
    }
  | {
      items: string[];
      type: "list";
    }
  | {
      text: string;
      type: "callout";
    }
  | {
      items: LearningArticleCard[];
      title?: string;
      type: "cards";
    }
  | {
      items: LearningArticleChart[];
      title?: string;
      type: "charts";
    }
  | {
      items: LearningArticleSource[];
      title?: string;
      type: "sources";
    };

export type LearningArticleMeta = {
  accent?: string;
  difficulty?: string;
  eyebrow?: string;
  readingTime?: string;
  summary?: string;
  title?: string;
};

export type LearningArticleDocument = {
  blocks: LearningArticleBlock[];
  meta: LearningArticleMeta;
};

const articleExtensions = [".md", ".txt"];

function getArticlePath(slug: string) {
  for (const extension of articleExtensions) {
    const candidate = path.join(process.cwd(), "content", "learn", "modules", `${slug}${extension}`);

    if (existsSync(candidate)) {
      return candidate;
    }
  }

  return null;
}

function parseCardBlock(lines: string[], title?: string): LearningArticleBlock {
  const items = lines
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [cardTitle, ...bodyParts] = line.split("|");

      return {
        body: bodyParts.join("|").trim(),
        title: cardTitle.trim(),
      };
    })
    .filter((item) => item.title.length > 0 && item.body.length > 0);

  return {
    items,
    title,
    type: "cards",
  };
}

function parseSourceBlock(lines: string[], title?: string): LearningArticleBlock {
  const items = lines
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label, sourceTitle, url] = line.split("|").map((part) => part.trim());

      return {
        label,
        title: sourceTitle,
        url,
      };
    })
    .filter((item) => item.label.length > 0 && item.title.length > 0 && item.url.length > 0);

  return {
    items,
    title,
    type: "sources",
  };
}

function parseChartBlock(lines: string[], title?: string): LearningArticleBlock {
  const items = lines
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [chartTitle, url, height, ...noteParts] = line.split("|").map((part) => part.trim());
      const parsedHeight = Number.parseInt(height, 10);

      return {
        height: Number.isFinite(parsedHeight) ? parsedHeight : 560,
        note: noteParts.join("|").trim() || undefined,
        title: chartTitle,
        url,
      };
    })
    .filter((item) => item.title.length > 0 && item.url.length > 0);

  return {
    items,
    title,
    type: "charts",
  };
}

function parseFrontmatter(raw: string): { meta: LearningArticleMeta; body: string } {
  const normalised = raw.replace(/\r\n/g, "\n");
  if (!normalised.startsWith("---\n")) {
    return { meta: {}, body: normalised };
  }
  const close = normalised.indexOf("\n---\n", 4);
  if (close === -1) {
    return { meta: {}, body: normalised };
  }
  const fmLines = normalised.slice(4, close).split("\n");
  const meta: LearningArticleMeta = {};
  for (const line of fmLines) {
    const colon = line.indexOf(": ");
    if (colon === -1) continue;
    const key = line.slice(0, colon).trim() as keyof LearningArticleMeta;
    const value = line.slice(colon + 2).trim();
    if (key && value) meta[key] = value;
  }
  return { meta, body: normalised.slice(close + 5) };
}

function parseLearningArticle(raw: string): LearningArticleDocument {
  const { meta, body } = parseFrontmatter(raw);
  const lines = body.replace(/\r\n/g, "\n").split("\n");
  const blocks: LearningArticleBlock[] = [];

  let index = 0;

  while (index < lines.length) {
    const currentLine = lines[index].trim();

    if (!currentLine) {
      index += 1;
      continue;
    }

    if (currentLine.startsWith(":::cards")) {
      const title = currentLine.slice(":::cards".length).trim() || undefined;
      const blockLines: string[] = [];
      index += 1;

      while (index < lines.length && lines[index].trim() !== ":::") {
        blockLines.push(lines[index]);
        index += 1;
      }

      blocks.push(parseCardBlock(blockLines, title));
      index += 1;
      continue;
    }

    if (currentLine.startsWith(":::sources")) {
      const title = currentLine.slice(":::sources".length).trim() || undefined;
      const blockLines: string[] = [];
      index += 1;

      while (index < lines.length && lines[index].trim() !== ":::") {
        blockLines.push(lines[index]);
        index += 1;
      }

      blocks.push(parseSourceBlock(blockLines, title));
      index += 1;
      continue;
    }

    if (currentLine.startsWith(":::charts")) {
      const title = currentLine.slice(":::charts".length).trim() || undefined;
      const blockLines: string[] = [];
      index += 1;

      while (index < lines.length && lines[index].trim() !== ":::") {
        blockLines.push(lines[index]);
        index += 1;
      }

      blocks.push(parseChartBlock(blockLines, title));
      index += 1;
      continue;
    }

    if (currentLine.startsWith("## ")) {
      blocks.push({
        level: 2,
        text: currentLine.slice(3).trim(),
        type: "heading",
      });
      index += 1;
      continue;
    }

    if (currentLine.startsWith("### ")) {
      blocks.push({
        level: 3,
        text: currentLine.slice(4).trim(),
        type: "heading",
      });
      index += 1;
      continue;
    }

    if (currentLine.startsWith("> ")) {
      const quoteLines: string[] = [];

      while (index < lines.length && lines[index].trim().startsWith("> ")) {
        quoteLines.push(lines[index].trim().slice(2).trim());
        index += 1;
      }

      blocks.push({
        text: quoteLines.join(" "),
        type: "callout",
      });
      continue;
    }

    if (currentLine.startsWith("- ")) {
      const items: string[] = [];

      while (index < lines.length && lines[index].trim().startsWith("- ")) {
        items.push(lines[index].trim().slice(2).trim());
        index += 1;
      }

      blocks.push({
        items,
        type: "list",
      });
      continue;
    }

    const paragraphLines: string[] = [];

    while (index < lines.length) {
      const line = lines[index].trim();

      if (
        !line ||
        line.startsWith("## ") ||
        line.startsWith("### ") ||
        line.startsWith("> ") ||
        line.startsWith("- ") ||
        line.startsWith(":::cards") ||
        line.startsWith(":::charts") ||
        line.startsWith(":::sources")
      ) {
        break;
      }

      paragraphLines.push(line);
      index += 1;
    }

    if (paragraphLines.length > 0) {
      blocks.push({
        text: paragraphLines.join(" "),
        type: "paragraph",
      });
    }
  }

  return {
    blocks,
    meta,
  };
}

export const getLearningArticleBySlug = cache((slug: string) => {
  const articlePath = getArticlePath(slug);

  if (!articlePath) {
    return null;
  }

  const raw = readFileSync(articlePath, "utf-8");
  const article = parseLearningArticle(raw);

  // Return null only if there is neither body content nor frontmatter meta
  const hasMeta = Object.keys(article.meta).length > 0;
  if (article.blocks.length === 0 && !hasMeta) {
    return null;
  }

  return article;
});

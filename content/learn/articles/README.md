# Learn deep-dive articles

Longer supplementary articles linked from a module's lesson page.
Each subdirectory matches a module slug and can contain multiple articles.

## Convention

```
content/learn/articles/
  why-gdp-is-not-the-same-as-wellbeing/
    the-history-of-gdp.md
    gdp-alternatives-compared.md
```

## Frontmatter

```yaml
---
title: The history of GDP
summary: How a wartime accounting tool became the world's dominant economic scoreboard.
author: Dimitris
publishedAt: 2026-06-09
relatedModule: why-gdp-is-not-the-same-as-wellbeing
---
```

Articles are loaded by `lib/learn/articles.ts` (create when first article is added).

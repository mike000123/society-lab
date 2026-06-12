# Open Graph images

Static OG images for social sharing previews.

## Convention

| File pattern | Used for |
|-------------|---------|
| `learn-<slug>.png` | Individual learn module pages |
| `simulator-<slug>.png` | Individual simulator pages |
| `default.png` | All other pages (fallback) |

Images should be **1200 × 630 px** PNG.

These are referenced in `generateMetadata()` in each route's `page.tsx`:

```ts
openGraph: {
  images: [{ url: `/images/og/learn-${slug}.png`, width: 1200, height: 630 }],
}
```

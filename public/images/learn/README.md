# Learn module images

Each subdirectory maps to a module slug and holds that module's visual assets.

## Convention

| File | Purpose |
|------|---------|
| `hero.webp` | Main hero image shown at the top of the lesson page (preferred format) |
| `hero.png` | Fallback if no `.webp` is available |
| `diagram.svg` | Any inline diagrams referenced in the `.md` body |

## How hero images are resolved

`lib/learn/hero-art.ts` checks paths in this order:

1. `public/images/learn/<slug>/hero.webp`
2. `public/images/learn/<slug>/hero.png`
3. Legacy `public/atlas/modules/<slug>-hero.png`
4. Track fallback (e.g. `learn-track-money-wealth.png`)
5. Global default `learn-hero.png`

To add a hero image for a module: drop `hero.webp` into the matching slug directory.
No code changes required.

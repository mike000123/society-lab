Learn article content now lives in plain document files instead of being fully hardcoded in `lib/learn/modules.ts`.

Why this exists:
- It keeps long teaching text out of the main TypeScript data file.
- It gives us a low-friction place to paste copy from notes, documents, or future editorial drafts.
- It is free, easy to version in Git, and a good bridge toward MDX or a CMS later.

Current support:
- `.md` and `.txt` files in `content/learn/modules/`
- `##` and `###` headings
- normal paragraphs
- bullet lists that start with `- `
- callout paragraphs that start with `> `
- card grids with:

```text
:::cards Quick map
Card title | Card body
Another card | Another explanation
:::
```

- embedded OWID chart blocks with:

```text
:::charts Reading the data
Chart title | https://ourworldindata.org/grapher/example-chart?tab=chart | 560 | One short sentence explaining what to notice.
Another chart | https://ourworldindata.org/grapher/example-map?tab=map | 620 | Optional note.
:::
```

- source cards with:

```text
:::sources Source trail
Our World in Data | Economic Inequality | https://ourworldindata.org/economic-inequality
:::
```

Authoring rule of thumb:
- Put the module slug in the filename, for example `how-pollution-builds-up-until-systems-tip.md`
- Keep the text concrete and connected.
- Use the cards for infographic-style summaries, not for whole essays.
- Keep citations at the bottom so the lesson stays readable.

Next possible step:
- support MDX for richer embedded visuals
- or connect the same document format to a simple admin import flow later

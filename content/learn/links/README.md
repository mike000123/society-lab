# Curated external links

One YAML file per module slug. Shown as a "Further reading" section on the lesson page.

## Convention

Filename: `<slug>.yaml`

```yaml
# content/learn/links/why-gdp-is-not-the-same-as-wellbeing.yaml
- title: "Beyond GDP — European Commission"
  url: "https://beyond-gdp.eu"
  note: "The EU's flagship alternative indicator initiative"
  type: official   # official | article | paper | video | tool

- title: "The GDP Illusion — Monthly Review"
  url: "https://monthlyreview.org/..."
  note: "Critical essay on GDP's political origins"
  type: article
```

Links are loaded by `lib/learn/links.ts` (create when first link file is added).

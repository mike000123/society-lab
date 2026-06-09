const CATEGORY_FALLBACKS: Record<string, string> = {
  "cities-housing": "/atlas/home-domain-cities-everyday-life.png",
  "corruption-development": "/atlas/society and politics.png",
  "data-research": "/atlas/home-world-map.png",
  "democracy-governance": "/atlas/home-domain-politics-democracy.png",
  "ecology-climate": "/atlas/learn-track-ecology-limits.png",
  "media-surveillance": "/atlas/home-domain-media-information.png",
  "money-banking": "/atlas/learn-track-money-wealth.png",
  "owid-shortlist": "/atlas/home-world-map.png",
  "political-economy": "/atlas/home-domain-economy.png",
  "systems-thinking": "/atlas/home-world3-card.png",
};

const RESOURCE_OVERRIDES: Record<string, string> = {
  "demo-democracynext": "/atlas/home-domain-politics-democracy.png",
  "demo-oecd-citizen-participation": "/atlas/home-world-map.png",
  "demo-participedia": "/atlas/home-domain-politics-democracy.png",
};

export function getStudyResourceArt(resourceId: string, categoryId: string) {
  return RESOURCE_OVERRIDES[resourceId] ?? CATEGORY_FALLBACKS[categoryId] ?? "/atlas/study-hero.png";
}

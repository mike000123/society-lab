export type Topic = { slug: string; title: string; bug: string; alternative: string; question: string };

export const topics: Topic[] = [
  { slug: "economy", title: "Economic System", bug: "GDP-only framing misses wellbeing outcomes.", alternative: "Track wellbeing, housing stability, and time poverty.", question: "What if policy optimized for life outcomes rather than output?" },
  { slug: "politics", title: "Democracy & Governance", bug: "Periodic elections alone cannot process complex tradeoffs.", alternative: "Structured assemblies and transparent deliberation.", question: "How can citizens contribute continuously without chaos?" },
  { slug: "cities", title: "Cities & Everyday Life", bug: "Urban design often optimizes traffic and speculation over humans.", alternative: "15-minute neighborhoods and green civic spaces.", question: "What changes when stress and isolation become primary design constraints?" }
];

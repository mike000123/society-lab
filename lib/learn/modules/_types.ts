export type AccentTone = "amber" | "cyan" | "emerald" | "rose";

export type CausalLoopNode = {
  id: string;
  label: string;
  tone?: AccentTone;
  x: number;
  y: number;
};

export type CausalLoopEdge = {
  bend?: number;
  from: string;
  label: string;
  polarity: "negative" | "positive";
  to: string;
};
export type CausalLoop = {
  description: string;
  label: string;
  nodeIds: string[];
  polarity: "reinforcing" | "balancing";
};



export type RealWorldExample = {
  insight: string;
  outcome: string;
  title: string;
};

export type CounterArgument = {
  point: string;
  response: string;
  title: string;
};

export type FoundationalReference = {
  focus: string;
  status: "Active lens" | "Coming next";
  summary: string;
  title: string;
};

export type LearningEvidenceLink = {
  note: string;
  source: string;
  title: string;
  url: string;
};

export type LearningTimelineEvent = {
  characteristics: string[];
  family: string;
  outcome: string;
  timeLabel: string;
  title: string;
  turningPoint: string;
  whyItStarted: string;
};

export type LearningTimeline = {
  intro: string;
  title: string;
  events: LearningTimelineEvent[];
};

export type BetterMetric = {
  description: string;
  label: string;
};

export type MiniLessonMetric = {
  base: number;
  description: string;
  key: string;
  label: string;
  max: number;
  min: number;
  slope: number;
  suffix?: string;
  tone: AccentTone;
};

export type MiniLessonBand = {
  insight: string;
  threshold: number;
};

export type MiniLessonConfig = {
  bands: MiniLessonBand[];
  defaultValue: number;
  description: string;
  highLabel: string;
  lowLabel: string;
  metrics: MiniLessonMetric[];
  prompt: string;
  sliderLabel: string;
  step: number;
  title: string;
  unit?: string;
  valueLabel?: string;
  valueMax: number;
  valueMin: number;
};

export type StaticMiniLessonMetric = {
  description: string;
  high: string;
  label: string;
  low: string;
  signal: string;
};

export type StaticMiniLesson = {
  accent: AccentTone;
  conclusion: string;
  metrics: StaticMiniLessonMetric[];
  subtitle: string;
  title: string;
};

export type ProposalActor =
  | "individual"
  | "community"
  | "civil_society"
  | "local_gov"
  | "national_gov"
  | "private_sector"
  | "international";

export type ProposalDomain = "economic" | "political" | "media" | "legal" | "social" | "environmental";

export type ProposalFeasibility = "proven" | "emerging" | "contested" | "long_horizon";

export type ModuleProposal = {
  title: string;
  summary: string;
  actor: ProposalActor;
  domain: ProposalDomain;
  feasibility: ProposalFeasibility;
  precedents?: { place: string; year: number; outcome: string }[];
};

export type LearningModule = {
  // ── Metadata (can live in .md frontmatter instead) ───────────────────────
  accent?: AccentTone;
  difficulty?: string;
  eyebrow?: string;
  readingTime?: string;
  summary?: string;
  title?: string;
  // ── Interactive widget data (always in .ts) ───────────────────────────────
  betterMetrics: BetterMetric[];
  betterMetricsTitle: string;
  causalLoop: {
    description: string;
    edges: CausalLoopEdge[];
    loops: (string | CausalLoop)[];
    nodes: CausalLoopNode[];
    title: string;
  };
  counterArguments: CounterArgument[];
  discussionPrompt: string;
  evidenceLinks?: LearningEvidenceLink[];
  heroHighlights: string[];
  miniLesson: MiniLessonConfig | StaticMiniLesson;
  realWorldExamples: RealWorldExample[];
  relatedFrameworks: string[];
  simpleExplanation: string[];
  simulationPrompt: string;
  simulatorSlug?: string;
  slug: string;
  systemBug: {
    signals: string[];
    summary: string;
    title: string;
  };
  timeline?: LearningTimeline;
  proposals?: ModuleProposal[];
  /** If present, this is a synthesis capstone — render LessonSynthesis instead of standard widgets. */
  synthesisOf?: string[];
};

/** A module that has been merged with its .md frontmatter — all 6 metadata fields are guaranteed present. */
export type ResolvedLearningModule = Omit<
  LearningModule,
  "accent" | "difficulty" | "eyebrow" | "readingTime" | "summary" | "title"
> & {
  accent: AccentTone;
  difficulty: string;
  eyebrow: string;
  readingTime: string;
  summary: string;
  title: string;
};

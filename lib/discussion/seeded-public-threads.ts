import type { Database } from "@/lib/database.types";
import { getProposalById } from "@/lib/governance/proposals";

type PostKind = Database["public"]["Enums"]["post_kind"];
type ThreadContextType = Database["public"]["Enums"]["thread_context_type"];
type ThreadParticipationMode = Database["public"]["Enums"]["thread_participation_mode"];

export type SeededDiscussionProposalReference = {
  category?: string | null;
  id: string;
  moduleSlug?: string | null;
  moduleTitle?: string | null;
  title: string;
};

export type SeededDiscussionPost = {
  author_avatar_url?: string | null;
  author_label: string;
  author_linkedin_url?: string | null;
  content: string;
  created_at: string;
  id: string;
  kind: PostKind;
  proposalReference?: SeededDiscussionProposalReference | null;
};

export type SeededPublicThread = {
  authorLabel: string;
  contextSlug: string | null;
  contextType: ThreadContextType;
  desiredAcademicLevels: string[];
  desiredExpertiseDomains: string[];
  desiredProfessionalStages: string[];
  homeKind: "Analysis" | "Claim" | "Proposal" | "Question";
  homeMeta: string;
  id: string;
  participationMode: ThreadParticipationMode;
  posts: SeededDiscussionPost[];
  prompt: string;
  proposalId: string;
  title: string;
  updatedAt: string;
};

function buildProposalReference(proposalId: string): SeededDiscussionProposalReference {
  const proposal = getProposalById(proposalId);
  if (!proposal) {
    throw new Error(`Seeded discussion references missing proposal "${proposalId}".`);
  }

  return {
    category: proposal.category,
    id: proposal.id,
    moduleSlug: proposal.moduleSlug,
    moduleTitle: proposal.moduleTitle,
    title: proposal.title,
  };
}

const PROGRESSIVE_WEALTH_TAX = buildProposalReference("progressive-wealth-tax");
const COMMUNITY_LAND_TRUSTS = buildProposalReference("community-land-trusts");
const PUBLIC_BANKING_NETWORK = buildProposalReference("public-banking-network");
const GENUINE_PROGRESS_INDICATOR = buildProposalReference("genuine-progress-indicator");

export const SEEDED_PUBLIC_THREADS: SeededPublicThread[] = [
  {
    authorLabel: "Society Lab",
    contextSlug: null,
    contextType: "general",
    desiredAcademicLevels: [],
    desiredExpertiseDomains: [],
    desiredProfessionalStages: [],
    homeKind: "Claim",
    homeMeta: "23 comments · 41 upvotes",
    id: "seed-growth-distribution",
    participationMode: "open",
    posts: [
      {
        author_label: "Systems Analyst",
        content:
          "A lot of frustration blamed on growth is really about who captures the gains. Output can rise while wages, housing access, and free time get worse for most people.",
        created_at: "2026-05-18T09:00:00Z",
        id: "seed-growth-distribution-1",
        kind: "claim",
      },
      {
        author_label: "Political Economist",
        content:
          "The pattern shows up whenever asset ownership compounds faster than wages. If capital gains and rents rise while labour income lags, people experience growth as exclusion rather than progress.",
        created_at: "2026-05-18T10:00:00Z",
        id: "seed-growth-distribution-2",
        kind: "evidence",
      },
      {
        author_label: "Ecology Researcher",
        content:
          "Distribution is central, but we should be careful not to imply that any kind of endless growth is harmless. Ecological limits still matter even if gains are shared more fairly.",
        created_at: "2026-05-18T11:00:00Z",
        id: "seed-growth-distribution-3",
        kind: "counterpoint",
      },
      {
        author_label: "Civic Designer",
        content:
          "A constructive next step is to slow wealth concentration directly rather than arguing about growth in the abstract. The linked proposal is one concrete way to break the compounding loop at the top.",
        created_at: "2026-05-18T12:00:00Z",
        id: "seed-growth-distribution-4",
        kind: "synthesis",
        proposalReference: PROGRESSIVE_WEALTH_TAX,
      },
    ],
    prompt:
      "If living standards feel worse even while economies grow, is the core problem growth itself or the way its gains are distributed through wages, assets, and public goods?",
    proposalId: PROGRESSIVE_WEALTH_TAX.id,
    title: "Growth is not the enemy. Distribution is.",
    updatedAt: "2026-05-18T12:00:00Z",
  },
  {
    authorLabel: "Society Lab",
    contextSlug: null,
    contextType: "general",
    desiredAcademicLevels: [],
    desiredExpertiseDomains: [],
    desiredProfessionalStages: [],
    homeKind: "Question",
    homeMeta: "34 comments · 62 votes",
    id: "seed-housing-public-good",
    participationMode: "open",
    posts: [
      {
        author_label: "Urban Planner",
        content:
          "When homes function mainly as investment vehicles, policymakers start defending price appreciation instead of affordability. That flips the social purpose of housing upside down.",
        created_at: "2026-05-20T08:15:00Z",
        id: "seed-housing-public-good-1",
        kind: "question",
      },
      {
        author_label: "Housing Researcher",
        content:
          "Financialized housing systems reward vacancy, speculation, and land capture. The more housing behaves like an asset class, the less stable it becomes as shelter.",
        created_at: "2026-05-20T09:00:00Z",
        id: "seed-housing-public-good-2",
        kind: "evidence",
      },
      {
        author_label: "Market Liberal",
        content:
          "We should acknowledge that some investment is necessary to finance new supply. The question is not whether capital enters housing, but whether rules let speculation overwhelm access.",
        created_at: "2026-05-20T10:10:00Z",
        id: "seed-housing-public-good-3",
        kind: "counterpoint",
      },
      {
        author_label: "Community Organizer",
        content:
          "If we want housing to behave more like a public good, we need ownership models that take land out of permanent speculation. Community land trusts do exactly that.",
        created_at: "2026-05-20T11:30:00Z",
        id: "seed-housing-public-good-4",
        kind: "synthesis",
        proposalReference: COMMUNITY_LAND_TRUSTS,
      },
    ],
    prompt:
      "Should housing primarily behave like a financial asset that stores and grows wealth, or like a public good whose first job is stable shelter and community life?",
    proposalId: COMMUNITY_LAND_TRUSTS.id,
    title: "Should housing be treated as an investment or a public good?",
    updatedAt: "2026-05-20T11:30:00Z",
  },
  {
    authorLabel: "Society Lab",
    contextSlug: null,
    contextType: "general",
    desiredAcademicLevels: [],
    desiredExpertiseDomains: [],
    desiredProfessionalStages: [],
    homeKind: "Proposal",
    homeMeta: "1.2K votes · 312 comments",
    id: "seed-public-banks-for-housing-and-green-investment",
    participationMode: "open",
    posts: [
      {
        author_label: "Policy Analyst",
        content:
          "Private banks expand credit where returns are strongest, not where social need is highest. That is why housing, small business, and green infrastructure are often underfunded or overpriced.",
        created_at: "2026-05-22T09:45:00Z",
        id: "seed-public-banking-1",
        kind: "claim",
      },
      {
        author_label: "Regional Banker",
        content:
          "Public banking is not a fantasy. Germany's Sparkassen and KfW show that publicly mandated banks can lend patiently, stay profitable, and strengthen regional resilience.",
        created_at: "2026-05-22T10:30:00Z",
        id: "seed-public-banking-2",
        kind: "evidence",
      },
      {
        author_label: "Fiscal Conservative",
        content:
          "The real design question is governance: how do you stop a public bank from becoming a political slush fund? Without safeguards, the model could recreate a different kind of capture.",
        created_at: "2026-05-22T11:20:00Z",
        id: "seed-public-banking-3",
        kind: "counterpoint",
      },
      {
        author_label: "Systems Designer",
        content:
          "A national public-banking network makes sense if it is paired with a clear social mandate, transparent lending criteria, and regional accountability. The linked proposal sketches that route.",
        created_at: "2026-05-22T12:10:00Z",
        id: "seed-public-banking-4",
        kind: "synthesis",
        proposalReference: PUBLIC_BANKING_NETWORK,
      },
    ],
    prompt:
      "Could public banks become a practical way to finance affordable housing and green investment at scale, or would they simply introduce a different set of risks and political dependencies?",
    proposalId: PUBLIC_BANKING_NETWORK.id,
    title: "Public banks for housing and green investment.",
    updatedAt: "2026-05-22T12:10:00Z",
  },
  {
    authorLabel: "Society Lab",
    contextSlug: null,
    contextType: "general",
    desiredAcademicLevels: [],
    desiredExpertiseDomains: [],
    desiredProfessionalStages: [],
    homeKind: "Analysis",
    homeMeta: "18 comments · 29 votes",
    id: "seed-gdp-not-wellbeing",
    participationMode: "open",
    posts: [
      {
        author_label: "Data Journalist",
        content:
          "GDP is good at measuring market output, but it treats defensive spending, pollution cleanup, and stress-related costs as positives because they are transactions.",
        created_at: "2026-05-24T08:40:00Z",
        id: "seed-gdp-not-wellbeing-1",
        kind: "claim",
      },
      {
        author_label: "Public Health Researcher",
        content:
          "That is why countries can report healthy GDP growth while people feel less secure, more time-poor, and less able to afford housing or care. The metric is not wrong; it is incomplete.",
        created_at: "2026-05-24T09:15:00Z",
        id: "seed-gdp-not-wellbeing-2",
        kind: "evidence",
      },
      {
        author_label: "Macroeconomist",
        content:
          "We should not throw GDP away entirely. It still matters for tax capacity and production analysis. The better move is to stop using it as the sole scorecard for progress.",
        created_at: "2026-05-24T10:10:00Z",
        id: "seed-gdp-not-wellbeing-3",
        kind: "counterpoint",
      },
      {
        author_label: "Policy Designer",
        content:
          "That points toward a dashboard or replacement metric that tracks wellbeing directly. The linked proposal is a concrete institutional version of that argument.",
        created_at: "2026-05-24T11:05:00Z",
        id: "seed-gdp-not-wellbeing-4",
        kind: "synthesis",
        proposalReference: GENUINE_PROGRESS_INDICATOR,
      },
    ],
    prompt:
      "If GDP is a production metric rather than a wellbeing metric, what should societies use to decide whether life is actually getting better?",
    proposalId: GENUINE_PROGRESS_INDICATOR.id,
    title: "GDP is a production metric, not a wellbeing metric.",
    updatedAt: "2026-05-24T11:05:00Z",
  },
];

export const SEEDED_PUBLIC_THREAD_MAP = new Map(SEEDED_PUBLIC_THREADS.map((thread) => [thread.id, thread]));

export function getSeededPublicThreadById(id: string) {
  return SEEDED_PUBLIC_THREAD_MAP.get(id) ?? null;
}

export function isSeededPublicThreadId(id?: string | null): id is string {
  return Boolean(id && SEEDED_PUBLIC_THREAD_MAP.has(id));
}

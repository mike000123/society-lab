import type { LearningModule } from "./_types";
import { owidEvidenceLinks } from "./_shared";

export const lessonData: LearningModule = {
    betterMetrics: [
      { description: "The share of votes that translate into no seat or no influence on election outcome.", label: "Wasted vote percentage" },
      { description: "The gap between a party's vote share and its seat share in the legislature.", label: "Proportionality gap" },
      { description: "How far district boundaries systematically favor one party over another.", label: "Gerrymandering index" },
      { description: "Voter turnout across different income and education levels.", label: "Turnout inequality" },
    ],
    betterMetricsTitle: "Measure these alongside voter turnout and seat counts",
    counterArguments: [
      {
        point: "First-past-the-post systems produce strong, stable governments with clear majorities and direct constituency links.",
        response: "Stability matters, but a government elected on 35% of the vote while 65% voted for others tests the meaning of democratic mandate.",
        title: "Strong governments need clear majorities",
      },
      {
        point: "Proportional systems produce fragmented legislatures and endless coalition negotiations that slow decision-making.",
        response: "Coalition governance has trade-offs, but it also produces broader representation and prevents minority rule. Nordic countries demonstrate proportional systems can be both stable and legitimate.",
        title: "Proportional systems create instability",
      },
      {
        point: "Electoral system design is a sovereign choice with legitimate defenders on all sides.",
        response: "True. But when rules persistently produce outcomes where a minority of votes produces a majority of power, the trade-off should at minimum be transparent.",
        title: "System design is a legitimate sovereign choice",
      },
    ],
    causalLoop: {
      description: "Winner-take-all rules allow parties to win disproportionate power with minority vote shares. That power controls boundary drawing and campaign finance rules that reinforce the advantage.",
      edges: [
        { from: "electoral_rules", label: "produce", polarity: "positive", to: "seat_distortion" },
        { from: "seat_distortion", label: "grants", polarity: "positive", to: "governing_power" },
        { from: "governing_power", label: "controls", polarity: "positive", to: "boundary_drawing" },
        { from: "boundary_drawing", label: "amplifies", polarity: "positive", to: "seat_distortion" },
        { from: "governing_power", label: "sets", polarity: "positive", to: "campaign_finance_rules" },
        { from: "campaign_finance_rules", label: "advantages", polarity: "positive", to: "incumbents" },
        { from: "incumbents", label: "defend", polarity: "positive", to: "electoral_rules" },
      ],
      loops: [
        "Reinforcing: seat distortion → governing power → boundary control → more distortion",
        "Balancing: voter mobilization, independent redistricting commissions, electoral reform campaigns",
      ],
      nodes: [
        { id: "electoral_rules", label: "Electoral rules", tone: "cyan", x: 80, y: 200 },
        { id: "seat_distortion", label: "Seat distortion", tone: "rose", x: 260, y: 100 },
        { id: "governing_power", label: "Governing power", tone: "amber", x: 460, y: 100 },
        { id: "boundary_drawing", label: "Boundary drawing", tone: "rose", x: 460, y: 300 },
        { id: "campaign_finance_rules", label: "Campaign finance rules", tone: "amber", x: 280, y: 340 },
        { id: "incumbents", label: "Incumbent advantage", tone: "amber", x: 80, y: 340 },
      ],
      title: "The electoral self-reinforcement loop",
    },
    discussionPrompt: "Should democracies optimize for strong decisive governments or proportional representation of all voters? Can those goals coexist?",
    heroHighlights: [
      "In first-past-the-post systems, a party can win a parliamentary majority with under 40% of the popular vote.",
      "Gerrymandering can reliably deliver 60% of seats to a party with 50% of the votes.",
      "Campaign finance rules in most democracies systematically advantage incumbents over challengers.",
    ],
    miniLesson: {
      bands: [
        { insight: "Highly proportional system. Vote share closely matches seat share. Coalitions are necessary; representation is broad.", threshold: 25 },
        { insight: "Mixed system. Some distortion, but multiple parties maintain real influence.", threshold: 50 },
        { insight: "Significant distortion. Winning party consistently gets more seats than votes warrant.", threshold: 72 },
        { insight: "Winner-take-all maximum. Minority rule is common. Large vote blocs are systematically unrepresented.", threshold: 90 },
      ],
      defaultValue: 65,
      description: "Adjust the distortion level — how far seat share can diverge from vote share under the system's rules.",
      highLabel: "Maximum winner bonus",
      lowLabel: "Fully proportional",
      metrics: [
        { base: 5, description: "How often a party wins a parliamentary majority with under 50% of votes.", key: "minority_rule", label: "Minority-vote majorities", max: 100, min: 0, slope: 0.72, suffix: "%", tone: "rose" },
        { base: 85, description: "The share of voters whose ballot materially influences the final composition of government.", key: "effective_votes", label: "Effective vote share", max: 100, min: 0, slope: -0.58, suffix: "%", tone: "cyan" },
        { base: 42, description: "Voter turnout in lower-income and younger age groups relative to the overall average.", key: "turnout_gap", label: "Turnout equality", max: 100, min: 0, slope: -0.35, suffix: "/100", tone: "emerald" },
      ],
      prompt: "Adjust electoral distortion to see how voter representation and turnout equity shift.",
      sliderLabel: "Electoral system distortion",
      step: 1,
      title: "Mini lesson: votes cast vs. votes that count",
      unit: "%",
      valueMax: 100,
      valueMin: 0,
    },
    realWorldExamples: [
      {
        insight: "Both the 2000 and 2016 US presidential elections were won by candidates who received fewer total votes — a direct result of the Electoral College's winner-take-all state allocation.",
        outcome: "The US Electoral College creates a system where swing-state votes determine the presidency while voters in safe states are effectively non-participants.",
        title: "Electoral College and popular vote divergence",
      },
      {
        insight: "In 2019, the UK Conservative Party won 56% of seats with 44% of the vote. The Brexit Party won 2% of seats with a similar vote share to the SNP, which won 7%.",
        outcome: "First-past-the-post consistently converts vote share into wildly unequal seat shares depending on geographic concentration.",
        title: "UK general election and geographic vote weighting",
      },
      {
        insight: "After the 2010 US Census, Republican-controlled states redrew district maps to pack Democrats into fewer districts.",
        outcome: "In North Carolina, Republicans won 10 of 13 congressional seats in 2012 despite winning only 49% of the congressional vote.",
        title: "Gerrymandering after the 2010 Census",
      },
    ],
    evidenceLinks: [owidEvidenceLinks.democracy],
    relatedFrameworks: [
      "Duverger's Law",
      "Proportional representation models",
      "Ranked-choice voting",
      "Independent redistricting commissions",
    ],
    simulationPrompt: "Compare winner-take-all, proportional, and ranked-choice systems across different vote distributions to see how the translation of votes to power changes.",
    simpleExplanation: [
      "Electoral systems are not neutral plumbing. The rules that translate votes into seats determine who governs, by how much, and which voters are effectively represented. Winner-take-all systems routinely produce majority governments from minority vote shares.",
      "The distortion is self-reinforcing: the party that wins power controls redistricting, sets campaign finance rules, and determines voter access legislation — all of which influence the next election.",
      "Reforming an electoral system is hardest for exactly those most likely to benefit from reform: challengers and voters whose preferences are geographically dispersed.",
    ],
    slug: "how-electoral-rules-shape-political-power",
    systemBug: {
      signals: [
        "Parties regularly win legislative majorities with under 50% of the popular vote.",
        "Electoral boundaries are drawn by the parties most interested in a favorable outcome.",
        "Campaign finance advantages compound incumbency, making seat turnover rare.",
      ],
      summary: "The rules that convert votes to power were designed in earlier eras and are maintained by those who benefit from them, creating structural barriers to the representation of new majorities.",
      title: "System bug: the rules that count votes are made by the people who win under those rules",
    },
  proposals: [
    {
      title: "Replace winner-take-all plurality voting with proportional representation",
      summary: "First-past-the-post systematically wastes millions of votes. Proportional representation ensures parliament reflects how people actually vote, reducing wasted votes and the incentive for tactical voting.",
      actor: "national_gov",
      domain: "political",
      feasibility: "proven",
      precedents: [
        { place: "New Zealand", year: 1996, outcome: "Switch to MMP after referendum; voter satisfaction with democracy increased; more diverse parliament within two elections" },
        { place: "Germany", year: 1949, outcome: "MMP system since post-war constitution; stable coalition governance; very few wasted votes" },
      ],
    },
    {
      title: "Introduce ranked-choice voting for single-winner elections",
      summary: "Ranked-choice voting eliminates the spoiler effect and strategic voting in single-seat contests. Voters express true preferences; winners need broad coalitions, reducing polarisation.",
      actor: "local_gov",
      domain: "political",
      feasibility: "proven",
      precedents: [
        { place: "Ireland", year: 1922, outcome: "Single Transferable Vote used for all general elections since independence; consistent coalition governments, high voter satisfaction" },
        { place: "Maine, USA", year: 2016, outcome: "First US state to adopt RCV for federal elections by referendum; used in 2018 and 2020 without problems" },
      ],
    },
    {
      title: "Establish independent citizens assemblies to reform electoral rules",
      summary: "Politicians who benefit from existing rules rarely vote to change them. Citizens assemblies — randomly selected, deliberative, and divorced from incumbent interests — have produced the most credible electoral reform recommendations in recent history.",
      actor: "civil_society",
      domain: "political",
      feasibility: "proven",
      precedents: [
        { place: "British Columbia, Canada", year: 2004, outcome: "Citizens Assembly recommended STV by 97% vote; set international template for deliberative electoral reform" },
        { place: "Ireland", year: 2016, outcome: "Citizens Assembly recommended marriage equality and abortion rights; both passed by referendum" },
      ],
    },
  ],

  };

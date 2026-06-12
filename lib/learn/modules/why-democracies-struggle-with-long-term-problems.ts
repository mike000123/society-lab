import type { LearningModule } from "./_types";

export const lessonData: LearningModule = {
  betterMetrics: [
    {
      label: "Independent fiscal institution coverage",
      description:
        "Whether a country has an independent fiscal council or parliamentary budget office with a mandate to publish long-run projections — and whether those projections are binding on budget processes.",
    },
    {
      label: "Long-run policy horizon in legislation",
      description:
        "What share of major legislation includes impact assessments beyond ten years? Most laws are assessed over 5-year budget windows, making multi-decade costs invisible to legislators.",
    },
    {
      label: "Intergenerational equity index",
      description:
        "A composite of pension sustainability, environmental liability, and infrastructure maintenance backlog — measures whether current decisions are exporting costs to future generations.",
    },
    {
      label: "Voter age distribution relative to policy timescale",
      description:
        "The median voter age relative to the time horizon of major policy decisions. When the median voter will not live to experience a policy's full consequences, their incentive to price them in is reduced.",
    },
  ],
  betterMetricsTitle: "What long-term governance capacity would look like",
  causalLoop: {
    description:
      "Elected politicians face strong incentives to deliver benefits before the next election and defer costs until after it. Problems that mature over decades fall outside this window — not because politicians are ignorant of them, but because the incentive structure punishes acting on them.",
    edges: [
      { from: "electoral-cycle", label: "sets horizon for", polarity: "positive", to: "politician-horizon" },
      { from: "politician-horizon", label: "biases toward", polarity: "positive", to: "short-term-benefits" },
      { from: "short-term-benefits", label: "wins", polarity: "positive", to: "votes" },
      { from: "votes", label: "sustains", polarity: "positive", to: "electoral-cycle" },
      { from: "politician-horizon", label: "defers", polarity: "negative", to: "long-term-action" },
      { from: "long-term-action", label: "would reduce", polarity: "negative", to: "future-costs", bend: 15 },
      { from: "future-costs", label: "fall on", polarity: "positive", to: "future-voters" },
      { from: "future-voters", label: "cannot vote in", polarity: "negative", to: "current-elections" },
      { from: "current-elections", label: "determine", polarity: "positive", to: "politician-horizon" },
      { from: "independent-institutions", label: "buffer against", polarity: "negative", to: "politician-horizon", bend: -20 },
    ],
    loops: [
      "R1 — Electoral short-termism: the electoral cycle sets politician horizons, which reward short-term benefits, which win elections, which reinforce the cycle.",
      "B1 — Institutional buffer: independent bodies (fiscal councils, central banks, courts) can partially offset short-termism — but face political pressure when their conclusions are uncomfortable.",
    ],
    nodes: [
      { id: "electoral-cycle", label: "Electoral cycle (4-5 yrs)", tone: "amber", x: 15, y: 15 },
      { id: "politician-horizon", label: "Politician's time horizon", tone: "amber", x: 55, y: 15 },
      { id: "short-term-benefits", label: "Short-term visible benefits", tone: "amber", x: 80, y: 40 },
      { id: "votes", label: "Votes & re-election", tone: "cyan", x: 55, y: 65 },
      { id: "long-term-action", label: "Long-term policy action", tone: "emerald", x: 15, y: 50 },
      { id: "future-costs", label: "Deferred future costs", tone: "rose", x: 15, y: 80 },
      { id: "future-voters", label: "Future generations", tone: "rose", x: 55, y: 88 },
      { id: "current-elections", label: "Current elections", tone: "cyan", x: 80, y: 75 },
      { id: "independent-institutions", label: "Independent institutions", tone: "emerald", x: 80, y: 15 },
    ],
    title: "The electoral time-horizon trap",
  },
  counterArguments: [
    {
      point:
        "Democracies have built long-term institutions before — Social Security, the interstate highway system, the NHS. The short-termism diagnosis is overstated.",
      response:
        "These examples are real, but they were mostly built in specific political moments: post-Depression, post-war, in high-trust high-growth environments with broad electoral coalitions. The question is whether those conditions exist today. Most evidence suggests democracies are now finding long-term investment harder, not easier — pension reform, infrastructure maintenance, and climate action are all stalled or reversing in many countries.",
      title: "Democracies have solved long-term problems before",
    },
    {
      point:
        "The problem isn't the system — it's voters. If voters demanded long-term thinking, politicians would deliver it. Democracy gives people what they want.",
      response:
        "Partly true, but voters' revealed preferences in elections are not the same as their considered preferences. People consistently say in surveys they want action on climate, pension sustainability, and infrastructure — but these issues rarely determine electoral outcomes. The system's structure also shapes what voters focus on: media incentives, campaign finance, and the salience of immediate concerns all push attention toward the short term.",
      title: "Voters get what they vote for",
    },
    {
      point:
        "Independent agencies and technocratic institutions solve this — central banks, independent regulators, and courts are specifically designed to insulate long-term decisions from electoral pressure.",
      response:
        "These institutions do help, and their existence is partly a recognition that electoral politics alone cannot deliver certain long-term goods. But they carry their own costs: democratic accountability is reduced, and they can be captured, defunded, or simply ignored. The ECB's independence didn't prevent the eurozone debt crisis; independent fiscal councils are routinely overridden. They buffer short-termism but don't eliminate it.",
      title: "Independent institutions already solve this",
    },
  ],
  discussionPrompt:
    "Which long-term problems in your country have been consistently deferred across multiple governments? Is the barrier lack of information, lack of political will, voter preference, or something structural about how electoral incentives work?",
  evidenceLinks: [
    {
      note:
        "Democracy data — allows comparison of democratic quality and governance outcomes across countries, relevant for comparing which institutional designs produce better long-term policy.",
      source: "Our World in Data",
      title: "Democracy",
      url: "https://ourworldindata.org/democracy",
    },
    {
      note:
        "Government debt over time — tracks the accumulation of deferred fiscal costs across generations, a direct measure of whether democracies are exporting costs to the future.",
      source: "Our World in Data",
      title: "Government debt",
      url: "https://ourworldindata.org/government-debt",
    },
  ],
  heroHighlights: [
    "The median electoral cycle is 4-5 years. Climate change, pension sustainability, and infrastructure decay operate on 20-50 year timescales. The incentive gap is structural.",
    "Politicians who act on long-term problems typically bear the cost now (taxes, unpopular cuts) and deliver the benefit after they leave office. That's a losing trade under electoral logic.",
    "Future generations, who will bear the cost of today's deferred decisions, cannot vote in current elections. They have no voice in the system that sets their inherited debt.",
  ],
  miniLesson: {
    bands: [
      {
        threshold: 0,
        insight:
          "With a 2-year electoral cycle, almost no policy that costs votes now and pays off later is politically viable. Infrastructure maintenance, pension reform, and climate investment all require time horizons longer than this.",
      },
      {
        threshold: 4,
        insight:
          "At a 4-5 year cycle — the most common in democracies — some medium-term investments are viable, but anything requiring more than one term of sacrifice before visible benefit is politically precarious.",
      },
      {
        threshold: 7,
        insight:
          "At 7 years, politicians can plausibly claim credit for investments that take half a decade to mature. Some infrastructure, education reform, and public health investments begin to look viable. Germany's Schuldenbremse (debt brake) was introduced precisely because it could survive across multiple electoral cycles.",
      },
      {
        threshold: 10,
        insight:
          "At a 10-year term, long-term investment in infrastructure, industrial policy, and climate becomes more feasible — but democratic accountability is substantially weakened. Most research finds this is past the trade-off point where the costs of reduced accountability outweigh the long-term policy gains.",
      },
    ],
    defaultValue: 4,
    description:
      "The longer the electoral cycle, the more long-term problems become politically viable to address — but the weaker the accountability link between voters and their representatives. Move the slider to see how the policy horizon changes.",
    highLabel: "10-year term",
    lowLabel: "2-year cycle",
    metrics: [
      {
        base: -10,
        description: "How many years into the future a re-election-seeking politician rationally plans policy",
        key: "policy-horizon",
        label: "Effective policy horizon",
        max: 12,
        min: 1,
        slope: 1.1,
        suffix: " yrs",
        tone: "emerald",
      },
      {
        base: 95,
        description: "How strongly voters can sanction underperforming governments at the ballot box",
        key: "accountability",
        label: "Democratic accountability",
        max: 100,
        min: 20,
        slope: -7,
        suffix: "/100",
        tone: "cyan",
      },
      {
        base: 5,
        description: "Share of major policy areas where long-term costs are addressed rather than deferred",
        key: "long-term-coverage",
        label: "Long-term policy coverage",
        max: 70,
        min: 5,
        slope: 6,
        suffix: "%",
        tone: "amber",
      },
    ],
    prompt: "Adjust the electoral cycle length to explore the accountability-horizon trade-off.",
    sliderLabel: "Electoral cycle length",
    step: 1,
    title: "The accountability–horizon trade-off",
    unit: " yrs",
    valueMax: 10,
    valueMin: 2,
  },
  realWorldExamples: [
    {
      title: "French pension reform: the math was known for decades",
      insight:
        "France's pension system had been projected as unsustainable since the 1990s. Every government since Balladur (1993) knew that France's pay-as-you-go system would require either higher contributions, lower benefits, or a higher retirement age. Every government also knew that pension reform was the issue most likely to bring down a government through street protest.",
      outcome:
        "Twenty years of demographic drift later, Macron's 2023 pension reform — raising the retirement age from 62 to 64 — had to be pushed through parliament using Article 49.3, which bypasses a vote. The reform was actuarially necessary but politically toxic, demonstrating that the system had no mechanism to act on a known long-term problem until the fiscal pressure became acute.",
    },
    {
      title: "US infrastructure: the maintenance backlog",
      insight:
        "The American Society of Civil Engineers has rated US infrastructure at C- or below in every report card since 1998. The estimated maintenance and investment gap stands at roughly $2.6 trillion over ten years. Roads, bridges, water systems, and the electrical grid all require sustained multi-decade investment that produces diffuse future benefits rather than immediate visible ribbon-cuttings.",
      outcome:
        "Infrastructure investment was deferred across administrations of both parties because it competes with more electorally salient spending, and because the costs of deferred maintenance are invisible until failure. The 2021 Infrastructure Investment and Jobs Act was the first major federal infrastructure bill in decades — passed in an unusual political moment — and is estimated to cover less than half the gap.",
    },
    {
      title: "New Zealand's long-term insights briefing: an institutional fix",
      insight:
        "New Zealand's Treasury introduced a Long-Term Insights Briefing requirement in 2021, mandating that each government department publish a publicly available analysis of major long-term trends and risks every three years, independent of the electoral cycle and government of the day.",
      outcome:
        "It is too early to assess its full impact, but it represents a concrete institutional design to make long-horizon risks visible and public — creating political accountability for ignoring them rather than deferring them. It has been studied as a model by fiscal councils in the UK, Canada, and Australia. The design principle: you cannot act on what you cannot see, and visibility at least removes the excuse.",
    },
  ],
  relatedFrameworks: [
    "Political business cycle theory",
    "Intergenerational equity",
    "Constitutional constraints on fiscal policy (debt brakes, balanced budget rules)",
    "Independent fiscal institutions and parliamentary budget offices",
    "Discount rates in public policy",
    "Future generations commissioners",
  ],
  simulationPrompt:
    "Test how different institutional designs — longer terms, independent fiscal councils, future generations commissioners, or constitutional constraints — affect the policy horizon and democratic accountability trade-off.",
  slug: "why-democracies-struggle-with-long-term-problems",
  simpleExplanation: [
    "The core problem is a mismatch in time horizons. Most democracies hold elections every four to five years. Climate change, pension sustainability, and infrastructure decay operate on twenty to fifty year timescales. A politician who acts on these problems incurs costs now — in political capital, unpopular taxes, or reduced spending elsewhere — while the benefits accrue after they have left office.",
    "This is not primarily a problem of ignorance. Governments have known about pension demographics, infrastructure backlogs, and climate trajectories for decades. The IMF, OECD, and national treasury departments have published the projections repeatedly. The problem is that acting on them is a losing electoral trade: you bear the cost, someone else gets the credit.",
    "Future generations make this worse. The people who will most directly bear the cost of today's deferred decisions — those under 20, those not yet born — cannot vote in current elections. They have no formal voice in the system that is setting their inherited debt, their climate, and their infrastructure. Their interests are systematically underweighted not through malice but through the basic mechanics of electoral accountability.",
    "Several institutional designs attempt to offset this. Independent central banks, fiscal councils, parliamentary budget offices, and courts are all partially insulated from electoral pressure, allowing them to act on longer time horizons. Some countries have introduced future generations commissioners or long-term insights requirements. These help, but they work by reducing democratic control — a real trade-off rather than a clean solution.",
  ],
  systemBug: {
    signals: [
      "Major long-term risks (pension gaps, infrastructure backlogs, climate commitments) are known decades in advance but acted on only under fiscal emergency",
      "Governments consistently borrow more in election years and consolidate after",
      "Infrastructure projects that produce visible benefits before the next election are prioritised over essential maintenance that is invisible until failure",
      "Independent institutions with long time horizons face political pressure when their conclusions challenge short-term government plans",
    ],
    summary:
      "Electoral systems reward visible short-term benefits and punish visible short-term costs. Problems that mature over decades fall outside the politician's rational planning horizon. Future generations — the most affected by today's deferred decisions — have no vote. The system is not broken; it is working as designed. The design is the problem.",
    title: "System bug: the electoral cycle is shorter than the problems that matter most",
  },
  proposals: [
    {
      title: "Create a Future Generations Commissioner with standing to challenge short-termist legislation",
      summary: "Future people cannot vote, but they will bear the consequences of today's decisions. A statutory commissioner — with the power to submit impact assessments and challenge legislation before courts — gives the future a voice in the present.",
      actor: "national_gov",
      domain: "political",
      feasibility: "proven",
      precedents: [
        { place: "Wales", year: 2015, outcome: "Future Generations Commissioner established by law; overturned M4 motorway project on long-term grounds in 2019" },
        { place: "Hungary", year: 2007, outcome: "Ombudsman for Future Generations operated until 2012; challenged several development projects on inter-generational grounds" },
      ],
    },
    {
      title: "Use citizens' assemblies to deliberate on long-term policy challenges",
      summary: "Elected politicians face four-year horizons; randomly-selected citizens do not. Citizens' assemblies on climate, pensions, and infrastructure — with binding or advisory mandates — consistently produce more far-sighted recommendations than parliament.",
      actor: "national_gov",
      domain: "political",
      feasibility: "proven",
      precedents: [
        { place: "Ireland", year: 2017, outcome: "Citizens' Assembly on climate change recommended 10% reduction per year — more ambitious than government position — and was largely adopted" },
        { place: "France", year: 2020, outcome: "150-person Climate Assembly produced 149 measures; several enacted including the constitutional commitment to fight climate change" },
      ],
    },
    {
      title: "Reform budget rules to allow long-term public investment outside deficit calculations",
      summary: "Treating public investment the same as consumption spending in deficit rules forces governments to cut infrastructure during downturns and deprioritise decarbonisation. A 'golden rule' — borrowing for investment is excluded — changes the incentive structure.",
      actor: "national_gov",
      domain: "economic",
      feasibility: "proven",
      precedents: [
        { place: "Germany (pre-2009)", year: 1969, outcome: "Original Basic Law golden rule allowed borrowing for net investment; sustained Autobahn and reunification infrastructure" },
        { place: "UK", year: 1997, outcome: "Golden rule under Blair/Brown: borrowing only for investment over the cycle; enabled NHS and school investment while keeping deficits manageable" },
      ],
    },
  ],
};

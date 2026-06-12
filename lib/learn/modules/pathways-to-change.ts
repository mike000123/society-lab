import type { LearningModule } from "./_types";

export const lessonData: LearningModule = {
    slug: "pathways-to-change",
    betterMetrics: [
      {
        label: "Reform depth index",
        description: "Do proposed changes address root causes or only symptoms?",
      },
      {
        label: "Coalition breadth",
        description: "How many actor types — citizens, institutions, private sector — are aligned?",
      },
      {
        label: "Precedent density",
        description: "How many of the proposed reforms have already worked somewhere?",
      },
    ],
    betterMetricsTitle: "What makes reform actually stick?",
    causalLoop: {
      title: "How reform builds or loses momentum",
      description:
        "Successful systemic change requires aligning narrative, coalition, and institutional opportunity. Each reinforces the others — but each can also stall without the others.",
      nodes: [
        { id: "crisis",    label: "Crisis or scandal",     x: 300, y: 60  },
        { id: "narrative", label: "Shared diagnosis",      x: 560, y: 160 },
        { id: "coalition", label: "Multi-actor coalition", x: 560, y: 340 },
        { id: "window",    label: "Policy window",         x: 300, y: 440 },
        { id: "reform",    label: "Structural reform",     x: 60,  y: 300 },
        { id: "trust",     label: "Public trust in system",x: 60,  y: 160 },
      ],
      edges: [
        { from: "crisis",    to: "narrative", label: "forces",       polarity: "positive" },
        { from: "narrative", to: "coalition", label: "attracts",     polarity: "positive" },
        { from: "coalition", to: "window",    label: "creates",      polarity: "positive" },
        { from: "window",    to: "reform",    label: "enables",      polarity: "positive" },
        { from: "reform",    to: "trust",     label: "rebuilds",     polarity: "positive" },
        { from: "trust",     to: "crisis",    label: "reduces next", polarity: "negative" },
        { from: "narrative", to: "reform",    label: "legitimises",  polarity: "positive" },
      ],
      loops: [
        {
          label:       "Reform momentum loop",
          nodeIds:     ["narrative", "coalition", "window", "reform", "trust"],
          polarity:    "reinforcing",
          description: "When reform builds trust it reduces the conditions for the next crisis — but only if it addresses root causes, not symptoms.",
        },
      ],
    },
    counterArguments: [
      {
        title: "These reforms are politically impossible",
        point:
          "The interests that benefit from the status quo are well-organised and well-funded. They will block any serious reform through lobbying, electoral spending, or simply regulatory capture.",
        response:
          "Every reform on this list was 'impossible' until it happened. Glass-Steagall in 1933, New Zealand's MMP in 1996, Ireland's marriage equality in 2015, the EU's Digital Services Act in 2023 — all faced exactly this objection. Possibility is not a fixed fact; it is a function of crisis, coalition, and narrative. The job is to build all three.",
      },
      {
        title: "Small reforms are just co-optation — the system needs total replacement",
        point:
          "Incremental changes are absorbed by the system without changing its fundamental logic. Only a wholesale transformation of economic and political structures can address root causes.",
        response:
          "History suggests otherwise. The welfare state, environmental regulation, and civil rights were incremental achievements that genuinely shifted power distributions. Total-replacement strategies have frequently produced worse outcomes than the systems they replaced, often by destroying existing coordination while failing to build new institutional capacity. Structural reforms are not co-optation — they are re-engineering.",
      },
      {
        title: "Different countries need different solutions",
        point:
          "What works in Norway or New Zealand does not transfer to countries with different institutional histories, state capacity, or political cultures.",
        response:
          "This is partly true and often overstated. The underlying mechanisms — transparency, accountability, democratic ownership — are portable even if the specific instruments vary. Beneficial ownership registers work in the UK, Kenya, and Latvia. Community land trusts work in Vermont, London, and Brussels. The principle transfers; the detail requires local adaptation.",
      },
    ],
    discussionPrompt:
      "Which of the reforms covered in this module do you think has the highest leverage — the one that, if achieved, would make the most other changes easier? Why?",
    heroHighlights: [
      "Every system explored in this atlas has been reformed somewhere — often under conditions that seemed equally impossible",
      "Structural reforms work by changing the rules, not just the players — they shift what is rational for everyone inside the system",
      "The gap between knowing what is wrong and changing it is a political problem, not a technical one — and political problems have political solutions",
    ],
    miniLesson: {
      title: "How many actors does a reform need?",
      description:
        "Successful structural reforms tend to require alignment across at least three actor types. Move the slider to see what changes when coalitions widen.",
      sliderLabel: "Coalition breadth",
      prompt: "Move the slider to see how coalition breadth affects reform outcomes",
      lowLabel: "Individual actors only",
      highLabel: "Full cross-sector coalition",
      valueMin: 1,
      valueMax: 5,
      defaultValue: 2,
      step: 1,
      unit: "actor types",
      bands: [
        { threshold: 1, insight: "Single-actor campaigns rarely achieve structural change — they can shift awareness but lack the veto power or institutional leverage to change rules." },
        { threshold: 2, insight: "Two aligned actors — e.g. civil society + opposition party — can force issues onto the agenda but usually not through implementation alone." },
        { threshold: 3, insight: "Three actor types (civil society + government + media or private sector) is the historical minimum for most successful structural reforms." },
        { threshold: 4, insight: "Four aligned actors creates enough legitimacy and implementation capacity to sustain reform through backlash and reversal attempts." },
        { threshold: 5, insight: "Full cross-sector coalitions are rare but historically produce the most durable and deep reforms — they change not just rules but norms." },
      ],
      metrics: [
        {
          key:         "success_rate",
          label:       "Reform success rate",
          description: "Historical probability of achieving structural change at this coalition breadth",
          base:        12,
          slope:       18,
          min:         0,
          max:         100,
          suffix:      "%",
          tone:        "emerald",
        },
        {
          key:         "durability",
          label:       "Reform durability",
          description: "Likelihood reform survives the first change of government",
          base:        10,
          slope:       16,
          min:         0,
          max:         100,
          suffix:      "%",
          tone:        "cyan",
        },
        {
          key:         "depth",
          label:       "Structural depth",
          description: "Degree to which reform addresses root causes vs. symptoms",
          base:        8,
          slope:       15,
          min:         0,
          max:         100,
          suffix:      "%",
          tone:        "amber",
        },
      ],
    },
    realWorldExamples: [
      {
        title: "New Zealand's 1996 electoral reform — from impossible to enacted in 6 years",
        outcome:
          "A citizens-led campaign combined with a royal commission, a referendum, and a cross-party coalition transformed New Zealand's electoral system from winner-take-all plurality to mixed-member proportional in under a decade. The reform was declared 'politically impossible' by both major parties — and passed anyway.",
        insight:
          "The key was separating the question of reform from the question of which party would benefit. A randomly-selected citizens' assembly and a binding referendum made it structurally difficult for incumbents to block a change the public clearly wanted.",
      },
      {
        title: "Ireland's constitutional change on same-sex marriage (2015) and abortion (2018)",
        outcome:
          "Two deeply contested social reforms — both long considered politically untouchable in a Catholic-majority country — were achieved through citizens' assemblies followed by referenda. The assemblies produced clear recommendations; the referenda delivered democratic legitimacy that parliament alone could not.",
        insight:
          "Citizens' assemblies are particularly powerful for questions where representative politicians are most risk-averse. Random selection removes the career risk, deliberation produces informed consensus, and the referendum translates it into binding political reality.",
      },
      {
        title: "The OECD Global Minimum Tax (2021) — 136 countries in 10 years",
        outcome:
          "A 15% global minimum corporate tax — dismissed as a fantasy as recently as 2015 — was agreed by 136 jurisdictions in 2021 after a decade of civil society pressure (led by groups like the Tax Justice Network), academic evidence (Zucman's profit-shifting data), and a US administration willing to use its leverage.",
        insight:
          "Global coordination is hard but not impossible. The combination of a credible technical proposal, a window of political alignment, and a hegemon willing to lead (the US Treasury under Yellen) compressed decades of stalemate into months of negotiation.",
      },
    ],
    relatedFrameworks: [
      "Systems thinking",
      "Political economy",
      "Coalition theory",
      "Institutional design",
      "Comparative policy analysis",
    ],
    simpleExplanation: [
      "Every module in this atlas diagnosed a system that produces bad outcomes by design — not by accident or individual malice, but because the rules, incentives, and power distributions inside it lead rational actors to collectively irrational results.",
      "The question this module addresses is: given that diagnosis, what actually changes systems?",
      "The answer from history is not 'the right idea' alone. Ideas are necessary but not sufficient. What changes systems is the combination of a credible alternative, a coalition that spans enough actors to overcome veto power, and a political window — usually opened by crisis — where the costs of the status quo temporarily exceed the costs of change.",
      "The proposals across all modules are not a wish list. They are a menu of proven, precedented interventions — each with a documented example of where it worked, under what conditions, and what it achieved. The question for each is not 'is this possible?' but 'what would it take to make it politically viable here?'",
    ],
    simulationPrompt:
      "Model a reform coalition: which actor types would you assemble first, and what is the minimum viable coalition to overcome the veto players in this system?",
    systemBug: {
      signals: [
        "Reforms are proposed, debated, and then quietly shelved without any stated reason",
        "The same systemic problems recur across election cycles regardless of which party governs",
        "Technical solutions are available but the political will to implement them is consistently absent",
      ],
      summary:
        "The system bug is not a lack of solutions — it is a deficit of political conditions. Good reforms fail not because they are wrong but because the coalitions needed to enact them have not yet been built.",
      title: "System bug: the reform gap between knowing and doing",
    },
    proposals: [
      {
        title: "Establish a standing citizens' assembly with a rotating mandate to review structural reforms",
        summary:
          "A permanent citizens' assembly — with members randomly selected for 2-year terms — would review structural reform proposals from parliament, civil society, and experts, and issue public recommendations. It bridges the gap between expert diagnosis and democratic legitimacy without being subject to electoral short-termism.",
        actor: "national_gov",
        domain: "political",
        feasibility: "emerging",
        precedents: [
          { place: "Belgium (G1000)", year: 2011, outcome: "Citizen deliberation experiment produced 211 concrete reform proposals; influenced subsequent constitutional reform debates" },
          { place: "France (CESE)", year: 2021, outcome: "Economic and Social Council reformed into a permanent Citizens Assembly; first body of this kind embedded in a national constitution" },
        ],
      },
      {
        title: "Create a multi-actor reform commission for each major systemic problem area",
        summary:
          "Rather than leaving reform to single-department government processes, establish time-limited commissions — with mandatory participation from civil society, affected communities, relevant industry, and independent experts — tasked with producing a costed, precedented reform package within 18 months.",
        actor: "national_gov",
        domain: "political",
        feasibility: "proven",
        precedents: [
          { place: "UK (Beveridge Report)", year: 1942, outcome: "Cross-sector commission produced blueprint for the NHS and welfare state; implemented by next government within 5 years" },
          { place: "South Africa (CODESA)", year: 1991, outcome: "Multi-party negotiation produced a new constitutional settlement; model for inclusive reform design under adversarial conditions" },
        ],
      },
      {
        title: "Fund a global open-source repository of reform precedents, evidence, and implementation guides",
        summary:
          "The biggest barrier to reform is often not opposition but ignorance — reformers do not know what has worked elsewhere, under what conditions, and with what adaptations. A maintained, publicly funded database of reform precedents, costing models, and implementation case studies would lower the barrier to evidence-based advocacy in every country.",
        actor: "international",
        domain: "political",
        feasibility: "emerging",
        precedents: [
          { place: "OECD Policy Hub", year: 2018, outcome: "Partial model: curates policy evidence but limited to member countries and excludes civil society use" },
          { place: "What Works Centres (UK)", year: 2013, outcome: "Network of evidence centres for education, crime, health; raised evidence standards in policy areas significantly" },
        ],
      },
      {
        title: "Align governance, individual, and structural action: use the three-level framework",
        summary:
          "Systemic change requires action at three levels simultaneously — individuals shifting behaviour and narrative, institutions changing rules and incentives, and structural reforms changing who holds power. The most effective campaigns treat all three as interdependent rather than competing priorities.",
        actor: "civil_society",
        domain: "political",
        feasibility: "proven",
        precedents: [
          { place: "Norwegian anti-corruption reforms", year: 1995, outcome: "Combined individual whistleblower protections (individual), KRIPOS investigative capacity (institutional), and OECD convention ratification (structural) — reduced corruption across all three levels simultaneously" },
          { place: "UK minimum wage campaign", year: 1997, outcome: "Trade union pressure (civil society), Low Pay Commission (institutional), National Minimum Wage Act (structural) achieved a reform previously considered impossible" },
        ],
      },
    ],
  };

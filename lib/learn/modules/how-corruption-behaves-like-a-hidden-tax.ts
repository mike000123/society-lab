import type { LearningModule } from "./_types";
import { owidEvidenceLinks } from "./_shared";

export const lessonData: LearningModule = {
    betterMetrics: [
      {
        description: "How much extra cost do firms and citizens pay just to pass through the system?",
        label: "Hidden extraction",
      },
      {
        description: "Do permits, contracts, and services depend on informal payments or connections?",
        label: "Gatekeeping risk",
      },
      {
        description: "How much trust is lost because rules are not applied evenly?",
        label: "Institutional trust",
      },
      {
        description: "How much public capacity gets hollowed out by skimming and fear?",
        label: "Service quality",
      },
    ],
    betterMetricsTitle: "How to spot the hidden tax",
    counterArguments: [
      {
        point:
          "Some petty corruption is just a symptom of low wages or weak state capacity, not the real core problem.",
        response:
          "That is often true, but once informal extraction becomes normal, it acts like a tax on everything else and further weakens the very capacity that could solve it.",
        title: "Corruption can be downstream of other weakness",
      },
      {
        point:
          "Small facilitation payments sometimes make slow systems function at all.",
        response:
          "They may create short-term workarounds, but they also lock in a dual system where access depends on cash, status, or connections instead of equal rights.",
        title: "It can feel like lubrication",
      },
    ],
    causalLoop: {
      description:
        "Corruption behaves like a hidden tax because it raises the effective cost of ordinary action while simultaneously hollowing out trust and service quality.",
      edges: [
        { from: "gatekeeping", label: "more discretion", polarity: "positive", to: "bribe-pressure" },
        { from: "bribe-pressure", label: "higher hidden cost", polarity: "positive", to: "business-cost" },
        { from: "business-cost", label: "worse service and prices", polarity: "negative", to: "public-trust" },
        { from: "public-trust", label: "weaker accountability", polarity: "positive", to: "service-quality" },
        { bend: -12, from: "service-quality", label: "more desperate workarounds", polarity: "negative", to: "gatekeeping" },
        { bend: 12, from: "business-cost", label: "demand for shortcuts", polarity: "positive", to: "gatekeeping" },
      ],
      loops: [
        "Reinforcing loop: more gatekeeping creates more bribery pressure, which raises costs and encourages even more informal shortcuts.",
        "Trust loop: when services feel unfair or predatory, public trust falls, making accountability and reform weaker.",
      ],
      nodes: [
        { id: "gatekeeping", label: "Discretionary gatekeepers", tone: "rose", x: 20, y: 20 },
        { id: "bribe-pressure", label: "Bribe pressure", tone: "amber", x: 80, y: 20 },
        { id: "business-cost", label: "Hidden cost on business and citizens", tone: "amber", x: 80, y: 56 },
        { id: "public-trust", label: "Public trust", tone: "emerald", x: 18, y: 56 },
        { id: "service-quality", label: "Service quality", tone: "cyan", x: 20, y: 84 },
      ],
      title: "Causal loop: extraction gets baked into ordinary life",
    },
    discussionPrompt:
      "Where have you seen corruption function less like a scandal and more like an everyday tax on time, money, or dignity?",
    heroHighlights: [
      "Corruption is not only dramatic theft; it is also friction, delay, and unequal access built into everyday systems.",
      "It behaves like a hidden tax because people pay more and receive less.",
      "The cost shows up in prices, fear, lower trust, and weaker public capacity.",
    ],
    miniLesson: {
      bands: [
        {
          insight:
            "Lower gatekeeping discretion reduces the need for side payments and makes the system feel more predictable and equal.",
          threshold: 0,
        },
        {
          insight:
            "As discretion rises, informal payments and delays start to behave like a tax layered on top of formal rules.",
          threshold: 35,
        },
        {
          insight:
            "At high discretion, extraction becomes normal and trust collapses because people expect access to depend on favors or money.",
          threshold: 65,
        },
      ],
      defaultValue: 30,
      description:
        "This mini lesson frames corruption as a system cost, not only a moral problem. It quietly raises prices, delays, and uncertainty across the whole economy.",
      highLabel: "High gatekeeping discretion",
      lowLabel: "Low gatekeeping discretion",
      metrics: [
        {
          base: 10,
          description: "How likely people are to meet bribe requests or informal tolls.",
          key: "bribes",
          label: "Bribe pressure",
          max: 100,
          min: 0,
          slope: 0.95,
          suffix: "/100",
          tone: "rose",
        },
        {
          base: 14,
          description: "Extra cost layered onto permits, services, and market activity.",
          key: "cost",
          label: "Hidden tax load",
          max: 100,
          min: 0,
          slope: 0.82,
          suffix: "/100",
          tone: "amber",
        },
        {
          base: 96,
          description: "The sense that institutions work the same way for everyone.",
          key: "trust",
          label: "Institutional trust",
          max: 100,
          min: 0,
          slope: -0.84,
          suffix: "/100",
          tone: "emerald",
        },
      ],
      prompt: "Move the discretion slider to see how everyday extraction spreads.",
      sliderLabel: "Discretionary gatekeeping",
      step: 1,
      title: "Mini lesson: informal extraction is still extraction",
      unit: "%",
      valueMax: 100,
      valueMin: 0,
    },
    realWorldExamples: [
      {
        title: "Brazil's Lava Jato: procurement as an extraction system",
        insight:
          "Operation Car Wash (Lava Jato), which began in 2014, revealed that Brazil's largest construction firms had paid 1–3% of every major public contract value to government officials and political parties for at least a decade. Petrobras, the state oil company, was the central node — $2B+ in bribes were identified across hundreds of contracts.",
        outcome:
          "The firms compensated by inflating contract prices, passing the bribery cost directly to the public. Lava Jato implicated over 200 politicians across 12 parties and showed how systemic procurement corruption is not episodic but structural — it raises the effective cost of all public infrastructure while producing lower-quality output.",
      },
      {
        title: "Italy's Tangentopoli: the 10% informal surcharge",
        insight:
          "Italy's 'Clean Hands' investigations in 1992–1993 revealed that kickbacks on public contracts — la tangente — had become so normalised that a 10–15% surcharge on contract value was simply budgeted in by firms. Every party in the governing coalition received a share; the system had operated for decades.",
        outcome:
          "The total cost was estimated at roughly 4% of GDP annually in inflated contracts and diverted public funds. The investigations brought down the entire postwar political class — the Christian Democrats, the Socialists, and dozens of senior officials — but revealed the cost not of occasional corruption but of institutionalised extraction embedded in ordinary government procurement.",
      },
      {
        title: "India's 2G spectrum scandal: licences priced to enrich, not to raise revenue",
        insight:
          "In 2008, India's telecoms ministry awarded 2G mobile spectrum licences at 2001 prices on a first-come-first-served basis, ignoring competitive auction. The Comptroller and Auditor General estimated the cost to public revenue at between $30–39 billion — the difference between the price charged and market value.",
        outcome:
          "The licences were quickly resold at market prices, capturing the gap as private profit. The scandal led to the cancellation of 122 licences by the Supreme Court in 2012. It illustrated how corruption does not always involve cash bribes — it can operate through administrative rules that transfer public assets to private parties at below-market prices.",
      },
    ],
    evidenceLinks: [owidEvidenceLinks.corruption, owidEvidenceLinks.stateCapacity, owidEvidenceLinks.taxation],
    relatedFrameworks: [
      "Institutional economics",
      "Hidden tax framing",
      "State capacity",
      "Causal loop mapping",
    ],
    simulationPrompt:
      "Test a scenario with fewer discretionary chokepoints, stronger transparency, and better frontline wages and enforcement.",
    simulatorSlug: "purchasing-power",
    simpleExplanation: [
      "Corruption is often described as theft, but systemically it behaves more like a hidden tax. It raises the cost of getting basic things done while lowering the quality and fairness of what people receive.",
      "A bribe, a gatekeeper's favor, or a politically connected shortcut all mean the rules are no longer equal. That weakens trust and encourages everyone else to play defensively too.",
      "The result is an economy and a public sphere with more friction, more fear, and lower state capacity than the formal budget or tax code would suggest.",
    ],
    slug: "how-corruption-behaves-like-a-hidden-tax",
    systemBug: {
      signals: [
        "People pay extra in time, cash, or connections just to access formal rights or services.",
        "Service quality falls because money and attention are diverted away from the public mission.",
        "Trust collapses because people assume equal rules do not really exist.",
      ],
      summary:
        "The system creates chokepoints where private extraction becomes possible, and that extraction spreads through prices, delays, and lost trust.",
      title: "System bug: informal tollbooths appear inside formal institutions",
    },
  proposals: [
    {
      title: "Establish independent anti-corruption agencies with prosecutorial authority",
      summary: "Corruption persists where enforcement is captured by the same networks it is meant to police. Independent agencies with secure budgets, civil-service tenure, and power to prosecute sitting officials break that cycle.",
      actor: "national_gov",
      domain: "legal",
      feasibility: "proven",
      precedents: [
        { place: "Hong Kong (ICAC)", year: 1974, outcome: "Reduced corruption from endemic to one of Asia's lowest rates within a decade through independent prosecution and public reporting" },
        { place: "Latvia (KNAB)", year: 2002, outcome: "Established with operational independence; prosecuted senior officials and enabled EU accession benchmarks" },
      ],
    },
    {
      title: "Mandate public beneficial ownership registers for companies and trusts",
      summary: "Shell companies are the primary vehicle for corruption proceeds. Requiring all legal entities to disclose their ultimate human owner — in a public, searchable register — eliminates the anonymity that makes corrupt capital safe.",
      actor: "national_gov",
      domain: "legal",
      feasibility: "proven",
      precedents: [
        { place: "UK", year: 2016, outcome: "Register of People with Significant Control exposed previously anonymous owners; adopted by 100+ countries in some form" },
        { place: "EU", year: 2018, outcome: "5th Anti-Money Laundering Directive required public beneficial ownership registers across member states" },
      ],
    },
    {
      title: "Protect and financially reward whistleblowers who expose public corruption",
      summary: "Inside information is the most reliable corruption detector. Strong legal protection from retaliation, combined with a share of recovered assets, changes the calculus for insiders who know where the money went.",
      actor: "national_gov",
      domain: "legal",
      feasibility: "proven",
      precedents: [
        { place: "USA (Dodd-Frank)", year: 2010, outcome: "Whistleblower programme recovered $6bn+ in fraud by 2023; awards of 10-30% of sanctions over $1m" },
        { place: "South Korea", year: 2001, outcome: "Anti-Corruption Act with cash rewards triggered thousands of public-sector disclosures" },
      ],
    },
  ],

  };

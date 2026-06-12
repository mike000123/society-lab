import type { LearningModule } from "./_types";
import { owidEvidenceLinks } from "./_shared";

export const lessonData: LearningModule = {
    betterMetrics: [
      {
        description:
          "How quickly a movement can capture, verify, and spread a concrete event or testimony before gatekeepers suppress it.",
        label: "Documentation speed",
      },
      {
        description:
          "How easy it is for new participants to join, repost, donate, attend, or self-organize without waiting for a formal hierarchy.",
        label: "Entry barrier",
      },
      {
        description:
          "Whether there are organizations, leaders, or institutions that can turn viral attention into negotiation, policy, or durable pressure.",
        label: "Institutional depth",
      },
      {
        description:
          "How consistently the movement can keep a shared narrative when platforms reward speed, novelty, and fragmentation.",
        label: "Narrative coherence",
      },
    ],
    betterMetricsTitle: "Signals that a networked movement can last beyond virality",
    counterArguments: [
      {
        point:
          "Hashtag movements are not real movements because posting is easier than organizing.",
        response:
          "Low-cost posting can be shallow, but it can also perform a real movement function: witnessing, recruitment, mutual recognition, fundraising, and rapid agenda setting. The real question is what offline and institutional structures follow.",
        title: "Digital activism is only slacktivism",
      },
      {
        point:
          "Leaderless networked movements are always better because no one can be co-opted or arrested.",
        response:
          "Loose networks are flexible, but they can also struggle to negotiate, maintain strategy, or survive attention cycles. Horizontal energy and organizational depth are not the same thing.",
        title: "Leaderless always means stronger",
      },
      {
        point:
          "If a movement trends globally, success is basically guaranteed.",
        response:
          "Virality can shift culture or trigger protest quickly, but institutions still matter. Without strategy, coalition partners, or policy channels, even massive attention can fade without durable change.",
        title: "Virality equals victory",
      },
    ],
    causalLoop: {
      description:
        "Networked movements scale when smartphones and platforms make witnessing instant. Viral evidence lowers entry barriers, pulls people into public action, and pressures institutions. But if institutional depth stays weak, the movement can peak faster than it consolidates.",
      edges: [
        { from: "smartphoneWitness", label: "creates", polarity: "positive", to: "viralEvidence" },
        { from: "viralEvidence", label: "drives", polarity: "positive", to: "publicAttention" },
        { from: "publicAttention", label: "lowers", polarity: "positive", to: "participantEntry" },
        { from: "participantEntry", label: "expands", polarity: "positive", to: "streetAndNetworkAction" },
        { from: "streetAndNetworkAction", label: "raises", polarity: "positive", to: "institutionalPressure" },
        { from: "institutionalPressure", label: "produces", polarity: "positive", to: "policyOrCulturalShift" },
        { from: "policyOrCulturalShift", label: "sustains", polarity: "positive", to: "publicAttention" },
        { from: "platformVolatility", label: "fragments", polarity: "negative", to: "publicAttention" },
        { from: "weakOrganizations", label: "reduces", polarity: "negative", to: "policyOrCulturalShift" },
        { from: "streetAndNetworkAction", label: "exposes need for", polarity: "positive", to: "organizations" },
        { from: "organizations", label: "reduces", polarity: "negative", to: "weakOrganizations" },
      ],
      loops: [
        "Reinforcing: viral evidence -> attention -> low-barrier entry -> collective action -> institutional pressure -> cultural or policy shift",
        "Balancing: platform volatility and weak organizations can make a movement peak quickly without translating its energy into durable wins",
      ],
      nodes: [
        { id: "smartphoneWitness", label: "Smartphone witness", tone: "cyan", x: 80, y: 60 },
        { id: "viralEvidence", label: "Viral evidence", tone: "rose", x: 280, y: 40 },
        { id: "publicAttention", label: "Public attention", tone: "amber", x: 500, y: 100 },
        { id: "participantEntry", label: "Low-barrier entry", tone: "emerald", x: 500, y: 260 },
        { id: "streetAndNetworkAction", label: "Street and network action", tone: "emerald", x: 280, y: 320 },
        { id: "institutionalPressure", label: "Institutional pressure", tone: "amber", x: 80, y: 280 },
        { id: "policyOrCulturalShift", label: "Policy or cultural shift", tone: "emerald", x: 80, y: 160 },
        { id: "platformVolatility", label: "Platform volatility", tone: "rose", x: 500, y: 420 },
        { id: "weakOrganizations", label: "Weak organizations", tone: "rose", x: 280, y: 500 },
        { id: "organizations", label: "Durable organizations", tone: "cyan", x: 80, y: 460 },
      ],
      title: "The networked movement loop",
    },
    discussionPrompt:
      "What is the real difference between a movement that trends and a movement that changes institutions? At what point does networked speed become a substitute for organization rather than a complement to it?",
    heroHighlights: [
      "Smartphones and platforms let movements document events before traditional gatekeepers can erase them.",
      "Networked movements can scale extremely fast, but their durability depends on what exists beyond the feed.",
      "The biggest turning points often come when online witness spills into courts, workplaces, streets, schools, or legislatures.",
    ],
    miniLesson: {
    bands: [
      {
        threshold: 0,
        insight:
          "With no algorithmic amplification, movements spread at organic pace — weeks to build reach, relying on committed organisers. Slower growth means more time to establish structure, develop leadership, and maintain message coherence.",
      },
      {
        threshold: 9,
        insight:
          "At 10× amplification — roughly early social media circa 2010–2013 — mobilisation can happen in days rather than months. The Arab Spring and early Black Lives Matter demonstrations spread at this pace: fast enough to surprise authorities, slow enough to maintain some coherence.",
      },
      {
        threshold: 24,
        insight:
          "At 25× amplification, the platform's engagement optimisation actively selects for content that provokes strong emotional reactions. Outrage, fear, and in-group signalling spread fastest. The movement's message gets simplified into the most shareable version, often distorting the original intent.",
      },
      {
        threshold: 40,
        insight:
          "At 40–50× amplification, a hashtag can reach millions in hours. But the movement that arrives at scale bears little resemblance to the one that started: fringe additions, adversarial co-option, and platform-driven fragmentation mean the original organisers have lost control of the narrative.",
      },
    ],
    defaultValue: 15,
    description:
      "Platform algorithm amplification can scale a movement from thousands to millions in days — but viral spread trades speed for coherence and durability. Adjust the amplification factor to explore the trade-off.",
    highLabel: "50× (engagement-max)",
    lowLabel: "1× (no algorithm)",
    metrics: [
      {
        base: 180,
        description: "Days from founding to 1 million active participants",
        key: "days-to-million",
        label: "Days to 1 million participants",
        max: 180,
        min: 2,
        slope: -3.63,
        suffix: " days",
        tone: "cyan",
      },
      {
        base: 85,
        description: "Share of the original organising message that survives intact after viral spread",
        key: "message-coherence",
        label: "Message coherence",
        max: 85,
        min: 10,
        slope: -1.53,
        suffix: "%",
        tone: "emerald",
      },
      {
        base: 60,
        description: "Probability that the movement maintains active organising more than 12 months after peak",
        key: "durability",
        label: "Sustained >12 months",
        max: 60,
        min: 15,
        slope: -0.92,
        suffix: "%",
        tone: "amber",
      },
    ],
    prompt: "Adjust the amplification factor to explore the viral speed vs coherence trade-off.",
    sliderLabel: "Platform amplification factor",
    step: 1,
    title: "The viral speed vs coherence trade-off",
    unit: "×",
    valueMax: 50,
    valueMin: 1,
  },
    realWorldExamples: [
      {
        insight:
          "The Arab Spring showed how digital platforms could accelerate witness, coordination, and symbolic occupation of space, while also revealing the limits of rapid mobilization without stable post-revolt institutions.",
        outcome:
          "Networked protest helped shatter the aura of inevitability around several regimes, but political outcomes diverged sharply depending on military power, organization, and institutional succession.",
        title: "Arab Spring and the speed of networked revolt",
      },
      {
        insight:
          "The #MeToo movement spread because a simple digital frame let survivors convert isolated experience into collective visibility at global scale.",
        outcome:
          "The movement changed workplace norms, public language, and accountability expectations in many countries, even though reforms and enforcement remained uneven.",
        title: "#MeToo and testimony at scale",
      },
      {
        insight:
          "Black Lives Matter demonstrated the political force of viral witness, while youth climate mobilization showed how platforms can help turn scattered anxiety into recurring public action.",
        outcome:
          "Videos, hashtags, and school strikes helped move police violence and climate urgency toward the center of public debate, while also exposing how hard it is to convert cultural attention into consistent institutional change.",
        title: "Black Lives Matter and youth climate mobilization",
      },
    ],
    evidenceLinks: [owidEvidenceLinks.internet, owidEvidenceLinks.humanRights],
    relatedFrameworks: [
      "Connective action",
      "Platform politics",
      "Witnessing",
      "Agenda setting",
      "Hybrid online-offline mobilization",
    ],
    simulationPrompt:
      "Compare a digital movement with viral witness and strong local organizations against one that trends globally but lacks durable leadership, coalition partners, and policy channels.",
    simulatorSlug: "social-movements",
    simpleExplanation: [
      "Networked digital movements differ from earlier movements because the first act is often witnessing. A phone camera, post, or hashtag can make a local event visible to millions before journalists, employers, or states can fully control the story.",
      "That lowers the cost of participation. People can identify with a frame, share testimony, donate, attend a protest, or self-organize quickly. This is one reason modern movements can grow much faster than earlier print or industrial-era movements.",
      "But speed is not enough. Durable change still requires organization, coalition-building, legal strategy, bargaining power, or electoral channels. Otherwise the movement may win a cultural moment without winning institutional change.",
      "Their turning points are often double-edged. They can rapidly change what is discussable and what evidence the public accepts, yet they also operate inside platforms built for novelty, fragmentation, and attention churn. That makes the leap from visibility to durable power especially hard.",
    ],
    slug: "how-networked-digital-movements-scale",
    systemBug: {
      signals: [
        "Public debate confuses attention with power and treats trending visibility as if it were already reform.",
        "Platforms make entry easy but also fragment memory, strategy, and accountability.",
        "Movements are judged either as complete failures or instant victories without tracing what happens after the viral peak.",
      ],
      summary:
        "The deep bug is a mismatch between communication speed and institutional speed. Platforms let collective awareness form almost instantly, but law, workplaces, and states still change slowly unless someone organizes the bridge.",
      title: "System bug: attention moves faster than institutions",
    },
  proposals: [
    {
      title: "Require social platforms to offer genuine chronological feeds and disable default algorithmic amplification",
      summary: "Algorithmic amplification turbocharges movement spread — but also manipulation and polarisation. Giving users a genuine choice between chronological and algorithmic feeds, with chronological as a real option, restores user agency over attention.",
      actor: "national_gov",
      domain: "media",
      feasibility: "emerging",
      precedents: [
        { place: "EU (DSA)", year: 2023, outcome: "Digital Services Act requires Very Large Platforms to offer at least one recommendation system not based on profiling; in force from 2024" },
        { place: "Twitter/X", year: 2022, outcome: "Following tab (chronological) introduced under user pressure; evidence of improved information quality in experimental studies" },
      ],
    },
    {
      title: "Protect end-to-end encrypted communications from backdoor mandates",
      summary: "Digital movements depend on private, secure organising. Government mandates for encryption backdoors create vulnerabilities that authoritarian states exploit to identify and suppress activists globally.",
      actor: "international",
      domain: "legal",
      feasibility: "contested",
      precedents: [
        { place: "EU", year: 2023, outcome: "Chat Control proposal to scan encrypted messages faced mass civil society opposition; delayed repeatedly due to encryption protection arguments" },
        { place: "USA", year: 2016, outcome: "Apple vs FBI: Apple refused to create iPhone backdoor; set precedent that strong encryption cannot be mandated broken" },
      ],
    },
  ],

  };

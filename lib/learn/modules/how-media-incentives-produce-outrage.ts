import type { LearningModule } from "./_types";

export const lessonData: LearningModule = {
    betterMetrics: [
      {
        description: "Are platforms rewarding verified understanding or raw reaction?",
        label: "Nuance capacity",
      },
      {
        description: "How much trust remains after repeated outrage cycles?",
        label: "Trust resilience",
      },
      {
        description: "Do correction, context, and slower reporting get reach too?",
        label: "Truth incentives",
      },
      {
        description: "Can people disagree without being shoved into enemy narratives?",
        label: "Deliberative quality",
      },
    ],
    betterMetricsTitle: "Signals beyond raw engagement",
    counterArguments: [
      {
        point:
          "Outrage can be appropriate when something genuinely unjust or dangerous is happening.",
        response:
          "Absolutely. The issue is when platforms structurally over-reward outrage because it performs well commercially, even when calmer truth-seeking would serve the public better.",
        title: "Some outrage is justified",
      },
      {
        point:
          "High-engagement media is sometimes the only way serious issues break through public apathy.",
        response:
          "Attention matters, but the long-term question is whether the system leaves people better informed or merely more activated and less grounded.",
        title: "Emotion can mobilize attention",
      },
    ],
    causalLoop: {
      description:
        "When attention is monetized, emotionally extreme content often wins. That creates a feedback loop between outrage, engagement, and platform incentives.",
      edges: [
        { from: "outrage-reward", label: "boosts reach", polarity: "positive", to: "sensational-content" },
        { from: "sensational-content", label: "stronger reactions", polarity: "positive", to: "engagement" },
        { from: "engagement", label: "ad revenue", polarity: "positive", to: "platform-incentives" },
        { bend: 12, from: "platform-incentives", label: "train the feed", polarity: "positive", to: "outrage-reward" },
        { from: "sensational-content", label: "reduces context", polarity: "negative", to: "nuance" },
        { from: "nuance", label: "protects trust", polarity: "positive", to: "public-trust" },
        { bend: -14, from: "public-trust", label: "less paranoia demand", polarity: "negative", to: "outrage-reward" },
      ],
      loops: [
        "Reinforcing loop: outrage earns engagement, engagement earns revenue, and revenue pushes platforms to reward more outrage.",
        "Balancing loop: stronger context, slower reporting, and better trust can reduce the demand for reflexive enemy narratives.",
      ],
      nodes: [
        { id: "outrage-reward", label: "Reward for outrage", tone: "rose", x: 20, y: 18 },
        { id: "sensational-content", label: "Sensational content", tone: "rose", x: 80, y: 18 },
        { id: "engagement", label: "Engagement spikes", tone: "amber", x: 80, y: 54 },
        { id: "platform-incentives", label: "Platform incentives", tone: "amber", x: 18, y: 54 },
        { id: "nuance", label: "Nuance and context", tone: "cyan", x: 20, y: 84 },
        { id: "public-trust", label: "Public trust", tone: "emerald", x: 80, y: 84 },
      ],
      title: "Causal loop: attention markets reward emotional intensity",
    },
    discussionPrompt:
      "Where have you noticed a platform or news format push you toward reaction before understanding?",
    heroHighlights: [
      "Outrage is often profitable even when it is socially corrosive.",
      "Feeds and headlines shape emotional tempo, not just information flow.",
      "A healthier media system would reward context, correction, and slower public judgment.",
    ],
    miniLesson: {
      bands: [
        {
          insight:
            "When outrage reward is low, people can spend more time with context and less time being whipped into reaction.",
          threshold: 0,
        },
        {
          insight:
            "As outrage reward rises, engagement improves quickly, but nuance and trust begin to fall away.",
          threshold: 40,
        },
        {
          insight:
            "At high reward levels, the system starts training users, creators, and journalists into constant escalation.",
          threshold: 70,
        },
      ],
      defaultValue: 50,
      description:
        "This lesson shows the platform trade-off: what grows fastest in an attention market is not always what helps a public think well.",
      highLabel: "High outrage reward",
      lowLabel: "Low outrage reward",
      metrics: [
        {
          base: 20,
          description: "How strongly content is optimized for anger and shock.",
          key: "engagement",
          label: "Engagement spikes",
          max: 100,
          min: 0,
          slope: 0.9,
          suffix: "/100",
          tone: "amber",
        },
        {
          base: 94,
          description: "How much space remains for context, nuance, and slower judgment.",
          key: "nuance",
          label: "Nuance capacity",
          max: 100,
          min: 0,
          slope: -0.8,
          suffix: "/100",
          tone: "cyan",
        },
        {
          base: 92,
          description: "How likely the public is to trust one another and shared information.",
          key: "trust",
          label: "Public trust",
          max: 100,
          min: 0,
          slope: -0.76,
          suffix: "/100",
          tone: "emerald",
        },
      ],
      prompt: "Move the slider and watch what the attention market optimizes for.",
      sliderLabel: "Reward for outrage in the feed",
      step: 1,
      title: "Mini lesson: the feed learns what makes you react",
      unit: "%",
      valueMax: 100,
      valueMin: 0,
    },
    realWorldExamples: [
      {
        insight:
          "MIT researchers found that false news on Twitter spread farther, faster, deeper, and more broadly than true news, especially in politics.",
        outcome:
          "Novelty and emotional charge had a structural edge in the attention market, helping falsehood outperform correction even without assuming a giant army of bots caused the whole effect.",
        title: "False news outruns true news",
      },
      {
        insight:
          "Yale researchers showed that likes and shares can train people to express more moral outrage online because outrage gets socially rewarded on platforms.",
        outcome:
          "People are not only reacting to outrage. They are learning that outrage is a successful performance inside the system.",
        title: "The feed teaches outrage",
      },
      {
        insight:
          "A Nature Human Behaviour study of headline experiments found that negative words increase click-through rates in online news.",
        outcome:
          "Editors and publishers face a measurable incentive to make headlines darker, sharper, and more threatening than calmer wording would be.",
        title: "Negative headlines get rewarded",
      },
      {
        insight:
          "Once a hot claim wins the first round of attention, later corrections usually reach a smaller and less emotionally primed audience.",
        outcome:
          "Even when the record is fixed later, the first outrage object often remains what people remember and organize around.",
        title: "Corrections lose the race",
      },
    ],
    evidenceLinks: [
      {
        note:
          "A canonical study showing that false stories can outperform true ones in reach and speed inside social platforms.",
        source: "MIT News / Science",
        title: "Study: On Twitter, false news travels faster than true stories",
        url: "https://news.mit.edu/2018/study-twitter-false-news-travels-faster-true-stories-0308",
      },
      {
        note:
          "Helpful for the mechanism: platform feedback does not just reward outrage, it can train users to produce more of it.",
        source: "Yale News",
        title: "Likes and shares teach people to express more outrage online",
        url: "https://news.yale.edu/2021/08/13/likes-and-shares-teach-people-express-more-outrage-online",
      },
      {
        note:
          "Useful for headline economics: negativity wins clicks even when outlets are running large-scale tests rather than guessing.",
        source: "Nature Human Behaviour",
        title: "Negativity drives online news consumption",
        url: "https://www.nature.com/articles/s41562-023-01538-4",
      },
    ],
    relatedFrameworks: [
      "Attention economics",
      "Incentive design",
      "Moral contagion",
      "System dynamics",
      "Information ecology",
    ],
    simulationPrompt:
      "Test a scenario where feeds reward verified context, slower amplification, and cross-perspective exposure.",
    simpleExplanation: [
      "Modern media systems often make money from attention, and attention is not neutral. Human beings react faster to threat, conflict, status challenge, and outrage than to calm complexity.",
      "That means the platform can reward emotionally intense content even when that content makes people less informed or more divided.",
      "The result is a public sphere that becomes quicker to react and slower to understand. Outrage is not invented from nowhere, but the incentive structure can turn every issue into a heightened conflict format.",
    ],
    slug: "how-media-incentives-produce-outrage",
    systemBug: {
      signals: [
        "Emotionally loaded content gets amplified faster than careful context.",
        "Corrections underperform compared with the original outrage object.",
        "Creators learn that certainty and conflict are rewarded more than precision.",
      ],
      summary:
        "The platform gets paid when users stay activated, so content design gravitates toward what reliably triggers reaction.",
      title: "System bug: what is profitable to amplify is not always healthy to absorb",
    },
  proposals: [
    {
      title: "Mandate algorithm transparency and third-party auditing for large social platforms",
      summary: "Engagement-maximisation algorithms that amplify outrage are proprietary and unaccountable. Requiring platforms to publish ranking criteria and submit to independent audits creates accountability without requiring the state to dictate content.",
      actor: "national_gov",
      domain: "media",
      feasibility: "emerging",
      precedents: [
        { place: "EU (DSA)", year: 2023, outcome: "Digital Services Act requires Very Large Online Platforms to conduct systemic risk assessments and submit to audit; in force from August 2023" },
        { place: "UK (OSA)", year: 2023, outcome: "Online Safety Act requires Ofcom-supervised risk assessments for platforms accessible to children" },
      ],
    },
    {
      title: "Fund independent public interest journalism through a levy on digital advertising revenue",
      summary: "Commercial media collapse has not been matched by public replacement. A small levy of 1-2% on digital ad revenues directed to an arms-length press fund can sustain investigative and local journalism without state editorial influence.",
      actor: "national_gov",
      domain: "media",
      feasibility: "emerging",
      precedents: [
        { place: "France", year: 2009, outcome: "Government press aid supports 9,000 newspapers; arms-length commission decides allocation" },
        { place: "Canada", year: 2019, outcome: "Journalism Tax Credit and Local Journalism Initiative funded 500+ local reporters in under-served communities" },
      ],
    },
    {
      title: "Introduce media literacy as a core subject from age 10, including algorithmic education",
      summary: "The most durable defence against manipulation is a population that understands how attention is engineered. Structured curricula teaching source evaluation, algorithmic amplification, and emotional manipulation techniques builds a citizenry harder to exploit.",
      actor: "national_gov",
      domain: "media",
      feasibility: "proven",
      precedents: [
        { place: "Finland", year: 2014, outcome: "Media literacy integrated across all subjects from primary school; Finland ranks highest in EU for resistance to misinformation" },
        { place: "Estonia", year: 2007, outcome: "Digital literacy curriculum post-Russian disinformation attacks; students test among highest in Europe for identifying fake news" },
      ],
    },
  ],

  };

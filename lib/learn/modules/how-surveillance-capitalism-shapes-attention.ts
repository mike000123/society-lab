import type { LearningModule } from "./_types";

export const lessonData: LearningModule = {
    betterMetrics: [
      { description: "How much of each person's online activity is tracked, stored, and monetized without meaningful consent.", label: "Behavioral data extraction rate" },
      { description: "The share of digital infrastructure revenue derived from behavioral prediction products.", label: "Prediction product revenue share" },
      { description: "Whether individuals can meaningfully opt out without losing access to essential services.", label: "Exit cost from surveillance systems" },
      { description: "Correlation between algorithmic amplification scores and emotional arousal content.", label: "Outrage amplification coefficient" },
    ],
    betterMetricsTitle: "Measure these alongside platform engagement and ad revenue",
    counterArguments: [
      {
        point: "Personalization improves user experience — people see content and products more relevant to them.",
        response: "Relevance and manipulation are not the same thing. Behavioral prediction systems optimize for engagement, not for user satisfaction or accuracy.",
        title: "Personalization benefits users",
      },
      {
        point: "Users consent to data collection through terms of service and can choose not to use platforms.",
        response: "Consent through a 10,000-word legal document, accepted under social and professional pressure, is not meaningful informed consent.",
        title: "Users consent freely",
      },
      {
        point: "The data economy produced enormous value: free services, rapid product innovation, and connectivity for billions.",
        response: "The services are not free — they are paid in behavioral data. The question is whether the value extracted from users is proportional to the value they receive.",
        title: "The attention economy created enormous value",
      },
    ],
    causalLoop: {
      description: "Platforms maximize engagement by amplifying emotionally arousing content. More engagement generates behavioral data that improves prediction accuracy, enabling higher ad prices, funding further attention extraction infrastructure.",
      edges: [
        { from: "attention_extraction", label: "generates", polarity: "positive", to: "behavioral_data" },
        { from: "behavioral_data", label: "trains", polarity: "positive", to: "prediction_models" },
        { from: "prediction_models", label: "increase", polarity: "positive", to: "ad_price" },
        { from: "ad_price", label: "funds", polarity: "positive", to: "platform_investment" },
        { from: "platform_investment", label: "improves", polarity: "positive", to: "attention_extraction" },
        { from: "attention_extraction", label: "requires", polarity: "positive", to: "outrage_amplification" },
        { from: "outrage_amplification", label: "degrades", polarity: "negative", to: "public_discourse" },
        { from: "public_discourse", label: "weakens", polarity: "negative", to: "epistemic_quality" },
      ],
      loops: [
        "Reinforcing: attention → behavioral data → prediction accuracy → ad revenue → more attention infrastructure",
        "Balancing (slow): regulatory backlash, user burnout, advertiser brand safety concerns",
      ],
      nodes: [
        { id: "attention_extraction", label: "Attention extraction", tone: "rose", x: 80, y: 160 },
        { id: "behavioral_data", label: "Behavioral data", tone: "amber", x: 280, y: 60 },
        { id: "prediction_models", label: "Prediction accuracy", tone: "amber", x: 480, y: 60 },
        { id: "ad_price", label: "Ad price premium", tone: "emerald", x: 560, y: 200 },
        { id: "platform_investment", label: "Platform investment", tone: "cyan", x: 420, y: 320 },
        { id: "outrage_amplification", label: "Outrage amplification", tone: "rose", x: 80, y: 320 },
        { id: "public_discourse", label: "Public discourse quality", tone: "cyan", x: 240, y: 400 },
        { id: "epistemic_quality", label: "Epistemic quality", tone: "cyan", x: 420, y: 400 },
      ],
      title: "The behavioral extraction loop",
    },
    discussionPrompt: "Can the attention economy be reformed from inside through better design or regulation, or does monetizing human attention inevitably corrupt the information environment?",
    heroHighlights: [
      "Shoshana Zuboff named the business model: behavioral data is extracted at scale, processed into prediction products, and sold to advertisers — human experience is the raw material.",
      "Engagement optimization algorithms consistently surface anger, fear, and outrage because these emotions produce higher dwell time and sharing.",
      "An estimated 5,000–10,000 data points are held on each active user of major platforms.",
    ],
    miniLesson: {
      bands: [
        { insight: "Low behavioral monetization. Platforms funded by subscriptions or public models. Algorithmic amplification is modest.", threshold: 20 },
        { insight: "Mixed model. Behavioral data collected but the outrage-engagement loop is not fully dominant.", threshold: 45 },
        { insight: "Engagement optimization dominant. Emotional and divisive content structurally amplified across the feed.", threshold: 70 },
        { insight: "Full surveillance capitalism. Behavioral prediction is the core product. Public discourse shaped around maximum engagement extraction.", threshold: 90 },
      ],
      defaultValue: 70,
      description: "Adjust how deeply the behavioral prediction business model dominates the platform economy.",
      highLabel: "Full surveillance capitalism",
      lowLabel: "Minimal behavioral monetization",
      metrics: [
        { base: 18, description: "Share of algorithmically distributed content that is emotionally negative or divisive.", key: "outrage_share", label: "Outrage content amplification", max: 100, min: 0, slope: 0.58, suffix: "%", tone: "rose" },
        { base: 72, description: "User ability to understand and meaningfully control what data is collected and how it is used.", key: "autonomy", label: "Informational autonomy", max: 100, min: 0, slope: -0.52, suffix: "/100", tone: "cyan" },
        { base: 68, description: "The degree to which different groups share a common factual baseline for public debate.", key: "shared_reality", label: "Shared epistemic ground", max: 100, min: 0, slope: -0.45, suffix: "/100", tone: "emerald" },
      ],
      prompt: "Move the slider to see how deeper behavioral monetization reshapes what gets amplified and what kind of public discourse emerges.",
      sliderLabel: "Behavioral prediction business model depth",
      step: 1,
      title: "Mini lesson: when attention is the product",
      unit: "%",
      valueMax: 100,
      valueMin: 0,
    },
    realWorldExamples: [
      {
        insight: "Facebook's own internal research showed its algorithm's preference for engagement systematically amplified outrage and divisive content.",
        outcome: "Internal documents (Frances Haugen leaks) showed Facebook understood the link between its engagement model and societal harm but prioritized growth.",
        title: "Facebook's internal research on amplification",
      },
      {
        insight: "The Cambridge Analytica scandal showed how platform data could be harvested, profiled, and merged with voter records to build behavior-targeting tools at political scale.",
        outcome: "The case made visible that surveillance capitalism is not just about selling products. The same behavioral infrastructure can be repurposed for political persuasion and voter manipulation.",
        title: "Cambridge Analytica and behavioral targeting",
      },
      {
        insight: "Data brokers such as X-Mode/Outlogic were found to sell precise location data that could reveal visits to clinics, shelters, and religious sites.",
        outcome: "Surveillance capitalism extends far beyond social-media feeds. It creates a market where intimate movement patterns become tradable commercial intelligence.",
        title: "Data brokers and location surveillance",
      },
      {
        insight: "The ad-tech system known as real-time bidding broadcasts user information across many actors in order to auction attention in milliseconds.",
        outcome: "Even when no single app feels oppressive, the background market architecture can still expose personal data so widely that meaningful consent becomes close to fictional.",
        title: "Real-time bidding as background surveillance",
      },
      {
        insight: "Facebook whistleblower Frances Haugen's testimony showed the company understood how engagement ranking could spread divisive content, harm young users, and erode privacy while still defending the underlying business model.",
        outcome: "The scandal made the system-level point clear: if profit depends on extracting data and maximizing engagement, safety reforms will keep colliding with the incentives of the business model itself.",
        title: "The Facebook Files and internal awareness",
      },
    ],
    evidenceLinks: [
      {
        note:
          "An official summary of the Cambridge Analytica case and how harvested Facebook data was used for behavioral profiling and political targeting.",
        source: "Federal Trade Commission",
        title: "FTC Sues Cambridge Analytica",
        url: "https://www.ftc.gov/news-events/news/press-releases/2019/07/ftc-sues-cambridge-analytica-settles-former-ceo-app-developer",
      },
      {
        note:
          "A strong official data-broker case showing that the surveillance market includes sensitive location patterns, not just clicks and likes.",
        source: "Federal Trade Commission",
        title: "FTC Order Prohibits Data Broker X-Mode Social / Outlogic from Selling Sensitive Location Data",
        url: "https://www.ftc.gov/news-events/news/press-releases/2024/01/ftc-order-prohibits-data-broker-x-mode-social-outlogic-selling-sensitive-location-data",
      },
      {
        note:
          "Helpful for the infrastructure layer: the ICO explains how personal data is circulated across ad-tech real-time bidding systems.",
        source: "UK Information Commissioner's Office",
        title: "Update report into adtech and real time bidding",
        url: "https://ico.org.uk/media/about-the-ico/documents/2615156/adtech-real-time-bidding-report-201906.pdf",
      },
      {
        note:
          "Useful for the whistleblower angle: internal research and testimony made the platform's knowledge of social harms part of the public record.",
        source: "U.S. Senate Commerce Committee",
        title: "Frances Haugen Written Testimony",
        url: "https://www.commerce.senate.gov/wp-content/uploads/media/doc/Frances%20Haugen%20Written%20Testimony.pdf",
      },
    ],
    relatedFrameworks: [
      "Shoshana Zuboff — The Age of Surveillance Capitalism",
      "Attention economy (Herbert Simon)",
      "Behavioral economics and dark patterns",
      "Ad-tech and data brokerage",
      "GDPR and consent architecture",
    ],
    simulationPrompt: "Compare platform designs: full behavioral monetization, subscription funding, and public utility models — how do they differ in discourse quality, radicalization risk, and informational autonomy?",
    simpleExplanation: [
      "Surveillance capitalism is not primarily about watching people. It is a business model: human behavior is turned into data, data is fed into prediction machines, and predictions are sold to advertisers and political actors who want to influence what people do next.",
      "The system incentivizes emotional manipulation because emotions are the most reliable drivers of engagement. Anger, fear, and outrage keep users on the platform longer, generating more data, improving prediction accuracy, commanding higher ad prices.",
      "The effect on public knowledge is structural: content is not selected for accuracy or importance but for its ability to trigger a response. This is not a bug in the design — it is the design working exactly as its incentives demand.",
    ],
    slug: "how-surveillance-capitalism-shapes-attention",
    systemBug: {
      signals: [
        "Emotionally negative and divisive content is systematically over-distributed relative to its accuracy or social value.",
        "Users cannot meaningfully opt out of behavioral tracking without losing access to socially essential platforms.",
        "Political and commercial actors can purchase precision influence over specific behavioral and demographic profiles.",
      ],
      summary: "The economic incentive to maximize engagement drives platforms to structurally amplify outrage, fear, and divisiveness — not because engineers want this, but because it is what the business model demands.",
      title: "System bug: engagement maximization degrades information quality and political discourse",
    },
  proposals: [
    {
      title: "Prohibit personalised behavioural advertising based on inferred psychological profiles",
      summary: "The surveillance capitalism model depends on converting personal data into micro-targeted persuasion. Banning the use of inferred psychological, political, or emotional profiles for advertising removes the core monetisation incentive without banning advertising itself.",
      actor: "national_gov",
      domain: "legal",
      feasibility: "emerging",
      precedents: [
        { place: "EU (GDPR)", year: 2018, outcome: "Consent requirements dramatically reduced tracking; Irish DPC fined Meta 1.2bn euros for GDPR violations in 2023" },
        { place: "Norway", year: 2021, outcome: "Norwegian DPA banned Meta from behavioural advertising based on app data, citing lack of legitimate interest" },
      ],
    },
    {
      title: "Give users genuine data portability and interoperability rights to break platform lock-in",
      summary: "Platform monopolies are sustained by data capture. Mandating real interoperability so users can take their social graph and history to competing services introduces competitive pressure that behavioural change alone cannot achieve.",
      actor: "national_gov",
      domain: "legal",
      feasibility: "emerging",
      precedents: [
        { place: "EU (DMA)", year: 2023, outcome: "Digital Markets Act requires gatekeepers to offer interoperability; WhatsApp required to open messaging to third-party clients by 2024" },
        { place: "USA (CCPA)", year: 2020, outcome: "California Consumer Privacy Act gives residents data access and deletion rights; model for 14 other US state laws" },
      ],
    },
    {
      title: "Build public digital infrastructure with privacy-by-default and non-addictive standards",
      summary: "Public alternatives to surveillance platforms can demonstrate that useful digital tools do not require attention harvesting. Government procurement standards requiring privacy-by-default create market pressure across the whole sector.",
      actor: "national_gov",
      domain: "media",
      feasibility: "proven",
      precedents: [
        { place: "Estonia", year: 2000, outcome: "e-Estonia digital public services built on citizen-controlled identity infrastructure; no surveillance advertising; model adopted by 50+ countries" },
        { place: "France (Tchap)", year: 2019, outcome: "Government-run encrypted messaging for civil servants; open source, no ad targeting; proved viability of non-commercial alternatives" },
      ],
    },
  ],

  };

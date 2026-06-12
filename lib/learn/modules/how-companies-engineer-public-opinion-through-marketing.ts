import type { LearningModule } from "./_types";

export const lessonData: LearningModule = {
    betterMetrics: [
      {
        description:
          "How much repeated persuasive messaging reaches people before they can meaningfully opt out or compare alternatives?",
        label: "Exposure concentration",
      },
      {
        description:
          "Can people easily tell whether a message is grassroots speech, journalism, sponsorship, or paid image management?",
        label: "Source transparency",
      },
      {
        description:
          "How much commercial persuasion is aimed at youth or identity formation rather than narrow product information?",
        label: "Identity targeting",
      },
      {
        description:
          "Do public-health, civic, and educational institutions have enough reach to answer well-funded corporate narratives?",
        label: "Countervailing capacity",
      },
    ],
    betterMetricsTitle: "What a healthier public-opinion system would track",
    causalLoop: {
      description:
        "When a company can repeatedly attach a product to freedom, status, belonging, or modernity, the product feels culturally normal rather than commercially pushed. Higher sales then fund even more image management and lobbying.",
      edges: [
        { from: "marketingBudget", label: "funds", polarity: "positive", to: "symbolicCampaigns" },
        { from: "movementSymbols", label: "supplies", polarity: "positive", to: "symbolicCampaigns" },
        { from: "symbolicCampaigns", label: "shape", polarity: "positive", to: "culturalMeaning" },
        { from: "culturalMeaning", label: "normalizes", polarity: "positive", to: "socialAcceptance" },
        { from: "socialAcceptance", label: "raises", polarity: "positive", to: "sales" },
        { from: "sales", label: "expands", polarity: "positive", to: "marketingBudget" },
        { from: "sales", label: "finances", polarity: "positive", to: "prAndLobbyPower" },
        { from: "prAndLobbyPower", label: "weakens", polarity: "negative", to: "publicGuardrails" },
        { from: "publicGuardrails", label: "limits", polarity: "negative", to: "symbolicCampaigns" },
      ],
      loops: [
        "Reinforcing: symbolic campaigns -> cultural meaning -> social acceptance -> sales -> larger marketing budgets -> more symbolic campaigns",
        "Balancing: scrutiny, health rules, and transparency can interrupt the loop, but often only after a norm has already been stabilized",
      ],
      nodes: [
        { id: "marketingBudget", label: "Marketing budget", tone: "amber", x: 18, y: 18 },
        { id: "movementSymbols", label: "Borrowed social symbols", tone: "cyan", x: 18, y: 52 },
        { id: "symbolicCampaigns", label: "Identity campaigns", tone: "rose", x: 50, y: 30 },
        { id: "culturalMeaning", label: "Product meaning", tone: "rose", x: 82, y: 18 },
        { id: "socialAcceptance", label: "Social acceptance", tone: "emerald", x: 82, y: 52 },
        { id: "sales", label: "Sales growth", tone: "amber", x: 50, y: 82 },
        { id: "prAndLobbyPower", label: "PR and lobbying power", tone: "rose", x: 18, y: 84 },
        { id: "publicGuardrails", label: "Public guardrails", tone: "emerald", x: 82, y: 84 },
      ],
      title: "The norm-engineering loop",
    },
    counterArguments: [
      {
        point:
          "Advertising mostly responds to preferences people already have. It does not create them from nothing.",
        response:
          "That is partly true. But repeated campaigns can still decide which preferences feel normal, modern, respectable, rebellious, or desirable. Marketing often shapes the meaning around a product rather than only describing the product itself.",
        title: "Ads only mirror demand",
      },
      {
        point:
          "People are not passive. Culture is too complex to be engineered by a company campaign.",
        response:
          "People do interpret messages actively. The structural issue is asymmetry: firms can repeat a story across media, celebrities, events, and sponsorships until it starts to feel like common sense. That does not guarantee control, but it does buy disproportionate influence over the symbolic environment.",
        title: "Culture cannot be engineered from above",
      },
    ],
    discussionPrompt:
      "When does marketing stop being ordinary persuasion and start functioning like political engineering of public norms, identities, and movements?",
    evidenceLinks: [
      {
        note:
          "Useful for the big-picture biography: Bernays was Sigmund Freud's nephew and a foundational figure in public relations, not just a tobacco ad man.",
        source: "Britannica",
        title: "Edward Bernays",
        url: "https://www.britannica.com/biography/Edward-Bernays",
      },
      {
        note:
          "This public-health history tracks how smoking among women was recoded from taboo to freedom and modernity through promotional strategy.",
        source: "Tobacco Control",
        title: "From social taboo to 'torch of freedom'",
        url: "https://tobaccocontrol.bmj.com/content/8/2/136",
      },
      {
        note:
          "Helpful for showing that marketing can create cultural expectations, not just boost short-term sales: De Beers helped turn the diamond engagement ring into a mass social norm.",
        source: "Britannica",
        title: "How Did the Tradition of Wedding Rings Start?",
        url: "https://www.britannica.com/topic/How-Did-the-Tradition-of-Wedding-Rings-Start",
      },
      {
        note:
          "A strong case of blame-shifting: anti-litter campaigns and corporate partnerships often moved responsibility from producers of disposable waste onto individual consumers.",
        source: "Tobacco Control",
        title: "Covering Their Butts: Responses to the Cigarette Litter Problem",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC3209806/",
      },
      {
        note:
          "Useful for the street-space example: the auto industry did not only sell cars, it helped redefine who streets were for and made pedestrian behavior seem backward or irresponsible.",
        source: "JSTOR Daily",
        title: "\"Jay Walking\" and the Fight for the Streets",
        url: "https://daily.jstor.org/jay-walking-and-the-fight-for-the-streets/",
      },
      {
        note:
          "Useful for a modern climate-era example: BP's green advertising helped soften consumer punishment, while later research found a mismatch between clean-energy discourse and actual investment patterns.",
        source: "American Economic Association",
        title: "Advertising and Environmental Stewardship: Evidence from the BP Oil Spill",
        url: "https://www.aeaweb.org/articles?id=10.1257/pol.20160555",
      },
      {
        note:
          "A broader greenwashing lens on oil majors: BP and peers sharply increased climate discourse without matching it with a comparable shift in underlying business models.",
        source: "PLOS One",
        title: "The clean energy claims of BP, Chevron, ExxonMobil and Shell",
        url: "https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0263596",
      },
      {
        note:
          "A broader health lens showing how the tobacco industry deliberately targeted women through symbolism, glamour, slimness, and emancipation themes.",
        source: "National Cancer Institute / NCBI",
        title: "Women and Smoking",
        url: "https://www.ncbi.nlm.nih.gov/books/NBK53022/",
      },
    ],
    heroHighlights: [
      "Modern marketing often sells meanings first and products second: freedom, status, adulthood, rebellion, care, or belonging.",
      "Companies can borrow the language of real social change and redirect it toward commercial ends.",
      "The same techniques can also shift blame away from producers and toward consumers, making structural problems look personal.",
      "Once a norm is culturally stabilized, higher sales and lobbying power help keep the narrative in place.",
    ],
    miniLesson: {
    bands: [
      {
        threshold: 0,
        insight:
          "With no marketing spend, products survive on word-of-mouth and intrinsic quality. Without consistent identity-building, even superior products struggle to build the brand associations that drive preference independent of price.",
      },
      {
        threshold: 3,
        insight:
          "At 3% of revenue — typical for B2B and industrial firms — marketing can establish category awareness and a professional reputation but rarely shapes consumer identity or commands strong price premiums in competitive markets.",
      },
      {
        threshold: 8,
        insight:
          "At 8–10%, companies can run sustained campaign cycles that build emotional associations beyond product function. Consumers begin to signal identity through brand choice — the product becomes a vehicle for self-expression.",
      },
      {
        threshold: 15,
        insight:
          "At 15%+, common in consumer goods and pharmaceuticals, marketing shapes what consumers consider normal, aspirational, or medically necessary. At this level, marketing spend is often more effective than R&D at increasing profit margins.",
      },
    ],
    defaultValue: 8,
    description:
      "Marketing spend shapes not just awareness but price sensitivity, consumer identity, and — at scale — public discourse. Adjust the spend level to see what different investment rates buy.",
    highLabel: "20% (pharma/luxury)",
    lowLabel: "0% (no spend)",
    metrics: [
      {
        base: 5,
        description: "Share of target consumers who recall the brand without prompting in a category survey",
        key: "brand-recall",
        label: "Unaided brand recall",
        max: 75,
        min: 5,
        slope: 3.5,
        suffix: "%",
        tone: "cyan",
      },
      {
        base: 2,
        description: "Price premium above an unbranded equivalent that consumers are willing to pay",
        key: "price-premium",
        label: "Acceptable price premium",
        max: 28,
        min: 2,
        slope: 1.3,
        suffix: "%",
        tone: "emerald",
      },
      {
        base: 5,
        description: "Likelihood of regulatory scrutiny for misleading claims, anti-competitive advertising, or narrative capture of policy debates",
        key: "scrutiny-risk",
        label: "Regulatory scrutiny risk",
        max: 60,
        min: 5,
        slope: 2.75,
        suffix: "/100",
        tone: "rose",
      },
    ],
    prompt: "Adjust marketing spend to see what brand power it buys — and at what regulatory cost.",
    sliderLabel: "Marketing spend as % of revenue",
    step: 1,
    title: "What marketing spend actually buys",
    unit: "%",
    valueMax: 20,
    valueMin: 0,
  },
    realWorldExamples: [
      {
        insight:
          "In 1929 Edward Bernays staged the 'Torches of Freedom' publicity event during New York's Easter Parade for the American Tobacco Company, borrowing women's emancipation imagery to make public smoking feel modern and defiant.",
        outcome:
          "The stunt did not create feminism or the first feminist protest. It showed how a company could appropriate the symbolism of a real social movement to expand a market among women.",
        title: "Bernays, Lucky Strike, and 'Torches of Freedom'",
      },
      {
        insight:
          "De Beers did not invent engagement rings, but its 1947 'A Diamond Is Forever' campaign helped make the diamond ring feel like the natural proof of love, permanence, and seriousness across the mass market.",
        outcome:
          "A purchasable luxury became a cultural expectation. The campaign did not merely sell stones; it reshaped romance, social pressure, and what counted as a 'proper' proposal.",
        title: "De Beers and the manufactured romance norm",
      },
      {
        insight:
          "Corporate-backed anti-litter campaigns such as Keep America Beautiful encouraged people to see waste mainly as the result of irresponsible individuals rather than of disposable packaging systems designed by producers.",
        outcome:
          "The culture of blame shifted toward personal behavior, which softened pressure for stronger regulation of packaging waste and corporate accountability.",
        title: "Keep America Beautiful and the individualization of waste",
      },
      {
        insight:
          "Auto interests in the 1920s did not only lobby for infrastructure. They also helped popularize the term 'jaywalking' and recast streets as places that naturally belonged to fast-moving cars rather than shared public space.",
        outcome:
          "What had once looked like dangerous driving was gradually reframed as improper pedestrian behavior. The culture of the street shifted in favor of car dominance, and that shift later shaped law, planning, and everyday common sense.",
        title: "Motordom, jaywalking, and the remaking of the street",
      },
      {
        insight:
          "BP's 'Beyond Petroleum' branding and promotion of individual carbon-footprint thinking helped present the company as climate-aware while redirecting part of the public conversation toward consumer behavior.",
        outcome:
          "Later research found that green discourse and advertising can reduce reputational damage even when the underlying fossil-fuel business model changes much less than the messaging suggests.",
        title: "BP, green branding, and climate blame-shifting",
      },
      {
        insight:
          "Across tobacco, diamonds, cars, packaging, and fossil fuels, the common move is not just 'buy this.' It is 'be this,' 'love this,' 'feel guilty this way,' or 'see the system through this frame.'",
        outcome:
          "Public opinion is steered not only by arguments and facts, but by meanings that are made to feel natural, moral, aspirational, or inevitable.",
        title: "The wider pattern across industries",
      },
    ],
    relatedFrameworks: [
      "Public relations and propaganda",
      "Agenda setting and framing",
      "Greenwashing and blame-shifting",
      "Identity marketing",
      "Movement co-option",
    ],
    simulationPrompt:
      "Compare two societies: one where commercial actors can freely tie products to identity and public causes, and one with strong transparency rules, youth protections, and publicly trusted counter-messaging.",
    simulatorSlug: "social-movements",
    simpleExplanation: [
      "Marketing is often described as simple persuasion: a company explains what a product does, and consumers decide whether to buy it. In reality, the deepest campaigns do something larger. They attach products to meaning. A cigarette becomes freedom. A car becomes adulthood. A brand becomes self-expression. A purchase becomes membership in a way of life.",
      "That is why the Edward Bernays story matters. Bernays, who was Sigmund Freud's nephew and one of the early architects of public relations, did not organize the first feminist protest. Women had been organizing and protesting for decades. What he did in 1929 was stage a publicity event that borrowed the symbolism of women's emancipation to help normalize smoking in public and open a larger market for cigarettes among women.",
      "The same structure appears far beyond tobacco. De Beers made diamonds feel essential to romance. Anti-litter campaigns made consumers feel mainly responsible for packaging waste. Auto interests helped make car-dominated streets feel natural. Fossil-fuel companies used green branding to soften scrutiny and redirect attention toward individual footprints.",
      "Once a company succeeds at rewriting cultural meaning, the effect is bigger than a single ad campaign. Sales rise, more money flows into publicity and lobbying, and the new norm starts to feel natural. People experience themselves as choosing freely, even when the symbolic environment around the choice has been carefully engineered.",
    ],
    slug: "how-companies-engineer-public-opinion-through-marketing",
    systemBug: {
      signals: [
        "Commercial campaigns frame products as liberation, belonging, or moral identity rather than as things to evaluate on their merits.",
        "Paid image management becomes hard to distinguish from grassroots sentiment or everyday common sense.",
        "Higher sales feed bigger PR and lobbying budgets, making the narrative harder to challenge once it is normalized.",
      ],
      summary:
        "Actors with large budgets can buy symbolic influence at scale, shaping what feels normal or desirable long before the public has clearly recognized the manipulation.",
      title: "System bug: markets can purchase cultural influence, not just attention",
    },
  proposals: [
    {
      title: "Ban advertising of harmful products to children under 16 across all media",
      summary: "Children cannot meaningfully consent to persuasion they cannot identify. Banning advertising of junk food, gambling, alcohol, and high-interest credit to under-16s across TV, digital, and algorithmic platforms reduces the most asymmetric manipulation.",
      actor: "national_gov",
      domain: "legal",
      feasibility: "proven",
      precedents: [
        { place: "Quebec, Canada", year: 1980, outcome: "Consumer Protection Act bans all advertising directed at under-13s; Quebec children have healthier food preferences than elsewhere in Canada" },
        { place: "Sweden and Norway", year: 1991, outcome: "Total ban on TV advertising to children under 12; consistently among lowest childhood obesity rates in Europe" },
      ],
    },
    {
      title: "Require clear non-skippable disclosure labels on all sponsored and AI-generated content",
      summary: "The blurring of editorial and advertorial — and increasingly of human and AI-generated content — undermines informed consent. Mandatory, prominent, standardised disclosures maintain the distinction between persuasion and information.",
      actor: "national_gov",
      domain: "media",
      feasibility: "proven",
      precedents: [
        { place: "UK (ASA)", year: 2019, outcome: "Enforcement of influencer disclosure rules; fines and bans for undisclosed paid posts significantly increased compliance" },
        { place: "EU (DSA)", year: 2023, outcome: "Very Large Platforms must clearly mark all advertising and the identity of the sponsor" },
      ],
    },
    {
      title: "Mandate disclosure of targeting parameters and spend for all political advertising",
      summary: "Political advertising is uniquely dangerous because it targets the formation of public opinion about power. Mandatory disclosure of targeting criteria, spend, and funder identity limits the most manipulative uses of mass persuasion.",
      actor: "national_gov",
      domain: "political",
      feasibility: "contested",
      precedents: [
        { place: "Canada", year: 2000, outcome: "Canada Elections Act requires paid-for tags and spending disclosure within strict limits" },
        { place: "EU", year: 2024, outcome: "Political Advertising Regulation requires transparency on targeting criteria and funding for all political ads across EU platforms" },
      ],
    },
  ],

  };

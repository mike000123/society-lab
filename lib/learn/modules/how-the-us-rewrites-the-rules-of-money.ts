import type { LearningModule } from "./_types";

export const lessonData: LearningModule = {
    betterMetrics: [
      {
        description: "The share of global trade and financial reserves denominated in a single national currency — a structural advantage that can be withdrawn without warning.",
        label: "Reserve currency concentration",
      },
      {
        description: "The gap between the official price of a monetary anchor (gold, a peg, a basket) and its market-clearing value — a measure of how much pressure is building before the next rewrite.",
        label: "Monetary anchor stress index",
      },
      {
        description: "Who holds veto power over the rules of international monetary settlement — and whether those rules can survive a political shock.",
        label: "Rule-making legitimacy",
      },
      {
        description: "How easily ordinary savers can move wealth outside the dominant monetary system when rules change — a measure of how concentrated monetary risk really is.",
        label: "Household monetary exit options",
      },
    ],
    betterMetricsTitle: "What to watch beyond inflation and GDP",
    counterArguments: [
      {
        point: "Each rewrite was a pragmatic emergency response, not a grand conspiracy. Roosevelt faced deflation and bank collapse; Nixon faced a real run on gold. Crisis management is not sinister.",
        response: "True — each decision had a genuine emergency behind it. The pattern worth understanding is not that elites are conspiring, but that the rules of money are political and revisable. Knowing that is useful regardless of who is in power.",
        title: "These were emergency responses, not power grabs",
      },
      {
        point: "The Bretton Woods system and the petrodollar era produced decades of relative stability and growth. Rewriting the rules worked.",
        response: "For most wealthy countries, yes. The distributional picture is more complex: dollar privilege allowed the US to run persistent deficits that would have forced adjustment in any other country, and the rules were written by the strongest player.",
        title: "The system delivered real prosperity",
      },
      {
        point: "A Bitcoin or crypto reserve is categorically different — it is not controlled by any government and cannot be inflated away. This makes it more honest than fiat.",
        response: "Scarcity by design does not guarantee stability. A fixed supply asset held as a national reserve asset still creates winners (early holders) and losers (latecomers), and its price volatility makes it a poor unit of account for international trade settlement.",
        title: "Crypto is a genuinely different kind of money",
      },
    ],
    causalLoop: {
      description:
        "Each monetary order creates structural pressures that accumulate until a rewrite becomes unavoidable. The stability of the new system depends on whether the underlying tensions are resolved or merely deferred.",
      edges: [
        { from: "monetary_order", label: "enables", polarity: "positive", to: "credit_expansion" },
        { from: "credit_expansion", label: "builds", polarity: "positive", to: "imbalances" },
        { from: "imbalances", label: "stress-test", polarity: "negative", to: "anchor_credibility" },
        { from: "anchor_credibility", label: "collapse triggers", polarity: "negative", to: "political_crisis" },
        { from: "political_crisis", label: "forces", polarity: "positive", to: "rule_rewrite" },
        { from: "rule_rewrite", label: "creates new", polarity: "positive", to: "monetary_order" },
        { from: "rule_rewrite", label: "redistributes", polarity: "positive", to: "winners_losers" },
        { from: "winners_losers", label: "shapes next", polarity: "positive", to: "imbalances" },
      ],
      loops: [
        "Reinforcing: stability breeds credit expansion → imbalances build → anchor stress → crisis → rewrite → new stability → repeat",
        "Balancing (slow): accumulated institutional memory and reform can delay the next crisis, but has never prevented it",
      ],
      nodes: [
        { id: "monetary_order", label: "Monetary order", tone: "amber", x: 300, y: 60 },
        { id: "credit_expansion", label: "Credit expansion", tone: "emerald", x: 560, y: 140 },
        { id: "imbalances", label: "Structural imbalances", tone: "rose", x: 560, y: 300 },
        { id: "anchor_credibility", label: "Anchor credibility", tone: "cyan", x: 380, y: 380 },
        { id: "political_crisis", label: "Political crisis", tone: "rose", x: 140, y: 300 },
        { id: "rule_rewrite", label: "Rule rewrite", tone: "amber", x: 60, y: 160 },
        { id: "winners_losers", label: "New winners & losers", tone: "amber", x: 300, y: 240 },
      ],
      title: "The monetary rewrite cycle",
    },
    discussionPrompt:
      "If the rules of money can always be rewritten by the most powerful state under sufficient pressure, what does that mean for how individuals and nations should store and protect wealth?",
    heroHighlights: [
      "In 1933, Franklin Roosevelt made it illegal for Americans to own gold and repriced it the next year by 41% — a default in all but name.",
      "In 1971, Richard Nixon ended the dollar's convertibility to gold in a single weekend TV address, dissolving the Bretton Woods system that 44 nations had spent years building.",
      "Each US monetary rewrite transferred enormous wealth between groups — and was presented as a technical fix rather than a political choice.",
    ],
    miniLesson: {
    bands: [
      {
        threshold: 0,
        insight:
          "At 20% global reserve share, dollar hegemony has collapsed. International trade invoicing has shifted to other currencies; financial sanctions lose their bite because most transactions can route around the dollar system.",
      },
      {
        threshold: 20,
        insight:
          "At 40% reserve share — well below current levels — the dollar remains the largest single reserve currency but faces genuine competition from the euro or renminbi. Sanctions still carry weight but are more easily avoided.",
      },
      {
        threshold: 30,
        insight:
          "At 50% (modestly below today's ~59%), the US retains substantial but contested financial power. Countries hit by sanctions can increasingly find workarounds. US trade deficits become harder to sustain.",
      },
      {
        threshold: 40,
        insight:
          "At 60–70% — close to the post-Bretton Woods peak — dollar hegemony gives the US the power to impose economically crippling sanctions with minimal cooperation from allies. The US can also run sustained trade deficits that would collapse any other currency.",
      },
    ],
    defaultValue: 60,
    description:
      "The dollar's share of global foreign exchange reserves determines how much leverage the US has over international finance — and how easily rules can be rewritten. Explore what changes as that share shifts.",
    highLabel: "70% (historic peak)",
    lowLabel: "20% (post-hegemony)",
    metrics: [
      {
        base: 3,
        description: "Estimated number of countries subject to economically significant dollar-denominated sanctions",
        key: "sanction-reach",
        label: "Countries effectively sanctioned",
        max: 40,
        min: 3,
        slope: 0.74,
        suffix: " countries",
        tone: "rose",
      },
      {
        base: 0.5,
        description: "Maximum US current account deficit that global demand for dollar reserves can sustain",
        key: "deficit-capacity",
        label: "Sustainable US trade deficit",
        max: 4.5,
        min: 0.5,
        slope: 0.08,
        suffix: "% GDP",
        tone: "cyan",
      },
      {
        base: 30,
        description: "Share of central banks holding a non-dollar currency as their primary reserve",
        key: "alt-reserve",
        label: "Central banks holding alternatives",
        max: 30,
        min: 4,
        slope: -0.52,
        suffix: "%",
        tone: "emerald",
      },
    ],
    prompt: "Adjust the dollar reserve share to see what financial power it buys — and what erodes as it shrinks.",
    sliderLabel: "Dollar share of global reserves",
    step: 5,
    title: "What reserve dominance actually buys",
    unit: "%",
    valueMax: 70,
    valueMin: 20,
  },
    realWorldExamples: [
      {
        insight:
          "By making gold ownership illegal at $20.67/oz and then repricing it to $35/oz, the US government effectively devalued the dollar by 41% overnight. Holders of gold certificates — mostly banks and foreign creditors — bore the loss; the US Treasury captured the gain.",
        outcome:
          "The Gold Reserve Act of 1934 gave the Treasury a multi-billion dollar windfall that funded New Deal programs. Domestic gold holders had already been forced to sell at the lower price.",
        title: "1933–34: the compulsory gold swap and overnight revaluation",
      },
      {
        insight:
          "Under Bretton Woods, foreign central banks could demand gold from the US at $35/oz. By 1971, the US held far less gold than its dollar obligations required — France had already started cashing in. Nixon closed the gold window before the US ran out.",
        outcome:
          "The dollar was cut loose from any fixed anchor. The US gained the ability to run deficits without the discipline of gold conversion. Within two years, inflation surged globally as dollar-denominated oil prices tripled.",
        title: "1971: Nixon closes the gold window",
      },
      {
        insight:
          "By early 2025, a US executive order directed agencies to explore a Strategic Bitcoin Reserve — treating seized and purchased bitcoin as a reserve asset. If pursued, it would mark the first time a sovereign incorporated a privately-designed, algorithmically-scarce asset into official reserves.",
        outcome:
          "The policy remained contested and unimplemented as of mid-2025. Its significance is structural: it signals that monetary architecture is once again being treated as a live political question rather than a settled technical matter.",
        title: "2025: Bitcoin as a potential reserve asset",
      },
    ],
    relatedFrameworks: [
      "Triffin dilemma (reserve currency paradox)",
      "Bretton Woods system and its collapse",
      "Modern Monetary Theory",
      "Gold standard history",
      "Exorbitant privilege (Barry Eichengreen)",
      "Petrodollar system",
    ],
    simulationPrompt:
      "Run the macro economy simulator with different monetary anchor assumptions — gold standard, fiat with inflation target, or currency board — to see how each constrains or enables fiscal and monetary policy.",
    simulatorSlug: "macro-economy",
    simpleExplanation: [
      "Most people treat money as a fixed fact of life — like gravity. But the specific rules that define what money is, who can create it, and what it can be exchanged for have been rewritten multiple times, usually in moments of crisis, always by those who held state power.",
      "The US has gone through at least five such rewrites since 1913: the creation of the Federal Reserve to prevent bank panics, FDR\'s gold confiscation and repricing in 1933–34, the Bretton Woods system that made the dollar the world\'s reserve currency in 1944, Nixon\'s shock that cut the dollar free from gold in 1971, and the Plaza Accord of 1985 that engineered a deliberate dollar devaluation by international agreement. A potential sixth — the incorporation of bitcoin into US reserves — was live policy as of 2025.",
      "Each rewrite had a genuine crisis behind it. But each also redistributed wealth on a massive scale: from gold holders to the Treasury, from creditor nations to the US, from savers to debtors. Understanding that monetary rules are political — not just technical — is the starting point for understanding how the financial system actually works.",
    ],
    slug: "how-the-us-rewrites-the-rules-of-money",
    systemBug: {
      signals: [
        "The monetary anchor (gold, fixed peg, or credibility) is under visible strain before the official rewrite is announced.",
        "Each rewrite creates large windfall gains for early movers and losses for those who trusted the old rules.",
        "International monetary agreements are negotiated by the strongest powers and presented as universal frameworks.",
        "Long periods of stability erode the institutional memory of how fast the rules can change.",
      ],
      summary:
        "The design flaw is not in any specific monetary system but in the belief that any monetary system is permanent. The rules are made by states under political pressure and can be changed by states under political pressure — usually faster than ordinary citizens can respond.",
      title: "System bug: monetary rules feel permanent until they change overnight",
    },
    timeline: {
      intro:
        "Six turning points in which the United States rewrote the fundamental rules of its monetary system — each one a response to a genuine crisis, each one reshaping who holds wealth and who bears risk.",
      title: "Six times the US changed the rules of money",
      events: [
        {
          characteristics: [
            "Created a lender of last resort to stop bank runs",
            "Established a network of regional Federal Reserve banks",
            "Transferred some monetary authority from private clearinghouses to a public institution",
          ],
          family: "Institutional creation",
          outcome:
            "Bank panics became less frequent, but the Fed\'s independence from both government and Wall Street remained contested from day one.",
          timeLabel: "1913",
          title: "Federal Reserve Act",
          turningPoint:
            "First time the US accepted a permanent central bank — reversing Andrew Jackson\'s abolition of the Second Bank of the United States eighty years earlier.",
          whyItStarted:
            "The Panic of 1907 showed that without a central bank, private bankers (principally J.P. Morgan) were the only thing standing between the financial system and collapse.",
        },
        {
          characteristics: [
            "Executive Order 6102 made it illegal for most Americans to own gold coins, bullion, or gold certificates",
            "Owners were required to surrender gold to the Federal Reserve at $20.67 per troy ounce",
            "Exemptions for jewelry, collectible coins, and industrial use",
          ],
          family: "Compulsory confiscation",
          outcome:
            "Roughly $300 million in gold (billions in today\'s terms) was transferred to the Treasury. Many historians regard it as a soft default on the gold standard.",
          timeLabel: "1933",
          title: "Executive Order 6102 — Gold Confiscation",
          turningPoint:
            "The US government demonstrated it could override property rights over monetary assets in a national emergency — a precedent with no peacetime parallel before or since.",
          whyItStarted:
            "Bank runs were draining gold reserves as the Depression deepened. Roosevelt needed to expand the money supply but could not do so under gold standard rules as long as people could convert dollars to gold.",
        },
        {
          characteristics: [
            "Transferred legal title of all gold from the Federal Reserve to the US Treasury",
            "Officially repriced gold from $20.67 to $35.00 per troy ounce",
            "The 41% revaluation produced an immediate profit for the Treasury",
          ],
          family: "Monetary devaluation",
          outcome:
            "The Treasury windfall funded New Deal programs. Holders of dollar-denominated assets saw 41% of their gold-equivalent purchasing power wiped out. Foreign creditors who had trusted the old peg took the loss.",
          timeLabel: "1934",
          title: "Gold Reserve Act — Dollar Devaluation",
          turningPoint:
            "The first explicit, legally-enacted devaluation of the US dollar — framed as stabilization, functioning as a redistribution from creditors to debtors and from private gold holders to the state.",
          whyItStarted:
            "With gold now concentrated in the Treasury, Roosevelt could set the new price. The higher price made US exports cheaper, discouraged gold outflows, and gave the government fiscal room.",
        },
        {
          characteristics: [
            "Dollar pegged to gold at $35 per ounce — the only currency with direct gold convertibility",
            "All other currencies pegged to the dollar within a ±1% band",
            "Created the IMF and World Bank as institutional pillars",
            "US veto guaranteed at both institutions",
          ],
          family: "International monetary architecture",
          outcome:
            "Two decades of relative exchange rate stability and reconstruction finance for war-damaged economies. The US gained structural economic advantages — the \'exorbitant privilege\' of issuing the world\'s reserve currency.",
          timeLabel: "1944",
          title: "Bretton Woods Agreement",
          turningPoint:
            "The dollar was formally installed as the global reserve currency — a position that allowed the US to run trade deficits without the balance-of-payments discipline every other country faced.",
          whyItStarted:
            "With WWII still running, 44 allied nations met in New Hampshire to design a post-war monetary order that avoided the competitive devaluations and gold hoarding of the 1930s. The US, holding 70% of the world\'s gold reserves at the time, set the terms.",
        },
        {
          characteristics: [
            "Nixon announced the end of gold convertibility in a Sunday TV address with no advance notice to allies",
            "Foreign central banks could no longer exchange dollar reserves for US gold",
            "Temporary 10% import surcharge imposed simultaneously",
            "Bretton Woods fixed exchange rate system collapsed within two years",
          ],
          family: "Unilateral dissolution",
          outcome:
            "The dollar became pure fiat money. Exchange rates floated. Inflation surged through the 1970s. The US retained reserve currency status but without the gold anchor discipline — gaining the ability to run unlimited deficits.",
          timeLabel: "1971",
          title: "Nixon Shock — End of Gold Convertibility",
          turningPoint:
            "The most consequential monetary rewrite of the 20th century: the world moved from commodity-backed to pure fiat money with no international agreement, no treaty, and no transition period.",
          whyItStarted:
            "The US had printed far more dollars than it held gold to redeem. France and other creditors were actively converting dollar reserves to gold. Nixon faced a choice between devaluation, austerity, or closing the gold window — and chose the third.",
        },
        {
          characteristics: [
            "G5 finance ministers (US, UK, France, West Germany, Japan) agreed to coordinated currency intervention",
            "Central banks sold dollars in foreign exchange markets to push the exchange rate down",
            "The dollar fell approximately 40–50% against the yen and deutschmark over two years",
          ],
          family: "Coordinated devaluation",
          outcome:
            "US manufacturing exports became competitive again. Japanese and German exporters faced a sudden cost shock. The agreement demonstrated that exchange rates — supposedly set by markets — were fully available as a policy instrument when major powers chose to act together.",
          timeLabel: "1985",
          title: "Plaza Accord — Engineered Dollar Depreciation",
          turningPoint:
            "The first explicit multilateral agreement to deliberately move a major currency in a specific direction — establishing that G-level coordination could override market pricing.",
          whyItStarted:
            "The strong dollar of the early 1980s (driven by Volcker\'s high interest rates) had made US manufacturing uncompetitive and ballooned the trade deficit. The Reagan administration, normally market-oriented, decided intervention was necessary.",
        },
        {
          characteristics: [
            "Executive order directed relevant agencies to explore a Strategic Bitcoin Reserve",
            "Would treat confiscated and potentially purchased bitcoin as a sovereign reserve asset",
            "Marks the first time a G7 government formally considered a privately-issued, algorithmically-scarce asset as reserves",
          ],
          family: "Potential new monetary layer (contested)",
          outcome:
            "Policy status uncertain as of mid-2025. If pursued, it would represent the first significant change to US reserve asset policy since the end of gold convertibility in 1971.",
          timeLabel: "2025",
          title: "Bitcoin Strategic Reserve Proposal",
          turningPoint:
            "Signals that monetary architecture is again being treated as a live political question — and that the definition of what counts as a reserve asset is once more open to revision.",
          whyItStarted:
            "A combination of distrust in dollar-denominated debt, political pressure from the crypto industry, and a broader desire to diversify from traditional reserve instruments following the Russia sanctions seizure of USD reserves in 2022.",
        },
      ],
    },
  proposals: [
    {
      title: "Reform IMF Special Drawing Rights allocation to give developing countries greater monetary firepower",
      summary: "SDR allocations are proportional to IMF quotas that reflect 1940s economic power. Reforming quotas and channelling a larger share of SDRs to developing countries would give the Global South greater monetary sovereignty in crises.",
      actor: "international",
      domain: "economic",
      feasibility: "contested",
      precedents: [
        { place: "IMF 2021 SDR allocation", year: 2021, outcome: "650bn dollar allocation — largest ever; but 60% went to rich countries with small needs; only 21bn to Africa" },
        { place: "G7 rechannelling initiative", year: 2022, outcome: "Committed to rechannelling 100bn dollars of SDRs to developing countries via RST; shows voluntary redistribution is feasible" },
      ],
    },
    {
      title: "Require the US Federal Reserve to treat distributional outcomes as an explicit mandate",
      summary: "The Fed dual mandate formally includes employment alongside inflation, but in practice inflation dominates. Explicitly weighting wage growth and distributional outcomes would rebalance monetary policy toward the majority of the population.",
      actor: "national_gov",
      domain: "economic",
      feasibility: "contested",
      precedents: [
        { place: "USA (average inflation targeting)", year: 2020, outcome: "Fed 2020 framework shift allowed unemployment to fall further before tightening; Black unemployment reached record lows in 2023" },
        { place: "Reserve Bank of New Zealand", year: 2018, outcome: "Mandate expanded to include employment; first central bank to explicitly add employment objective alongside price stability" },
      ],
    },
  ],

  };

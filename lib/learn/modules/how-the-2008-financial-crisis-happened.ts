import type { LearningModule } from "./_types";

export const lessonData: LearningModule = {
    betterMetrics: [
      {
        description: "Tracks risk hidden off-balance-sheet in structured vehicles, repo, and money markets.",
        label: "Shadow banking system size (% of GDP)",
      },
      {
        description: "Rising spread signals funding stress and counterparty distrust — a real-time crisis indicator.",
        label: "TED spread / LIBOR-OIS spread",
      },
      {
        description: "Measures how much leverage sits in the financial sector relative to real economic activity.",
        label: "Financial sector debt-to-GDP",
      },
      {
        description: "Tracks the proportion of mortgages issued with no income verification or deposit — a measure of origination quality.",
        label: "Subprime and no-doc origination share",
      },
    ],
    betterMetricsTitle: "Signals that matter more than headline growth",
    causalLoop: {
      description:
        "A reinforcing bubble builds as rising prices justify further leverage; when prices stall the same leverage unwinds faster than it built, with shadow banking amplifying each step.",
      edges: [
        { from: "housePrice", label: "boosts", polarity: "positive", to: "origination" },
        { from: "origination", label: "funds", polarity: "positive", to: "securitisation" },
        { from: "securitisation", label: "frees capital for", polarity: "positive", to: "origination" },
        { from: "securitisation", label: "feeds", polarity: "positive", to: "shadow" },
        { from: "shadow", label: "amplifies", polarity: "positive", to: "leverage" },
        { from: "leverage", label: "supports", polarity: "positive", to: "housePrice" },
        { from: "housePrice", label: "collapse triggers", polarity: "negative", to: "defaults" },
        { from: "defaults", label: "impairs", polarity: "negative", to: "bankCapital" },
        { from: "bankCapital", label: "forces", polarity: "negative", to: "creditFlow" },
        { from: "creditFlow", label: "depresses", polarity: "negative", to: "housePrice" },
        { from: "shadow", label: "evades", polarity: "negative", to: "regulation" },
      ],
      loops: [
        {
          description: "Rising house prices improve collateral, enabling more lending, which funds more buying — until prices reverse.",
          label: "R1",
          nodeIds: ["housePrice", "origination", "securitisation", "leverage", "housePrice"],
          polarity: "reinforcing",
        },
        {
          description: "Price falls raise defaults, destroying capital, tightening credit, falling prices further.",
          label: "B1",
          nodeIds: ["housePrice", "defaults", "bankCapital", "creditFlow", "housePrice"],
          polarity: "balancing",
        },
      ],
      nodes: [
        { id: "housePrice", label: "House Prices", x: 350, y: 60 },
        { id: "origination", label: "Mortgage Origination", x: 580, y: 160 },
        { id: "securitisation", label: "Securitisation (MBS/CDO)", x: 580, y: 300 },
        { id: "shadow", label: "Shadow Banking", x: 350, y: 390 },
        { id: "leverage", label: "System Leverage", x: 120, y: 300 },
        { id: "defaults", label: "Mortgage Defaults", x: 580, y: 460 },
        { id: "bankCapital", label: "Bank Capital", x: 350, y: 540 },
        { id: "creditFlow", label: "Credit Flow", x: 120, y: 460 },
        { id: "regulation", label: "Regulatory Perimeter", x: 120, y: 160 },
      ],
      title: "2008 Bubble–Bust Causal Loop",
    },
    counterArguments: [
      {
        point:
          "Many economists and ratings agencies genuinely believed diversification made CDOs safe — it was a model error, not deliberate fraud.",
        response:
          "Internal emails at Goldman, Citigroup, and rating agencies show awareness of deteriorating collateral quality. Epistemic failure and incentive-driven blindness are different problems, and the latter still demands structural reform.",
        title: "It was an honest intellectual mistake",
      },
      {
        point:
          "Regulators, central banks, and economists also missed the bubble — the problem was universal blindness, not deregulation.",
        response:
          "The Gramm-Leach-Bliley Act (1999) and the Commodity Futures Modernization Act (2000) explicitly removed capital and disclosure requirements from the shadow sector. Blindness was institutionalized through policy choices, not random.",
        title: "Everyone missed it — regulators included",
      },
      {
        point:
          "The Dodd-Frank Act and Basel III responded with massive reforms. Blaming the 2008 system is fair; pretending nothing changed is not.",
        response:
          "Significant reforms passed, but leverage caps were watered down, stress tests became periodic rather than continuous, and shadow banking has grown again — this time in private credit and money market funds.",
        title: "Dodd-Frank fixed the core problems",
      },
    ],
    discussionPrompt:
      "If subprime mortgages were obviously risky, why did AAA-rated CDOs built from them remain attractive to pension funds and sovereign wealth funds?",
    heroHighlights: [
      "Securitisation let originators profit by selling risk, not bearing it",
      "AAA-rated CDOs concentrated, rather than dispersed, systemic risk",
      "Shadow banking grew to rival regulated banking — without any safety net",
    ],
    miniLesson: {
    bands: [
      {
        threshold: 0,
        insight:
          "At 10× leverage a 10% loss on assets wipes out all equity — painful, but potentially absorbed through emergency capital. Bear Stearns operated around this level in the early 2000s and was considered conservative.",
      },
      {
        threshold: 5,
        insight:
          "At 15× leverage, a 7% asset decline eliminates equity entirely. Recovery requires external rescue or a fire sale that pushes asset prices down further — harming every other leveraged institution simultaneously.",
      },
      {
        threshold: 15,
        insight:
          "At 25× leverage — common at European banks and US investment banks by 2006–2007 — the system has almost no buffer. A 4% asset price decline wipes equity. Lehman Brothers was at roughly 30:1 when it failed.",
      },
      {
        threshold: 20,
        insight:
          "At 30–35×, a 3% asset decline is fatal. At these levels, failure is not a question of whether — it's a question of which asset class cracks first. The cascade at this leverage ratio engulfs counterparties and correspondent banks worldwide.",
      },
    ],
    defaultValue: 15,
    description:
      "Bank leverage amplifies both gains and losses. At 10× leverage, a 10% asset loss wipes out equity; at 35×, the same loss produces a 350% equity deficit. Move the slider to see how leverage ratios translate into systemic fragility.",
    highLabel: "35× (Lehman peak)",
    lowLabel: "10× (conservative)",
    metrics: [
      {
        base: 10,
        description: "Equity as a percentage of total assets — the buffer that absorbs losses before insolvency",
        key: "equity-cushion",
        label: "Equity cushion",
        max: 10,
        min: 2,
        slope: -0.28,
        suffix: "%",
        tone: "emerald",
      },
      {
        base: 1,
        description: "Estimated number of major institutions failing if the first one collapses",
        key: "cascade",
        label: "Cascade: institutions failing",
        max: 12,
        min: 1,
        slope: 0.4,
        suffix: " banks",
        tone: "rose",
      },
      {
        base: -1.5,
        description: "GDP contraction if 10% of the banking system's assets lose all value",
        key: "gdp-contraction",
        label: "GDP contraction",
        max: -1.5,
        min: -10,
        slope: -0.27,
        suffix: "%",
        tone: "amber",
      },
    ],
    prompt: "Drag the lever to see how leverage ratios determine whether a shock is absorbed or amplified.",
    sliderLabel: "Bank leverage ratio",
    step: 1,
    title: "The fragility multiplier",
    unit: "×",
    valueMax: 35,
    valueMin: 10,
  },
    realWorldExamples: [
      {
        insight:
          "Tranching allowed a pool of B-rated mortgages to produce a senior tranche rated AAA. This mathematical alchemy required house prices to never fall nationally at the same time — an assumption that failed in 2006.",
        outcome:
          "By 2006, over 80% of subprime mortgages were securitised into MBS and re-pooled into CDOs, receiving investment-grade ratings. When defaults rose, correlation between tranches — assumed to be low — proved near-perfect.",
        title: "Mortgage-backed securities and CDOs",
      },
      {
        insight:
          "AIG's CDS business functioned as insurance without reserves. When the housing market fell, AIG owed $440bn in credit protection it could not pay — turning a large insurer into a $182bn government bailout.",
        outcome:
          "AIG sold credit default swaps on CDOs to banks globally, effectively promising to pay if the CDOs defaulted. Without capital requirements, AIG's Financial Products division built a position it had no capacity to honour.",
        title: "AIG and the credit default swap market",
      },
      {
        insight:
          "Repo markets were the shadow banking system's deposit base. When Lehman's counterparties stopped rolling over repo, its $600bn balance sheet froze in 24 hours — showing how overnight funding can detonate a systemically important institution instantly.",
        outcome:
          "Lehman Brothers funded long-term illiquid assets with overnight repo. A $2bn collateral dispute triggered counterparty refusal to roll positions, making Chapter 11 the only option within days.",
        title: "Lehman Brothers and the repo freeze",
      },
    ],
    timeline: {
      title: "How the 2008 machine was built, cracked, and blew up",
      intro:
        "2008 was not one bad weekend. It was a decade-long construction project in which incentives, leverage, and shadow funding lined up to turn falling house prices into a global financial seizure.",
      events: [
        {
          timeLabel: "1999–2000",
          title: "The perimeter is opened",
          family: "Rule changes",
          whyItStarted:
            "Financial firms argued that old separations and derivatives oversight were blocking innovation and efficiency in modern capital markets.",
          turningPoint:
            "The Gramm-Leach-Bliley Act and Commodity Futures Modernization Act helped dissolve key firebreaks between commercial banking, securities, and opaque derivatives markets.",
          characteristics: [
            "Glass-Steagall era boundaries weakened",
            "OTC derivatives escape full transparency",
            "Shadow intermediation becomes easier to scale",
          ],
          outcome:
            "A larger, more interconnected financial system could grow outside the part regulators directly understood or controlled.",
        },
        {
          timeLabel: "2001–2004",
          title: "Cheap credit accelerates mortgage volume",
          family: "Credit expansion",
          whyItStarted:
            "Low interest rates after the dot-com crash made mortgages cheap, while investors searched for higher-yielding assets than government bonds.",
          turningPoint:
            "Mortgage origination increasingly focused on volume and fees because loans could be sold onward rather than kept on lenders’ balance sheets.",
          characteristics: [
            "Subprime and no-doc lending expands",
            "Originators paid on throughput, not repayment quality",
            "House prices rise fast enough to hide weak underwriting",
          ],
          outcome:
            "The system learned to treat rising house prices as evidence that the whole model was safe.",
        },
        {
          timeLabel: "2004–2006",
          title: "Securitisation and leverage peak together",
          family: "Fragility build-up",
          whyItStarted:
            "Banks, rating agencies, insurers, and investors all earned fees or carry by packaging risk rather than examining it.",
          turningPoint:
            "Pools of weak mortgages were tranched into AAA securities, while investment banks and shadow vehicles layered leverage on top of them.",
          characteristics: [
            "CDOs built from mortgage-backed securities",
            "AIG sells credit protection without equivalent reserves",
            "Repo funding treats risky collateral like near-cash",
          ],
          outcome:
            "The system became highly profitable precisely because it was converting fragile debt into instruments treated as safe.",
        },
        {
          timeLabel: "2007",
          title: "The first cracks appear",
          family: "Confidence break",
          whyItStarted:
            "House prices stopped rising nationally and mortgage defaults began to exceed the assumptions built into securitisation models.",
          turningPoint:
            "Bear Stearns hedge fund failures and BNP Paribas fund suspensions signaled that markets could no longer confidently price structured products.",
          characteristics: [
            "Correlation assumptions fail",
            "Funding stress rises in wholesale markets",
            "Confidence falls before the public crisis headline arrives",
          ],
          outcome:
            "The problem shifted from credit quality alone to uncertainty about who was exposed, by how much, and through which instruments.",
        },
        {
          timeLabel: "2008",
          title: "Lehman, AIG, and the global freeze",
          family: "Systemic rupture",
          whyItStarted:
            "Once repo lenders and counterparties doubted collateral quality, the short-term funding that sustained shadow banking evaporated.",
          turningPoint:
            "Lehman’s failure and AIG’s collapse threat turned a housing downturn into a generalized credit seizure.",
          characteristics: [
            "Wholesale funding runs replace retail deposit runs",
            "Interbank trust collapses",
            "Payments, pensions, and global trade all depend on rescue",
          ],
          outcome:
            "Governments had to backstop private balance sheets to stop the freeze from turning into depression-scale collapse.",
        },
        {
          timeLabel: "2010+",
          title: "Reform arrives, but the migration resumes",
          family: "Post-crisis response",
          whyItStarted:
            "Dodd-Frank, Basel III, and stress tests were created to stop a replay inside the same institutional channels.",
          turningPoint:
            "Capital rules tightened and living wills appeared, but risk gradually migrated toward private credit, money funds, and new non-bank structures.",
          characteristics: [
            "Higher capital inside regulated banking",
            "Living wills and periodic stress tests",
            "Shadow finance adapts faster than memory lasts",
          ],
          outcome:
            "The immediate architecture changed, but the underlying lesson remains: if leverage plus runnable funding can move outside the perimeter, fragility returns.",
        },
      ],
    },
    relatedFrameworks: ["Shadow Banking", "Securitisation", "Leverage Cycles", "Systemic Risk", "Moral Hazard"],
    simulationPrompt:
      "Adjust housing bubble size, leverage ratio, and bailout speed to see how 2008 could have been worse — or cut short with early intervention.",
    simulatorSlug: "financial-crisis",
    slug: "how-the-2008-financial-crisis-happened",
    simpleExplanation: [
      "The 2008 crisis was the result of a machine built to create and sell mortgage debt as fast as possible, with nobody in the chain having a lasting stake in whether the debt could actually be repaid. Mortgage originators sold loans for fees and passed the risk on. Banks packaged those loans into securities and sold them. Rating agencies rated those securities AAA for fees. Investors bought them without understanding what was inside.",
      "The critical invention was the CDO — a security built from tranches of mortgage pools. Mathematical models suggested that pooling thousands of geographically dispersed mortgages would diversify away default risk. The models assumed house prices in different US cities were uncorrelated. When the housing market fell nationally in 2006-2007, that assumption failed simultaneously everywhere, and the senior tranches rated AAA proved worthless.",
      "Shadow banking amplified everything. Investment banks, money market funds, and structured investment vehicles were performing bank-like functions — borrowing short, lending long, at high leverage — but without deposit insurance, capital requirements, or a lender of last resort. When confidence broke, the entire shadow system froze simultaneously. Lehman Brothers collapsed in 36 hours when repo counterparties stopped rolling overnight funding. The resulting credit freeze transmitted the financial crisis into a global recession.",
    ],
    systemBug: {
      signals: [
        "Originators earn fees on volume regardless of loan quality",
        "Ratings agencies are paid by the issuers they rate",
        "Regulatory capital rules apply only inside the official perimeter",
        "Rising asset prices validate the very leverage that inflated them",
      ],
      summary:
        "The system separated the party who originates risk from the party who bears it. Each link in the chain — originator, securitiser, rating agency, investor — had an incentive to pass the parcel rather than examine it.",
      title: "System bug: originate-to-distribute breaks the risk signal",
    },
  proposals: [
    {
      title: "Enforce hard leverage limits and living wills for systemically important banks",
      summary: "The 2008 crisis was a leverage crisis: banks had 35 dollars of assets for every 1 dollar of equity. Hard caps and mandatory wind-down plans make failure containable rather than catastrophic.",
      actor: "national_gov",
      domain: "economic",
      feasibility: "proven",
      precedents: [
        { place: "USA (Dodd-Frank)", year: 2010, outcome: "Living wills required for banks with $100bn+ assets; US bank equity ratios doubled vs. pre-crisis levels by 2015" },
        { place: "Switzerland", year: 2012, outcome: "Swiss Too Big to Fail law required UBS and Credit Suisse to hold 19% CET1 capital — among the highest globally" },
      ],
    },
    {
      title: "Require originators to retain 5-10% of securitised risk",
      summary: "Mortgage-backed CDOs allowed originators to sell risk immediately, removing the incentive to check borrower quality. Skin-in-the-game requirements restore alignment between those who create credit and those who bear loss.",
      actor: "national_gov",
      domain: "economic",
      feasibility: "proven",
      precedents: [
        { place: "EU", year: 2019, outcome: "Securitisation Regulation mandates 5% risk retention and disclosure requirements; reduced low-quality issuance" },
        { place: "USA", year: 2014, outcome: "Risk retention rules finalized under Dodd-Frank; required 5% retention for most securitisations" },
      ],
    },
    {
      title: "Replace short-term bank bonuses with long-term deferred compensation and clawbacks",
      summary: "Bonuses paid on quarterly earnings reward short-term risk-taking that creates long-term systemic fragility. Mandatory deferral of 50%+ of variable pay for 5-10 years, with clawback provisions, realigns incentives with stability.",
      actor: "national_gov",
      domain: "economic",
      feasibility: "proven",
      precedents: [
        { place: "EU (CRD IV)", year: 2014, outcome: "Banker bonus cap and deferral rules reduced variable pay ratios at large EU banks" },
        { place: "Switzerland", year: 2013, outcome: "Mandatory 3-year deferral and clawback rules introduced by FINMA after UBS losses" },
      ],
    },
  ],

  };

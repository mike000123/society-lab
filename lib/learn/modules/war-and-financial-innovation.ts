import type { LearningModule } from "./_types";

export const lessonData: LearningModule = {
  slug: "war-and-financial-innovation",
  accent: "amber",
  difficulty: "Intermediate",
  eyebrow: "War and Financial History",
  simulatorSlug: "war-finance",

  betterMetrics: [
    {
      label: "Debt-to-GDP trajectory",
      description: "Whether a government's debt ratio is rising or falling relative to economic output — the only metric that distinguishes sustainable from unsustainable borrowing.",
    },
    {
      label: "Primary balance",
      description: "Government revenues minus non-interest spending. A positive primary balance means the state is generating enough income to begin reducing its debt load.",
    },
    {
      label: "Average maturity of debt",
      description: "How long until existing debts must be repaid or refinanced. Short average maturities create rollover risk; long maturities give governments more time to adjust.",
    },
    {
      label: "Reserve currency share",
      description: "The fraction of global foreign exchange reserves held in a given currency. Measures the geopolitical premium that reduces borrowing costs for the issuing country.",
    },
  ],
  betterMetricsTitle: "Measure these alongside headline debt levels",

  counterArguments: [
    {
      title: "Wars create debt, not innovation",
      point: "The financial institutions created by wars would have emerged anyway through normal economic development. War merely accelerated what was already inevitable.",
      response: "The timing matters. The Bank of England was chartered specifically to solve the Nine Years' War financing problem in 1694 — 150 years after joint-stock companies appeared in England. The income tax was introduced under Napoleon-level fiscal emergency and abolished twice before becoming permanent. Path dependence is real: the specific form these institutions took was shaped by the crisis that produced them, not by some general developmental logic.",
    },
    {
      title: "Fiat money is inherently unstable",
      point: "The gold standard provided monetary discipline. Fiat money enables governments to spend beyond their means, producing inflation that punishes savers and the poor.",
      response: "The gold standard produced deflationary crises that also punished the poor — the Depression being the most vivid example. The practical test is which system performed better: the gold standard era featured repeated banking panics, deflations, and the Great Depression; the post-Bretton Woods fiat era featured higher average growth, lower unemployment, and the ability to respond to shocks (including 2008 and COVID) without the constraints that triggered the 1930s spiral. Monetary discipline is real and important, but it does not require gold.",
    },
    {
      title: "Dollar reserve dominance is ending",
      point: "The rise of China, the weaponisation of SWIFT sanctions, and the development of alternative payment systems suggest dollar dominance is declining.",
      response: "Dollar share of global reserves has declined from ~72% in 2000 to ~59% in 2023. This is a real shift, but reserve currency transitions are measured in decades, not years. A full transition would require a liquid, open, and politically stable alternative with deep bond markets — none of which China currently offers. The more likely outcome is slow multi-polarisation rather than rapid displacement.",
    },
  ],

  heroHighlights: [
    "The Bank of England was created in 1694 to fund one war. It managed the national debt for the next 330 years.",
    "Britain's income tax was introduced as a temporary wartime measure in 1799. It was abolished twice and returned permanently in 1842.",
    "Every major attempt to restore the gold standard after a world war failed. Today every currency in existence is fiat.",
  ],

  discussionPrompt: "Financial institutions created under wartime emergency — central banks, income tax, deposit insurance — became permanent features of peacetime economies. Does this suggest that crisis is necessary to produce major institutional change, or are there examples of comparable innovation in stable conditions? What does the pattern imply for how societies should think about financial reform today?",

  realWorldExamples: [
    {
      title: "Venice Monte Vecchio, 1262",
      insight: "Forced war loans became tradeable debt instruments, creating the world's first sovereign bond market.",
      outcome: "Venice financed continuous wars for two centuries; the prestiti became the template for every subsequent government bond.",
    },
    {
      title: "Bank of England charter, 1694",
      insight: "A private syndicate lent money to the Crown in exchange for a banking charter — aligning private profit with public war finance.",
      outcome: "The Bank managed British national debt for 330 years; the model was copied by France, the Netherlands, and the US Federal Reserve.",
    },
    {
      title: "Pitt's income tax, 1799",
      insight: "Wartime fiscal emergency produced the first direct tax on income rather than transactions or property.",
      outcome: "Abolished twice, returned permanently in 1842; income tax now funds every major government in the world.",
    },
    {
      title: "Jay Cooke's retail bond drive, 1862",
      insight: "War bonds sold to ordinary citizens through a nationwide agent network created retail financial markets for the first time.",
      outcome: "The infrastructure was reused for WWI Liberty Bonds and WWII war bonds ($185 billion); transformed American financial culture.",
    },
    {
      title: "Federal Reserve Act, 1913",
      insight: "The 1907 banking panic, resolved only by J.P. Morgan's personal intervention, proved that a central bank was necessary.",
      outcome: "The Fed was tested almost immediately by WWI, managing $32 billion in war spending; has operated as lender of last resort ever since.",
    },
    {
      title: "FDIC creation, 1933",
      insight: "After 9,000 bank failures, deposit insurance made individual bank runs irrational by guaranteeing deposits would be repaid regardless.",
      outcome: "Systemic bank runs essentially disappeared in the US for 90 years; the FDIC mechanism contained the 2023 Silicon Valley Bank failure.",
    },
    {
      title: "Bretton Woods conference, 1944",
      insight: "With WWII still ongoing, 44 nations designed the postwar monetary order from scratch — the first time this was done multilaterally.",
      outcome: "The IMF, World Bank, and dollar reserve system that emerged still structure international finance today, 80 years later.",
    },
    {
      title: "Nixon closes the gold window, 1971",
      insight: "The final severing of the dollar-gold link completed the transition to fiat money that began with WWI gold standard suspensions in 1914.",
      outcome: "Every currency in the world is now fiat; the intellectual and political legitimacy to make this work was built across a century of wartime necessity.",
    },
  ],


  causalLoop: {
    title: "The War–Finance–Institution Loop",
    description: "Wars create fiscal crises. Fiscal crises force institutional innovation. Innovations outlast the wars that created them, reshaping peacetime economies. The new institutions then make the next war more financeable — enabling larger conflicts and larger institutional responses.",
    nodes: [
      { id: "war", label: "War / crisis", x: 200, y: 30, tone: "rose" as const },
      { id: "fiscal_gap", label: "Fiscal gap", x: 340, y: 120, tone: "amber" as const },
      { id: "innovation", label: "Financial innovation", x: 340, y: 240, tone: "cyan" as const },
      { id: "state_capacity", label: "State fiscal capacity", x: 200, y: 320, tone: "emerald" as const },
      { id: "debt", label: "Sovereign debt", x: 60, y: 240, tone: "amber" as const },
      { id: "creditors", label: "Private creditor class", x: 60, y: 120, tone: "amber" as const },
    ],
    edges: [
      { from: "war", to: "fiscal_gap", label: "creates", polarity: "positive" as const },
      { from: "fiscal_gap", to: "innovation", label: "forces", polarity: "positive" as const },
      { from: "innovation", to: "state_capacity", label: "expands", polarity: "positive" as const },
      { from: "state_capacity", to: "debt", label: "enables", polarity: "positive" as const },
      { from: "debt", to: "creditors", label: "creates", polarity: "positive" as const },
      { from: "creditors", to: "innovation", label: "institutionalises", polarity: "positive" as const },
      { from: "state_capacity", to: "war", label: "finances next", polarity: "positive" as const, bend: -0.3 },
    ],
    loops: [
      "R1 — War → innovation → capacity → larger wars (self-reinforcing escalation)",
      "R2 — Debt → creditor class → lobbying for institution permanence",
    ],
  },

  miniLesson: {
    accent: "amber" as const,
    title: "Crises vs. Stability: Which produces bigger reforms?",
    subtitle: "Compare the scale of financial reform produced in crisis years versus stable periods",
    metrics: [
      {
        label: "Bank of England (1694)",
        signal: "Nine Years' War fiscal crisis",
        low: "Existing goldsmiths charged extortionate rates; Crown had defaulted before",
        high: "Chartered central bank managing national debt for 330+ years",
        description: "Crisis severity: existential war finance need. Reform scale: largest institutional innovation in British monetary history.",
      },
      {
        label: "Income tax (1799)",
        signal: "Napoleonic Wars — debt at 100% of GDP",
        low: "Traditional revenues (customs, excise, land tax) maxed out",
        high: "Permanent direct tax on income — still the primary revenue base of all modern states",
        description: "Introduced as temporary, abolished twice, returned permanently. Now raises ~40% of revenue in most developed economies.",
      },
      {
        label: "Federal Reserve (1913)",
        signal: "1907 banking panic — private bailout exposed systemic fragility",
        low: "J.P. Morgan personally organised the rescue; no institutional backstop existed",
        high: "Lender of last resort with full WWI deployment four years after creation",
        description: "The reform gap between crisis (1907) and institution (1913) shows even emergencies require political time.",
      },
      {
        label: "Bretton Woods (1944)",
        signal: "WWII — both UK (240% GDP) and US (119% GDP) debt at historic peaks",
        low: "Interwar gold standard chaos: competitive devaluations, trade collapse, Depression",
        high: "IMF, World Bank, dollar reserve system — still the architecture of global finance today",
        description: "Designed while war was still ongoing; the most ambitious monetary reform ever attempted in real time.",
      },
    ],
    conclusion: "Every transformative financial institution in the modern world was created under crisis conditions. The pattern is not coincidental — peacetime political systems lack the urgency to overcome the vested interests that resist change.",
  },

  relatedFrameworks: [
    "Charles Kindleberger — Manias, Panics, and Crashes",
    "Barry Eichengreen — international monetary system evolution",
    "Niall Ferguson — the ascent of money",
    "Adam Tooze — war finance and state capacity",
    "Keynes vs. White — competing visions at Bretton Woods",
    "Triffin dilemma — reserve currency tensions",
    "Modern Monetary Theory — sovereign money creation",
  ],

  simulationPrompt: "Explore the war-finance simulator to trace how government debt-to-GDP ratios spiked with each major conflict — and how the institutional innovations created in each crisis shaped the trajectory of debt in its aftermath.",

  simpleExplanation: [
    "The financial system we live in was not designed. It was patched together under pressure, one crisis at a time, over eight centuries. The Bank of England exists because England needed to borrow money for a war. The income tax exists because Napoleon was too expensive. The Federal Reserve exists because no private citizen should have to bail out the financial system personally. Deposit insurance exists because 9,000 banks failed in four years. Fiat money exists because world wars cannot be fought on a gold standard.",
    "The common thread is urgency. Peacetime political systems are slow — too many vested interests, too many competing priorities, too much ability for those who benefit from the status quo to delay change. Crises remove that friction. When a government cannot meet payroll, cannot fund its army, cannot stop a cascade of bank failures, the political cost of inaction finally exceeds the political cost of reform.",
    "The institutions that emerged from these crises then outlasted their origins. Income tax was meant to be temporary. The Bank of England was meant to fund one war. Deposit insurance was meant to stabilise one banking panic. They stayed because they found constituencies — bureaucracies that depended on them, creditors who benefited from them, publics who came to rely on them. The temporary became permanent; the emergency became infrastructure.",
  ],

  systemBug: {
    title: "System bug: crisis-dependency for institutional change",
    summary: "Modern democratic systems are structurally poor at producing major institutional change in peacetime. The veto points are too many, the vested interests too entrenched, and the time horizons of elected officials too short. The result is a system that waits for crises to force reform — and then keeps the reform long after the crisis has passed.",
    signals: [
      "Major financial reforms cluster tightly around crisis years (1694, 1799, 1913, 1933, 1944)",
      "Post-crisis reforms often weakened during subsequent stability periods (Glass-Steagall repealed 1999; Dodd-Frank weakened 2018)",
      "International monetary coordination requires existential threat (WWII) to overcome national interest politics",
      "Income taxes, central banks, and fiat money were all explicitly described as temporary at introduction",
      "Each crisis produces institutions designed for that crisis — not the next one",
    ],
  },

  proposals: [
    {
      title: "Permanent fiscal stabilisation fund",
      summary: "Establish a counter-cyclical sovereign wealth fund — contributions in boom years, drawdown in crises — to reduce dependence on emergency borrowing innovations.",
      actor: "national_gov",
      domain: "economic",
      feasibility: "emerging",
      precedents: [
        { place: "Norway", year: 1990, outcome: "Government Pension Fund Global grew to $1.7 trillion by 2023, providing a stable fiscal buffer across commodity price cycles" },
      ],
    },
    {
      title: "International sovereign debt restructuring mechanism",
      summary: "Create a standing multilateral forum for sovereign debt restructuring analogous to the IMF, reducing the ad hoc crises that currently accompany each episode of sovereign distress.",
      actor: "international",
      domain: "economic",
      feasibility: "contested",
    },
    {
      title: "Central bank climate financial stability mandate",
      summary: "Extend central bank mandates to include financial stability risks from climate change, allowing monetary institutions to respond to a non-war existential threat as they responded to wartime crises.",
      actor: "national_gov",
      domain: "environmental",
      feasibility: "emerging",
      precedents: [
        { place: "European Union", year: 2021, outcome: "ECB launched climate stress tests and began incorporating climate risk into collateral frameworks" },
      ],
    },
  ],
};

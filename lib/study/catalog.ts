export type StudyFormat =
  | "Website"
  | "Article"
  | "Book"
  | "Paper"
  | "Report"
  | "Dataset"
  | "Course"
  | "Tool"
  | "Channel"
  | "Podcast";

export type StudyLevel = "Starter" | "Intermediate" | "Deep dive";
export type StudyAccess = "Free" | "Mixed" | "Paid";
export type StudyAccent = "amber" | "cyan" | "emerald" | "rose";

export type StudyResource = {
  access: StudyAccess;
  communityKind?: "article" | "link";
  contributionSource?: "community" | "curated";
  contributorName?: string | null;
  format: StudyFormat;
  id: string;
  level: StudyLevel;
  source: string;
  summary: string;
  tags: string[];
  title: string;
  url: string;
};

export const STUDY_LEVELS: StudyLevel[] = ["Starter", "Intermediate", "Deep dive"];
export const STUDY_ACCESS_OPTIONS: StudyAccess[] = ["Free", "Mixed", "Paid"];

export type StudyCategory = {
  accent: StudyAccent;
  description: string;
  id: string;
  items: StudyResource[];
  title: string;
};

export const STUDY_CATEGORIES: StudyCategory[] = [
  {
    accent: "cyan",
    description:
      "Feedback loops, stocks and flows, tipping points, resilience, and the basic mindset for reading any system before trying to redesign it.",
    id: "systems-thinking",
    title: "Systems Thinking & Complexity",
    items: [
      {
        access: "Mixed",
        format: "Book",
        id: "systems-thinking-in-systems",
        level: "Starter",
        source: "Donella Meadows Project",
        summary:
          "The most accessible entry point into systems thinking, written to make feedback loops and stocks feel intuitive rather than abstract.",
        tags: ["feedback loops", "stocks and flows", "foundations"],
        title: "Thinking in Systems",
        url: "https://donellameadows.org/archives/thinking-in-systems-a-primer/",
      },
      {
        access: "Free",
        format: "Article",
        id: "systems-leverage-points",
        level: "Starter",
        source: "Donella Meadows Project",
        summary:
          "A short classic on where interventions actually matter: parameters, rules, goals, and paradigms.",
        tags: ["leverage points", "interventions", "design"],
        title: "Leverage Points: Places to Intervene in a System",
        url: "https://donellameadows.org/archives/leverage-points-places-to-intervene-in-a-system/",
      },
      {
        access: "Mixed",
        format: "Report",
        id: "systems-limits-to-growth",
        level: "Intermediate",
        source: "Club of Rome",
        summary:
          "The landmark World3 text on overshoot, delays, and why exponential growth collides with finite systems.",
        tags: ["World3", "overshoot", "limits to growth"],
        title: "The Limits to Growth",
        url: "https://www.clubofrome.org/publication/the-limits-to-growth/",
      },
      {
        access: "Free",
        format: "Website",
        id: "systems-sds",
        level: "Intermediate",
        source: "System Dynamics Society",
        summary:
          "A hub for system dynamics methods, community events, and model-based approaches to policy and complexity.",
        tags: ["system dynamics", "modeling", "policy"],
        title: "System Dynamics Society",
        url: "https://systemdynamics.org/",
      },
      {
        access: "Free",
        format: "Course",
        id: "systems-complexity-explorer",
        level: "Starter",
        source: "Santa Fe Institute",
        summary:
          "Free online courses that connect complexity science to economics, networks, emergence, and social systems.",
        tags: ["complexity", "online course", "emergence"],
        title: "Complexity Explorer",
        url: "https://www.complexityexplorer.org/",
      },
      {
        access: "Free",
        format: "Website",
        id: "systems-sfi",
        level: "Intermediate",
        source: "Santa Fe Institute",
        summary:
          "A strong research gateway if you want the broader complexity science angle behind many systemic ideas on the site.",
        tags: ["research", "complex systems", "networks"],
        title: "What Is Complex Systems Science?",
        url: "https://santafe.edu/what-is-complex-systems-science",
      },
      {
        access: "Free",
        format: "Tool",
        id: "systems-en-roads",
        level: "Starter",
        source: "Climate Interactive / MIT Sloan",
        summary:
          "A hands-on simulator for exploring climate and energy policy tradeoffs in one connected model.",
        tags: ["simulator", "climate", "policy testing"],
        title: "En-ROADS",
        url: "https://en-roads.climateinteractive.org/",
      },
      {
        access: "Free",
        format: "Website",
        id: "systems-systems-thinker",
        level: "Intermediate",
        source: "The Systems Thinker",
        summary:
          "A long-running archive of systems articles, diagrams, and practical applications across business, policy, and social change.",
        tags: ["systems practice", "articles", "feedback loops"],
        title: "The Systems Thinker",
        url: "https://thesystemsthinker.com/",
      },
    ],
  },
  {
    accent: "emerald",
    description:
      "Pluralist economics, inequality, industrial strategy, and the institutional side of who creates value and who gets to keep it.",
    id: "political-economy",
    title: "Political Economy & Inequality",
    items: [
      {
        access: "Free",
        format: "Course",
        id: "pe-core-econ",
        level: "Starter",
        source: "CORE Econ",
        summary:
          "A much better economics starting point than standard intro textbooks if you care about power, institutions, instability, and ecology.",
        tags: ["economics", "teaching", "pluralism"],
        title: "CORE Econ",
        url: "https://www.core-econ.org/",
      },
      {
        access: "Free",
        format: "Dataset",
        id: "pe-wid",
        level: "Starter",
        source: "World Inequality Database",
        summary:
          "The best open-access place to check long-run income and wealth concentration across countries.",
        tags: ["inequality", "wealth", "income"],
        title: "WID.world",
        url: "https://wid.world/",
      },
      {
        access: "Free",
        format: "Website",
        id: "pe-inet",
        level: "Intermediate",
        source: "Institute for New Economic Thinking",
        summary:
          "Research, essays, and talks on pluralist economics, money, crises, ecology, and political economy.",
        tags: ["pluralist economics", "research", "policy"],
        title: "Institute for New Economic Thinking",
        url: "https://www.ineteconomics.org/",
      },
      {
        access: "Free",
        format: "Website",
        id: "pe-evonomics",
        level: "Starter",
        source: "Evonomics",
        summary:
          "Readable essays connecting economics to evolution, institutions, power, and real-world evidence.",
        tags: ["institutions", "heterodox economics", "essays"],
        title: "Evonomics",
        url: "https://evonomics.com/",
      },
      {
        access: "Paid",
        format: "Book",
        id: "pe-how-growth-really-happens",
        level: "Deep dive",
        source: "Princeton University Press",
        summary:
          "A production-centered view of development that fits much better with governance and institutional capacity than GDP-only thinking.",
        tags: ["development", "industrial policy", "production"],
        title: "How Growth Really Happens",
        url: "https://cart.press.princeton.edu/how-growth-really-happens-pb.html",
      },
      {
        access: "Mixed",
        format: "Book",
        id: "pe-code-of-capital",
        level: "Deep dive",
        source: "Princeton University Press / Harvard Book Store",
        summary:
          "Explains how law quietly turns claims, assets, and contracts into durable wealth and structural inequality.",
        tags: ["law", "wealth", "asset power"],
        title: "The Code of Capital",
        url: "https://www.harvard.com/book/9780691208602",
      },
      {
        access: "Free",
        format: "Paper",
        id: "pe-entrepreneurial-state-public-options",
        level: "Intermediate",
        source: "UCL Institute for Innovation and Public Purpose",
        summary:
          "A concise public-value lens on the entrepreneurial state, public options, and why the state is not only a market fixer.",
        tags: ["state capacity", "public value", "industrial policy"],
        title: "The Entrepreneurial State and Public Options",
        url: "https://discovery.ucl.ac.uk/id/eprint/10196907/",
      },
      {
        access: "Free",
        format: "Website",
        id: "pe-common-wealth",
        level: "Intermediate",
        source: "Common Wealth",
        summary:
          "Research and proposals on democratic ownership, industrial strategy, wealth concentration, and institutional redesign.",
        tags: ["public ownership", "industrial policy", "wealth"],
        title: "Common Wealth",
        url: "https://www.common-wealth.org/",
      },
      {
        access: "Paid",
        format: "Book",
        id: "pe-value-of-everything",
        level: "Starter",
        source: "Penguin Random House",
        summary:
          "A readable challenge to the idea that markets simply reveal value rather than shaping and claiming it through institutions.",
        tags: ["value", "markets", "institutions"],
        title: "The Value of Everything",
        url: "https://www.penguinrandomhouse.com/books/562623/the-value-of-everything-by-mariana-mazzucato/",
      },
    ],
  },
  {
    accent: "emerald",
    description:
      "Credit creation, shadow banking, financial crises, and the institutions that shape where money goes before most people notice.",
    id: "money-banking",
    title: "Money, Banking & Financial Crises",
    items: [
      {
        access: "Free",
        format: "Article",
        id: "money-boe-money-creation",
        level: "Starter",
        source: "Bank of England",
        summary:
          "The cleanest official explanation of how commercial bank lending creates most of the money supply.",
        tags: ["money creation", "banking", "credit"],
        title: "Money Creation in the Modern Economy",
        url: "https://www.bankofengland.co.uk/quarterly-bulletin/2014/q1/money-creation-in-the-modern-economy",
      },
      {
        access: "Free",
        format: "Website",
        id: "money-bis",
        level: "Intermediate",
        source: "Bank for International Settlements",
        summary:
          "A useful doorway into central banking, liquidity, regulation, and global financial plumbing.",
        tags: ["central banking", "liquidity", "regulation"],
        title: "Bank for International Settlements",
        url: "https://www.bis.org/",
      },
      {
        access: "Free",
        format: "Website",
        id: "money-levy",
        level: "Intermediate",
        source: "Levy Economics Institute",
        summary:
          "A rich archive for post-Keynesian, Minskyan, and monetary research with a stronger real-world orientation than standard macro.",
        tags: ["Minsky", "post-Keynesian", "macro"],
        title: "Levy Economics Institute",
        url: "https://www.levyinstitute.org/",
      },
      {
        access: "Free",
        format: "Website",
        id: "money-positive-money",
        level: "Starter",
        source: "Positive Money",
        summary:
          "Accessible explainers and campaigns on money creation, public banking, and monetary reform.",
        tags: ["monetary reform", "public banking", "credit"],
        title: "Positive Money",
        url: "https://positivemoney.org/",
      },
      {
        access: "Mixed",
        format: "Course",
        id: "money-mehrling-course",
        level: "Intermediate",
        source: "Coursera / Perry Mehrling",
        summary:
          "A classic course on the money view, hierarchy of money, dealer of last resort, and shadow banking.",
        tags: ["money view", "shadow banking", "course"],
        title: "Economics of Money and Banking",
        url: "https://www.coursera.org/learn/money-banking",
      },
      {
        access: "Free",
        format: "Website",
        id: "money-imf-fd",
        level: "Starter",
        source: "IMF Finance & Development",
        summary:
          "A surprisingly useful magazine for high-level primers on debt, finance, growth, and global macro debates.",
        tags: ["IMF", "macro", "finance"],
        title: "Finance & Development",
        url: "https://www.imf.org/en/Publications/fandd",
      },
      {
        access: "Free",
        format: "Website",
        id: "money-chartbook",
        level: "Intermediate",
        source: "Adam Tooze",
        summary:
          "Fast, historically grounded analysis of crises, geopolitical economy, debt, and the polycrisis frame.",
        tags: ["newsletter", "financial crises", "geopolitics"],
        title: "Chartbook",
        url: "https://adamtooze.com/",
      },
      {
        access: "Free",
        format: "Website",
        id: "money-ecb-explainers",
        level: "Starter",
        source: "European Central Bank",
        summary:
          "Useful plain-language explainers on inflation, interest rates, banks, and the institutional role of central banking.",
        tags: ["ECB", "central banking", "inflation"],
        title: "ECB Explainers",
        url: "https://www.ecb.europa.eu/ecb/educational/explainers/html/index.en.html",
      },
    ],
  },
  {
    accent: "amber",
    description:
      "Grand corruption, foreign bribery, extractive industries, procurement opacity, and the cross-border networks that let elite deals scale.",
    id: "corruption-development",
    title: "Corruption, Extraction & Development Finance",
    items: [
      {
        access: "Free",
        format: "Website",
        id: "corr-ti",
        level: "Starter",
        source: "Transparency International",
        summary:
          "A core starting point for corruption indices, explainers, investigations, and policy proposals.",
        tags: ["corruption", "governance", "anti-corruption"],
        title: "Transparency International",
        url: "https://www.transparency.org/",
      },
      {
        access: "Free",
        format: "Website",
        id: "corr-global-witness",
        level: "Starter",
        source: "Global Witness",
        summary:
          "Investigations linking extraction, environmental harm, secrecy, and political power across borders.",
        tags: ["extractives", "investigations", "corporate power"],
        title: "Global Witness",
        url: "https://www.globalwitness.org/",
      },
      {
        access: "Free",
        format: "Article",
        id: "corr-export-corruption-article",
        level: "Starter",
        source: "Transparency International",
        summary:
          "A sharp framing of how firms from richer countries can supply the bribery side of corruption elsewhere.",
        tags: ["foreign bribery", "corporate corruption", "case studies"],
        title: "The Companies That Export Corruption",
        url: "https://www.transparency.org/en/news/the-companies-that-export-corruption",
      },
      {
        access: "Free",
        format: "Website",
        id: "corr-occrp",
        level: "Intermediate",
        source: "OCCRP",
        summary:
          "Investigative reporting on kleptocracy, shell companies, procurement abuse, and illicit finance.",
        tags: ["journalism", "kleptocracy", "shell companies"],
        title: "Organized Crime and Corruption Reporting Project",
        url: "https://www.occrp.org/",
      },
      {
        access: "Free",
        format: "Website",
        id: "corr-open-contracting",
        level: "Starter",
        source: "Open Contracting Partnership",
        summary:
          "Practical resources on making procurement legible before inflated contracts and kickbacks are baked in.",
        tags: ["procurement", "contracts", "transparency"],
        title: "Open Contracting Partnership",
        url: "https://www.open-contracting.org/",
      },
      {
        access: "Free",
        format: "Website",
        id: "corr-oecd-bribery",
        level: "Intermediate",
        source: "OECD",
        summary:
          "The institutional backbone for understanding foreign bribery enforcement and why supply-side reform matters.",
        tags: ["foreign bribery", "OECD", "enforcement"],
        title: "Fighting Foreign Bribery",
        url: "https://www.oecd.org/corruption/oecdantibriberyconvention.htm",
      },
      {
        access: "Free",
        format: "Website",
        id: "corr-eiti",
        level: "Starter",
        source: "Extractive Industries Transparency Initiative",
        summary:
          "Contract transparency, beneficial ownership, and revenue disclosure for oil, gas, and mining.",
        tags: ["extractives", "beneficial ownership", "revenues"],
        title: "EITI",
        url: "https://eiti.org/",
      },
      {
        access: "Free",
        format: "Website",
        id: "corr-u4",
        level: "Intermediate",
        source: "U4 Anti-Corruption Resource Centre",
        summary:
          "A deeper research hub with sector-specific anti-corruption guidance and practitioner notes.",
        tags: ["research hub", "anti-corruption", "governance"],
        title: "U4 Anti-Corruption Resource Centre",
        url: "https://www.u4.no/",
      },
      {
        access: "Free",
        format: "Website",
        id: "corr-pwyp",
        level: "Intermediate",
        source: "Publish What You Pay",
        summary:
          "Campaigns and resources focused on natural-resource transparency and public accountability.",
        tags: ["extractives", "campaign", "resource governance"],
        title: "Publish What You Pay",
        url: "https://www.publishwhatyoupay.org/",
      },
      {
        access: "Paid",
        format: "Book",
        id: "corr-economic-hitman",
        level: "Starter",
        source: "Berrett-Koehler Publishers",
        summary:
          "Best read as a provocative narrative lens on debt, development power, and elite deals - then checked against stronger empirical sources.",
        tags: ["debt", "development finance", "narrative"],
        title: "Confessions of an Economic Hit Man",
        url: "https://bkconnection.com/products/9781523001897_confessions-of-an-economic-hit-man-3rd-edition",
      },
      {
        access: "Free",
        format: "Website",
        id: "corr-nrgi",
        level: "Intermediate",
        source: "Natural Resource Governance Institute",
        summary:
          "A strong resource for extractive-governance research, policy analysis, and the institutional side of oil, gas, and mining dependence.",
        tags: ["extractives", "resource governance", "institutions"],
        title: "Natural Resource Governance Institute",
        url: "https://resourcegovernance.org/",
      },
      {
        access: "Free",
        format: "Website",
        id: "corr-debt-justice",
        level: "Starter",
        source: "Debt Justice",
        summary:
          "Campaigns and explainers on sovereign debt, unjust repayment burdens, and the political economy of financial dependence.",
        tags: ["sovereign debt", "campaign", "development finance"],
        title: "Debt Justice",
        url: "https://debtjustice.org.uk/",
      },
    ],
  },
  {
    accent: "cyan",
    description:
      "Planetary boundaries, climate risk, ecological economics, and the frameworks that put the economy back inside biophysical limits.",
    id: "ecology-climate",
    title: "Ecology, Climate & Doughnut Economics",
    items: [
      {
        access: "Free",
        format: "Website",
        id: "eco-kate-raworth",
        level: "Starter",
        source: "Kate Raworth",
        summary:
          "A clear gateway into the doughnut frame: social foundations, ecological ceilings, and the safe-and-just space in between.",
        tags: ["doughnut economics", "social foundation", "ecological ceiling"],
        title: "What on Earth Is the Doughnut?",
        url: "https://www.kateraworth.com/doughnut/",
      },
      {
        access: "Free",
        format: "Website",
        id: "eco-deal",
        level: "Starter",
        source: "Doughnut Economics Action Lab",
        summary:
          "The best place to see what doughnut thinking looks like in practice across cities, policy, and organizations.",
        tags: ["cities", "practice", "redesign"],
        title: "Doughnut Economics Action Lab",
        url: "https://doughnuteconomics.org/",
      },
      {
        access: "Free",
        format: "Website",
        id: "eco-planetary-boundaries",
        level: "Starter",
        source: "Stockholm Resilience Centre",
        summary:
          "A central reference for the planetary boundaries framework and why tipping risks are systemic, not isolated.",
        tags: ["planetary boundaries", "tipping points", "resilience"],
        title: "Planetary Boundaries",
        url: "https://www.stockholmresilience.org/research/planetary-boundaries.html",
      },
      {
        access: "Free",
        format: "Paper",
        id: "eco-planetary-boundaries-paper",
        level: "Deep dive",
        source: "Stockholm Resilience Centre / Science",
        summary:
          "A peer-reviewed update linking planetary boundaries to governance and development choices.",
        tags: ["paper", "safe operating space", "earth systems"],
        title: "Planetary Boundaries: Guiding Human Development on a Changing Planet",
        url: "https://www.stockholmresilience.org/publications/publications/2016-04-15-planetary-boundaries-guiding-human-development-on-a-changing-planet.html",
      },
      {
        access: "Free",
        format: "Website",
        id: "eco-ipcc",
        level: "Intermediate",
        source: "IPCC",
        summary:
          "The main official source for climate science assessments, working-group reports, and synthesis findings.",
        tags: ["IPCC", "climate science", "assessment"],
        title: "Intergovernmental Panel on Climate Change",
        url: "https://www.ipcc.ch/",
      },
      {
        access: "Free",
        format: "Website",
        id: "eco-drawdown",
        level: "Starter",
        source: "Project Drawdown",
        summary:
          "Useful when you want to move from climate diagnosis to concrete decarbonization and adaptation options.",
        tags: ["solutions", "decarbonization", "climate action"],
        title: "Project Drawdown",
        url: "https://drawdown.org/",
      },
      {
        access: "Free",
        format: "Channel",
        id: "eco-climate-town",
        level: "Starter",
        source: "Climate Town",
        summary:
          "A strong YouTube-style explainer series for climate politics, infrastructure, greenwashing, and fossil fuel narratives.",
        tags: ["channel", "climate politics", "media literacy"],
        title: "Climate Town",
        url: "https://www.youtube.com/@ClimateTown",
      },
      {
        access: "Free",
        format: "Website",
        id: "eco-earth4all",
        level: "Starter",
        source: "Earth4All",
        summary:
          "Systems-based work on wellbeing, inequality, poverty, and ecological stability from a Club of Rome-adjacent perspective.",
        tags: ["systems model", "wellbeing", "future scenarios"],
        title: "Earth4All",
        url: "https://earth4all.life/",
      },
      {
        access: "Free",
        format: "Website",
        id: "eco-weall",
        level: "Starter",
        source: "Wellbeing Economy Alliance",
        summary:
          "A broad coalition and resource hub for moving beyond GDP-centered policy toward wellbeing within ecological limits.",
        tags: ["wellbeing economy", "beyond GDP", "coalition"],
        title: "Wellbeing Economy Alliance",
        url: "https://weall.org/",
      },
    ],
  },
  {
    accent: "rose",
    description:
      "Attention markets, platform power, extraction of behavioral data, and the institutions that shape what gets amplified online.",
    id: "media-surveillance",
    title: "Media, Attention & Digital Power",
    items: [
      {
        access: "Free",
        format: "Website",
        id: "media-data-society",
        level: "Starter",
        source: "Data & Society",
        summary:
          "High-quality research on platforms, AI, labor, moderation, and the social consequences of digital infrastructures.",
        tags: ["platforms", "AI", "research"],
        title: "Data & Society",
        url: "https://datasociety.net/",
      },
      {
        access: "Free",
        format: "Website",
        id: "media-eff",
        level: "Starter",
        source: "Electronic Frontier Foundation",
        summary:
          "A practical civil-liberties lens on surveillance, privacy, platform governance, and digital rights.",
        tags: ["privacy", "surveillance", "civil liberties"],
        title: "Electronic Frontier Foundation",
        url: "https://www.eff.org/",
      },
      {
        access: "Free",
        format: "Website",
        id: "media-humane-tech",
        level: "Starter",
        source: "Center for Humane Technology",
        summary:
          "Useful for the attention-economy critique and for connecting platform design to human behavior and democracy.",
        tags: ["attention economy", "design", "platform harms"],
        title: "Center for Humane Technology",
        url: "https://www.humanetech.com/",
      },
      {
        access: "Free",
        format: "Website",
        id: "media-markup",
        level: "Intermediate",
        source: "The Markup",
        summary:
          "Investigative tech journalism focused on how digital systems actually work in practice and who they harm.",
        tags: ["investigations", "algorithms", "journalism"],
        title: "The Markup",
        url: "https://themarkup.org/",
      },
      {
        access: "Free",
        format: "Website",
        id: "media-mozilla",
        level: "Starter",
        source: "Mozilla Foundation",
        summary:
          "A broader public-interest-technology hub with campaigns, reports, and policy work around healthier digital ecosystems.",
        tags: ["digital rights", "public interest tech", "AI"],
        title: "Mozilla Foundation",
        url: "https://foundation.mozilla.org/",
      },
      {
        access: "Paid",
        format: "Book",
        id: "media-atlas-of-ai",
        level: "Intermediate",
        source: "Yale University Press",
        summary:
          "Connects AI systems to labor, extraction, logistics, state power, and planetary cost rather than treating AI as just software.",
        tags: ["AI", "labor", "planetary costs"],
        title: "Atlas of AI",
        url: "https://yalebooks.yale.edu/book/9780300264630/atlas-of-ai/",
      },
      {
        access: "Paid",
        format: "Book",
        id: "media-surveillance-capitalism",
        level: "Deep dive",
        source: "PublicAffairs / Hachette",
        summary:
          "The canonical long-form account of surveillance capitalism as a new economic order of behavioral extraction.",
        tags: ["surveillance capitalism", "behavioral data", "platform power"],
        title: "The Age of Surveillance Capitalism",
        url: "https://www.hachettebookgroup.com/titles/shoshana-zuboff/the-age-of-surveillance-capitalism/9781541758001/?lens=publicaffairs",
      },
      {
        access: "Paid",
        format: "Book",
        id: "media-chaos-machine",
        level: "Starter",
        source: "Little, Brown and Company / Hachette",
        summary:
          "A strong narrative complement to the theory: how social platforms reshaped politics and public life on the ground.",
        tags: ["social media", "politics", "platforms"],
        title: "The Chaos Machine",
        url: "https://www.hachettebookgroup.com/titles/max-fisher/the-chaos-machine/9780316703314/",
      },
      {
        access: "Free",
        format: "Podcast",
        id: "media-tech-wont-save-us",
        level: "Starter",
        source: "Tech Won't Save Us",
        summary:
          "A very good interview archive if you want political rather than hype-driven conversations about tech.",
        tags: ["podcast", "tech criticism", "political economy"],
        title: "Tech Won't Save Us",
        url: "https://techwontsave.us/",
      },
      {
        access: "Free",
        format: "Website",
        id: "media-ai-now",
        level: "Intermediate",
        source: "AI Now Institute",
        summary:
          "Research and policy work on AI power, accountability, labor, and governance beyond product hype.",
        tags: ["AI governance", "policy", "accountability"],
        title: "AI Now Institute",
        url: "https://ainowinstitute.org/",
      },
      {
        access: "Free",
        format: "Website",
        id: "media-ajl",
        level: "Starter",
        source: "Algorithmic Justice League",
        summary:
          "A practical entry point into algorithmic bias, measurement, and the social consequences of automated decision systems.",
        tags: ["algorithms", "bias", "justice"],
        title: "Algorithmic Justice League",
        url: "https://www.ajl.org/",
      },
    ],
  },
  {
    accent: "cyan",
    description:
      "Urban form, housing, transport, and the everyday systems that quietly decide how expensive, stressful, or social life feels.",
    id: "cities-housing",
    title: "Cities, Housing & Transport",
    items: [
      {
        access: "Paid",
        format: "Book",
        id: "city-jane-jacobs",
        level: "Starter",
        source: "Penguin Random House",
        summary:
          "Still one of the best lenses for street life, local complexity, mixed use, and why top-down planning misreads cities.",
        tags: ["urbanism", "street life", "planning"],
        title: "The Death and Life of Great American Cities",
        url: "https://www.penguinrandomhouse.com/books/60823/the-death-and-life-of-great-american-cities-by-jane-jacobs-introduction-by-robert-kanigel-afterword-by-marshall-berman/",
      },
      {
        access: "Free",
        format: "Website",
        id: "city-strong-towns",
        level: "Starter",
        source: "Strong Towns",
        summary:
          "Excellent on the financial fragility of car-centric planning, suburban growth patterns, and municipal insolvency.",
        tags: ["transport", "fiscal urbanism", "land use"],
        title: "Strong Towns",
        url: "https://www.strongtowns.org/home",
      },
      {
        access: "Free",
        format: "Website",
        id: "city-itdp",
        level: "Starter",
        source: "Institute for Transportation and Development Policy",
        summary:
          "A practical resource for sustainable transport, BRT, walkability, cycling, and street redesign.",
        tags: ["transit", "walkability", "BRT"],
        title: "ITDP",
        url: "https://itdp.org/home/",
      },
      {
        access: "Free",
        format: "Website",
        id: "city-shelterforce",
        level: "Intermediate",
        source: "Shelterforce",
        summary:
          "Independent reporting and essays on housing justice, tenant power, displacement, and community development.",
        tags: ["housing justice", "tenants", "community"],
        title: "Shelterforce",
        url: "https://shelterforce.org/",
      },
      {
        access: "Free",
        format: "Website",
        id: "city-urban-institute",
        level: "Intermediate",
        source: "Urban Institute",
        summary:
          "Useful for housing policy, land use, transit, community resilience, and local public-finance research.",
        tags: ["housing policy", "urban data", "communities"],
        title: "Housing and Communities",
        url: "https://www.urban.org/research-and-evidence/housing-and-communities?page=1",
      },
      {
        access: "Free",
        format: "Website",
        id: "city-c40-knowledge-hub",
        level: "Intermediate",
        source: "C40 Cities",
        summary:
          "A city-focused resource bank on climate planning, retrofit, mobility, and urban transition policies.",
        tags: ["cities", "climate action", "mobility"],
        title: "C40 Knowledge Hub",
        url: "https://www.c40.org/the-c40-knowledge-hub/",
      },
      {
        access: "Free",
        format: "Channel",
        id: "city-not-just-bikes",
        level: "Starter",
        source: "YouTube",
        summary:
          "One of the best introductory channels for understanding why car dependency is not just transport policy but a full social design choice.",
        tags: ["YouTube", "urban design", "mobility"],
        title: "Not Just Bikes",
        url: "https://www.youtube.com/@NotJustBikes",
      },
      {
        access: "Free",
        format: "Website",
        id: "city-parking-reform-network",
        level: "Intermediate",
        source: "Parking Reform Network",
        summary:
          "A focused resource for understanding how parking minimums and road-space rules quietly distort housing, transport, and land use.",
        tags: ["parking", "zoning", "land use"],
        title: "Parking Reform Network",
        url: "https://parkingreform.org/",
      },
      {
        access: "Free",
        format: "Channel",
        id: "city-city-beautiful",
        level: "Starter",
        source: "City Beautiful",
        summary:
          "Urban-planning videos that connect policy, history, design, and the everyday experience of streets and neighborhoods.",
        tags: ["urban planning", "channel", "cities"],
        title: "City Beautiful",
        url: "https://citybeautiful.city/",
      },
    ],
  },
  {
    accent: "amber",
    description:
      "Democratic redesign, citizens' assemblies, open government, participatory structures, and institutional defenses against capture.",
    id: "democracy-governance",
    title: "Democracy, Governance & Civic Design",
    items: [
      {
        access: "Free",
        format: "Website",
        id: "demo-participedia",
        level: "Starter",
        source: "Participedia",
        summary:
          "A global database of democratic processes, assemblies, participatory budgets, and civic experiments.",
        tags: ["citizens assemblies", "participation", "cases"],
        title: "Participedia",
        url: "https://participedia.net/",
      },
      {
        access: "Free",
        format: "Website",
        id: "demo-democracynext",
        level: "Starter",
        source: "DemocracyNext",
        summary:
          "Focused on citizens' assemblies, lotteries, and institutional redesign beyond elite-only politics.",
        tags: ["sortition", "assemblies", "democracy reform"],
        title: "DemocracyNext",
        url: "https://demnext.org/",
      },
      {
        access: "Free",
        format: "Website",
        id: "demo-oecd-citizen-participation",
        level: "Intermediate",
        source: "OECD",
        summary:
          "A useful official gateway to evidence and frameworks around representative deliberation and democratic innovation.",
        tags: ["deliberation", "OECD", "public participation"],
        title: "Innovative Citizen Participation",
        url: "https://www.oecd.org/gov/open-government/innovative-citizen-participation.htm",
      },
      {
        access: "Free",
        format: "Website",
        id: "demo-ogp",
        level: "Starter",
        source: "Open Government Partnership",
        summary:
          "Best for transparency, accountability, and open-government commitments that are broader than election mechanics.",
        tags: ["open government", "accountability", "transparency"],
        title: "Open Government Partnership",
        url: "https://www.opengovpartnership.org/",
      },
      {
        access: "Free",
        format: "Website",
        id: "demo-world-justice-project",
        level: "Starter",
        source: "World Justice Project",
        summary:
          "A strong gateway for rule of law, institutional accountability, civic justice, and comparative governance indicators across countries.",
        tags: ["rule of law", "governance", "justice", "institutions"],
        title: "World Justice Project",
        url: "https://worldjusticeproject.org/",
      },
      {
        access: "Free",
        format: "Website",
        id: "demo-brennan",
        level: "Intermediate",
        source: "Brennan Center for Justice",
        summary:
          "Strong work on democracy reform, money in politics, voting rights, courts, and institutional guardrails.",
        tags: ["democracy reform", "voting rights", "money in politics"],
        title: "Brennan Center for Justice",
        url: "https://www.brennancenter.org/",
      },
      {
        access: "Free",
        format: "Website",
        id: "demo-vtaiwan",
        level: "Intermediate",
        source: "vTaiwan",
        summary:
          "A living example of digital deliberation and issue-based public consultation rather than one-off election participation.",
        tags: ["digital democracy", "Taiwan", "deliberation"],
        title: "vTaiwan",
        url: "https://info.vtaiwan.tw/",
      },
      {
        access: "Free",
        format: "Website",
        id: "demo-international-idea",
        level: "Intermediate",
        source: "International IDEA",
        summary:
          "A strong comparative-democracy hub for institutions, participation, electoral design, and democratic resilience.",
        tags: ["democracy", "institutions", "comparative politics"],
        title: "International IDEA",
        url: "https://www.idea.int/",
      },
    ],
  },
  {
    accent: "rose",
    description:
      "A practical shortlist of the strongest Our World in Data pages for Society Lab. Best used as the evidence layer behind modules on inequality, ecology, governance, cities, rights, and information systems.",
    id: "owid-shortlist",
    title: "Our World in Data: Best Fits for Society Lab",
    items: [
      {
        access: "Free",
        format: "Website",
        id: "owid-economic-inequality",
        level: "Starter",
        source: "Our World in Data",
        summary:
          "The best OWID starting point for long-run income and wealth distribution, especially top-income shares, Gini trends, and redistribution comparisons.",
        tags: ["owid", "money & wealth", "inequality", "redistribution"],
        title: "Economic Inequality",
        url: "https://ourworldindata.org/economic-inequality",
      },
      {
        access: "Free",
        format: "Website",
        id: "owid-poverty",
        level: "Starter",
        source: "Our World in Data",
        summary:
          "Useful for grounding poverty, deprivation, and global-development claims in long-run evidence rather than anecdote.",
        tags: ["owid", "money & wealth", "poverty", "development"],
        title: "Poverty",
        url: "https://ourworldindata.org/poverty",
      },
      {
        access: "Free",
        format: "Website",
        id: "owid-taxation",
        level: "Intermediate",
        source: "Our World in Data",
        summary:
          "Strong for comparing tax composition, tax-to-GDP, and how states raise revenue across countries and time.",
        tags: ["owid", "money & wealth", "tax", "public finance"],
        title: "Taxation",
        url: "https://ourworldindata.org/taxation",
      },
      {
        access: "Free",
        format: "Website",
        id: "owid-happiness",
        level: "Starter",
        source: "Our World in Data",
        summary:
          "A direct evidence companion to the GDP-versus-wellbeing module, especially for life satisfaction and quality-of-life comparisons.",
        tags: ["owid", "wellbeing", "happiness", "gdp critique"],
        title: "Happiness and Life Satisfaction",
        url: "https://ourworldindata.org/happiness-and-life-satisfaction",
      },
      {
        access: "Free",
        format: "Website",
        id: "owid-work-employment",
        level: "Starter",
        source: "Our World in Data",
        summary:
          "Helpful for placing labor-market change, sector shifts, and employment structure in historical context.",
        tags: ["owid", "work", "employment", "labor"],
        title: "Work and Employment",
        url: "https://ourworldindata.org/work-employment",
      },
      {
        access: "Free",
        format: "Website",
        id: "owid-working-hours",
        level: "Starter",
        source: "Our World in Data",
        summary:
          "Especially useful if the site expands on free time, overwork, and whether productivity gains improve lived time.",
        tags: ["owid", "work", "time", "wellbeing"],
        title: "Working Hours",
        url: "https://ourworldindata.org/working-hours",
      },
      {
        access: "Free",
        format: "Website",
        id: "owid-co2",
        level: "Starter",
        source: "Our World in Data",
        summary:
          "The clearest single OWID topic page for emissions, responsibility, per-capita comparisons, and long-run climate trends.",
        tags: ["owid", "ecology & limits", "climate", "emissions"],
        title: "CO2 and Greenhouse Gas Emissions",
        url: "https://ourworldindata.org/co2-and-greenhouse-gas-emissions",
      },
      {
        access: "Free",
        format: "Website",
        id: "owid-energy",
        level: "Starter",
        source: "Our World in Data",
        summary:
          "Useful for energy mixes, transition pathways, electricity access, and the infrastructure side of decarbonization.",
        tags: ["owid", "ecology & limits", "energy", "transition"],
        title: "Energy",
        url: "https://ourworldindata.org/energy",
      },
      {
        access: "Free",
        format: "Website",
        id: "owid-air-pollution",
        level: "Starter",
        source: "Our World in Data",
        summary:
          "One of the strongest OWID pages for showing how pollution becomes a public-health and systems problem.",
        tags: ["owid", "ecology & limits", "pollution", "public health"],
        title: "Air Pollution",
        url: "https://ourworldindata.org/air-pollution",
      },
      {
        access: "Free",
        format: "Website",
        id: "owid-biodiversity",
        level: "Intermediate",
        source: "Our World in Data",
        summary:
          "Helpful for explaining ecosystem decline, extinction pressure, and why ecological limits are not only a carbon story.",
        tags: ["owid", "ecology & limits", "biodiversity", "ecosystems"],
        title: "Biodiversity",
        url: "https://ourworldindata.org/biodiversity",
      },
      {
        access: "Free",
        format: "Website",
        id: "owid-forests-deforestation",
        level: "Intermediate",
        source: "Our World in Data",
        summary:
          "A strong long-run page for forests, land-use change, and ecological tradeoffs in development.",
        tags: ["owid", "ecology & limits", "deforestation", "land use"],
        title: "Forests and Deforestation",
        url: "https://ourworldindata.org/forests-and-deforestation",
      },
      {
        access: "Free",
        format: "Website",
        id: "owid-clean-water",
        level: "Starter",
        source: "Our World in Data",
        summary:
          "Useful for connecting ecology to everyday life through sanitation, safe water, disease, and infrastructure access.",
        tags: ["owid", "ecology & limits", "water", "sanitation"],
        title: "Clean Water and Sanitation",
        url: "https://ourworldindata.org/clean-water-sanitation",
      },
      {
        access: "Free",
        format: "Website",
        id: "owid-urbanization",
        level: "Starter",
        source: "Our World in Data",
        summary:
          "The strongest OWID page for city growth, density, slum populations, and the long-run urban transition.",
        tags: ["owid", "cities & everyday life", "urbanization", "density"],
        title: "Urbanization",
        url: "https://ourworldindata.org/urbanization",
      },
      {
        access: "Free",
        format: "Website",
        id: "owid-corruption",
        level: "Starter",
        source: "Our World in Data",
        summary:
          "Good for comparative context on perceived corruption, institutional quality, and broad governance patterns.",
        tags: ["owid", "power & politics", "corruption", "governance"],
        title: "Corruption",
        url: "https://ourworldindata.org/corruption",
      },
      {
        access: "Free",
        format: "Website",
        id: "owid-democracy",
        level: "Starter",
        source: "Our World in Data",
        summary:
          "Useful for democracy trends, regime comparison, participation, and political development over time.",
        tags: ["owid", "power & politics", "democracy", "institutions"],
        title: "Democracy",
        url: "https://ourworldindata.org/democracy",
      },
      {
        access: "Free",
        format: "Website",
        id: "owid-state-capacity",
        level: "Intermediate",
        source: "Our World in Data",
        summary:
          "One of the best fits for governance content because it links institutions to implementation capacity rather than slogans.",
        tags: ["owid", "power & politics", "state capacity", "implementation"],
        title: "State Capacity",
        url: "https://ourworldindata.org/state-capacity",
      },
      {
        access: "Free",
        format: "Website",
        id: "owid-human-rights",
        level: "Intermediate",
        source: "Our World in Data",
        summary:
          "Useful background for rights-based movements, formal legal protections, and uneven rights progress across countries.",
        tags: ["owid", "power & politics", "human rights", "citizenship"],
        title: "Human Rights",
        url: "https://ourworldindata.org/human-rights",
      },
      {
        access: "Free",
        format: "Website",
        id: "owid-womens-rights",
        level: "Intermediate",
        source: "Our World in Data",
        summary:
          "A direct fit for suffrage, gendered power, rights expansion, and long-run institutional change around women's status.",
        tags: ["owid", "power & politics", "women's rights", "gender"],
        title: "Women’s Rights",
        url: "https://ourworldindata.org/women-rights",
      },
      {
        access: "Free",
        format: "Website",
        id: "owid-internet",
        level: "Starter",
        source: "Our World in Data",
        summary:
          "The best OWID page for internet access and digital infrastructure as background for networked movements and attention systems.",
        tags: ["owid", "information & attention", "internet", "digital access"],
        title: "Internet",
        url: "https://ourworldindata.org/internet",
      },
      {
        access: "Free",
        format: "Website",
        id: "owid-global-education",
        level: "Starter",
        source: "Our World in Data",
        summary:
          "Useful for literacy, schooling, and educational access when discussing why some movements and institutions scale better than others.",
        tags: ["owid", "education", "literacy", "social foundations"],
        title: "Global Education",
        url: "https://ourworldindata.org/global-education",
      },
    ],
  },
  {
    accent: "rose",
    description:
      "Datasets, dashboards, and institutional repositories that help you move from claims and narratives to evidence.",
    id: "data-research",
    title: "Data, Dashboards & Research Hubs",
    items: [
      {
        access: "Free",
        format: "Dataset",
        id: "data-owid",
        level: "Starter",
        source: "Our World in Data",
        summary:
          "The easiest place to quickly sanity-check long-run global trends before reaching for a hot take.",
        tags: ["data", "global trends", "charts"],
        title: "Our World in Data",
        url: "https://ourworldindata.org/",
      },
      {
        access: "Free",
        format: "Dataset",
        id: "data-world-bank",
        level: "Starter",
        source: "World Bank",
        summary:
          "A foundational source for macro, development, demographics, and sector indicators across countries.",
        tags: ["development", "macro", "country data"],
        title: "World Bank Data",
        url: "https://data.worldbank.org/",
      },
      {
        access: "Free",
        format: "Dataset",
        id: "data-undp",
        level: "Starter",
        source: "UNDP",
        summary:
          "Useful for human development indicators when GDP alone is too narrow a frame.",
        tags: ["human development", "HDI", "wellbeing"],
        title: "UNDP Human Development Data Center",
        url: "https://hdr.undp.org/data-center",
      },
      {
        access: "Free",
        format: "Dataset",
        id: "data-vdem",
        level: "Intermediate",
        source: "V-Dem",
        summary:
          "Deep democracy data covering liberal, electoral, participatory, deliberative, and egalitarian dimensions.",
        tags: ["democracy", "institutions", "indices"],
        title: "V-Dem",
        url: "https://v-dem.net/",
      },
      {
        access: "Free",
        format: "Dataset",
        id: "data-qog",
        level: "Intermediate",
        source: "Quality of Government Institute",
        summary:
          "Excellent for corruption, administrative quality, governance, and comparative institutional analysis.",
        tags: ["governance", "corruption", "institutions"],
        title: "QoG Data",
        url: "https://www.gu.se/en/quality-government/qog-data",
      },
      {
        access: "Free",
        format: "Dataset",
        id: "data-oecd",
        level: "Starter",
        source: "OECD",
        summary:
          "A good cross-country source for housing, tax, education, labor, social policy, and public-finance comparisons.",
        tags: ["OECD", "comparative policy", "social indicators"],
        title: "OECD Data",
        url: "https://www.oecd.org/en/data.html",
      },
      {
        access: "Free",
        format: "Dataset",
        id: "data-imf",
        level: "Intermediate",
        source: "IMF",
        summary:
          "Strong for fiscal, debt, balance-of-payments, and macro-financial series when you need official cross-country data.",
        tags: ["debt", "fiscal", "macro data"],
        title: "IMF Data",
        url: "https://www.imf.org/en/Data",
      },
      {
        access: "Free",
        format: "Dataset",
        id: "data-opensecrets",
        level: "Starter",
        source: "OpenSecrets",
        summary:
          "Essential if you want to concretely follow lobbying, campaign money, and elite influence in U.S. politics.",
        tags: ["lobbying", "campaign finance", "influence"],
        title: "OpenSecrets",
        url: "https://www.opensecrets.org/",
      },
      {
        access: "Free",
        format: "Dataset",
        id: "data-influencemap",
        level: "Intermediate",
        source: "InfluenceMap",
        summary:
          "Tracks corporate and financial lobbying around climate and transition policy.",
        tags: ["climate lobbying", "corporate influence", "policy"],
        title: "InfluenceMap",
        url: "https://influencemap.org/",
      },
      {
        access: "Free",
        format: "Dataset",
        id: "data-gapminder",
        level: "Starter",
        source: "Gapminder",
        summary:
          "A classic source for public-facing development data, trend visuals, and intuition-building comparisons across countries.",
        tags: ["development", "visualization", "global trends"],
        title: "Gapminder",
        url: "https://www.gapminder.org/",
      },
      {
        access: "Free",
        format: "Dataset",
        id: "data-global-carbon-atlas",
        level: "Intermediate",
        source: "Global Carbon Atlas",
        summary:
          "Useful for drilling into emissions trends, territorial comparisons, and the data behind climate discussions.",
        tags: ["emissions", "climate data", "carbon"],
        title: "Global Carbon Atlas",
        url: "https://globalcarbonatlas.org/",
      },
    ],
  },
];

export const STUDY_RESOURCES = STUDY_CATEGORIES.flatMap((category) => category.items);

export const STUDY_FORMATS = Array.from(
  new Set(STUDY_RESOURCES.map((resource) => resource.format)),
);

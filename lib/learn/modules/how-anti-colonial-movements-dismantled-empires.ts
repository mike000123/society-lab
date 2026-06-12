import type { LearningModule } from "./_types";

export const lessonData: LearningModule = {
    betterMetrics: [
      {
        description:
          "How deeply colonial extraction, hierarchy, and exclusion are felt across workers, peasants, students, and local elites.",
        label: "Extraction and grievance intensity",
      },
      {
        description:
          "How many schools, newspapers, unions, parties, or religious networks can carry a national frame beyond one city or class.",
        label: "National organizing infrastructure",
      },
      {
        description:
          "Whether war, fiscal stress, or international pressure weakens the empire's willingness or ability to rule by force.",
        label: "Imperial vulnerability",
      },
      {
        description:
          "Whether the movement can govern after independence rather than winning sovereignty only in name.",
        label: "Post-independence state capacity",
      },
    ],
    betterMetricsTitle: "Signals that an anti-colonial movement can break empire",
    counterArguments: [
      {
        point:
          "Empires gave up colonies because they became too expensive, not because anti-colonial movements changed history.",
        response:
          "Imperial overstretch mattered, but it rarely translated into independence automatically. Organized boycotts, strikes, parties, diplomatic campaigns, and insurgencies turned imperial weakness into a political break.",
        title: "Empires simply walked away",
      },
      {
        point:
          "Anti-colonial movements were basically elite nationalist projects with little mass participation.",
        response:
          "Many were led by educated elites, but the decisive movements usually built mass participation through workers, farmers, students, religious institutions, or veterans. Without that broader base, nationalist claims stayed narrow.",
        title: "Only elites mattered",
      },
      {
        point:
          "Once a colony becomes independent, the anti-colonial project is complete.",
        response:
          "Formal sovereignty is a turning point, not the end of the story. Borders, debt, trade dependence, military structures, and elite bargains often leave deep colonial legacies inside the new state.",
        title: "Independence solved the problem",
      },
    ],
    causalLoop: {
      description:
        "Colonial extraction generates grievance, but grievance becomes independence only when organizing infrastructure, imperial weakness, and international legitimacy line up. Winning sovereignty then creates a second challenge: whether the movement can build a state stronger than the colonial shell it inherits.",
      edges: [
        { from: "colonialExtraction", label: "drives", polarity: "positive", to: "massGrievance" },
        { from: "massGrievance", label: "feeds", polarity: "positive", to: "nationalOrganizations" },
        { from: "nationalOrganizations", label: "raise", polarity: "positive", to: "massMobilization" },
        { from: "imperialWeakness", label: "amplifies", polarity: "positive", to: "massMobilization" },
        { from: "massMobilization", label: "creates", polarity: "positive", to: "legitimacyCrisis" },
        { from: "internationalSupport", label: "deepens", polarity: "positive", to: "legitimacyCrisis" },
        { from: "legitimacyCrisis", label: "pushes", polarity: "positive", to: "independence" },
        { from: "independence", label: "depends on", polarity: "positive", to: "stateCapacity" },
        { from: "weakInstitutions", label: "reduces", polarity: "negative", to: "stateCapacity" },
        { from: "stateCapacity", label: "stabilizes", polarity: "positive", to: "independence" },
      ],
      loops: [
        "Reinforcing: extraction -> grievance -> national organizations -> mobilization -> imperial legitimacy crisis -> independence",
        "Balancing: weak inherited institutions can limit what independence can deliver unless movements build administrative capacity as well as symbolic legitimacy",
      ],
      nodes: [
        { id: "colonialExtraction", label: "Colonial extraction", tone: "rose", x: 80, y: 80 },
        { id: "massGrievance", label: "Mass grievance", tone: "amber", x: 280, y: 40 },
        { id: "nationalOrganizations", label: "National organizations", tone: "emerald", x: 500, y: 100 },
        { id: "massMobilization", label: "Mass mobilization", tone: "emerald", x: 500, y: 280 },
        { id: "legitimacyCrisis", label: "Imperial legitimacy crisis", tone: "rose", x: 280, y: 340 },
        { id: "independence", label: "Independence", tone: "cyan", x: 80, y: 300 },
        { id: "stateCapacity", label: "State capacity", tone: "amber", x: 80, y: 180 },
        { id: "imperialWeakness", label: "Imperial weakness", tone: "cyan", x: 500, y: 420 },
        { id: "internationalSupport", label: "International support", tone: "amber", x: 280, y: 500 },
        { id: "weakInstitutions", label: "Weak inherited institutions", tone: "rose", x: 80, y: 460 },
      ],
      title: "The anti-colonial liberation loop",
    },
    discussionPrompt:
      "What turns resentment against empire into a successful independence movement? Is it mass participation, outside pressure, imperial weakness, or the ability to govern afterward?",
    heroHighlights: [
      "Anti-colonial movements often succeeded when imperial weakness met strong national organization.",
      "Print, schools, radio, unions, and parties helped people imagine themselves as one political community.",
      "Independence was a turning point, but inherited borders, debt, and institutions shaped what came next.",
    ],
    miniLesson: {
    bands: [
      {
        threshold: 0,
        insight:
          "Without external pressure, an entrenched colonial power faces only internal resistance. Armed insurgency can be suppressed indefinitely if the cost-benefit of occupation remains favourable to the metropole — as it did in many colonies for decades.",
      },
      {
        threshold: 3,
        insight:
          "With some international attention — UN speeches, sympathetic press coverage, solidarity movements in the metropole itself — the calculus begins to shift. The metropolitan population starts asking what the colony actually costs.",
      },
      {
        threshold: 6,
        insight:
          "When Cold War powers begin competing for the movement's loyalty, or trade partners impose diplomatic costs on the coloniser, the retention calculus changes substantially. The colony shifts from an asset to a liability in the balance of great-power competition.",
      },
      {
        threshold: 9,
        insight:
          "Under full international pressure — UN resolutions, superpower backing, economic sanctions, and internal metropolitan opposition — colonial retention becomes diplomatically and economically untenable. The question shifts from whether to leave to how to manage the exit.",
      },
    ],
    defaultValue: 5,
    description:
      "International pressure transformed the viability of anti-colonial movements — not just by providing resources, but by raising the cost of occupation for colonial powers. Adjust the solidarity level to see how it shaped timelines and outcomes.",
    highLabel: "Full international support",
    lowLabel: "Isolated movement",
    metrics: [
      {
        base: 40,
        description: "Expected years from mass movement formation to formal independence",
        key: "years-to-independence",
        label: "Years to independence",
        max: 40,
        min: 4,
        slope: -3.6,
        suffix: " yrs",
        tone: "amber",
      },
      {
        base: 20,
        description: "Probability that independence is achieved through negotiation rather than prolonged armed conflict",
        key: "negotiated-exit",
        label: "Negotiated exit probability",
        max: 80,
        min: 20,
        slope: 6,
        suffix: "%",
        tone: "emerald",
      },
      {
        base: 15,
        description: "Share of colonial GDP derived from the territory — above which retention remains economically rational",
        key: "economic-value",
        label: "Colony as % of colonial GDP",
        max: 15,
        min: 2,
        slope: -1.3,
        suffix: "%",
        tone: "rose",
      },
    ],
    prompt: "Adjust international solidarity to see how it shaped the timeline and character of decolonisation.",
    sliderLabel: "International solidarity / external pressure",
    step: 1,
    title: "How international pressure changed the occupation calculus",
    unit: "/10",
    valueMax: 10,
    valueMin: 0,
  },
    realWorldExamples: [
      {
        insight:
          "Indian independence showed how anti-colonial struggle could combine elite negotiation, mass noncooperation, boycotts, and symbolic acts that made imperial rule appear illegitimate rather than inevitable.",
        outcome:
          "Campaigns such as noncooperation, civil disobedience, and the Salt March helped transform nationalist sentiment into a mass movement that Britain could no longer treat as marginal.",
        title: "India and the scaling of noncooperation",
      },
      {
        insight:
          "Postwar African independence movements spread quickly once colonial rule lost prestige and a generation of local organizers could build parties around the language of self-determination.",
        outcome:
          "Ghana's independence in 1957 became an important signal that helped accelerate the wider decolonization wave later described as the Year of Africa.",
        title: "Ghana and the momentum of decolonization",
      },
      {
        insight:
          "Some empires yielded only after much more violent confrontation, showing that anti-colonial movements were a family of strategies rather than one script.",
        outcome:
          "The Algerian war demonstrated how imperial crisis, armed struggle, and international legitimacy battles could combine to make colonial rule unsustainable.",
        title: "Algeria and the high-cost route to independence",
      },
    ],
    relatedFrameworks: [
      "Self-determination",
      "National liberation",
      "Political opportunity structures",
      "Imperial overstretch",
      "Postcolonial state formation",
    ],
    simulationPrompt:
      "Compare an anti-colonial movement with broad mass organization and a weakened empire against one facing strong imperial capacity, narrow elites, and no international recognition.",
    simulatorSlug: "social-movements",
    simpleExplanation: [
      "Anti-colonial movements were usually responses to a system in which political rule, economic extraction, and racial hierarchy were fused together. People were not only denied representation; they were governed by an external power that treated land, labor, and law as instruments of empire.",
      "These movements became powerful when they could turn many local grievances into a single national frame. Schools, newspapers, unions, churches, parties, and radio mattered because they helped people imagine that they were part of one political community with a claim to self-rule.",
      "Success often required timing as much as bravery. After major wars, empires were poorer, less legitimate, and under more international pressure. Movements that already had organization could use those windows far better than movements that relied on symbolism alone.",
      "Their outcomes were transformative but unfinished. Independence changed flags, constitutions, and legal sovereignty, yet many new states inherited colonial borders, export dependence, debt structures, or militarized institutions that continued to shape politics long after formal rule ended.",
    ],
    slug: "how-anti-colonial-movements-dismantled-empires",
    systemBug: {
      signals: [
        "Independence is taught as if it arrived because empire matured morally rather than because movements made rule too costly and illegitimate.",
        "National heroes are remembered while the unions, schools, and local organizers that built real capacity disappear from view.",
        "Formal sovereignty is mistaken for complete decolonization even where dependence survived through trade, debt, borders, or military structures.",
      ],
      summary:
        "The central bug is external rule without reciprocal accountability. Empire can extract from people whose consent it does not need, so anti-colonial movements become the mechanism through which political community is claimed and rebuilt.",
      title: "System bug: rule without equal political membership",
    },
  proposals: [
    {
      title: "Establish reparations frameworks for colonial-era extraction and forced labour",
      summary: "Colonial extraction generated wealth that compounds in former colonial powers to this day. Reparations — financial, institutional, or as debt cancellation — are not charity but the correction of a measurable accounting imbalance.",
      actor: "international",
      domain: "economic",
      feasibility: "contested",
      precedents: [
        { place: "Germany (Holocaust)", year: 1952, outcome: "Luxembourg Agreement established that reparations for state crimes are legally enforceable; paid 3bn DM to Israel and survivors" },
        { place: "UK (Mau Mau)", year: 2013, outcome: "British government paid 19.9m pounds to 5,228 Kenyan torture victims — first colonial-era reparations by a major power" },
      ],
    },
    {
      title: "Reform IMF and World Bank conditionality to remove structural adjustment requirements",
      summary: "Post-colonial states often face debt conditionality that replicates colonial economic dependencies — forcing austerity, privatisation, and trade liberalisation regardless of democratic choices. Reforming conditionality restores genuine sovereignty.",
      actor: "international",
      domain: "economic",
      feasibility: "contested",
      precedents: [
        { place: "HIPC Initiative", year: 1996, outcome: "Heavily Indebted Poor Countries programme cancelled 76bn dollars in debt for 36 countries — showed debt relief is feasible at scale" },
        { place: "Ecuador", year: 2008, outcome: "Declared 3.2bn dollars of external debt illegitimate via audit; bought it back at 35 cents on dollar — demonstrated sovereign debt audit viability" },
      ],
    },
  ],

  };

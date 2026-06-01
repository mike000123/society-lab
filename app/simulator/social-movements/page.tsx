"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type FamilyKey = "print" | "industrial" | "anticolonial" | "rights" | "networked";

interface MovementContext {
  coalitionBreadth: number;
  communicationShift: number;
  economicLeverage: number;
  eliteSplits: number;
  grievanceBreadth: number;
  institutionalOpenness: number;
  internationalAttention: number;
  organizationDepth: number;
  repression: number;
}

interface PhaseConfig {
  backfire: number;
  coalition: number;
  communication: number;
  economic: number;
  elite: number;
  institutional: number;
  international: number;
  legitimacyFactor: number;
  organization: number;
  repression: number;
  slug: string;
  title: string;
}

interface HistoricalCase {
  event: string;
  outcome: string;
  year: string;
}

interface FamilyProfile {
  color: string;
  description: string;
  historicalCases: HistoricalCase[];
  label: string;
  model: {
    backlashAmplifier: number;
    coalition: number;
    communication: number;
    economic: number;
    elite: number;
    fragmentationRisk: number;
    institutional: number;
    international: number;
    organization: number;
    repressionResistance: number;
    spontaneity: number;
  };
  strengths: string[];
}

interface HistoricalPreset {
  context: MovementContext;
  description: string;
  family: FamilyKey;
  label: string;
  year: string;
}

interface PhasePoint {
  legitimacy: number;
  phase: string;
  pressure: number;
  structure: number;
  traction: number;
}

interface SimulationResult {
  breakthrough: number;
  drag: string;
  durability: number;
  phases: PhasePoint[];
  stallRisk: number;
  summary: string;
  supports: string[];
}

const FAMILY_ORDER: FamilyKey[] = ["print", "industrial", "anticolonial", "rights", "networked"];

const FAMILY_MAP: Record<FamilyKey, FamilyProfile> = {
  print: {
    color: "#f59e0b",
    description:
      "Pamphlets, translated texts, sermons, and petition networks. Strong when communication costs fall and parts of the elite provide shelter.",
    label: "Print-era campaigns",
    model: {
      backlashAmplifier: 0.78,
      coalition: 0.86,
      communication: 1.18,
      economic: 0.55,
      elite: 1.16,
      fragmentationRisk: 0.26,
      institutional: 0.64,
      international: 0.4,
      organization: 0.88,
      repressionResistance: 0.66,
      spontaneity: 0.72,
    },
    historicalCases: [
      { year: "1789", event: "French Revolution", outcome: "Pamphlets and the Enlightenment press delegitimised the ancien régime; the monarchy fell within months of Bastille." },
      { year: "1775–83", event: "American Revolution", outcome: "Tom Paine's Common Sense turned tax grievance into a republican independence movement backed by a transatlantic print network." },
      { year: "1517", event: "Protestant Reformation", outcome: "Luther's 95 Theses spread across Germany in weeks via the press, fracturing the Church's doctrinal monopoly permanently." },
    ],
    strengths: ["cheap copying", "vernacular framing", "petition politics"],
  },
  industrial: {
    color: "#34d399",
    description:
      "Factory concentration, unions, dues, newspapers, and strike leverage. Strong when organization and economic disruption can be sustained.",
    label: "Industrial mass movements",
    model: {
      backlashAmplifier: 0.62,
      coalition: 0.94,
      communication: 0.82,
      economic: 1.28,
      elite: 0.78,
      fragmentationRisk: 0.2,
      institutional: 0.82,
      international: 0.46,
      organization: 1.28,
      repressionResistance: 0.96,
      spontaneity: 0.58,
    },
    historicalCases: [
      { year: "1917", event: "Russian Revolution", outcome: "Bolshevik-organised soviets converted war exhaustion and elite collapse into a seizure of state power within days." },
      { year: "1968", event: "May '68 France", outcome: "Ten million workers joined a student revolt in a general strike — but no unified leadership existed to convert the pressure into institutional change." },
      { year: "1838–1918", event: "British Labour & Suffrage", outcome: "Trade unions and suffrage campaigns built mass membership politics, eventually winning the vote and the eight-hour day." },
    ],
    strengths: ["dense membership", "strike leverage", "durable institutions"],
  },
  anticolonial: {
    color: "#38bdf8",
    description:
      "National liberation parties, boycotts, self-determination, and imperial crisis. Strong when grievance is broad and external rule is losing legitimacy.",
    label: "Anti-colonial movements",
    model: {
      backlashAmplifier: 0.92,
      coalition: 1.02,
      communication: 0.88,
      economic: 0.92,
      elite: 1.18,
      fragmentationRisk: 0.34,
      institutional: 0.52,
      international: 1.18,
      organization: 1.1,
      repressionResistance: 1.02,
      spontaneity: 0.7,
    },
    historicalCases: [
      { year: "1930–47", event: "Gandhi & Indian Independence", outcome: "The Salt March made colonial law unenforceable through nonviolent civil disobedience, destroying imperial legitimacy before a global press audience." },
      { year: "1954–62", event: "Algerian War of Independence", outcome: "FLN combined armed insurgency with international diplomacy to force French withdrawal after eight years of costly occupation." },
      { year: "1955–75", event: "African decolonisation wave", outcome: "Over thirty nations gained independence as postwar imperial overstretch, Cold War pressures, and nationalist organisation made colonial rule untenable." },
    ],
    strengths: ["mass grievance", "self-determination frame", "imperial vulnerability"],
  },
  rights: {
    color: "#fb7185",
    description:
      "Broad coalitions, disciplined disruption, visible contradiction, and legal strategy. Strong when public witness and institutional follow-through can reinforce each other.",
    label: "Rights-based movements",
    model: {
      backlashAmplifier: 1.16,
      coalition: 1.18,
      communication: 1.06,
      economic: 0.58,
      elite: 0.84,
      fragmentationRisk: 0.3,
      institutional: 1.18,
      international: 0.96,
      organization: 1.04,
      repressionResistance: 1.0,
      spontaneity: 0.76,
    },
    historicalCases: [
      { year: "1955–68", event: "US Civil Rights Movement", outcome: "Birmingham's televised repression forced the Civil Rights Act (1964) and Voting Rights Act (1965) — visible contradiction turned into legislative breakthrough." },
      { year: "1989", event: "Tiananmen Square (failed)", outcome: "Maximum pressure met zero elite splits — the PLA remained loyal and the regime absorbed the cost of crackdown rather than concede. A lesson in what closes the turning point." },
      { year: "1976–90", event: "Anti-apartheid movement", outcome: "Internal boycotts, international sanctions, and ANC organisation eventually forced negotiations — Mandela released 1990, elections 1994." },
    ],
    strengths: ["moral contrast", "coalition breadth", "legal follow-through"],
  },
  networked: {
    color: "#a78bfa",
    description:
      "Phones, platforms, hashtags, and fast witness. Strong at rapid scaling, but it can stall if attention outruns organization and institutions.",
    label: "Networked digital movements",
    model: {
      backlashAmplifier: 1.12,
      coalition: 0.82,
      communication: 1.34,
      economic: 0.42,
      elite: 0.76,
      fragmentationRisk: 0.82,
      institutional: 0.74,
      international: 1.06,
      organization: 0.66,
      repressionResistance: 0.72,
      spontaneity: 1.2,
    },
    historicalCases: [
      { year: "2010–12", event: "Arab Spring & Occupy Wall Street", outcome: "Mubarak fell in 18 days; Occupy put inequality on the agenda — but thin organisation meant neither converted momentum into durable institutional change." },
      { year: "2017", event: "#MeToo", outcome: "Viral testimony collapsed the silence norm around workplace abuse within weeks; some jurisdictions passed legal reforms, others did not." },
      { year: "2020", event: "George Floyd protests / BLM", outcome: "Largest protest wave in US history triggered policing reforms in some cities — but without sustained organisation, many reversals followed." },
    ],
    strengths: ["viral witness", "low entry barriers", "fast agenda setting"],
  },
};

const PHASES: PhaseConfig[] = [
  {
    backfire: 0.06,
    coalition: 0.06,
    communication: 0.24,
    economic: 0.05,
    elite: 0.03,
    institutional: 0.02,
    international: 0.03,
    legitimacyFactor: 0.04,
    organization: 0.08,
    repression: 0.06,
    slug: "spark",
    title: "Spark",
  },
  {
    backfire: 0.12,
    coalition: 0.14,
    communication: 0.18,
    economic: 0.08,
    elite: 0.05,
    institutional: 0.04,
    international: 0.05,
    legitimacyFactor: 0.07,
    organization: 0.16,
    repression: 0.1,
    slug: "frame",
    title: "Frame",
  },
  {
    backfire: 0.18,
    coalition: 0.12,
    communication: 0.12,
    economic: 0.18,
    elite: 0.08,
    institutional: 0.06,
    international: 0.07,
    legitimacyFactor: 0.1,
    organization: 0.16,
    repression: 0.14,
    slug: "disruption",
    title: "Disruption",
  },
  {
    backfire: 0.22,
    coalition: 0.1,
    communication: 0.1,
    economic: 0.08,
    elite: 0.2,
    institutional: 0.1,
    international: 0.16,
    legitimacyFactor: 0.16,
    organization: 0.12,
    repression: 0.12,
    slug: "turn",
    title: "Turning point",
  },
  {
    backfire: 0.08,
    coalition: 0.12,
    communication: 0.06,
    economic: 0.06,
    elite: 0.12,
    institutional: 0.22,
    international: 0.1,
    legitimacyFactor: 0.2,
    organization: 0.18,
    repression: 0.08,
    slug: "settlement",
    title: "Settlement",
  },
  {
    backfire: 0.03,
    coalition: 0.1,
    communication: 0.03,
    economic: 0.04,
    elite: 0.08,
    institutional: 0.24,
    international: 0.08,
    legitimacyFactor: 0.22,
    organization: 0.2,
    repression: 0.05,
    slug: "durability",
    title: "Durability",
  },
];

const BASE_CONTEXT: MovementContext = {
  coalitionBreadth: 62,
  communicationShift: 58,
  economicLeverage: 48,
  eliteSplits: 42,
  grievanceBreadth: 68,
  institutionalOpenness: 46,
  internationalAttention: 44,
  organizationDepth: 54,
  repression: 52,
};

const CONTEXT_PRESETS: Array<{
  context: MovementContext;
  description: string;
  label: string;
}> = [
  {
    context: {
      coalitionBreadth: 40,
      communicationShift: 24,
      economicLeverage: 28,
      eliteSplits: 20,
      grievanceBreadth: 70,
      institutionalOpenness: 18,
      internationalAttention: 16,
      organizationDepth: 38,
      repression: 82,
    },
    description: "Low media reach, tight elite control, and heavy repression.",
    label: "Closed order",
  },
  {
    context: {
      coalitionBreadth: 66,
      communicationShift: 52,
      economicLeverage: 82,
      eliteSplits: 46,
      grievanceBreadth: 76,
      institutionalOpenness: 42,
      internationalAttention: 30,
      organizationDepth: 78,
      repression: 58,
    },
    description: "Dense organizations and strong strike or boycott leverage.",
    label: "Industrial bargaining window",
  },
  {
    context: {
      coalitionBreadth: 70,
      communicationShift: 48,
      economicLeverage: 56,
      eliteSplits: 78,
      grievanceBreadth: 88,
      institutionalOpenness: 34,
      internationalAttention: 84,
      organizationDepth: 74,
      repression: 64,
    },
    description: "Empire or regime is brittle, and outside legitimacy pressure is high.",
    label: "Imperial crisis",
  },
  {
    context: {
      coalitionBreadth: 72,
      communicationShift: 64,
      economicLeverage: 34,
      eliteSplits: 44,
      grievanceBreadth: 74,
      institutionalOpenness: 68,
      internationalAttention: 58,
      organizationDepth: 62,
      repression: 60,
    },
    description: "Visible contradiction, broad sympathy, and real legal openings.",
    label: "Rights breakthrough window",
  },
  {
    context: {
      coalitionBreadth: 46,
      communicationShift: 92,
      economicLeverage: 26,
      eliteSplits: 38,
      grievanceBreadth: 78,
      institutionalOpenness: 28,
      internationalAttention: 72,
      organizationDepth: 34,
      repression: 66,
    },
    description: "High virality, thin organization, and slow-moving institutions.",
    label: "Platform surge, weak follow-through",
  },
];

const HISTORICAL_PRESETS: HistoricalPreset[] = [
  {
    label: "French Revolution (1789)",
    year: "1789",
    family: "print",
    description: "Pamphlets + bread crisis + elite implosion. The regime fell within months of Bastille.",
    context: {
      grievanceBreadth: 88,
      communicationShift: 72,
      organizationDepth: 52,
      coalitionBreadth: 60,
      economicLeverage: 80,
      eliteSplits: 88,
      institutionalOpenness: 22,
      internationalAttention: 48,
      repression: 65,
    },
  },
  {
    label: "Gandhi's Salt March (1930)",
    year: "1930",
    family: "anticolonial",
    description: "Disciplined nonviolent disobedience made British law unenforceable before a global press audience.",
    context: {
      grievanceBreadth: 85,
      communicationShift: 60,
      organizationDepth: 82,
      coalitionBreadth: 70,
      economicLeverage: 62,
      eliteSplits: 58,
      institutionalOpenness: 28,
      internationalAttention: 82,
      repression: 68,
    },
  },
  {
    label: "Russian Revolution (1917)",
    year: "1917",
    family: "industrial",
    description: "War exhaustion + extreme elite splits + organised soviets. The state dissolved before the insurrection began.",
    context: {
      grievanceBreadth: 92,
      communicationShift: 55,
      organizationDepth: 72,
      coalitionBreadth: 58,
      economicLeverage: 88,
      eliteSplits: 90,
      institutionalOpenness: 14,
      internationalAttention: 42,
      repression: 72,
    },
  },
  {
    label: "May 1968, France",
    year: "1968",
    family: "industrial",
    description: "Students + 10M workers in general strike — but no unified leadership to convert momentum into change.",
    context: {
      grievanceBreadth: 72,
      communicationShift: 58,
      organizationDepth: 55,
      coalitionBreadth: 74,
      economicLeverage: 78,
      eliteSplits: 65,
      institutionalOpenness: 48,
      internationalAttention: 68,
      repression: 52,
    },
  },
  {
    label: "US Civil Rights (1963)",
    year: "1963",
    family: "rights",
    description: "Birmingham's televised repression forced the Civil Rights Act. Visible contradiction became legislative breakthrough.",
    context: {
      grievanceBreadth: 82,
      communicationShift: 74,
      organizationDepth: 78,
      coalitionBreadth: 70,
      economicLeverage: 44,
      eliteSplits: 64,
      institutionalOpenness: 66,
      internationalAttention: 72,
      repression: 74,
    },
  },
  {
    label: "Tiananmen Square (1989)",
    year: "1989",
    family: "rights",
    description: "Maximum pressure, zero elite splits. PLA stayed loyal — the regime absorbed crackdown rather than concede.",
    context: {
      grievanceBreadth: 76,
      communicationShift: 50,
      organizationDepth: 44,
      coalitionBreadth: 48,
      economicLeverage: 52,
      eliteSplits: 28,
      institutionalOpenness: 10,
      internationalAttention: 78,
      repression: 94,
    },
  },
  {
    label: "Occupy Wall Street (2011)",
    year: "2011",
    family: "networked",
    description: "Viral inequality grievance, horizontal structure, closed institutions — set the agenda, won no legislation.",
    context: {
      grievanceBreadth: 76,
      communicationShift: 90,
      organizationDepth: 28,
      coalitionBreadth: 44,
      economicLeverage: 32,
      eliteSplits: 34,
      institutionalOpenness: 24,
      internationalAttention: 72,
      repression: 54,
    },
  },
];

const SLIDERS: Array<{
  key: keyof MovementContext;
  label: string;
  max: number;
  min: number;
  step: number;
  tooltip: string;
}> = [
  {
    key: "grievanceBreadth",
    label: "Shared grievance",
    max: 100,
    min: 0,
    step: 1,
    tooltip: "How many people feel the harm directly and recognize it as a common problem.",
  },
  {
    key: "communicationShift",
    label: "Communication advantage",
    max: 100,
    min: 0,
    step: 1,
    tooltip: "How much a new medium lowers the cost of witness, copying, and recruitment.",
  },
  {
    key: "organizationDepth",
    label: "Organizational depth",
    max: 100,
    min: 0,
    step: 1,
    tooltip: "How much structure exists after the first wave of outrage or protest.",
  },
  {
    key: "coalitionBreadth",
    label: "Coalition breadth",
    max: 100,
    min: 0,
    step: 1,
    tooltip: "How many institutions or constituencies beyond the core base join the movement.",
  },
  {
    key: "economicLeverage",
    label: "Economic leverage",
    max: 100,
    min: 0,
    step: 1,
    tooltip: "How much the movement can disrupt production, trade, campus life, or workplace routines.",
  },
  {
    key: "eliteSplits",
    label: "Elite splits",
    max: 100,
    min: 0,
    step: 1,
    tooltip: "How much the ruling bloc is divided over whether to repress, negotiate, or concede.",
  },
  {
    key: "institutionalOpenness",
    label: "Institutional openness",
    max: 100,
    min: 0,
    step: 1,
    tooltip: "Whether courts, legislatures, ministries, or negotiations can convert pressure into reform.",
  },
  {
    key: "internationalAttention",
    label: "International attention",
    max: 100,
    min: 0,
    step: 1,
    tooltip: "How much outside witness, solidarity, or legitimacy pressure amplifies the movement.",
  },
  {
    key: "repression",
    label: "State or employer repression",
    max: 100,
    min: 0,
    step: 1,
    tooltip: "The coercive force used to fragment, punish, or isolate the movement.",
  },
];

const MODULE_TO_FAMILY: Partial<Record<string, FamilyKey>> = {
  "how-anti-colonial-movements-dismantled-empires": "anticolonial",
  "how-industrial-mass-movements-won-rights": "industrial",
  "how-networked-digital-movements-scale": "networked",
  "how-print-era-movements-turned-ideas-into-power": "print",
  "how-rights-based-movements-expand-citizenship": "rights",
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function factorLabel(key: keyof MovementContext) {
  switch (key) {
    case "grievanceBreadth":
      return "broad grievance";
    case "communicationShift":
      return "cheap coordination and witness";
    case "organizationDepth":
      return "deep organization";
    case "coalitionBreadth":
      return "broad coalitions";
    case "economicLeverage":
      return "economic leverage";
    case "eliteSplits":
      return "elite splits";
    case "institutionalOpenness":
      return "open institutional channels";
    case "internationalAttention":
      return "outside attention";
    case "repression":
      return "heavy repression";
  }
}

function joinLabels(values: string[]) {
  if (values.length <= 1) {
    return values[0] ?? "";
  }
  if (values.length === 2) {
    return `${values[0]} and ${values[1]}`;
  }
  return `${values.slice(0, -1).join(", ")}, and ${values[values.length - 1]}`;
}

function simulateFamily(familyKey: FamilyKey, context: MovementContext): SimulationResult {
  const family = FAMILY_MAP[familyKey];
  const model = family.model;

  let structure = clamp(
    10 +
      context.organizationDepth * 0.42 * model.organization +
      context.coalitionBreadth * 0.12 * model.coalition,
    0,
    100,
  );
  let legitimacy = clamp(
    8 +
      context.grievanceBreadth * 0.24 +
      context.communicationShift * 0.16 * model.communication +
      context.coalitionBreadth * 0.12 * model.coalition,
    0,
    100,
  );
  let pressure = clamp(
    family.model.spontaneity * 16 +
      context.communicationShift * 0.24 * model.communication +
      context.grievanceBreadth * 0.18 +
      context.economicLeverage * 0.08 * model.economic,
    0,
    100,
  );
  let traction = clamp(
    6 +
      context.institutionalOpenness * 0.18 * model.institutional +
      context.eliteSplits * 0.14 * model.elite,
    0,
    100,
  );

  const phases: PhasePoint[] = [];

  for (const phase of PHASES) {
    const repressionForce =
      context.repression * phase.repression * (1.18 - model.repressionResistance * 0.45);
    const backfire =
      Math.max(0, context.repression - 35) *
      phase.backfire *
      model.backlashAmplifier *
      (context.communicationShift / 100);
    const fragmentation =
      Math.max(0, context.communicationShift - context.organizationDepth) *
      model.fragmentationRisk *
      0.18;

    pressure = clamp(
      pressure +
        context.grievanceBreadth * 0.05 +
        context.communicationShift * phase.communication * model.communication +
        context.economicLeverage * phase.economic * model.economic +
        structure * 0.05 -
        repressionForce * 0.32 +
        backfire * 0.18,
      0,
      100,
    );

    structure = clamp(
      structure +
        context.organizationDepth * phase.organization * model.organization +
        context.coalitionBreadth * phase.coalition * model.coalition -
        fragmentation,
      0,
      100,
    );

    legitimacy = clamp(
      legitimacy +
        context.communicationShift * phase.communication * 0.62 * model.communication +
        context.eliteSplits * phase.elite * model.elite +
        context.internationalAttention * phase.international * model.international +
        context.coalitionBreadth * phase.coalition * 0.4 * model.coalition -
        repressionForce * 0.12 +
        backfire * 0.42,
      0,
      100,
    );

    traction = clamp(
      traction +
        legitimacy * phase.legitimacyFactor * 0.09 +
        structure * phase.organization * 0.06 +
        context.institutionalOpenness * phase.institutional * model.institutional +
        context.eliteSplits * phase.elite * 0.38 * model.elite +
        context.internationalAttention * phase.international * 0.24 * model.international -
        repressionForce * 0.06,
      0,
      100,
    );

    phases.push({
      legitimacy: Math.round(legitimacy * 10) / 10,
      phase: phase.title,
      pressure: Math.round(pressure * 10) / 10,
      structure: Math.round(structure * 10) / 10,
      traction: Math.round(traction * 10) / 10,
    });
  }

  const breakthrough = clamp(
    traction * 0.46 +
      legitimacy * 0.2 +
      structure * 0.2 +
      pressure * 0.14 -
      context.repression * 0.08 +
      context.eliteSplits * 0.05,
    0,
    100,
  );
  const durability = clamp(
    structure * 0.42 +
      traction * 0.34 +
      legitimacy * 0.12 +
      context.institutionalOpenness * 0.12 * model.institutional,
    0,
    100,
  );
  const stallRisk = clamp(
    100 -
      breakthrough +
      context.repression * 0.16 +
      Math.max(0, context.communicationShift - context.organizationDepth) * model.fragmentationRisk * 0.24 -
      context.eliteSplits * 0.06,
    0,
    100,
  );

  const rawPositiveDrivers: Array<{ key: keyof MovementContext; value: number }> = [
    { key: "communicationShift", value: context.communicationShift * model.communication },
    { key: "organizationDepth", value: context.organizationDepth * model.organization },
    { key: "coalitionBreadth", value: context.coalitionBreadth * model.coalition },
    { key: "economicLeverage", value: context.economicLeverage * model.economic },
    { key: "eliteSplits", value: context.eliteSplits * model.elite },
    { key: "institutionalOpenness", value: context.institutionalOpenness * model.institutional },
    { key: "internationalAttention", value: context.internationalAttention * model.international },
    { key: "grievanceBreadth", value: context.grievanceBreadth },
  ];
  const positiveDrivers = rawPositiveDrivers
    .sort((a, b) => b.value - a.value)
    .slice(0, 3)
    .map((item) => factorLabel(item.key));

  const drags = [
    { label: "heavy repression", value: context.repression * (1.16 - model.repressionResistance * 0.4) },
    {
      label: "thin organization after the first wave",
      value: Math.max(0, 65 - context.organizationDepth) * (1.24 - model.organization * 0.35),
    },
    {
      label: "narrow coalitions",
      value: Math.max(0, 60 - context.coalitionBreadth) * (1.2 - model.coalition * 0.35),
    },
    {
      label: "closed institutions",
      value:
        Math.max(0, 60 - context.institutionalOpenness) * (1.16 - model.institutional * 0.35),
    },
    {
      label: "fragmentation after fast attention growth",
      value: Math.max(0, context.communicationShift - context.organizationDepth) * model.fragmentationRisk,
    },
  ].sort((a, b) => b.value - a.value);

  const roundedBreakthrough = Math.round(breakthrough);
  const roundedDurability = Math.round(durability);
  const summary =
    roundedBreakthrough >= 70
      ? `This family is well-matched to the current context. It is likely to force a turning point if it can keep ${joinLabels(positiveDrivers.slice(0, 2))} working together.`
      : roundedBreakthrough >= 45
        ? `This family can break through, but the result is conditional. It needs ${joinLabels(positiveDrivers.slice(0, 2))} to outweigh ${drags[0]?.label ?? "its biggest constraint"}.`
        : `This family is more likely to stall under the current context. Without stronger ${positiveDrivers[0] ?? "support"}, ${drags[0]?.label ?? "its main drag"} stays dominant.`;

  return {
    breakthrough: roundedBreakthrough,
    drag: drags[0]?.label ?? "no major drag",
    durability: roundedDurability,
    phases,
    stallRisk: Math.round(stallRisk),
    summary,
    supports: positiveDrivers,
  };
}

function familyFromModule(slug: string | null): FamilyKey {
  if (!slug) {
    return "industrial";
  }
  return MODULE_TO_FAMILY[slug] ?? "print";
}

function contrastingFamily(key: FamilyKey): FamilyKey {
  switch (key) {
    case "print":
      return "networked";
    case "industrial":
      return "networked";
    case "anticolonial":
      return "rights";
    case "rights":
      return "industrial";
    case "networked":
      return "industrial";
  }
}

function ChartTooltip({
  active,
  label,
  payload,
}: {
  active?: boolean;
  label?: string;
  payload?: { color: string; name: string; value: number }[];
}) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900/95 px-4 py-3 text-xs shadow-xl">
      <p className="mb-2 font-bold text-slate-200">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} style={{ color: entry.color }}>
          {entry.name}: <span className="font-semibold">{entry.value}</span>
        </p>
      ))}
    </div>
  );
}

function ChartPanel({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-panel p-4">
      <p className="mb-3 text-xs font-semibold text-slate-400">{title}</p>
      <ResponsiveContainer height={240} width="100%">
        {children as React.ReactElement}
      </ResponsiveContainer>
    </div>
  );
}

function SocialMovementsSimulatorPageContent() {
  const searchParams = useSearchParams();
  const moduleSlug = searchParams.get("module");
  const focus = searchParams.get("focus");

  const defaultLeftFamily = familyFromModule(moduleSlug);
  const [leftFamily, setLeftFamily] = useState<FamilyKey>(defaultLeftFamily);
  const [rightFamily, setRightFamily] = useState<FamilyKey>(contrastingFamily(defaultLeftFamily));
  const [context, setContext] = useState<MovementContext>(BASE_CONTEXT);

  const leftProfile = FAMILY_MAP[leftFamily];
  const rightProfile = FAMILY_MAP[rightFamily];

  const leftResult = useMemo(() => simulateFamily(leftFamily, context), [context, leftFamily]);
  const rightResult = useMemo(() => simulateFamily(rightFamily, context), [context, rightFamily]);

  const chartData = useMemo(
    () =>
      PHASES.map((phase, index) => ({
        phase: phase.title,
        leftLegitimacy: leftResult.phases[index]?.legitimacy ?? 0,
        leftPressure: leftResult.phases[index]?.pressure ?? 0,
        leftTraction: leftResult.phases[index]?.traction ?? 0,
        rightLegitimacy: rightResult.phases[index]?.legitimacy ?? 0,
        rightPressure: rightResult.phases[index]?.pressure ?? 0,
        rightTraction: rightResult.phases[index]?.traction ?? 0,
      })),
    [leftResult.phases, rightResult.phases],
  );

  const winner =
    leftResult.breakthrough === rightResult.breakthrough
      ? null
      : leftResult.breakthrough > rightResult.breakthrough
        ? "left"
        : "right";

  const setContextValue = (key: keyof MovementContext, value: number) => {
    setContext((current) => ({ ...current, [key]: value }));
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-12">
      <section className="relative overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-950/85 p-6 sm:p-8">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-amber-400/12 via-cyan-400/6 to-transparent" />
        <div className="relative space-y-4">
          <span className="inline-flex rounded-full border border-amber-300/25 bg-amber-400/10 px-3 py-1 text-xs font-medium text-amber-100">
            Compare-mode simulator
          </span>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-50 sm:text-4xl">
              Social Movement Compare Lab
            </h1>
            <p className="mt-3 max-w-4xl text-base leading-7 text-slate-300">
              Test why one movement family breaks through while another stalls. Load a historical
              scenario or set the context sliders manually, then compare how different movement
              strategies would have fared under the same conditions.
            </p>
          </div>
          {focus && (
            <div className="rounded-2xl border border-slate-800 bg-panel/85 px-4 py-3 text-sm leading-6 text-slate-300">
              <span className="font-semibold text-slate-100">Current focus:</span> {focus}
            </div>
          )}
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <div className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            {[
              {
                family: leftFamily,
                label: "Scenario A",
                profile: leftProfile,
                result: leftResult,
                setFamily: setLeftFamily,
              },
              {
                family: rightFamily,
                label: "Scenario B",
                profile: rightProfile,
                result: rightResult,
                setFamily: setRightFamily,
              },
            ].map((panel) => (
              <section
                className="rounded-[1.75rem] border bg-panel p-5"
                key={panel.label}
                style={{ borderColor: `${panel.profile.color}44` }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{panel.label}</p>
                    <select
                      className="mt-2 rounded-2xl border border-slate-800 bg-slate-950/80 px-3 py-2 text-sm text-slate-100"
                      onChange={(event) => panel.setFamily(event.target.value as FamilyKey)}
                      value={panel.family}
                    >
                      {FAMILY_ORDER.map((key) => (
                        <option key={key} value={key}>
                          {FAMILY_MAP[key].label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <span
                    className="inline-flex rounded-full px-3 py-1 text-xs font-semibold text-slate-950"
                    style={{ backgroundColor: panel.profile.color }}
                  >
                    {panel.result.breakthrough >= 70
                      ? "Breakthrough likely"
                      : panel.result.breakthrough >= 45
                        ? "Contested path"
                        : "Stall risk"}
                  </span>
                </div>

                <p className="mt-4 text-sm leading-6 text-slate-300">{panel.profile.description}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {panel.profile.strengths.map((strength) => (
                    <span
                      className="inline-flex rounded-full border border-slate-700 bg-slate-950/70 px-3 py-1 text-xs font-medium text-slate-200"
                      key={strength}
                    >
                      {strength}
                    </span>
                  ))}
                </div>

                <div className="mt-4 space-y-2">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-slate-600">Historical cases for this family</p>
                  {panel.profile.historicalCases.map((c) => (
                    <div key={c.event} className="rounded-xl border border-slate-800 bg-slate-950/50 px-3 py-2">
                      <div className="flex items-center gap-2">
                        <span className="rounded-full border border-slate-700 px-2 py-0.5 text-[10px] font-bold text-slate-400">{c.year}</span>
                        <span className="text-xs font-semibold text-slate-200">{c.event}</span>
                      </div>
                      <p className="mt-1 text-[11px] leading-4 text-slate-500">{c.outcome}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 grid grid-cols-3 gap-3">
                  {[
                    { label: "Breakthrough", value: panel.result.breakthrough },
                    { label: "Durability", value: panel.result.durability },
                    { label: "Stall risk", value: panel.result.stallRisk },
                  ].map((metric) => (
                    <div className="rounded-2xl border border-slate-800 bg-slate-950/60 px-3 py-3" key={metric.label}>
                      <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">{metric.label}</p>
                      <p className="mt-2 text-2xl font-black text-slate-50">{metric.value}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Why this one moves</p>
                  <p className="mt-2 text-sm leading-6 text-slate-200">
                    Strongest supports: {joinLabels(panel.result.supports)}.
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    Main drag: {panel.result.drag}. {panel.result.summary}
                  </p>
                </div>
              </section>
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <ChartPanel title="Public pressure across the movement cycle">
              <LineChart data={chartData}>
                <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
                <XAxis dataKey="phase" tick={{ fill: "#64748b", fontSize: 10 }} />
                <YAxis domain={[0, 100]} tick={{ fill: "#64748b", fontSize: 10 }} />
                <Tooltip content={<ChartTooltip />} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Line
                  activeDot={{ r: 4 }}
                  dataKey="leftPressure"
                  dot={false}
                  name={`${leftProfile.label} pressure`}
                  stroke={leftProfile.color}
                  strokeWidth={2.5}
                  type="monotone"
                />
                <Line
                  activeDot={{ r: 4 }}
                  dataKey="rightPressure"
                  dot={false}
                  name={`${rightProfile.label} pressure`}
                  stroke={rightProfile.color}
                  strokeWidth={2.5}
                  type="monotone"
                />
              </LineChart>
            </ChartPanel>

            <ChartPanel title="Institutional traction toward a turning point">
              <AreaChart data={chartData}>
                <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
                <XAxis dataKey="phase" tick={{ fill: "#64748b", fontSize: 10 }} />
                <YAxis domain={[0, 100]} tick={{ fill: "#64748b", fontSize: 10 }} />
                <Tooltip content={<ChartTooltip />} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Area
                  dataKey="leftTraction"
                  fill={leftProfile.color}
                  fillOpacity={0.12}
                  name={`${leftProfile.label} traction`}
                  stroke={leftProfile.color}
                  strokeWidth={2}
                  type="monotone"
                />
                <Area
                  dataKey="rightTraction"
                  fill={rightProfile.color}
                  fillOpacity={0.08}
                  name={`${rightProfile.label} traction`}
                  stroke={rightProfile.color}
                  strokeDasharray="5 4"
                  strokeWidth={2}
                  type="monotone"
                />
              </AreaChart>
            </ChartPanel>
          </div>

          <div className="rounded-[1.75rem] border border-slate-800 bg-panel p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Read the comparison</p>
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                <p className="text-sm font-semibold text-slate-50">Legitimacy versus coercion</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Some movement families benefit more when repression becomes visible to outsiders.
                  Rights-based and networked movements often turn witness into legitimacy pressure, while
                  print-era and industrial movements depend more on durable organization or shelter.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                <p className="text-sm font-semibold text-slate-50">Why stalling happens</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Stalls usually appear when coordination becomes easier faster than organization does, or
                  when institutions stay too closed for pressure to convert into reform. The simulator
                  makes that mismatch visible.
                </p>
              </div>
            </div>

            <div
              className="mt-4 rounded-2xl border px-4 py-4 text-sm leading-6"
              style={{
                borderColor:
                  winner === "left"
                    ? `${leftProfile.color}44`
                    : winner === "right"
                      ? `${rightProfile.color}44`
                      : "#334155",
              }}
            >
              {winner === null
                ? "Under this context, both movement families perform similarly. The more important difference is where they rely on different supports and where they are vulnerable to different drags."
                : winner === "left"
                  ? `${leftProfile.label} has the clearer path under the current conditions. It is better aligned with ${joinLabels(leftResult.supports.slice(0, 2))}, while ${rightProfile.label.toLowerCase()} is held back more by ${rightResult.drag}.`
                  : `${rightProfile.label} has the clearer path under the current conditions. It is better aligned with ${joinLabels(rightResult.supports.slice(0, 2))}, while ${leftProfile.label.toLowerCase()} is held back more by ${leftResult.drag}.`}
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <section className="rounded-[1.75rem] border border-amber-400/20 bg-panel p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs uppercase tracking-[0.2em] text-amber-300">Shared context</p>
              <button
                className="rounded-xl border border-slate-700 px-3 py-1.5 text-xs text-slate-400 transition hover:text-slate-200"
                onClick={() => setContext(BASE_CONTEXT)}
                type="button"
              >
                Reset
              </button>
            </div>
            <p className="mt-2 text-xs leading-5 text-slate-500">
              These sliders describe the environment both movement families face. The family presets then
              weight those conditions differently.
            </p>

            <div className="mt-5 space-y-4">
              {SLIDERS.map((slider) => (
                <label className="block" key={slider.key}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="text-slate-300">{slider.label}</span>
                    <span className="font-mono font-bold text-amber-200">
                      {context[slider.key]}
                    </span>
                  </div>
                  <input
                    className="w-full accent-amber-400"
                    max={slider.max}
                    min={slider.min}
                    onChange={(event) => setContextValue(slider.key, Number(event.target.value))}
                    step={slider.step}
                    type="range"
                    value={context[slider.key]}
                  />
                  <p className="mt-1 text-xs leading-5 text-slate-600">{slider.tooltip}</p>
                </label>
              ))}
            </div>
          </section>

          <section className="rounded-[1.75rem] border border-amber-400/15 bg-panel p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-amber-300/80">Historical scenarios</p>
            <p className="mt-1 text-xs leading-5 text-slate-600">Load a real event — sets Scenario A family and all context sliders.</p>
            <div className="mt-3 space-y-2">
              {HISTORICAL_PRESETS.map((preset) => (
                <button
                  className="w-full rounded-2xl border border-slate-800 bg-slate-950/50 p-3 text-left transition hover:border-amber-400/30"
                  key={preset.label}
                  onClick={() => { setLeftFamily(preset.family); setContext(preset.context); }}
                  type="button"
                >
                  <div className="flex items-center gap-2">
                    <span className="rounded-full border border-slate-700 px-2 py-0.5 text-[10px] font-bold text-slate-400">{preset.year}</span>
                    <p className="text-xs font-semibold text-slate-100">{preset.label}</p>
                  </div>
                  <p className="mt-1 text-[11px] leading-4 text-slate-500">{preset.description}</p>
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-[1.75rem] border border-slate-800 bg-panel p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Generic context presets</p>
            <div className="mt-4 space-y-3">
              {CONTEXT_PRESETS.map((preset) => (
                <button
                  className="w-full rounded-2xl border border-slate-800 bg-slate-950/50 p-3 text-left transition hover:border-slate-600"
                  key={preset.label}
                  onClick={() => setContext(preset.context)}
                  type="button"
                >
                  <p className="text-sm font-semibold text-slate-100">{preset.label}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">{preset.description}</p>
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-[1.75rem] border border-slate-800 bg-panel p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">What the model is doing</p>
            <div className="mt-4 space-y-3 text-xs leading-5 text-slate-400">
              <p>
                1. It gives both families the same historical environment.
              </p>
              <p>
                2. Each family weights that environment differently based on its typical strengths.
              </p>
              <p>
                3. The score evolves across phases from spark to durability, so quick visibility and long-run
                institutional traction can pull in different directions.
              </p>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

function SocialMovementsSimulatorFallback() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-12">
      <section className="rounded-[2rem] border border-slate-800 bg-slate-950/85 p-6 sm:p-8">
        <span className="inline-flex rounded-full border border-amber-300/25 bg-amber-400/10 px-3 py-1 text-xs font-medium text-amber-100">
          Compare-mode simulator
        </span>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-50 sm:text-4xl">
          Social Movement Compare Lab
        </h1>
        <p className="mt-3 max-w-3xl text-base leading-7 text-slate-300">
          Loading the movement comparison environment.
        </p>
      </section>
    </div>
  );
}

export default function SocialMovementsSimulatorPage() {
  return (
    <Suspense fallback={<SocialMovementsSimulatorFallback />}>
      <SocialMovementsSimulatorPageContent />
    </Suspense>
  );
}

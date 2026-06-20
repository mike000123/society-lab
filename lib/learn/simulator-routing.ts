import type { ResolvedLearningModule } from "@/lib/learn/modules";
import type { LearningTrack } from "@/lib/tracks/config";
import { withQuery } from "@/lib/utils";

type SimulatorRoutableModule = Pick<ResolvedLearningModule, "simulationPrompt" | "simulatorSlug" | "slug">;

export const TRACK_RELATED_LABS: Record<string, { href: string; label: string }> = {
  economy: { href: "/simulator/macro-economy", label: "Run a simulation" },
  "politics-and-democracy": { href: "/simulator/political-talent", label: "Open governance lab" },
  "cities-and-ecology": { href: "/simulator/world3", label: "Open World3" },
  "media-and-information": { href: "/simulator/social-movements", label: "Open movement lab" },
};

export const MODULE_SIMULATOR_SLUGS: Partial<Record<string, string>> = {
  "how-capitalism-evolved-through-stages": "wealth-gap",
  "how-capitalism-socialism-and-communism-differ": "wealth-gap",
  "how-doughnut-economics-puts-the-economy-inside-limits": "world3",
  "how-electoral-rules-shape-political-power": "political-talent",
  "how-lobbying-shapes-policy": "political-talent",
  "how-media-incentives-produce-outrage": "social-movements",
  "how-pollution-builds-up-until-systems-tip": "world3",
  "how-surveillance-capitalism-shapes-attention": "social-movements",
  "why-cities-create-stress-or-freedom": "world3",
  "why-decoupling-growth-from-emissions-is-so-hard": "world3",
  "why-democracies-struggle-with-long-term-problems": "political-talent",
};

export function getLessonSimulatorSlug(module: Pick<ResolvedLearningModule, "simulatorSlug" | "slug">) {
  return module.simulatorSlug ?? MODULE_SIMULATOR_SLUGS[module.slug];
}

export function hasLessonSimulator(module: Pick<ResolvedLearningModule, "simulatorSlug" | "slug">) {
  return Boolean(getLessonSimulatorSlug(module));
}

export function getLessonSimulatorBaseHref(
  module: Pick<ResolvedLearningModule, "simulatorSlug" | "slug">,
  currentTrack?: Pick<LearningTrack, "id"> | null,
) {
  const simulatorSlug = getLessonSimulatorSlug(module);
  if (simulatorSlug) {
    return `/simulator/${simulatorSlug}`;
  }

  return TRACK_RELATED_LABS[currentTrack?.id ?? ""]?.href ?? "/simulator";
}

export function getLessonSimulationHref(
  module: SimulatorRoutableModule,
  currentTrack?: Pick<LearningTrack, "id"> | null,
) {
  return withQuery(getLessonSimulatorBaseHref(module, currentTrack), {
    focus: module.simulationPrompt,
    module: module.slug,
  });
}

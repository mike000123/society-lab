export const ACADEMIC_LEVEL_OPTIONS = [
  { value: "secondary", label: "Secondary / pre-university" },
  { value: "undergraduate", label: "Undergraduate" },
  { value: "masters", label: "Master's" },
  { value: "doctorate", label: "Doctorate / PhD" },
  { value: "postdoc", label: "Postdoctoral" },
  { value: "faculty", label: "Faculty / lecturer" },
  { value: "independent", label: "Independent / non-academic" },
] as const;

export const PROFESSIONAL_STAGE_OPTIONS = [
  { value: "student", label: "Student / trainee" },
  { value: "early-career", label: "Early career" },
  { value: "mid-career", label: "Mid career" },
  { value: "senior", label: "Senior / specialist" },
  { value: "executive", label: "Executive / leadership" },
  { value: "public-service", label: "Public service / civic role" },
  { value: "independent", label: "Independent / self-directed" },
  { value: "retired", label: "Retired / emeritus" },
] as const;

export const EXPERTISE_DOMAIN_OPTIONS = [
  { value: "economy-finance", label: "Economy & finance" },
  { value: "governance-policy", label: "Governance & policy" },
  { value: "cities-housing", label: "Cities & housing" },
  { value: "ecology-climate", label: "Ecology & climate" },
  { value: "media-information", label: "Media & information" },
  { value: "technology-systems", label: "Technology & systems" },
  { value: "health-wellbeing", label: "Health & wellbeing" },
  { value: "law-rights", label: "Law & rights" },
  { value: "education-research", label: "Education & research" },
  { value: "community-lived-experience", label: "Community / lived experience" },
] as const;

export type AcademicLevelValue = (typeof ACADEMIC_LEVEL_OPTIONS)[number]["value"];
export type ProfessionalStageValue = (typeof PROFESSIONAL_STAGE_OPTIONS)[number]["value"];
export type ExpertiseDomainValue = (typeof EXPERTISE_DOMAIN_OPTIONS)[number]["value"];

export function optionLabel(
  options: ReadonlyArray<{ label: string; value: string }>,
  value: string | null | undefined,
) {
  if (!value) return null;
  return options.find((option) => option.value === value)?.label ?? value;
}

export function labelsForValues(
  options: ReadonlyArray<{ label: string; value: string }>,
  values: ReadonlyArray<string> | null | undefined,
) {
  if (!values || values.length === 0) return [];
  return values
    .map((value) => optionLabel(options, value))
    .filter((value): value is string => Boolean(value));
}

export function backgroundFilterGroups({
  academicLevels,
  expertiseDomains,
  professionalStages,
}: {
  academicLevels?: ReadonlyArray<string> | null;
  expertiseDomains?: ReadonlyArray<string> | null;
  professionalStages?: ReadonlyArray<string> | null;
}) {
  const groups = [
    {
      label: "Academic",
      values: labelsForValues(ACADEMIC_LEVEL_OPTIONS, academicLevels),
    },
    {
      label: "Professional",
      values: labelsForValues(PROFESSIONAL_STAGE_OPTIONS, professionalStages),
    },
    {
      label: "Expertise",
      values: labelsForValues(EXPERTISE_DOMAIN_OPTIONS, expertiseDomains),
    },
  ];

  return groups.filter((group) => group.values.length > 0);
}

export function summarizeBackgroundFilters({
  academicLevels,
  expertiseDomains,
  professionalStages,
}: {
  academicLevels?: ReadonlyArray<string> | null;
  expertiseDomains?: ReadonlyArray<string> | null;
  professionalStages?: ReadonlyArray<string> | null;
}) {
  const groups = backgroundFilterGroups({
    academicLevels,
    expertiseDomains,
    professionalStages,
  });

  if (groups.length === 0) {
    return "Open to everyone";
  }

  return groups
    .map((group) => `${group.label}: ${group.values.join(", ")}`)
    .join(" · ");
}

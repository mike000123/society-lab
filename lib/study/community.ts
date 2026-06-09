import type { Database } from "@/lib/database.types";
import {
  STUDY_ACCESS_OPTIONS,
  STUDY_CATEGORIES,
  STUDY_FORMATS,
  STUDY_LEVELS,
  type StudyAccess,
  type StudyCategory,
  type StudyFormat,
  type StudyLevel,
  type StudyResource,
} from "@/lib/study/catalog";

export type StudySubmissionStatus = Database["public"]["Enums"]["study_resource_submission_status"];
export type StudySubmissionKind = Database["public"]["Enums"]["study_resource_submission_kind"];
export type StudySubmissionRow = Database["public"]["Tables"]["study_resource_submissions"]["Row"];
export type StudyCategoryId = StudyCategory["id"];

export type CommunityStudyResource = StudyResource & {
  categoryId: StudyCategoryId;
  contributionSource: "community";
  communityKind: StudySubmissionKind;
  submissionId: string;
};

export const STUDY_SUBMISSION_FORMATS: StudyFormat[] = [...STUDY_FORMATS];
export const STUDY_SUBMISSION_LEVELS: StudyLevel[] = [...STUDY_LEVELS];
export const STUDY_SUBMISSION_ACCESS_OPTIONS: StudyAccess[] = [...STUDY_ACCESS_OPTIONS];
export const STUDY_SUBMISSION_CATEGORY_OPTIONS = STUDY_CATEGORIES.map((category) => ({
  id: category.id,
  title: category.title,
}));

export function mergeStudyCategories(communityResources: CommunityStudyResource[]) {
  const resourcesByCategory = new Map<StudyCategoryId, CommunityStudyResource[]>();

  for (const resource of communityResources) {
    const existing = resourcesByCategory.get(resource.categoryId) ?? [];
    existing.push(resource);
    resourcesByCategory.set(resource.categoryId, existing);
  }

  return STUDY_CATEGORIES.map((category) => ({
    ...category,
    items: [...category.items, ...(resourcesByCategory.get(category.id) ?? [])],
  }));
}

export function flattenStudyResources(categories: StudyCategory[]) {
  return categories.flatMap((category) => category.items);
}

export function isStudyCategoryId(value: string): value is StudyCategoryId {
  return STUDY_CATEGORIES.some((category) => category.id === value);
}

export function isStudyFormat(value: string): value is StudyFormat {
  return STUDY_SUBMISSION_FORMATS.includes(value as StudyFormat);
}

export function isStudyLevel(value: string): value is StudyLevel {
  return STUDY_SUBMISSION_LEVELS.includes(value as StudyLevel);
}

export function isStudyAccess(value: string): value is StudyAccess {
  return STUDY_SUBMISSION_ACCESS_OPTIONS.includes(value as StudyAccess);
}

export function mapStudySubmissionToResource(
  submission: Pick<
    StudySubmissionRow,
    "id" | "title" | "url" | "format" | "level" | "access" | "source" | "summary" | "tags" | "category_id" | "submission_kind"
  >,
  contributorName?: string | null,
): CommunityStudyResource {
  const isArticle = submission.submission_kind === "article";

  return {
    access: submission.access as StudyAccess,
    categoryId: submission.category_id as StudyCategoryId,
    contributionSource: "community",
    contributorName: contributorName ?? null,
    communityKind: submission.submission_kind,
    format: submission.format as StudyFormat,
    id: `community-${submission.id}`,
    level: submission.level as StudyLevel,
    source: isArticle ? contributorName ?? submission.source : submission.source,
    submissionId: submission.id,
    summary: submission.summary,
    tags: submission.tags,
    title: submission.title,
    url: isArticle ? `/study/articles/${submission.id}` : submission.url ?? `/study/articles/${submission.id}`,
  };
}

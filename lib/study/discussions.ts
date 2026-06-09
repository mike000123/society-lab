import type { StudyResource } from "@/lib/study/catalog";
import type { StudyPath } from "@/lib/study/paths";
import { withQuery } from "@/lib/utils";

export function buildStudyDiscussionHref({
  prompt,
  title,
}: {
  prompt: string;
  title: string;
}) {
  return `${withQuery("/discussions", { prompt, title })}#start-discussion`;
}

export function buildPathDiscussionHref(path: StudyPath) {
  return buildStudyDiscussionHref({
    prompt: `Use the study path "${path.title}" as a starting point. Which system question is this path best equipped to answer, which resource in it matters most, and what should people test, challenge, or apply next?`,
    title: `What should we take from the "${path.title}" study path?`,
  });
}

export function buildTopicDiscussionHref(title: string, description?: string) {
  return buildStudyDiscussionHref({
    prompt: `Use the topic "${title}" as the discussion frame. ${description ? `${description} ` : ""}Which resources in this shelf are most useful, what tensions matter most, and what should people understand or investigate next?`,
    title: `Which questions matter most inside "${title}"?`,
  });
}

export function buildResourceDiscussionHref(resource: StudyResource, contextLabel: string) {
  return buildStudyDiscussionHref({
    prompt:
      resource.communityKind === "article"
        ? `Use the study article "${resource.title}" as a starting point within ${contextLabel}. What is the strongest claim, what evidence is most convincing, and what should this community question, refine, or apply next?`
        : `Use the study resource "${resource.title}" as a starting point within ${contextLabel}. What is the main claim, what evidence matters most, and how should it reshape our understanding of this area?`,
    title: `What should we take from "${resource.title}"?`,
  });
}

export function isExternalStudyUrl(url: string) {
  return /^https?:\/\//i.test(url);
}

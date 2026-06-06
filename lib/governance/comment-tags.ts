import type { Database } from "@/lib/database.types";

export type ProposalCommentTag = Database["public"]["Enums"]["proposal_comment_tag"];

export const PROPOSAL_COMMENT_TAGS: Array<{
  description: string;
  label: string;
  value: ProposalCommentTag;
}> = [
  {
    value: "point_of_improvement",
    label: "Point of improvement",
    description: "A concrete way the proposal could become stronger or clearer.",
  },
  {
    value: "feasibility_issue",
    label: "Feasibility issue",
    description: "A practical barrier in capacity, law, cost, or political reality.",
  },
  {
    value: "implementation_detail",
    label: "Implementation detail",
    description: "A design or execution detail the proposal should spell out.",
  },
  {
    value: "supporting_evidence",
    label: "Supporting evidence",
    description: "A case, study, or example that strengthens the proposal.",
  },
  {
    value: "risk_tradeoff",
    label: "Risk / trade-off",
    description: "A side effect, trade-off, or unintended consequence to address.",
  },
  {
    value: "clarifying_question",
    label: "Clarifying question",
    description: "A question that can sharpen the proposal before it moves forward.",
  },
];

export function proposalCommentTagLabel(tag: ProposalCommentTag) {
  return PROPOSAL_COMMENT_TAGS.find((option) => option.value === tag)?.label ?? tag;
}

export function proposalCommentTagDescription(tag: ProposalCommentTag) {
  return PROPOSAL_COMMENT_TAGS.find((option) => option.value === tag)?.description ?? "";
}

export function proposalCommentTagTone(tag: ProposalCommentTag) {
  switch (tag) {
    case "point_of_improvement":
      return "border-sky-200 bg-sky-50 text-sky-700";
    case "feasibility_issue":
      return "border-amber-200 bg-amber-50 text-amber-700";
    case "implementation_detail":
      return "border-violet-200 bg-violet-50 text-violet-700";
    case "supporting_evidence":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "risk_tradeoff":
      return "border-rose-200 bg-rose-50 text-rose-700";
    case "clarifying_question":
      return "border-cyan-200 bg-cyan-50 text-cyan-700";
    default:
      return "border-slate-200 bg-slate-50 text-slate-600";
  }
}

"use client";

import { useCallback, useEffect, useState } from "react";

const VOTES_KEY = "society_lab_votes_v1";
const SUBMISSIONS_KEY = "society_lab_submissions_v1";

type VoteMap = Record<string, 1 | -1>;  // proposalId -> vote

function loadVotes(): VoteMap {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(VOTES_KEY) ?? "{}");
  } catch {
    return {};
  }
}

function saveVotes(votes: VoteMap) {
  if (typeof window === "undefined") return;
  localStorage.setItem(VOTES_KEY, JSON.stringify(votes));
}

export function useVotes() {
  const [votes, setVotes] = useState<VoteMap>({});

  useEffect(() => {
    setVotes(loadVotes());
  }, []);

  const castVote = useCallback((proposalId: string, value: 1 | -1) => {
    setVotes((prev) => {
      const next = { ...prev };
      if (next[proposalId] === value) {
        // Toggle off
        delete next[proposalId];
      } else {
        next[proposalId] = value;
      }
      saveVotes(next);
      return next;
    });
  }, []);

  const getVote = useCallback((proposalId: string): 1 | -1 | 0 => {
    return votes[proposalId] ?? 0;
  }, [votes]);

  // Net delta for a proposal: only count this browser's vote on top of seed data
  const getLocalDelta = useCallback((proposalId: string): number => {
    return votes[proposalId] ?? 0;
  }, [votes]);

  return { castVote, getVote, getLocalDelta };
}

// ─── User submissions (localStorage) ─────────────────────────────────────────
import type { Proposal, ProposalCategory } from "./proposals";

function loadSubmissions(): Proposal[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(SUBMISSIONS_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function saveSubmissions(proposals: Proposal[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(proposals));
}

export function useSubmissions() {
  const [submissions, setSubmissions] = useState<Proposal[]>([]);

  useEffect(() => {
    setSubmissions(loadSubmissions());
  }, []);

  const addSubmission = useCallback((data: {
    title: string;
    description: string;
    rationale: string;
    category: ProposalCategory;
    moduleSlug: string | null;
    moduleTitle: string | null;
    authorName: string;
  }): string => {
    const id = crypto.randomUUID();
    const proposal: Proposal = {
      ...data,
      id,
      isSeeded: false,
      seedUpvotes: 0,
      seedDownvotes: 0,
      createdAt: new Date().toISOString(),
    };
    const next = [proposal, ...loadSubmissions()];
    saveSubmissions(next);
    setSubmissions(next);
    return id;
  }, []);

  return { submissions, addSubmission };
}

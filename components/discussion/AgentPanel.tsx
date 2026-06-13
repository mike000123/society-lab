"use client";

import { useState } from "react";
import { Bot, ChevronDown, ChevronUp, Loader2, Sparkles } from "lucide-react";

import { AGENT_PERSONAS, type AgentPersona } from "@/lib/agents/personas";
import { cn } from "@/lib/utils";

interface AgentResponse {
  agentId: string;
  agentName: string;
  response: string;
}

interface AgentPanelProps {
  defaultOpen?: boolean;
  recentPosts: { author: string; content: string; kind: string }[];
  topic: string;
}

function AgentCard({
  agent,
  onSelect,
  selected,
}: {
  agent: AgentPersona;
  onSelect: () => void;
  selected: boolean;
}) {
  return (
    <button
      className={cn(
        "w-full rounded-[1.2rem] border px-3 py-3 text-left text-xs transition",
        selected
          ? "border-[rgba(59,130,246,0.2)] bg-[rgba(59,130,246,0.08)]"
          : "border-[rgba(28,36,48,0.08)] bg-white/88 hover:border-[rgba(28,36,48,0.18)]",
      )}
      onClick={onSelect}
      type="button"
    >
      <span className={cn("block text-sm font-semibold", selected ? "text-slate-900" : "text-slate-700")}>
        {agent.name}
      </span>
      <span className="mt-1 block leading-snug text-slate-500">{agent.role}</span>
    </button>
  );
}

export function AgentPanel({ defaultOpen = false, topic, recentPosts }: AgentPanelProps) {
  const [open, setOpen] = useState(defaultOpen);
  const [selectedId, setSelectedId] = useState<string>(AGENT_PERSONAS[0].id);
  const [userPrompt, setUserPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [responses, setResponses] = useState<AgentResponse[]>([]);
  const [error, setError] = useState<string | null>(null);

  const selectedAgent = AGENT_PERSONAS.find((agent) => agent.id === selectedId)!;

  async function askAgent() {
    if (loading) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/debate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId: selectedId,
          topic,
          recentPosts,
          userPrompt: userPrompt.trim() || undefined,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? "Something went wrong.");
        return;
      }

      setResponses((previous) => [
        { agentId: data.agentId, agentName: data.agentName, response: data.response },
        ...previous,
      ]);
      setUserPrompt("");
    } catch {
      setError("Network error. Check your connection.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-[1.75rem] border border-[rgba(28,36,48,0.08)] bg-white/92 shadow-[0_14px_32px_rgba(28,36,48,0.04)]">
      <button
        className="flex w-full items-center justify-between px-5 py-4 text-left"
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(139,92,246,0.16)] bg-[rgba(139,92,246,0.08)] text-violet-700">
            <Bot className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">Test Your Argument</p>
            <p className="text-xs text-slate-500">Get perspectives from AI agents.</p>
          </div>
        </div>
        {open ? <ChevronUp className="h-4 w-4 text-slate-500" /> : <ChevronDown className="h-4 w-4 text-slate-500" />}
      </button>

      {open ? (
        <div className="border-t border-[rgba(28,36,48,0.08)] px-5 pb-5 pt-4 space-y-4">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {AGENT_PERSONAS.map((agent) => (
              <AgentCard
                agent={agent}
                key={agent.id}
                onSelect={() => setSelectedId(agent.id)}
                selected={selectedId === agent.id}
              />
            ))}
          </div>

          <div className="rounded-[1.2rem] border border-[rgba(28,36,48,0.08)] bg-[rgba(251,249,245,0.95)] px-4 py-4 text-sm leading-6 text-slate-600">
            <span className="font-semibold text-slate-900">{selectedAgent.name}</span> — {selectedAgent.description}
          </div>

          <textarea
            className="w-full rounded-[1.35rem] border border-[rgba(28,36,48,0.12)] bg-[rgba(251,249,245,0.95)] px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[rgb(var(--atlas-primary))] resize-none"
            onChange={(event) => setUserPrompt(event.target.value)}
            placeholder={`Ask ${selectedAgent.name} a specific question, or leave blank for a general perspective...`}
            rows={2}
            value={userPrompt}
          />

          {error ? (
            <p className="rounded-[1.1rem] border border-rose-200 bg-rose-50/80 px-4 py-3 text-xs text-rose-700">
              {error}
            </p>
          ) : null}

          <button
            className="flex w-full items-center justify-center gap-2 rounded-full bg-[rgb(var(--atlas-primary))] px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:opacity-50"
            disabled={loading}
            onClick={askAgent}
            type="button"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Thinking...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Get {selectedAgent.name}&apos;s perspective
              </>
            )}
          </button>

          {responses.length > 0 ? (
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Agent responses</p>
              {responses.map((response, index) => (
                <article
                  className="rounded-[1.2rem] border border-[rgba(28,36,48,0.08)] bg-white/88 px-4 py-4"
                  key={`${response.agentId}-${index}`}
                >
                  <div className="flex items-center gap-2">
                    <Bot className="h-3.5 w-3.5 text-violet-700" />
                    <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      {response.agentName}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-slate-700 whitespace-pre-line">{response.response}</p>
                </article>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

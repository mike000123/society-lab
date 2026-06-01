"use client";

import { useState } from "react";
import { Bot, ChevronDown, ChevronUp, Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { AGENT_PERSONAS, type AgentPersona } from "@/lib/agents/personas";

interface AgentResponse {
  agentId: string;
  agentName: string;
  response: string;
}

interface AgentPanelProps {
  topic: string;
  recentPosts: { kind: string; content: string; author: string }[];
}

function AgentCard({ agent, onSelect, selected }: {
  agent: AgentPersona;
  onSelect: () => void;
  selected: boolean;
}) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        "flex flex-col gap-1 rounded-2xl border p-3 text-left text-xs transition-colors w-full",
        selected
          ? `${agent.borderColor} ${agent.bgColor}`
          : "border-slate-700 hover:border-slate-500",
      )}
    >
      <span className={cn("font-semibold text-sm", selected ? agent.color : "text-slate-300")}>
        {agent.name}
      </span>
      <span className="text-slate-500 leading-snug">{agent.role}</span>
    </button>
  );
}

export function AgentPanel({ topic, recentPosts }: AgentPanelProps) {
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string>(AGENT_PERSONAS[0].id);
  const [userPrompt, setUserPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [responses, setResponses] = useState<AgentResponse[]>([]);
  const [error, setError] = useState<string | null>(null);

  const selectedAgent = AGENT_PERSONAS.find((a) => a.id === selectedId)!;

  async function askAgent() {
    if (loading) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/debate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId: selectedId,
          topic,
          recentPosts,
          userPrompt: userPrompt.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        return;
      }

      setResponses((prev) => [
        { agentId: data.agentId, agentName: data.agentName, response: data.response },
        ...prev,
      ]);
      setUserPrompt("");
    } catch {
      setError("Network error. Check your connection.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-[1.75rem] border border-slate-700/60 bg-slate-900/40">
      {/* Header toggle */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-5 py-4 text-left"
      >
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-xl border border-violet-400/25 bg-violet-400/10">
            <Bot className="h-4 w-4 text-violet-300" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-200">Ask an AI agent</p>
            <p className="text-xs text-slate-500">6 expert perspectives — systems, economics, ethics, history</p>
          </div>
        </div>
        {open ? (
          <ChevronUp className="h-4 w-4 text-slate-500" />
        ) : (
          <ChevronDown className="h-4 w-4 text-slate-500" />
        )}
      </button>

      {open && (
        <div className="border-t border-slate-700/60 px-5 pb-5 pt-4 space-y-4">
          {/* Agent selector */}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {AGENT_PERSONAS.map((agent) => (
              <AgentCard
                key={agent.id}
                agent={agent}
                onSelect={() => setSelectedId(agent.id)}
                selected={selectedId === agent.id}
              />
            ))}
          </div>

          {/* Selected agent description */}
          <div className={cn("rounded-xl border px-4 py-3 text-xs", selectedAgent.borderColor, selectedAgent.bgColor)}>
            <span className={cn("font-semibold", selectedAgent.color)}>{selectedAgent.name}</span>
            <span className="text-slate-400"> — {selectedAgent.description}</span>
          </div>

          {/* Optional prompt */}
          <textarea
            value={userPrompt}
            onChange={(e) => setUserPrompt(e.target.value)}
            placeholder={`Ask ${selectedAgent.name} a specific question, or leave blank for a general perspective…`}
            rows={2}
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-violet-500 resize-none"
          />

          {error && (
            <p className="rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-2 text-xs text-rose-300">
              {error}
            </p>
          )}

          <button
            onClick={askAgent}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:opacity-50"
          >
            {loading ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Thinking…</>
            ) : (
              <><Sparkles className="h-4 w-4" /> Get {selectedAgent.name}&apos;s perspective</>
            )}
          </button>

          {/* Responses */}
          {responses.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-widest text-slate-600">Agent responses</p>
              {responses.map((r, i) => {
                const agent = AGENT_PERSONAS.find((a) => a.id === r.agentId)!;
                return (
                  <article
                    key={i}
                    className={cn("rounded-2xl border p-4 space-y-2", agent?.borderColor ?? "border-slate-700")}
                  >
                    <div className="flex items-center gap-2">
                      <Bot className={cn("h-3.5 w-3.5", agent?.color ?? "text-slate-400")} />
                      <span className={cn("text-xs font-semibold", agent?.color ?? "text-slate-300")}>
                        {r.agentName}
                      </span>
                      <span className="text-xs text-slate-600">· AI agent</span>
                    </div>
                    <p className="text-sm leading-6 text-slate-300 whitespace-pre-line">{r.response}</p>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

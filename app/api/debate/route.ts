import { NextRequest, NextResponse } from "next/server";
import { getAgentById } from "@/lib/agents/personas";

export const runtime = "edge";

interface DebateRequest {
  agentId: string;
  topic: string;
  recentPosts: { kind: string; content: string; author: string }[];
  userPrompt?: string;
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY is not configured. Add it to .env.local." },
      { status: 503 },
    );
  }

  let body: DebateRequest;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { agentId, topic, recentPosts, userPrompt } = body;
  const agent = getAgentById(agentId);

  if (!agent) {
    return NextResponse.json({ error: `Unknown agent: ${agentId}` }, { status: 400 });
  }

  // Build the user message from discussion context
  const contextLines = recentPosts
    .slice(-6)
    .map((p) => `[${p.kind.toUpperCase()}] ${p.author}: ${p.content}`)
    .join("\n");

  const userMessage = [
    `Topic: ${topic}`,
    recentPosts.length > 0
      ? `\nRecent discussion:\n${contextLines}`
      : "",
    userPrompt
      ? `\nUser question: ${userPrompt}`
      : "\nContribute your perspective to this discussion.",
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 512,
        system: agent.systemPrompt,
        messages: [{ role: "user", content: userMessage }],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Anthropic API error:", err);
      return NextResponse.json(
        { error: "AI service error. Check ANTHROPIC_API_KEY and try again." },
        { status: 502 },
      );
    }

    const data = await response.json();
    const text: string = data.content?.[0]?.text ?? "";

    return NextResponse.json({ agentId, agentName: agent.name, response: text });
  } catch (err) {
    console.error("Debate agent fetch error:", err);
    return NextResponse.json({ error: "Network error reaching AI service." }, { status: 502 });
  }
}

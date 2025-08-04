import { NextRequest } from "next/server";
import OpenAI from "openai";
import type { AgentName } from "./agents";

export const defaultAgent: AgentName = "Listener";
const expiryTurns = 4;
const expiryMs = 5 * 60_000;

interface Session {
  agent: AgentName;
  turns: number;
  lastTime: number;
}

const sessions = new Map<string, Session>();

// Use an empty string so the build does not fail if no API key is configured.
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "" });

// Decide agent via lightweight LLM classification.
export async function decideAgent(message: string): Promise<AgentName> {
  try {
    const res = await client.responses.create({
      model: "gpt-4o-mini",
      input: `You are a router deciding which agent should reply to a user message.\n` +
        `Return either "Listener" for emotional support or "Solver" for problem solving.\n` +
        `Reply with only the agent name.\n` +
        `Message: ${message}`,
    });
    const choice = res.output_text.trim();
    if (choice === "Solver" || choice === "Listener") return choice;
  } catch (err) {
    console.error("decideAgent failed", err);
  }
  return defaultAgent;
}

function ensureUid(req: NextRequest): { uid: string; headers: Headers } {
  const cookie = req.cookies.get("uid")?.value;
  if (cookie) return { uid: cookie, headers: new Headers() };
  const uid = crypto.randomUUID();
  const headers = new Headers();
  headers.append(
    "Set-Cookie",
    `uid=${uid}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 365}`,
  );
  return { uid, headers };
}

// Routing logic with expiry rules.
export async function route(
  req: NextRequest,
  message: string,
): Promise<{ agent: AgentName; headers: Headers }> {
  const { uid, headers } = ensureUid(req);
  const now = Date.now();
  const session = sessions.get(uid) ?? {
    agent: defaultAgent,
    turns: 0,
    lastTime: now,
  };

  // Reset to default based on time or turns.
  if (now - session.lastTime > expiryMs || session.turns >= expiryTurns) {
    session.agent = defaultAgent;
    session.turns = 0;
  }

  const chosen = await decideAgent(message);
  if (chosen !== session.agent) {
    session.agent = chosen;
    session.turns = 0;
  } else {
    session.turns += 1;
  }
  session.lastTime = now;
  sessions.set(uid, session);
  return { agent: session.agent, headers };
}

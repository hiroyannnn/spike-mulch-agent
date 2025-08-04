import { NextRequest } from "next/server";
import { runAgent } from "@/lib/agents";
import { route } from "@/lib/router";
import type { Message } from "@/lib/agents";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const messages: Message[] = body.messages || [];
  const last = messages.filter((m) => m.role === "user").slice(-1)[0];
  const lastContent = last ? last.content : "";

  const { agent, headers } = await route(req, lastContent);
  const stream = await runAgent(agent, messages);

  const resHeaders = new Headers({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });
  headers.forEach((value, key) => resHeaders.append(key, value));

  return new Response(stream, { headers: resHeaders });
}

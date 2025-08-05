import { NextRequest } from "next/server";
import { runAgent } from "@/lib/agents";
import { route } from "@/lib/router";
import type { Message } from "@/lib/agents";

export const runtime = "edge";

async function handler(req: NextRequest) {
  console.log("/api/chat", req.method);

  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }

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
    "Access-Control-Allow-Origin": "*",
  });
  headers.forEach((value, key) => resHeaders.append(key, value));

  return new Response(stream, { headers: resHeaders });
}

export { handler as POST, handler as GET, handler as OPTIONS };

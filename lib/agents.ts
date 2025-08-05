import OpenAI from "openai";

// Define each agent with its system prompt.
export const agents = {
  Listener: {
    system: "You are Listener, a compassionate agent who responds empathetically and validates feelings. Keep replies short and supportive.",
  },
  Solver: {
    system: "You are Solver, a pragmatic problem-solving coach. Guide users toward actionable solutions and encourage them to think through options.",
  },
};

export type AgentName = keyof typeof agents;

// Allow building without an API key by falling back to an empty string.
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "" });

export interface Message {
  role: "user" | "assistant";
  content: string;
}

// Call OpenAI's Responses API and return a ReadableStream for SSE.
export async function runAgent(
  agent: AgentName,
  messages: Message[],
): Promise<ReadableStream<any>> {
  const stream = await client.responses.stream({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: agents[agent].system },
      ...messages,
    ],
  });

  // `client.responses.stream` returns different types depending on the
  // runtime and library version. In Node/Edge it may already be a
  // `ReadableStream`, while older versions expose a helper method
  // `toReadableStream()`. Guard against both cases to avoid runtime
  // errors when the helper does not exist.
  const anyStream = stream as any;
  if (typeof anyStream.toReadableStream === "function") {
    return anyStream.toReadableStream();
  }

  // When running in a Node.js environment the OpenAI library may return a
  // Node.js `Readable` stream. Convert it to a Web `ReadableStream` so that
  // it can be consumed by the `Response` constructor used in the API route.
  if (typeof anyStream.pipe === "function") {
    const { Readable } = await import("stream");
    return Readable.toWeb(anyStream);
  }

  return anyStream as ReadableStream;
}

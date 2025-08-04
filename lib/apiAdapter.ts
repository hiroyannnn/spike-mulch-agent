"use client";

import type {
  ChatModelAdapter,
  ChatModelRunOptions,
  ChatModelRunResult,
} from "@assistant-ui/react";

// Adapter that calls the `/api/chat` route and streams the response
export const apiAdapter: ChatModelAdapter = {
  async run({ messages, abortSignal }: ChatModelRunOptions): Promise<ChatModelRunResult> {
    const payload = {
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content
          .filter((p) => "text" in p)
          .map((p: any) => p.text as string)
          .join(""),
      })),
    };

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: abortSignal,
    });

    const reader = res.body?.getReader();
    if (!reader) {
      return { content: [{ type: "text", text: "" }] };
    }

    const decoder = new TextDecoder();
    let buffer = "";
    let text = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const parts = buffer.split("\n\n");
      buffer = parts.pop() ?? "";
      for (const part of parts) {
        if (!part.startsWith("data:")) continue;
        const data = part.slice(5).trim();
        if (data === "[DONE]") {
          break;
        }
        try {
          const json = JSON.parse(data);
          const delta =
            json.delta?.content?.[0]?.text ??
            json.message?.content?.[0]?.text ??
            "";
          text += delta;
        } catch {
          // ignore malformed SSE lines
        }
      }
    }

    return { content: [{ type: "text", text }] };
  },
};


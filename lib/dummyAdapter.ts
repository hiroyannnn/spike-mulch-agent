import type {
  ChatModelAdapter,
  ChatModelRunResult,
  ChatModelRunOptions,
} from "@assistant-ui/react";

// A minimal chat model adapter that returns a static message.
// This allows the UI to render even when the OpenAI API key is missing.
export const dummyAdapter: ChatModelAdapter = {
  async run(_: ChatModelRunOptions): Promise<ChatModelRunResult> {
    return {
      content: [{ type: "text", text: "OpenAI API key not configured." }],
    };
  },
};

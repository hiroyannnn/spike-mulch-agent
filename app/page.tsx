"use client";

import { Thread } from "assistant-ui";

export default function Page() {
  return (
    <main className="p-4">
      <Thread endpoint="/api/chat" welcome="こんにちは！お気軽に話しかけてください😊" />
    </main>
  );
}

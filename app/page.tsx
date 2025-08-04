"use client";

import { Thread as BaseThread } from "@assistant-ui/react-ui";
const Thread: any = BaseThread;

export default function Page() {
  return (
    <main className="p-4">
      <Thread welcome={{ message: "こんにちは！お気軽に話しかけてください😊" }} />
    </main>
  );
}

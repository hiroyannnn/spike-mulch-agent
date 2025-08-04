import "./globals.css";
import type { Metadata } from "next";
import { ReactNode } from "react";
import AssistantProvider from "./AssistantProvider";

export const metadata: Metadata = {
  title: "Multi-Agent Chatbot",
  description: "Chat with listener and solver agents",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AssistantProvider>{children}</AssistantProvider>
      </body>
    </html>
  );
}

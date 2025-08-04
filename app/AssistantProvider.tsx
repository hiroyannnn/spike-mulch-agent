"use client";

import { ReactNode } from "react";
import { AssistantRuntimeProvider, useLocalRuntime } from "@assistant-ui/react";
import { apiAdapter } from "@/lib/apiAdapter";

interface Props {
  children: ReactNode;
}

export default function AssistantProvider({ children }: Props) {
  const runtime = useLocalRuntime(apiAdapter, {});
  return <AssistantRuntimeProvider runtime={runtime}>{children}</AssistantRuntimeProvider>;
}

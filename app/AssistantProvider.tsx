"use client";

import { ReactNode } from "react";
import { AssistantRuntimeProvider, useLocalRuntime } from "@assistant-ui/react";
import { dummyAdapter } from "@/lib/dummyAdapter";

interface Props {
  children: ReactNode;
}

export default function AssistantProvider({ children }: Props) {
  const runtime = useLocalRuntime(dummyAdapter, {});
  return <AssistantRuntimeProvider runtime={runtime}>{children}</AssistantRuntimeProvider>;
}

"use client";

import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { useChatRuntime } from "@assistant-ui/react-ai-sdk";
import { AssistantCloud } from "assistant-cloud";
import { Thread } from "@assistant-ui/react-ui";
import { useMemo } from "react";

export interface ChatInterfaceProps {
  cloudBaseUrl: string;
}

export function ChatInterface({ cloudBaseUrl }: ChatInterfaceProps) {
  const cloud = useMemo(
    () => new AssistantCloud({ baseUrl: cloudBaseUrl, anonymous: true }),
    [cloudBaseUrl]
  );

  const runtime = useChatRuntime({ cloud });

  return (
    <div className="aui-root dark flex flex-col h-full w-full bg-background text-foreground">
      <AssistantRuntimeProvider runtime={runtime}>
        <Thread />
      </AssistantRuntimeProvider>
    </div>
  );
}
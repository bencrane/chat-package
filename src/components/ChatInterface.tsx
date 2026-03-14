"use client";

import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { useChatRuntime } from "@assistant-ui/react-ai-sdk";
import { AssistantCloud } from "assistant-cloud";
import { Thread } from "@assistant-ui/react-ui";

const cloud = new AssistantCloud({
  baseUrl: process.env.NEXT_PUBLIC_ASSISTANT_BASE_URL!,
  anonymous: true,
});

export function ChatInterface() {
  const runtime = useChatRuntime({ cloud });

  return (
    <div className="aui-root dark flex flex-col h-full w-full bg-background text-foreground">
      <AssistantRuntimeProvider runtime={runtime}>
        <Thread />
      </AssistantRuntimeProvider>
    </div>
  );
}
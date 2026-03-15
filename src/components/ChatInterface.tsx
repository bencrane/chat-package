"use client";

import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { useChatRuntime } from "@assistant-ui/react-ai-sdk";
import { AssistantCloud } from "assistant-cloud";
import { Thread, ThreadList } from "@assistant-ui/react-ui";
import { useMemo } from "react";

export interface ChatInterfaceProps {
  /** assistant-ui Cloud API base URL for persistent threads. Optional. */
  cloudBaseUrl?: string;
}

export function ChatInterface({ cloudBaseUrl }: ChatInterfaceProps) {
  const cloud = useMemo(
    () =>
      cloudBaseUrl
        ? new AssistantCloud({ baseUrl: cloudBaseUrl, anonymous: true })
        : undefined,
    [cloudBaseUrl]
  );

  const runtime = useChatRuntime({ cloud });

  return (
    <div className="aui-root dark flex h-full w-full bg-background text-foreground">
      <AssistantRuntimeProvider runtime={runtime}>
        {cloud ? (
          <>
            <div className="w-[220px] shrink-0 border-r border-border">
              <ThreadList />
            </div>
            <div className="flex-1 min-w-0">
              <Thread />
            </div>
          </>
        ) : (
          <Thread />
        )}
      </AssistantRuntimeProvider>
    </div>
  );
}
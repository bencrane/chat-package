"use client";

import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { useDataStreamRuntime } from "@assistant-ui/react-data-stream";
import { Thread } from "@assistant-ui/react-ui";

export interface ChatInterfaceProps {
  /**
   * The API endpoint to send the messages to. Defaults to "/api/chat"
   */
  api?: string;
}

export function ChatInterface({ api = "/api/chat" }: ChatInterfaceProps) {
  const runtime = useDataStreamRuntime({
    api,
    protocol: "data-stream",
  });

  return (
    <div className="aui-root dark flex flex-col h-full w-full bg-background text-foreground">
      <AssistantRuntimeProvider runtime={runtime}>
        <Thread />
      </AssistantRuntimeProvider>
    </div>
  );
}

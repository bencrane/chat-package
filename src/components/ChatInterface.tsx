"use client";

import { useChat } from "@ai-sdk/react";
import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { useChatRuntime } from "@assistant-ui/react-ai-sdk";
import { Thread } from "@assistant-ui/react-ui";

export interface ChatInterfaceProps {
  /**
   * The API endpoint to send the messages to. Defaults to "/api/chat"
   */
  api?: string;
  /**
   * Initial messages if required.
   */
  initialMessages?: any[];
}

export function ChatInterface({
  api = "/api/chat",
  initialMessages,
}: ChatInterfaceProps) {
  // 1. Hook into Vercel AI SDK to manage state & API interactions
  const chatState = useChat({
    api,
    initialMessages,
  });

  // 2. Link the AI SDK up with assistant-ui's runtime hook
  // Casting to `any` because @ai-sdk/react v1.1.0 returns a `role: "data"` in its UIMessage type
  // which conflicts with @assistant-ui/react-ai-sdk v1.3.0 strict typings.
  const runtime = useChatRuntime(chatState as any);

  // 3. Render the standard component provided by assistant-ui.
  // The 'dark' class defaults the UI to dark mode as requested.
  return (
    <div className="aui-root dark flex flex-col h-full w-full bg-background text-foreground">
      <AssistantRuntimeProvider runtime={runtime}>
        <Thread />
      </AssistantRuntimeProvider>
    </div>
  );
}

"use client";

import { ChatInterface } from "chat-package";

export default function Home() {
  return (
    <main className="flex w-full h-screen flex-col items-center justify-between p-4 bg-zinc-950">
      <div className="w-full max-w-4xl h-full border border-zinc-800 rounded-xl overflow-hidden shadow-2xl relative bg-black/50">
        <ChatInterface />
      </div>
    </main>
  );
}

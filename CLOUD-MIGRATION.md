# Chat Package v2.0 — Cloud Migration

## What changed

We ripped out the self-hosted LLM backend and switched to **assistant-ui Cloud**. Cloud now handles both LLM calls (via the Anthropic provider configured in the dashboard) and persistent thread history.

### Removed
- **Server route handler** (`src/server/route-handler.ts`) — Cloud calls Anthropic directly, no need for our own `/api/chat` proxy
- **Tools helper** (`src/lib/tools.ts`) — tools are configured in Cloud now, not in our backend
- **Server entry point** (`src/server.ts`) — nothing to export server-side anymore
- **`@ai-sdk/anthropic`** dependency — we're not calling Anthropic ourselves
- **`@assistant-ui/react-data-stream`** dependency — replaced by `@assistant-ui/react-ai-sdk`
- **`./server` package export** — consuming apps no longer import from `chat-package/server`

### Updated
- **`ChatInterface`** — uses `useChatRuntime({ cloud })` instead of `useDataStreamRuntime`. No more `api` prop since there's no backend route to point at.
- **`AssistantCloud`** — initialized with `NEXT_PUBLIC_ASSISTANT_BASE_URL` env var (anonymous auth mode)
- **Dependencies** — all assistant-ui and AI SDK packages moved to `peerDependencies` to prevent duplicate React context issues. Version bumped to 2.0.0.

## Why

The old setup was broken — the data-stream protocol caused messages to vanish with `[DONE]` marker errors. We investigated two fixes:

1. **Self-hosted route with UI Message Stream protocol** — upgrade `ai` to v6, swap `toDataStreamResponse()` for `toUIMessageStreamResponse()`, add `AssistantChatTransport`. This works but means maintaining our own backend route, managing `@ai-sdk/anthropic` versions, dealing with breaking API changes across `ai` major versions, and handling tool registration in our own code.

2. **assistant-ui Cloud** — add Anthropic API key in the Cloud dashboard, let Cloud handle everything. One component, one env var, done.

Option 2 is dramatically simpler. The entire package is now ~25 lines of component code. Cloud gives us persistent threads (conversation history across sessions) for free, which we'd have had to build ourselves with option 1.

## What consuming apps need to do

### 1. Install new peer dependencies
```bash
npm install ai@^6 @ai-sdk/react @assistant-ui/react@latest @assistant-ui/react-ai-sdk @assistant-ui/react-ui assistant-cloud
```

### 2. Reinstall chat-package
```bash
npm install github:bencrane/chat-package
```

### 3. Add env var
```
NEXT_PUBLIC_ASSISTANT_BASE_URL=<your assistant-ui Cloud project URL>
```

### 4. Delete your `/api/chat` route
The `app/api/chat/route.ts` file that imported from `chat-package/server` is dead code now. Delete it.

### 5. Remove unused imports
If anything imports from `chat-package/server`, remove those imports. The only export is now:
```ts
import { ChatInterface } from "chat-package";
```

## Architecture (before → after)

**Before:**
```
Browser → ChatInterface → /api/chat (our Next.js route) → Anthropic API
                              ↑
                    createAnthropicChatHandler()
```

**After:**
```
Browser → ChatInterface → assistant-ui Cloud → Anthropic API
```
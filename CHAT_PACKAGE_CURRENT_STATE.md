# Chat Package — Current State Audit

**Date:** 2026-03-30
**Branch:** `bencrane/audit-chat-integration`
**Package version:** 2.0.0

---

## 1. Dependencies

### Root package (`package.json`)

| Package | Version | Location | Notes |
|---------|---------|----------|-------|
| `@assistant-ui/react` | `>=0.12.15` (peer), `^0.12.17` (dev) | peerDependencies + devDependencies | Core runtime provider |
| `@assistant-ui/react-ai-sdk` | `>=1.3.0` (peer), `^1.3.13` (dev) | peerDependencies + devDependencies | `useChatRuntime` hook |
| `@assistant-ui/react-ui` | `>=0.2.0` (peer), `^0.2.1` (dev) | peerDependencies + devDependencies | `Thread`, `ThreadList` components |
| `assistant-cloud` | `>=0.1.0` (peer), `^0.1.21` (dev) | peerDependencies + devDependencies | `AssistantCloud` client |
| `ai` | `^6.0.0` (peer + dev) | peerDependencies + devDependencies | Vercel AI SDK v6 |
| `@ai-sdk/react` | `^1.0.0 \|\| ^3.0.0` (peer), `^1.0.0` (dev) | peerDependencies + devDependencies | AI SDK React bindings |

### Playground (`playground/package.json`)

| Package | Version | Notes |
|---------|---------|-------|
| `@assistant-ui/react` | `^0.12.0` | |
| `@assistant-ui/react-ui` | `latest` | |
| `@assistant-ui/react-ai-sdk` | `^1.3.0` | |
| `@assistant-ui/react-syntax-highlighter` | `^0.12.0` | Only in playground |
| `@ai-sdk/anthropic` | `^1.1.0` | **Stale** — no longer needed post-Cloud migration |
| `@ai-sdk/react` | `^1.1.0` | |
| `ai` | `^4.0.0` | **Version mismatch** — root requires `^6.0.0` |

### Not installed (mentioned in docs/PRD but removed)

| Package | Status |
|---------|--------|
| `@ai-sdk/anthropic` | Removed from root — Cloud calls Anthropic directly (`CLOUD-MIGRATION.md:11`) |
| `@assistant-ui/react-data-stream` | Replaced by `@assistant-ui/react-ai-sdk` (`CLOUD-MIGRATION.md:12`) |
| `assistant-stream` | Never installed |

### Issues

- **Playground `ai` version mismatch:** `^4.0.0` vs root's `^6.0.0`. Will cause peer dep conflicts.
- **Playground has stale deps:** `@ai-sdk/anthropic` and the dead `api/chat/route.ts` suggest the playground wasn't updated for the v2 migration.
- **`assistant-cloud` missing from playground:** Not listed in playground's `package.json`, but required by `ChatInterface`.

---

## 2. Runtime Configuration

**Runtime hook:** `useChatRuntime` from `@assistant-ui/react-ai-sdk`
**File:** `src/components/ChatInterface.tsx:23`

```typescript
const runtime = useChatRuntime({ cloud });
```

**How it's configured:**
- `ChatInterface` accepts an optional `cloudBaseUrl` prop (`ChatInterface.tsx:11`)
- When provided, creates an `AssistantCloud` instance with `anonymous: true` (`ChatInterface.tsx:15-21`)
- The runtime receives the `cloud` instance (or `undefined` for ephemeral mode)

**What exists:**
- `useChatRuntime({ cloud })` — fully wired up
- `AssistantRuntimeProvider` wraps the component tree (`ChatInterface.tsx:27`)

**What's partially done:**
- Nothing — runtime setup is complete for Cloud mode

**What's missing:**
- No `useDataStreamRuntime` (intentionally removed)
- No `useLocalRuntime`, `useCloudRuntime` (not needed with current architecture)
- No way to pass custom tools or system prompt through the component props — tools are configured in Cloud dashboard only

---

## 3. Assistant Cloud

**File:** `src/components/ChatInterface.tsx:15-21`

```typescript
const cloud = useMemo(
  () =>
    cloudBaseUrl
      ? new AssistantCloud({ baseUrl: cloudBaseUrl, anonymous: true })
      : undefined,
  [cloudBaseUrl]
);
```

**What exists:**
- `AssistantCloud` instance creation with `anonymous: true` auth mode
- `cloudBaseUrl` prop accepted by `ChatInterface`
- Cloud handles both LLM calls and thread persistence

**What's partially done:**
- Nothing — Cloud integration is functional

**What's missing:**
- **No `.env` files anywhere** — no `.env`, `.env.example`, `.env.local`, or `.env.development` in root or playground
- **No `.env.example`** to document `NEXT_PUBLIC_ASSISTANT_BASE_URL` for consumers
- **No authenticated Cloud mode** — only `anonymous: true` is used. No JWT-based auth, no user-scoped threads
- **No API key configuration in this repo** — Anthropic key is set in Cloud dashboard (external)
- **Playground doesn't pass `cloudBaseUrl`** (`playground/src/app/page.tsx:9`), so it always runs in ephemeral mode with no persistence

---

## 4. Thread Management

**File:** `src/components/ChatInterface.tsx:28-39`

**What exists:**
- `<ThreadList />` from `@assistant-ui/react-ui` — rendered in a 220px sidebar (`ChatInterface.tsx:30-32`)
- Conditional rendering: sidebar + ThreadList shown only when `cloud` is configured
- Thread creation, loading, switching — all delegated to `assistant-ui Cloud` via the runtime
- Fallback to single-column `<Thread />` when Cloud is not configured

**What's partially done:**
- Nothing — thread management is complete for the Cloud-backed architecture

**What's missing:**
- **No thread deletion UI** — relies on whatever `ThreadList` provides out of the box
- **No thread archiving** — not implemented, would need Cloud API support
- **No thread search** — not implemented
- **No Supabase or local thread storage** — threads live entirely in Cloud
- **No custom thread metadata** (e.g., platform, user ID, conversation title)
- **Thread state is anonymous** — no user scoping, so threads are device/session-scoped only

---

## 5. Chat UI Components

### Component tree

```
ChatInterface (src/components/ChatInterface.tsx)
├── AssistantRuntimeProvider  (@assistant-ui/react)
│   ├── [if cloud] ThreadList  (@assistant-ui/react-ui, line 31)
│   ├── [if cloud] Thread      (@assistant-ui/react-ui, line 34)
│   └── [no cloud] Thread      (@assistant-ui/react-ui, line 38)
```

### Files using assistant-ui components

| File | Components | Lines |
|------|------------|-------|
| `src/components/ChatInterface.tsx` | `AssistantRuntimeProvider`, `Thread`, `ThreadList`, `useChatRuntime`, `AssistantCloud` | 1-43 |
| `src/index.ts` | Re-exports `ChatInterface` + `ChatInterfaceProps` | 1 |
| `src/styles.css` | `@import "@assistant-ui/react-ui/styles/index.css"`, custom `--aui-*` CSS variables | 1-83 |
| `playground/src/app/page.tsx` | `ChatInterface` (consumer) | 1-13 |

### Styling

- Base styles imported from `@assistant-ui/react-ui/styles/index.css` (`styles.css:2`)
- Custom CSS variables for light/dark mode (`--aui-primary`, `--aui-border`, etc.)
- Tailwind config includes `@assistant-ui/react-ui` in content scan (`tailwind.config.ts:7`)
- Component hardcoded to dark mode (`aui-root dark` class, `ChatInterface.tsx:26`)

**What exists:**
- Core chat UI is fully rendered via stock `Thread` and `ThreadList` components
- Dark theme with custom design tokens

**What's missing:**
- **No custom Composer component** — uses whatever `Thread` provides by default
- **No message rendering customization** — no custom bubbles, avatars, or markdown renderers
- **No syntax highlighting in main package** (only `@assistant-ui/react-syntax-highlighter` in playground)
- **No loading states or error boundaries** around the chat UI
- **Hardcoded dark mode** — no light mode toggle or system preference detection

---

## 6. Backend Connection

**Architecture (post v2.0 migration):**
```
Browser → ChatInterface → assistant-ui Cloud → Anthropic API
```

**What exists:**
- `AssistantCloud` client connects directly to Cloud backend (`ChatInterface.tsx:18`)
- No self-hosted API route — Cloud handles LLM calls and streaming
- `CLOUD-MIGRATION.md` documents the architecture change

**What's partially done / stale:**
- **Dead playground API route:** `playground/src/app/api/chat/route.ts` still exists, imports from `chat-package/server` which no longer exists. This file is dead code per `CLOUD-MIGRATION.md:47-48`.

**What's missing:**
- **No connection to `chat-engine-x-api`** — the package talks to assistant-ui Cloud, not to any custom backend
- **No `/v1/chat` or `/api/chat` endpoint** — removed in v2.0
- **No Authorization header passing** — Cloud uses anonymous auth
- **No JWT forwarding** to any backend
- **No streaming protocol configuration** — Cloud handles this internally (the old data-stream protocol was removed)
- **No API URL env var for a custom backend** — only `cloudBaseUrl` for Cloud

### If `chat-engine-x-api` integration is planned, these are needed:
1. An API URL prop or env var pointing to `chat-engine-x-api`
2. A transport layer (e.g., `AssistantChatTransport` or custom fetch) that sends requests to the backend
3. Authorization header with user JWT
4. Platform identifier in request headers or body
5. Streaming protocol handling (UI message stream or SSE)

---

## 7. Auth Integration

**What exists:**
- `anonymous: true` mode on `AssistantCloud` (`ChatInterface.tsx:18`)

**What's missing — everything:**
- **No Better Auth client** — not installed, not configured
- **No next-auth / Clerk / Auth0** — no auth provider of any kind
- **No login/signup flow** — no auth pages, no auth UI
- **No JWT handling** — no token storage, retrieval, or passing
- **No auth middleware** — no route guards or session checks
- **No `auth-engine-x` integration** — no references to any auth service
- **No user identity** — threads are anonymous, not user-scoped
- **No auth-related env vars** (`AUTH_URL`, `AUTH_SECRET`, etc.)

### What's needed for auth:
1. Auth client (Better Auth or similar) configured with `auth-engine-x` backend
2. Login page or auth redirect flow
3. JWT retrieval after authentication
4. JWT passed to `AssistantCloud` (switch from `anonymous: true` to authenticated mode)
5. JWT passed to `chat-engine-x-api` if/when that integration is added
6. User-scoped threads (currently anonymous)

---

## 8. Multi-Platform Routing

**What exists:**
- Nothing. Zero platform awareness.

**What's missing — everything:**
- **No platform identifiers** — `outboundhq`, `paidedge`, `paidautopsy` do not appear anywhere in the codebase
- **No platform prop** on `ChatInterface`
- **No platform context provider**
- **No platform-specific routing, UI, or logic**
- **No platform parameter sent to any backend**
- **No platform detection** from URL, subdomain, or config

### What's needed for multi-platform:
1. A `platform` prop on `ChatInterface` (or detected from consuming app context)
2. Platform identifier passed to `chat-engine-x-api` in request headers/body
3. Potentially platform-specific system prompts, tools, or UI customization
4. Platform-aware thread storage (threads scoped to platform + user)

---

## Summary Matrix

| Area | Status | Key Gap |
|------|--------|---------|
| **Dependencies** | Mostly done | Playground has stale deps (`ai@^4`, dead `@ai-sdk/anthropic`) |
| **Runtime** | Done | `useChatRuntime({ cloud })` fully wired |
| **Assistant Cloud** | Done (anonymous) | No authenticated mode, no `.env.example` |
| **Thread management** | Done (basic) | No deletion, search, archiving, or user scoping |
| **Chat UI** | Done (stock) | No customization, hardcoded dark mode |
| **Backend connection** | Cloud only | No `chat-engine-x-api` connection at all |
| **Auth** | Not started | No auth of any kind — fully anonymous |
| **Multi-platform** | Not started | No platform awareness whatsoever |

### Dead code to clean up
- `playground/src/app/api/chat/route.ts` — imports from deleted `chat-package/server` export
- `playground/package.json` — `@ai-sdk/anthropic`, `ai@^4.0.0` are stale

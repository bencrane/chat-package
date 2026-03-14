import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/server.ts"],
  format: ["cjs", "esm"],
  dts: true,
  splitting: true,
  clean: true,
  external: ["react", "react-dom", "next", "tailwindcss", "@assistant-ui/react", "@assistant-ui/react-ui", "@assistant-ui/react-ai-sdk", "ai", "@ai-sdk/anthropic", "@ai-sdk/react", "lucide-react"],
});

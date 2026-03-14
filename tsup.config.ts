import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/server.ts"],
  format: ["cjs", "esm"],
  dts: false,
  splitting: true,
  clean: true,
  external: ["react", "react-dom", "next", "tailwindcss", "@assistant-ui/react", "@assistant-ui/react-ui", "@assistant-ui/react-data-stream", "ai", "@ai-sdk/anthropic", "lucide-react"],
});

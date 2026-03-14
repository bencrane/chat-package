import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: false,
  splitting: true,
  clean: true,
  external: [
    "react", "react-dom", "next",
    "ai", "@ai-sdk/react",
    "@assistant-ui/react", "@assistant-ui/react-ai-sdk", "@assistant-ui/react-ui",
    "assistant-cloud",
    "lucide-react", "tailwindcss",
  ],
});
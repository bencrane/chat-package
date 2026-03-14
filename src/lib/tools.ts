import { tool as aiTool, type CoreTool } from "ai";
import { z } from "zod";

/**
 * A helper wrapper to generate Vercel AI SDK compatible tools.
 * Since consuming apps will use this package to supply generic tools to the system,
 * we export this utility to standardize how they define them.
 */
export function defineChatTool<T extends z.ZodObject<any>>(
  description: string,
  parameters: T,
  execute: (args: z.infer<T>) => Promise<any> | any
): CoreTool {
  return aiTool({
    description,
    parameters,
    execute
  });
}

/**
 * Type to represent a collection of tools the consuming app might export.
 */
export type ChatToolsRegistry = Record<string, CoreTool>;

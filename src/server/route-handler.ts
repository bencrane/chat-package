import { anthropic } from '@ai-sdk/anthropic';
import { streamText, tool, type CoreTool } from 'ai';

export interface ChatHandlerOptions {
  /**
   * You can pass explicit tools when setting up the chat backend route.
   */
  tools?: Record<string, CoreTool>;
  /**
   * The model string representation. Defaults to 'claude-3-5-sonnet-latest'
   */
  model?: string;
  /**
   * Optional system prompt instructions
   */
  system?: string;
}

export function createAnthropicChatHandler(options: ChatHandlerOptions = {}) {
  const modelName = options.model || 'claude-sonnet-4-20250514';
  const tools = options.tools || {};

  return async function POST(req: Request) {
    const { messages } = await req.json();

    const result = streamText({
      model: anthropic(modelName),
      messages,
      system: options.system,
      tools,
      // Limits max back and forth automatic tool steps
      maxSteps: 5, 
    });

    return result.toDataStreamResponse();
  };
}

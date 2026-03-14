import { createAnthropicChatHandler, defineChatTool } from "chat-package/server";
import { z } from "zod";

const weatherTool = defineChatTool(
  "Get the current weather in a given location",
  z.object({
    location: z.string().describe("The city and state, e.g. San Francisco, CA"),
    unit: z.enum(["celsius", "fahrenheit"]).optional().default("fahrenheit"),
  }),
  async ({ location, unit }) => {
    // Mock weather payload
    return `The weather in ${location} is 72 degrees ${unit === "celsius" ? "Celsius" : "Fahrenheit"} and sunny.`;
  }
);

export const POST = createAnthropicChatHandler({
  model: "claude-3-5-sonnet-latest",
  system: "You are a helpful AI assistant. Answer the user's questions clearly.",
  tools: {
    getWeather: weatherTool,
  },
});

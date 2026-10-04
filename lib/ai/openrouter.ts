import "server-only";

import { OpenRouter } from "@openrouter/sdk";

export const IDEA_TEXT_MODEL_ID = "inclusionai/ling-3.0-flash-sante:free";

function getOpenRouterApiKey(): string {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is not configured");
  }
  return apiKey;
}

export function createOpenRouterClient(): OpenRouter {
  return new OpenRouter({ apiKey: getOpenRouterApiKey() });
}

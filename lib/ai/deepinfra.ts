import "server-only";

import OpenAI from "openai";

// https://docs.deepinfra.com/chat/overview
const DEEPINFRA_BASE_URL = "https://api.deepinfra.com/v1/openai";

export const IDEA_TEXT_MODEL_ID = "deepseek-ai/DeepSeek-V4.1-Flash";
export const IDEA_IMAGE_MODEL_ID = "Qwen/Qwen-Image-Max";

//deepseek-ai/DeepSeek-V4-Flash-0731
//black-forest-labs/FLUX-2-pro

function getDeepInfraApiKey(): string {
  const apiKey = process.env.DEEPINFRA_API_KEY;
  if (!apiKey) {
    throw new Error("DEEPINFRA_API_KEY is not configured");
  }
  return apiKey;
}

export function createDeepInfraClient(): OpenAI {
  return new OpenAI({
    apiKey: getDeepInfraApiKey(),
    baseURL: DEEPINFRA_BASE_URL,
    // Retries multiply cost on a paid API; failures surface to the route.
    maxRetries: 0,
  });
}

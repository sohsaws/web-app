import "server-only";

import OpenAI from "openai";

export const IDEA_TEXT_MODEL_ID = "gpt-4o-mini-2024-07-18";
export const IDEA_IMAGE_MODEL_ID = "gemini-2.5-flash-image";

type MixrouteEnvName = "MIXROUTE_API_BASE_URL" | "MIXROUTE_API_KEY";
const openai = new OpenAI({
    baseURL: getMixrouteBaseUrl(),
    apiKey: getMixrouteApiKey(),
    maxRetries: 0,
    fetch: (url, init) => {
      console.log(init?.body);
      return fetch(url, init);
    },
});

function requireMixrouteEnv(name: MixrouteEnvName): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not configured`);
  }
  return value;
}

export function getMixrouteBaseUrl(): string {
  return requireMixrouteEnv("MIXROUTE_API_BASE_URL");
}

export function getMixrouteApiKey(): string {
  return requireMixrouteEnv("MIXROUTE_API_KEY");
}

export function createMixrouteClient(): OpenAI {
  return openai
}

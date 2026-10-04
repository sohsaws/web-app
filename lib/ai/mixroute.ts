import "server-only";

// MixRoute now serves only image generation, which is disconnected until the
// user moves it to a new provider. Text generation uses OpenRouter.
export const IDEA_IMAGE_MODEL_ID = "gemini-2.5-flash-image";

type MixrouteEnvName = "MIXROUTE_API_BASE_URL" | "MIXROUTE_API_KEY";

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

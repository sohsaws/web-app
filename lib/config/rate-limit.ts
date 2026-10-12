import type { Duration } from "@upstash/ratelimit";

export const RATE_LIMITS = {
  generate: { requests: 5, window: "1 h" },
  image: { requests: 50, window: "1 h" },
} as const satisfies Record<string, { requests: number; window: Duration }>;

export type RateLimitScope = keyof typeof RATE_LIMITS;

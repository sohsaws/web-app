import "server-only";

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import type { NextResponse } from "next/server";
import { apiErrorResponse } from "@/lib/api-error-response";
import { RATE_LIMITS, type RateLimitScope } from "@/lib/config/rate-limit";
import { getRetryAfterSeconds } from "@/lib/utils/retry-after";

export type RateLimitResult =
  | { rateLimited: false }
  | { rateLimited: true; retryAfterSeconds: number };

const limiters = new Map<RateLimitScope, Ratelimit>();

function getLimiter(scope: RateLimitScope): Ratelimit {
  const existing = limiters.get(scope);
  if (existing) {
    return existing;
  }

  const { requests, window } = RATE_LIMITS[scope];
  const limiter = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(requests, window),
    prefix: `ratelimit:${scope}`,
  });
  limiters.set(scope, limiter);
  return limiter;
}

export async function checkRateLimit(
  scope: RateLimitScope,
  userId: string,
): Promise<RateLimitResult> {
  try {
    const { success, reset } = await getLimiter(scope).limit(userId);

    if (success) {
      return { rateLimited: false };
    }

    return {
      rateLimited: true,
      retryAfterSeconds: getRetryAfterSeconds(reset, Date.now()),
    };
  } catch (error: unknown) {
    console.error(`Rate limit check failed (${scope}):`, error);
    return { rateLimited: false };
  }
}

export function rateLimitExceededResponse(
  retryAfterSeconds: number,
): NextResponse {
  return apiErrorResponse("RATE_LIMITED", 429, {
    "Retry-After": String(retryAfterSeconds),
  });
}

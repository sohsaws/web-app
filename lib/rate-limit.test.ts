import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { RATE_LIMITS } from "@/lib/config/rate-limit";

const { limit, ratelimitConstructor, slidingWindow } = vi.hoisted(() => ({
  limit: vi.fn(),
  ratelimitConstructor: vi.fn(),
  slidingWindow: vi.fn(
    (requests: number, window: string) => `sliding:${requests}:${window}`,
  ),
}));

vi.mock("@upstash/redis", () => ({
  Redis: { fromEnv: () => ({ fake: "redis" }) },
}));

vi.mock("@upstash/ratelimit", () => ({
  Ratelimit: class {
    static slidingWindow = slidingWindow;
    limit = limit;
    constructor(config: unknown) {
      ratelimitConstructor(config);
    }
  },
}));

const NOW = new Date("2026-10-12T12:00:00.000Z").getTime();

// The module caches one limiter per scope, so every test imports a fresh copy
// and does not depend on which test created the limiters first.
let checkRateLimit: typeof import("./rate-limit").checkRateLimit;
let rateLimitExceededResponse: typeof import("./rate-limit").rateLimitExceededResponse;

beforeEach(async () => {
  vi.resetModules();
  ({ checkRateLimit, rateLimitExceededResponse } = await import(
    "./rate-limit"
  ));
  vi.useFakeTimers();
  vi.setSystemTime(NOW);
});

afterEach(() => {
  vi.useRealTimers();
});

describe("checkRateLimit", () => {
  it("lets the request through while under the limit", async () => {
    limit.mockResolvedValue({ success: true, reset: NOW + 60_000 });

    await expect(checkRateLimit("generate", "u1")).resolves.toEqual({
      rateLimited: false,
    });
    expect(limit).toHaveBeenCalledWith("u1");
  });

  it("returns the seconds until the window resets when limited", async () => {
    limit.mockResolvedValue({ success: false, reset: NOW + 90_500 });

    await expect(checkRateLimit("image", "u1")).resolves.toEqual({
      rateLimited: true,
      retryAfterSeconds: 91,
    });
  });

  it("creates one limiter per scope and reuses it", async () => {
    limit.mockResolvedValue({ success: true, reset: NOW });

    await checkRateLimit("generate", "u1");
    await checkRateLimit("generate", "u2");

    expect(ratelimitConstructor).toHaveBeenCalledTimes(1);
    expect(limit).toHaveBeenNthCalledWith(2, "u2");
  });

  it("builds each limiter from the config with its own prefix", async () => {
    limit.mockResolvedValue({ success: true, reset: NOW });

    await checkRateLimit("generate", "u1");
    await checkRateLimit("image", "u1");

    for (const scope of ["generate", "image"] as const) {
      const { requests, window } = RATE_LIMITS[scope];
      expect(ratelimitConstructor).toHaveBeenCalledWith(
        expect.objectContaining({
          limiter: `sliding:${requests}:${window}`,
          prefix: `ratelimit:${scope}`,
        }),
      );
    }
  });

  it("lets the request through and logs when Redis fails", async () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    limit.mockRejectedValue(new Error("Redis unavailable"));

    await expect(checkRateLimit("generate", "u1")).resolves.toEqual({
      rateLimited: false,
    });
    expect(consoleError).toHaveBeenCalled();
  });
});

describe("rateLimitExceededResponse", () => {
  it("answers 429 with the wait time only in the Retry-After header", async () => {
    const response = rateLimitExceededResponse(42);

    expect(response.status).toBe(429);
    expect(response.headers.get("Retry-After")).toBe("42");
    await expect(response.json()).resolves.toEqual({
      error: "Too many requests. Please try again later.",
      code: "RATE_LIMITED",
    });
  });
});

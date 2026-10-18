import { describe, expect, it } from "vitest";
import {
  createApiResponseError,
  getApiResponseError,
  RateLimitError,
} from "./responseError";

const FALLBACK = "Something went wrong";

function jsonResponse(body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status: 400,
    headers: { "Content-Type": "application/json" },
  });
}

describe("getApiResponseError", () => {
  it("returns the error message from a JSON body", async () => {
    await expect(
      getApiResponseError(
        jsonResponse({ error: "Provide a valid idea" }),
        FALLBACK,
      ),
    ).resolves.toBe("Provide a valid idea");
  });

  it.each([
    ["the error is not a string", jsonResponse({ error: { message: "x" } })],
    ["there is no error field", jsonResponse({ message: "x" })],
    ["the body is JSON null", jsonResponse(null)],
    [
      "the body is not JSON",
      new Response("<html>Bad gateway</html>", { status: 502 }),
    ],
    ["the body is empty", new Response(null, { status: 500 })],
  ])("falls back when %s", async (_, response) => {
    await expect(getApiResponseError(response, FALLBACK)).resolves.toBe(
      FALLBACK,
    );
  });
});

describe("createApiResponseError", () => {
  it("turns a 429 into a RateLimitError with the Retry-After seconds", async () => {
    const response = new Response(
      JSON.stringify({ error: "Too many requests. Please try again later." }),
      { status: 429, headers: { "Retry-After": "120" } },
    );

    const error = await createApiResponseError(response, FALLBACK);

    expect(error).toBeInstanceOf(RateLimitError);
    expect(error.name).toBe("RateLimitError");
    expect(error.message).toBe("Too many requests. Please try again later.");
    expect(error instanceof RateLimitError && error.retryAfterSeconds).toBe(
      120,
    );
  });

  it("falls back to one minute when a 429 has no Retry-After header", async () => {
    const error = await createApiResponseError(
      new Response(null, { status: 429 }),
      FALLBACK,
    );

    expect(error.message).toBe(FALLBACK);
    expect(error instanceof RateLimitError && error.retryAfterSeconds).toBe(60);
  });

  it("returns a plain Error for other failures", async () => {
    const error = await createApiResponseError(
      jsonResponse({ error: "Provide a valid idea" }),
      FALLBACK,
    );

    expect(error).not.toBeInstanceOf(RateLimitError);
    expect(error.message).toBe("Provide a valid idea");
  });
});

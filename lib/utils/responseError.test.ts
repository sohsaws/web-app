import { describe, expect, it } from "vitest";
import { getApiResponseError } from "./responseError";

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

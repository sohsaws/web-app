import { beforeEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { POST } from "./route";

const { getSession, checkRateLimit, generateImages } = vi.hoisted(() => ({
  getSession: vi.fn(),
  checkRateLimit: vi.fn(),
  generateImages: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({ auth: { api: { getSession } } }));
vi.mock("@/lib/ai/generate-ideas", () => ({ generateImages }));
vi.mock("@/lib/rate-limit", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/rate-limit")>()),
  checkRateLimit,
}));

function imageRequest(
  body: unknown,
  contentType = "application/json",
): Request {
  return new Request("http://localhost/api/ideas/image", {
    method: "POST",
    headers: { "Content-Type": contentType },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  getSession.mockResolvedValue({ user: { id: "u1" } });
  checkRateLimit.mockResolvedValue({ rateLimited: false });
});

describe("POST /api/ideas/image", () => {
  it("returns 401 without a session and never counts or generates", async () => {
    getSession.mockResolvedValue(null);

    const response = await POST(imageRequest({ description: "A walk." }));

    expect(response.status).toBe(401);
    expect(checkRateLimit).not.toHaveBeenCalled();
    expect(generateImages).not.toHaveBeenCalled();
  });

  it("returns 429 with Retry-After and never calls DeepInfra when limited", async () => {
    checkRateLimit.mockResolvedValue({
      rateLimited: true,
      retryAfterSeconds: 60,
    });

    const response = await POST(imageRequest({ description: "A walk." }));

    expect(response.status).toBe(429);
    expect(response.headers.get("Retry-After")).toBe("60");
    expect(checkRateLimit).toHaveBeenCalledWith("image", "u1");
    expect(generateImages).not.toHaveBeenCalled();
  });

  it("counts a request with the wrong content type before rejecting it", async () => {
    const response = await POST(
      imageRequest({ description: "A walk." }, "text/plain"),
    );

    expect(response.status).toBe(415);
    expect(checkRateLimit).toHaveBeenCalledWith("image", "u1");
    expect(generateImages).not.toHaveBeenCalled();
  });

  it.each([
    ["a blank description", { description: "   " }],
    ["a missing description", { prompt: "A walk." }],
    ["a non-string description", { description: 42 }],
  ])("returns 400 for %s", async (_case, body) => {
    const response = await POST(imageRequest(body));

    expect(response.status).toBe(400);
    expect(generateImages).not.toHaveBeenCalled();
  });

  it("returns the image when allowed", async () => {
    generateImages.mockResolvedValue({ image: "AAAA" });

    const response = await POST(imageRequest({ description: "A walk." }));

    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(generateImages).toHaveBeenCalledWith("A walk.");
    await expect(response.json()).resolves.toEqual({ image: "AAAA" });
  });

  it("returns 400 when the prompt is too long for the image model", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    const tooLong = z.string().max(1).safeParse("too long");
    generateImages.mockRejectedValue(
      new Error("Invalid image description or prompt", {
        cause: tooLong.error,
      }),
    );

    const response = await POST(imageRequest({ description: "A walk." }));

    expect(response.status).toBe(400);
  });

  it("returns 502 without leaking the provider error", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    generateImages.mockRejectedValue(new Error("DeepInfra secret detail"));

    const response = await POST(imageRequest({ description: "A walk." }));
    const body = await response.json();

    expect(response.status).toBe(502);
    expect(JSON.stringify(body)).not.toContain("secret detail");
  });
});

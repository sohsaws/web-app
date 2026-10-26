import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";

const { getSession, checkRateLimit, generateIdeas, assignIdeaCategories } =
  vi.hoisted(() => ({
    getSession: vi.fn(),
    checkRateLimit: vi.fn(),
    generateIdeas: vi.fn(),
    assignIdeaCategories: vi.fn(),
  }));

vi.mock("next/headers", () => ({ headers: async () => new Headers() }));
vi.mock("@/lib/auth", () => ({ auth: { api: { getSession } } }));
vi.mock("@/lib/ai/generate-ideas", () => ({
  generateIdeas,
  assignIdeaCategories,
}));
vi.mock("@/lib/rate-limit", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/rate-limit")>()),
  checkRateLimit,
}));

function generateRequest(body: unknown): Request {
  return new Request("http://localhost/api/ideas/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  getSession.mockResolvedValue({ user: { id: "u1" } });
  checkRateLimit.mockResolvedValue({ rateLimited: false });
});

describe("POST /api/ideas/generate", () => {
  it("returns 401 without a session and never counts or generates", async () => {
    getSession.mockResolvedValue(null);

    const response = await POST(generateRequest({ bio: "I like hiking." }));

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toMatchObject({
      code: "UNAUTHORIZED",
    });
    expect(checkRateLimit).not.toHaveBeenCalled();
    expect(generateIdeas).not.toHaveBeenCalled();
  });

  it("returns 429 with Retry-After and never calls DeepInfra when limited", async () => {
    checkRateLimit.mockResolvedValue({
      rateLimited: true,
      retryAfterSeconds: 300,
    });

    const response = await POST(generateRequest({ bio: "I like hiking." }));

    expect(response.status).toBe(429);
    await expect(response.json()).resolves.toMatchObject({
      code: "RATE_LIMITED",
    });
    expect(response.headers.get("Retry-After")).toBe("300");
    expect(checkRateLimit).toHaveBeenCalledWith("generate", "u1");
    expect(generateIdeas).not.toHaveBeenCalled();
    expect(assignIdeaCategories).not.toHaveBeenCalled();
  });

  it("counts a malformed request before rejecting it with 400", async () => {
    const response = await POST(generateRequest({ bio: 42 }));

    expect(response.status).toBe(400);
    expect(checkRateLimit).toHaveBeenCalledWith("generate", "u1");
    expect(generateIdeas).not.toHaveBeenCalled();
  });

  it("returns 400 for a body that is not JSON", async () => {
    const response = await POST(
      new Request("http://localhost/api/ideas/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{not json",
      }),
    );

    expect(response.status).toBe(400);
    expect(generateIdeas).not.toHaveBeenCalled();
  });

  it("returns the generated deck when allowed", async () => {
    generateIdeas.mockResolvedValue({
      ideas: [{ title: "Kyoto", description: "Walk the temple paths." }],
    });
    assignIdeaCategories.mockResolvedValue([
      {
        title: "Kyoto",
        description: "Walk the temple paths.",
        categories: ["Travel", "Photography"],
      },
    ]);

    const response = await POST(generateRequest({ bio: "I like hiking." }));
    const body = await response.json();

    expect(response.status).toBe(200);
    // The session user has no locale field here, so English is used.
    expect(generateIdeas).toHaveBeenCalledWith("I like hiking.", "en");
    expect(body.ideas).toHaveLength(1);
    expect(body.ideas[0]).toMatchObject({
      title: "Kyoto",
      categories: ["Travel", "Photography"],
    });
    expect(body.ideas[0].id).toEqual(expect.any(String));
  });

  it.each([
    ["the profile language", "de", "de"],
    ["English for an unsupported stored value", "xx", "en"],
  ])("generates in %s", async (_case, storedLocale, expectedLocale) => {
    getSession.mockResolvedValue({ user: { id: "u1", locale: storedLocale } });
    generateIdeas.mockResolvedValue({ ideas: [] });
    assignIdeaCategories.mockResolvedValue([]);

    await POST(generateRequest({ bio: "I like hiking." }));

    expect(generateIdeas).toHaveBeenCalledWith(
      "I like hiking.",
      expectedLocale,
    );
  });

  it("ignores a locale sent in the request body", async () => {
    getSession.mockResolvedValue({ user: { id: "u1", locale: "de" } });
    generateIdeas.mockResolvedValue({ ideas: [] });
    assignIdeaCategories.mockResolvedValue([]);

    await POST(generateRequest({ bio: "I like hiking.", locale: "fr" }));

    expect(generateIdeas).toHaveBeenCalledWith("I like hiking.", "de");
  });

  it("returns 502 without leaking the provider error", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    generateIdeas.mockRejectedValue(new Error("DeepInfra secret detail"));

    const response = await POST(generateRequest({ bio: "I like hiking." }));
    const body = await response.json();

    expect(response.status).toBe(502);
    expect(JSON.stringify(body)).not.toContain("secret detail");
  });

  it("returns 502 when choosing categories fails", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    generateIdeas.mockResolvedValue({
      ideas: [{ title: "Kyoto", description: "Walk the temple paths." }],
    });
    assignIdeaCategories.mockRejectedValue(new Error("category call failed"));

    const response = await POST(generateRequest({ bio: "I like hiking." }));

    expect(response.status).toBe(502);
  });
});

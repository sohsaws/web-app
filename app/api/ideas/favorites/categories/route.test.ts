import { beforeEach, describe, expect, it, vi } from "vitest";
import { GET } from "./route";

const { getSession, getCategoryDistribution } = vi.hoisted(() => ({
  getSession: vi.fn(),
  getCategoryDistribution: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({ auth: { api: { getSession } } }));
vi.mock("@/lib/data/get-category-distribution", () => ({
  getCategoryDistribution,
}));

const categoriesRequest = (): Request =>
  new Request("http://localhost/api/ideas/favorites/categories?userId=u2");

beforeEach(() => {
  getSession.mockResolvedValue({ user: { id: "u1" } });
});

describe("GET /api/ideas/favorites/categories", () => {
  it("returns 401 without a session and reads nothing", async () => {
    getSession.mockResolvedValue(null);

    const response = await GET(categoriesRequest());

    expect(response.status).toBe(401);
    expect(getCategoryDistribution).not.toHaveBeenCalled();
  });

  it("returns only the session user's distribution, never cached by shared caches", async () => {
    const distribution = [{ category: "Travel", percentage: 100 }];
    getCategoryDistribution.mockResolvedValue(distribution);

    const response = await GET(categoriesRequest());

    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toBe("private, no-store");
    await expect(response.json()).resolves.toEqual(distribution);
    expect(getCategoryDistribution).toHaveBeenCalledWith("u1");
  });

  it("returns 500 without leaking the database error", async () => {
    getCategoryDistribution.mockRejectedValue(
      new Error("relation card does not exist"),
    );

    const response = await GET(categoriesRequest());
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(JSON.stringify(body)).not.toContain("relation card");
  });
});

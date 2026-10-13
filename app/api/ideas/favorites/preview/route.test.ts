import { beforeEach, describe, expect, it, vi } from "vitest";
import { GET } from "./route";

const { getSession, getFavoritesPreview } = vi.hoisted(() => ({
  getSession: vi.fn(),
  getFavoritesPreview: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({ auth: { api: { getSession } } }));
vi.mock("@/lib/data/get-favorites-preview", () => ({ getFavoritesPreview }));

const previewRequest = (): Request =>
  new Request("http://localhost/api/ideas/favorites/preview?userId=u2");

beforeEach(() => {
  getSession.mockResolvedValue({ user: { id: "u1" } });
});

describe("GET /api/ideas/favorites/preview", () => {
  it("returns 401 without a session and reads nothing", async () => {
    getSession.mockResolvedValue(null);

    const response = await GET(previewRequest());

    expect(response.status).toBe(401);
    expect(getFavoritesPreview).not.toHaveBeenCalled();
  });

  it("returns only the session user's preview, never cached by shared caches", async () => {
    const preview = { cards: [], total: 0 };
    getFavoritesPreview.mockResolvedValue(preview);

    const response = await GET(previewRequest());

    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toBe("private, no-store");
    await expect(response.json()).resolves.toEqual(preview);
    // The query string asks for u2; the route must ignore it.
    expect(getFavoritesPreview).toHaveBeenCalledWith("u1");
  });

  it("returns 500 without leaking the database error", async () => {
    getFavoritesPreview.mockRejectedValue(new Error("connection string xyz"));

    const response = await GET(previewRequest());
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(JSON.stringify(body)).not.toContain("connection string");
  });
});

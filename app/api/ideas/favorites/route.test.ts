import { beforeEach, describe, expect, it, vi } from "vitest";
import { IDEA_IMAGE_DATA_URL_PREFIX } from "@/lib/config/ideas";
import { POST } from "./route";

const { getSession, put, del, saveFavoriteForUser } = vi.hoisted(() => ({
  getSession: vi.fn(),
  put: vi.fn(),
  del: vi.fn(),
  saveFavoriteForUser: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({ auth: { api: { getSession } } }));
vi.mock("@vercel/blob", () => ({ put, del }));
vi.mock("@/lib/data/save-favorite", () => ({ saveFavoriteForUser }));

const PNG_BASE64 = "iVBORw0KGgo=";
const BLOB_URL =
  "https://store.public.blob.vercel-storage.com/ideas-images/u1/new.png";

const idea = {
  id: "0b7f6a52-3c1d-4f3e-9a7b-2d5c8e1f4a6b",
  title: "Night hike",
  description: "Walk a trail at dusk.",
  categories: ["Hiking", "Travel"],
  createdAt: "2026-10-13T10:00:00.000Z",
};

function saveRequest(body: unknown, contentType = "application/json"): Request {
  return new Request("http://localhost/api/ideas/favorites", {
    method: "POST",
    headers: { "Content-Type": contentType },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

beforeEach(() => {
  getSession.mockResolvedValue({ user: { id: "u1" } });
  put.mockResolvedValue({ url: BLOB_URL });
  saveFavoriteForUser.mockResolvedValue(true);
});

describe("POST /api/ideas/favorites", () => {
  it("returns 401 without a session and stores nothing", async () => {
    getSession.mockResolvedValue(null);

    const response = await POST(saveRequest(idea));

    expect(response.status).toBe(401);
    expect(put).not.toHaveBeenCalled();
    expect(saveFavoriteForUser).not.toHaveBeenCalled();
  });

  it("returns 415 for a body that is not JSON", async () => {
    const response = await POST(saveRequest(idea, "text/plain"));

    expect(response.status).toBe(415);
    expect(saveFavoriteForUser).not.toHaveBeenCalled();
  });

  it.each([
    ["a body that does not parse", "{not json"],
    ["an id that is not a UUID", { ...idea, id: "card-1" }],
    ["an unknown category", { ...idea, categories: ["Hacking"] }],
    [
      "an image that is not a PNG data URL",
      { ...idea, image: "https://example.com/a.png" },
    ],
  ])("returns 400 for %s and stores nothing", async (_case, body) => {
    const response = await POST(saveRequest(body));

    expect(response.status).toBe(400);
    expect(put).not.toHaveBeenCalled();
    expect(saveFavoriteForUser).not.toHaveBeenCalled();
  });

  it("saves an idea without an image for the session user only", async () => {
    const response = await POST(saveRequest({ ...idea, userId: "u2" }));

    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    await expect(response.json()).resolves.toEqual({ saved: true });
    expect(put).not.toHaveBeenCalled();
    expect(saveFavoriteForUser).toHaveBeenCalledTimes(1);

    const [userId, saved] = saveFavoriteForUser.mock.calls[0] ?? [];
    expect(userId).toBe("u1");
    // Unknown keys are stripped, so a client cannot pick another owner.
    expect(saved).not.toHaveProperty("userId");
    expect(saved).toMatchObject({ id: idea.id, image: undefined });
  });

  it("uploads the image into the user's own folder and saves its URL", async () => {
    const response = await POST(
      saveRequest({
        ...idea,
        image: `${IDEA_IMAGE_DATA_URL_PREFIX}${PNG_BASE64}`,
      }),
    );

    expect(response.status).toBe(200);
    expect(put).toHaveBeenCalledTimes(1);

    const [pathname, bytes, options] = put.mock.calls[0] ?? [];
    expect(pathname).toMatch(/^ideas-images\/u1\/[0-9a-f-]{36}\.png$/);
    expect(bytes).toEqual(Buffer.from(PNG_BASE64, "base64"));
    expect(options).toMatchObject({ contentType: "image/png" });
    expect(saveFavoriteForUser).toHaveBeenCalledWith(
      "u1",
      expect.objectContaining({ image: BLOB_URL }),
    );
    expect(del).not.toHaveBeenCalled();
  });

  it("returns 409 and deletes the uploaded image when the card is not saved", async () => {
    saveFavoriteForUser.mockResolvedValue(false);

    const response = await POST(
      saveRequest({
        ...idea,
        image: `${IDEA_IMAGE_DATA_URL_PREFIX}${PNG_BASE64}`,
      }),
    );

    expect(response.status).toBe(409);
    expect(del).toHaveBeenCalledWith(BLOB_URL);
  });

  it("returns 500 and deletes the uploaded image when saving throws", async () => {
    saveFavoriteForUser.mockRejectedValue(
      new Error("unique constraint failed"),
    );

    const response = await POST(
      saveRequest({
        ...idea,
        image: `${IDEA_IMAGE_DATA_URL_PREFIX}${PNG_BASE64}`,
      }),
    );
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(JSON.stringify(body)).not.toContain("unique constraint");
    expect(del).toHaveBeenCalledWith(BLOB_URL);
  });

  it("returns 500 without saving when the upload fails", async () => {
    put.mockRejectedValue(new Error("Blob unavailable"));

    const response = await POST(
      saveRequest({
        ...idea,
        image: `${IDEA_IMAGE_DATA_URL_PREFIX}${PNG_BASE64}`,
      }),
    );

    expect(response.status).toBe(500);
    expect(saveFavoriteForUser).not.toHaveBeenCalled();
    expect(del).not.toHaveBeenCalled();
  });
});

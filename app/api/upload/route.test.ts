import { beforeEach, describe, expect, it, vi } from "vitest";
import { AVATAR_MAX_SIZE_BYTES } from "@/lib/config/avatar";
import { DELETE, POST } from "./route";

const { getSession, updateUser, put, del } = vi.hoisted(() => ({
  getSession: vi.fn(),
  updateUser: vi.fn(),
  put: vi.fn(),
  del: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({ auth: { api: { getSession, updateUser } } }));
vi.mock("@vercel/blob", () => ({ put, del }));

const STORE = "https://store.public.blob.vercel-storage.com";
const OWN_OLD_AVATAR = `${STORE}/avatars/u1/old.png`;
const NEW_AVATAR = `${STORE}/avatars/u1/new.png`;

function sessionWithImage(image: string | null) {
  return { user: { id: "u1", image } };
}

function uploadRequest(
  body: Uint8Array<ArrayBuffer>,
  contentType: string | null = "image/png",
): Request {
  const headers = new Headers();
  if (contentType) {
    headers.set("content-type", contentType);
  }
  return new Request("http://localhost/api/upload", {
    method: "POST",
    headers,
    body,
  });
}

const deleteRequest = (): Request =>
  new Request("http://localhost/api/upload", { method: "DELETE" });

beforeEach(() => {
  vi.spyOn(console, "error").mockImplementation(() => undefined);
  getSession.mockResolvedValue(sessionWithImage(OWN_OLD_AVATAR));
  put.mockResolvedValue({ url: NEW_AVATAR });
  updateUser.mockResolvedValue({ status: true });
  del.mockResolvedValue(undefined);
});

describe("POST /api/upload", () => {
  it("returns 401 without a session and uploads nothing", async () => {
    getSession.mockResolvedValue(null);

    const response = await POST(uploadRequest(new Uint8Array([1])));

    expect(response.status).toBe(401);
    expect(put).not.toHaveBeenCalled();
  });

  it.each([
    ["an SVG", "image/svg+xml"],
    ["a missing content type", null],
    ["an inherited object key", "toString"],
  ])("returns 415 for %s", async (_case, contentType) => {
    const response = await POST(
      uploadRequest(new Uint8Array([1]), contentType),
    );

    expect(response.status).toBe(415);
    expect(put).not.toHaveBeenCalled();
  });

  it("returns 400 for an empty file", async () => {
    const response = await POST(uploadRequest(new Uint8Array()));

    expect(response.status).toBe(400);
    expect(put).not.toHaveBeenCalled();
  });

  it("returns 413 for a file over the size limit", async () => {
    const response = await POST(
      uploadRequest(new Uint8Array(AVATAR_MAX_SIZE_BYTES + 1)),
    );

    expect(response.status).toBe(413);
    expect(put).not.toHaveBeenCalled();
  });

  it("stores the avatar in the user's folder and deletes the old one", async () => {
    const response = await POST(uploadRequest(new Uint8Array([1, 2, 3])));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ url: NEW_AVATAR });
    expect(put).toHaveBeenCalledWith(
      expect.stringMatching(/^avatars\/u1\/[0-9a-f-]{36}\.png$/),
      expect.anything(),
      expect.objectContaining({ access: "public" }),
    );
    expect(updateUser).toHaveBeenCalledWith(
      expect.objectContaining({ body: { image: NEW_AVATAR } }),
    );
    expect(del).toHaveBeenCalledTimes(1);
    expect(del).toHaveBeenCalledWith(OWN_OLD_AVATAR);
  });

  it.each([
    ["another user's avatar", `${STORE}/avatars/u2/theirs.png`],
    ["a Google avatar", "https://lh3.googleusercontent.com/a/photo"],
    ["no previous avatar", null],
  ])("never deletes %s", async (_case, previousImage) => {
    getSession.mockResolvedValue(sessionWithImage(previousImage));

    const response = await POST(uploadRequest(new Uint8Array([1])));

    expect(response.status).toBe(200);
    expect(del).not.toHaveBeenCalled();
  });

  it("removes the new upload and keeps the old avatar when saving the user fails", async () => {
    updateUser.mockRejectedValue(new Error("database down"));

    const response = await POST(uploadRequest(new Uint8Array([1])));

    expect(response.status).toBe(500);
    expect(del).toHaveBeenCalledTimes(1);
    expect(del).toHaveBeenCalledWith(NEW_AVATAR);
  });

  it("still succeeds when deleting the old avatar fails", async () => {
    del.mockRejectedValue(new Error("Blob unavailable"));

    const response = await POST(uploadRequest(new Uint8Array([1])));

    expect(response.status).toBe(200);
    expect(console.error).toHaveBeenCalled();
  });
});

describe("DELETE /api/upload", () => {
  it("returns 401 without a session", async () => {
    getSession.mockResolvedValue(null);

    const response = await DELETE(deleteRequest());

    expect(response.status).toBe(401);
    expect(updateUser).not.toHaveBeenCalled();
  });

  it("does nothing when the user has no avatar", async () => {
    getSession.mockResolvedValue(sessionWithImage(null));

    const response = await DELETE(deleteRequest());

    expect(response.status).toBe(200);
    expect(updateUser).not.toHaveBeenCalled();
    expect(del).not.toHaveBeenCalled();
  });

  it("clears the avatar and deletes the user's own file", async () => {
    const response = await DELETE(deleteRequest());

    expect(response.status).toBe(200);
    expect(updateUser).toHaveBeenCalledWith(
      expect.objectContaining({ body: { image: null } }),
    );
    expect(del).toHaveBeenCalledWith(OWN_OLD_AVATAR);
  });

  it("clears another user's avatar URL without deleting their file", async () => {
    getSession.mockResolvedValue(
      sessionWithImage(`${STORE}/avatars/u2/theirs.png`),
    );

    const response = await DELETE(deleteRequest());

    expect(response.status).toBe(200);
    expect(updateUser).toHaveBeenCalled();
    expect(del).not.toHaveBeenCalled();
  });

  it("returns 500 and keeps the file when clearing the avatar fails", async () => {
    updateUser.mockRejectedValue(new Error("database down"));

    const response = await DELETE(deleteRequest());

    expect(response.status).toBe(500);
    expect(del).not.toHaveBeenCalled();
  });
});

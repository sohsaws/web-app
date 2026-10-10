import { describe, expect, it } from "vitest";
import {
  BLOB_FOLDERS,
  getUserBlobPathname,
  isUserBlobUrl,
} from "./managed-blob-url";

const STORE = "https://abc123.public.blob.vercel-storage.com";

describe("getUserBlobPathname", () => {
  it("puts the file inside the user's folder", () => {
    expect(getUserBlobPathname(BLOB_FOLDERS.avatars, "u1", "a.png")).toBe(
      "avatars/u1/a.png",
    );
  });
});

describe("isUserBlobUrl", () => {
  it("accepts a file in the user's own folder", () => {
    expect(
      isUserBlobUrl(`${STORE}/avatars/u1/a.png`, BLOB_FOLDERS.avatars, "u1"),
    ).toBe(true);
  });

  it("accepts every URL built with getUserBlobPathname", () => {
    for (const folder of Object.values(BLOB_FOLDERS)) {
      const url = `${STORE}/${getUserBlobPathname(folder, "u1", "file.png")}`;
      expect(isUserBlobUrl(url, folder, "u1")).toBe(true);
    }
  });

  it.each([
    ["another user's file", `${STORE}/avatars/u2/a.png`],
    ["a user id that only starts the same", `${STORE}/avatars/u10/a.png`],
    [
      "a path that climbs into another folder",
      `${STORE}/avatars/u1/../u2/a.png`,
    ],
    ["an encoded slash", `${STORE}/avatars/u1%2F..%2Fu2/a.png`],
    ["the user's file in another folder", `${STORE}/ideas-images/u1/a.png`],
    ["the folder itself", `${STORE}/avatars/u1`],
    ["plain http", `${STORE.replace("https:", "http:")}/avatars/u1/a.png`],
    [
      "an OAuth avatar host",
      "https://lh3.googleusercontent.com/avatars/u1/a.png",
    ],
    [
      "a host that only contains the Blob domain",
      "https://abc.blob.vercel-storage.com.attacker.com/avatars/u1/a.png",
    ],
    [
      "a lookalike host without the dot",
      "https://evilblob.vercel-storage.com/avatars/u1/a.png",
    ],
    ["text that is not a URL", "not a url"],
    ["an empty string", ""],
  ])("rejects %s", (_case, url) => {
    expect(isUserBlobUrl(url, BLOB_FOLDERS.avatars, "u1")).toBe(false);
  });

  it.each([null, undefined])("rejects %s", (value) => {
    expect(isUserBlobUrl(value, BLOB_FOLDERS.avatars, "u1")).toBe(false);
  });

  it("rejects everything when the user id is empty", () => {
    expect(
      isUserBlobUrl(`${STORE}/avatars//a.png`, BLOB_FOLDERS.avatars, ""),
    ).toBe(false);
  });
});

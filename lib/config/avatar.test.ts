import { describe, expect, it } from "vitest";
import {
  AVATAR_CONTENT_TYPE_TO_EXTENSION,
  isAvatarContentType,
} from "./avatar";

describe("isAvatarContentType", () => {
  it.each(Object.keys(AVATAR_CONTENT_TYPE_TO_EXTENSION))(
    "accepts %s",
    (contentType) => {
      expect(isAvatarContentType(contentType)).toBe(true);
    },
  );

  it.each([
    ["an unsupported image type", "image/svg+xml"],
    ["a non-image type", "application/pdf"],
    ["a different letter case", "IMAGE/PNG"],
    ["surrounding spaces", " image/png "],
    ["parameters after the type", "image/png; charset=utf-8"],
    ["an empty string", ""],
  ])("rejects %s", (_case, contentType) => {
    expect(isAvatarContentType(contentType)).toBe(false);
  });

  // The client controls the Content-Type header. A plain `in` check would
  // also accept keys inherited from Object.prototype; Object.hasOwn must not.
  it.each(["toString", "constructor", "__proto__", "hasOwnProperty"])(
    "rejects the inherited key %s",
    (contentType) => {
      expect(isAvatarContentType(contentType)).toBe(false);
    },
  );
});

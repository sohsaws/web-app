import { describe, expect, it } from "vitest";
import { IDEA_IMAGE_DATA_URL_PREFIX, ideaSaveRequestSchema } from "./ideas";

const MAX_IMAGE_LENGTH = 4 * 1024 * 1024;

const validIdea = {
  id: "3f8d2a1c-6b4e-4c2a-9f1d-2e7b8c9a0d1e",
  title: "Kyoto in autumn",
  description: "Walk the temple paths at sunrise.",
  categories: ["Travel", "Photography"],
  createdAt: "2026-10-10T10:00:00.000Z",
};

// Base64 text must have a length that is a multiple of 4.
function pngDataUrlOfLength(totalLength: number): string {
  const base64Length = totalLength - IDEA_IMAGE_DATA_URL_PREFIX.length;
  return `${IDEA_IMAGE_DATA_URL_PREFIX}${"A".repeat(base64Length - (base64Length % 4))}`;
}

describe("ideaSaveRequestSchema", () => {
  it("accepts a valid idea without an image", () => {
    const result = ideaSaveRequestSchema.safeParse(validIdea);
    expect(result.success).toBe(true);
  });

  it("turns createdAt into a Date", () => {
    const idea = ideaSaveRequestSchema.parse(validIdea);
    expect(idea.createdAt).toEqual(new Date(validIdea.createdAt));
  });

  describe("image", () => {
    it("accepts a base64 PNG data URL", () => {
      const image = `${IDEA_IMAGE_DATA_URL_PREFIX}${Buffer.from("png bytes").toString("base64")}`;
      expect(
        ideaSaveRequestSchema.safeParse({ ...validIdea, image }).success,
      ).toBe(true);
    });

    it("accepts an image right at the 4 MB limit", () => {
      const image = pngDataUrlOfLength(MAX_IMAGE_LENGTH);
      expect(image.length).toBeLessThanOrEqual(MAX_IMAGE_LENGTH);
      expect(
        ideaSaveRequestSchema.safeParse({ ...validIdea, image }).success,
      ).toBe(true);
    });

    it("rejects an image over the 4 MB limit", () => {
      const image = pngDataUrlOfLength(MAX_IMAGE_LENGTH + 8);
      expect(image.length).toBeGreaterThan(MAX_IMAGE_LENGTH);
      expect(
        ideaSaveRequestSchema.safeParse({ ...validIdea, image }).success,
      ).toBe(false);
    });

    it.each([
      ["another media type", "data:image/jpeg;base64,AAAA"],
      ["text that is not base64", `${IDEA_IMAGE_DATA_URL_PREFIX}not*base64!`],
      ["a plain URL", "https://example.com/a.png"],
      ["raw base64 without the prefix", "AAAA"],
    ])("rejects %s", (_case, image) => {
      expect(
        ideaSaveRequestSchema.safeParse({ ...validIdea, image }).success,
      ).toBe(false);
    });
  });

  describe("categories", () => {
    it.each([
      ["no categories", []],
      ["more than three", ["Travel", "Photography", "Cooking", "Music"]],
      ["a repeated category", ["Travel", "Travel"]],
      ["an unknown category", ["Not A Category"]],
    ])("rejects %s", (_case, categories) => {
      expect(
        ideaSaveRequestSchema.safeParse({ ...validIdea, categories }).success,
      ).toBe(false);
    });
  });

  it.each([
    ["a title of spaces", { title: "   " }],
    ["a description of spaces", { description: "   " }],
    ["an id that is not a UUID", { id: "card-1" }],
    ["a createdAt that is not an ISO date", { createdAt: "yesterday" }],
  ])("rejects %s", (_case, override) => {
    expect(
      ideaSaveRequestSchema.safeParse({ ...validIdea, ...override }).success,
    ).toBe(false);
  });
});

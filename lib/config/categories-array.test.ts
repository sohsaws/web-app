import { describe, expect, it } from "vitest";
import { IDEA_CATEGORIES, isIdeaCategory } from "./categories-array";

describe("IDEA_CATEGORIES", () => {
  it("has no duplicates", () => {
    expect(new Set(IDEA_CATEGORIES).size).toBe(IDEA_CATEGORIES.length);
  });
});

describe("isIdeaCategory", () => {
  it("accepts every known category", () => {
    expect(IDEA_CATEGORIES.every(isIdeaCategory)).toBe(true);
  });

  it.each([
    ["an unknown category", "Hacking"],
    ["a different letter case", "travel"],
    ["surrounding spaces", " Travel "],
    ["an empty string", ""],
    // The set lookup must not match inherited object keys.
    ["an inherited key", "toString"],
    ["a prototype key", "__proto__"],
  ])("rejects %s", (_case, value) => {
    expect(isIdeaCategory(value)).toBe(false);
  });
});

import { describe, expect, it } from "vitest";
import { favoritesPreviewSchema } from "./favorites";

const card = {
  id: "card-1",
  title: "Night hike",
  description: "Walk a trail at dusk.",
  image: "https://store.public.blob.vercel-storage.com/ideas-images/u1/a.png",
  categories: ["Hiking", "Travel"],
};

function preview(cardOverrides: Record<string, unknown>, total = 1) {
  return { cards: [{ ...card, ...cardOverrides }], total };
}

describe("favoritesPreviewSchema", () => {
  it("accepts a valid preview", () => {
    expect(favoritesPreviewSchema.parse(preview({}))).toEqual(preview({}));
  });

  it("accepts an empty preview", () => {
    expect(
      favoritesPreviewSchema.safeParse({ cards: [], total: 0 }).success,
    ).toBe(true);
  });

  it.each([
    ["a card without an image", { image: null }],
    ["a card without categories", { categories: [] }],
    ["three categories", { categories: ["Hiking", "Travel", "Camping"] }],
  ])("accepts %s", (_case, overrides) => {
    expect(favoritesPreviewSchema.safeParse(preview(overrides)).success).toBe(
      true,
    );
  });

  it("trims the title and description", () => {
    const result = favoritesPreviewSchema.parse(
      preview({ title: "  Night hike ", description: " Walk. " }),
    );

    expect(result.cards[0]).toMatchObject({
      title: "Night hike",
      description: "Walk.",
    });
  });

  it.each([
    [
      "more than three categories",
      { categories: ["Hiking", "Travel", "Camping", "Running"] },
    ],
    ["an unknown category", { categories: ["Hacking"] }],
    ["an empty id", { id: "" }],
    ["an empty image URL", { image: "" }],
    ["a missing image field", { image: undefined }],
    ["a blank title", { title: "   " }],
    ["a blank description", { description: "" }],
  ])("rejects a card with %s", (_case, overrides) => {
    expect(favoritesPreviewSchema.safeParse(preview(overrides)).success).toBe(
      false,
    );
  });

  it.each([
    ["negative", -1],
    ["fractional", 1.5],
  ])("rejects a %s total", (_case, total) => {
    expect(favoritesPreviewSchema.safeParse(preview({}, total)).success).toBe(
      false,
    );
  });
});

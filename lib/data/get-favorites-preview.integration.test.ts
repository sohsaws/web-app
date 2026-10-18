import { randomUUID } from "node:crypto";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import prisma from "@/lib/prisma";
import { getFavoritesPreview } from "./get-favorites-preview";

// The test branch is a copy of production: only rows created here are
// touched, and they are removed in afterAll.
const run = randomUUID();
const userId = `test-preview-${run}`;
const otherUserId = `test-preview-other-${run}`;
const emptyUserId = `test-preview-empty-${run}`;

const cardId = (name: string): string => `test-${name}-${run}`;

function testCard(
  name: string,
  createdAt: string,
  overrides: {
    userId?: string;
    isFavorited?: boolean;
    category?: string[];
  } = {},
) {
  return {
    id: cardId(name),
    userId,
    isFavorited: true,
    category: ["Travel"],
    title: `Idea ${name}`,
    description: "Created by an integration test.",
    image: null,
    createdAt: new Date(createdAt),
    ...overrides,
  };
}

beforeAll(async () => {
  await prisma.user.createMany({
    data: [userId, otherUserId, emptyUserId].map((id) => ({
      id,
      name: "Test",
      email: `${id}@example.test`,
    })),
  });
  await prisma.card.createMany({
    data: [
      testCard("oldest", "2026-01-01T00:00:00Z"),
      testCard("newest", "2026-01-03T00:00:00Z", {
        // A category that is no longer in the list is dropped, not shown.
        category: ["Travel", "Retired category"],
      }),
      // Same time: the id breaks the tie so the order never flickers.
      testCard("middle-a", "2026-01-02T00:00:00Z"),
      testCard("middle-b", "2026-01-02T00:00:00Z"),
      testCard("dismissed", "2026-01-04T00:00:00Z", { isFavorited: false }),
      testCard("foreign", "2026-01-05T00:00:00Z", { userId: otherUserId }),
    ],
  });
});

afterAll(async () => {
  // Cards are removed by the cascade on their users.
  await prisma.user.deleteMany({
    where: { id: { in: [userId, otherUserId, emptyUserId] } },
  });
  await prisma.$disconnect();
});

describe("getFavoritesPreview with a real database", () => {
  it("lists only the user's saved cards, newest first", async () => {
    const preview = await getFavoritesPreview(userId);

    expect(preview.cards.map((card) => card.id)).toEqual([
      cardId("newest"),
      cardId("middle-b"),
      cardId("middle-a"),
      cardId("oldest"),
    ]);
    expect(preview.total).toBe(4);
  });

  it("returns only known categories under the categories key", async () => {
    const preview = await getFavoritesPreview(userId);

    expect(preview.cards[0]).toEqual({
      id: cardId("newest"),
      title: "Idea newest",
      description: "Created by an integration test.",
      image: null,
      categories: ["Travel"],
    });
  });

  it("returns an empty preview for a user without saved cards", async () => {
    await expect(getFavoritesPreview(emptyUserId)).resolves.toEqual({
      cards: [],
      total: 0,
    });
  });
});

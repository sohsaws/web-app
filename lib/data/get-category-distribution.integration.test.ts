import { randomUUID } from "node:crypto";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import prisma from "@/lib/prisma";
import { getCategoryDistribution } from "./get-category-distribution";

// The test branch is a copy of production: only rows created here are
// touched, and they are removed in afterAll.
const run = randomUUID();
const userId = `test-dist-${run}`;
const otherUserId = `test-dist-other-${run}`;
const emptyUserId = `test-dist-empty-${run}`;

function testCard(owner: string, category: string[], isFavorited = true) {
  return {
    userId: owner,
    category,
    isFavorited,
    title: "Test idea",
    description: "Created by an integration test.",
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
      testCard(userId, ["Travel", "Hiking"]),
      testCard(userId, ["Travel"]),
      // Blank values are not categories and must not count.
      testCard(userId, ["Travel", "  ", ""]),
      testCard(userId, ["Cooking"]),
      // Not a saved card: dismissed cards never count.
      testCard(userId, ["Music", "Music"], false),
      testCard(otherUserId, ["Art"]),
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

describe("getCategoryDistribution with a real database", () => {
  it("shares out category assignments of the user's saved cards", async () => {
    // 5 assignments: Travel 3, Hiking 1, Cooking 1. Counting cards instead
    // would give Travel 75%, so this also pins the agreed formula.
    await expect(getCategoryDistribution(userId)).resolves.toEqual([
      { category: "Travel", percentage: 60 },
      { category: "Cooking", percentage: 20 },
      { category: "Hiking", percentage: 20 },
    ]);
  });

  it("adds up to 100 percent", async () => {
    const distribution = await getCategoryDistribution(userId);
    const total = distribution.reduce((sum, row) => sum + row.percentage, 0);

    expect(total).toBeCloseTo(100);
  });

  it("returns nothing for a user without saved cards", async () => {
    await expect(getCategoryDistribution(emptyUserId)).resolves.toEqual([]);
  });

  it("never mixes in another user's cards", async () => {
    await expect(getCategoryDistribution(otherUserId)).resolves.toEqual([
      { category: "Art", percentage: 100 },
    ]);
  });
});

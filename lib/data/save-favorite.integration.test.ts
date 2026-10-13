import { randomUUID } from "node:crypto";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import prisma from "@/lib/prisma";
import type { IdeaSaveRequest } from "@/lib/types/ideas/types";
import { saveFavoriteForUser } from "./save-favorite";

// The test branch is a copy of production: only rows created here are
// touched, and they are removed in afterAll.
const run = randomUUID();
const userId = `test-save-${run}`;
const otherUserId = `test-save-other-${run}`;
const foreignCardId = randomUUID();

function idea(overrides: Partial<IdeaSaveRequest> = {}): IdeaSaveRequest {
  return {
    id: randomUUID(),
    title: "Night hike",
    description: "Walk a trail at dusk.",
    categories: ["Hiking", "Travel"],
    createdAt: new Date("2026-10-13T10:00:00.000Z"),
    image: "https://store.public.blob.vercel-storage.com/ideas-images/u1/a.png",
    ...overrides,
  };
}

beforeAll(async () => {
  await prisma.user.createMany({
    data: [userId, otherUserId].map((id) => ({
      id,
      name: "Test",
      email: `${id}@example.test`,
    })),
  });
  await prisma.card.create({
    data: {
      id: foreignCardId,
      userId: otherUserId,
      title: "Their idea",
      description: "Belongs to another user.",
      category: ["Art"],
      isFavorited: true,
    },
  });
});

afterAll(async () => {
  // Cards are removed by the cascade on their users.
  await prisma.user.deleteMany({
    where: { id: { in: [userId, otherUserId] } },
  });
  await prisma.$disconnect();
});

describe("saveFavoriteForUser with a real database", () => {
  it("stores the idea as a saved card of the user", async () => {
    const saved = idea();

    await expect(saveFavoriteForUser(userId, saved)).resolves.toBe(true);

    const row = await prisma.card.findUnique({ where: { id: saved.id } });
    expect(row).toMatchObject({
      userId,
      isFavorited: true,
      title: saved.title,
      description: saved.description,
      image: saved.image,
      category: saved.categories,
      createdAt: saved.createdAt,
    });
  });

  it("stores an idea without an image", async () => {
    const saved = idea({ image: undefined });

    await saveFavoriteForUser(userId, saved);

    const row = await prisma.card.findUnique({ where: { id: saved.id } });
    expect(row?.image).toBeNull();
  });

  it("refuses an id that already belongs to another user's card", async () => {
    await expect(
      saveFavoriteForUser(userId, idea({ id: foreignCardId })),
    ).rejects.toThrow();

    const foreignCard = await prisma.card.findUnique({
      where: { id: foreignCardId },
    });
    expect(foreignCard).toMatchObject({
      userId: otherUserId,
      title: "Their idea",
    });
  });

  it("refuses to save the same card twice", async () => {
    const saved = idea();
    await saveFavoriteForUser(userId, saved);

    await expect(saveFavoriteForUser(userId, saved)).rejects.toThrow();
    await expect(prisma.card.count({ where: { id: saved.id } })).resolves.toBe(
      1,
    );
  });
});

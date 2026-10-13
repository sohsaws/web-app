import { randomUUID } from "node:crypto";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import prisma from "@/lib/prisma";
import { deleteUserBlobs } from "./delete-user-blobs";

const { del } = vi.hoisted(() => ({ del: vi.fn() }));

vi.mock("@vercel/blob", () => ({ del }));

const STORE = "https://test-store.public.blob.vercel-storage.com";

// The test branch is a copy of production, so tests never truncate tables:
// they create rows with unique ids and remove only those.
const run = randomUUID();
const ownerId = `test-owner-${run}`;
const otherUserId = `test-other-${run}`;
const noFilesUserId = `test-no-files-${run}`;

function testCard(userId: string, image: string | null) {
  return {
    userId,
    image,
    title: "Test idea",
    description: "Created by an integration test.",
    category: ["Travel"],
    isFavorited: true,
  };
}

beforeAll(async () => {
  await prisma.user.createMany({
    data: [
      { id: ownerId, name: "Owner", email: `${ownerId}@example.test` },
      { id: otherUserId, name: "Other", email: `${otherUserId}@example.test` },
      {
        id: noFilesUserId,
        name: "No files",
        email: `${noFilesUserId}@example.test`,
      },
    ],
  });
  await prisma.card.createMany({
    data: [
      testCard(ownerId, `${STORE}/ideas-images/${ownerId}/own.png`),
      testCard(ownerId, null),
      // A card of the owner that points into another user's folder.
      testCard(ownerId, `${STORE}/ideas-images/${otherUserId}/forged.png`),
      testCard(otherUserId, `${STORE}/ideas-images/${otherUserId}/theirs.png`),
    ],
  });
});

afterAll(async () => {
  // Cards are removed by the cascade on their users.
  await prisma.user.deleteMany({
    where: { id: { in: [ownerId, otherUserId, noFilesUserId] } },
  });
  await prisma.$disconnect();
});

describe("deleteUserBlobs with a real database", () => {
  it("deletes only the user's own avatar and card images", async () => {
    const avatarUrl = `${STORE}/avatars/${ownerId}/me.png`;
    const ownCardImage = `${STORE}/ideas-images/${ownerId}/own.png`;

    await deleteUserBlobs(ownerId, avatarUrl);

    expect(del).toHaveBeenCalledTimes(1);
    expect(del).toHaveBeenCalledWith(
      expect.arrayContaining([avatarUrl, ownCardImage]),
    );
    expect(del.mock.calls[0]?.[0]).toHaveLength(2);
  });

  it("rejects when Blob deletion fails, so the account deletion is aborted", async () => {
    del.mockRejectedValue(new Error("Blob unavailable"));

    await expect(
      deleteUserBlobs(ownerId, `${STORE}/avatars/${ownerId}/me.png`),
    ).rejects.toThrow("Blob unavailable");
  });

  it("does not call Blob for a user without files of their own", async () => {
    await deleteUserBlobs(
      noFilesUserId,
      "https://lh3.googleusercontent.com/a/photo",
    );

    expect(del).not.toHaveBeenCalled();
  });
});

import "server-only";

import { del } from "@vercel/blob";
import { isManagedBlobUrl } from "@/lib/blob/managed-blob-url";
import prisma from "@/lib/prisma";

// Runs before Better Auth deletes the user. The database cascade removes the
// user's cards, but their images and the avatar live in Vercel Blob and would
// be orphaned forever. A failure here throws on purpose: aborting the deletion
// is better than deleting the account and keeping the user's files.
export async function deleteUserBlobs(
  userId: string,
  avatarUrl: string | null | undefined,
): Promise<void> {
  const cards = await prisma.card.findMany({
    where: { userId, image: { not: null } },
    select: { image: true },
  });

  const urls = [avatarUrl, ...cards.map((card) => card.image)].filter(
    isManagedBlobUrl,
  );

  if (urls.length > 0) {
    await del(urls);
  }
}

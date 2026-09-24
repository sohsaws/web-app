import "server-only";

import {
  FAVORITES_PREVIEW_LIMIT,
  type FavoritesPreview,
} from "@/lib/config/favorites";
import prisma from "@/lib/prisma";

export async function getFavoritesPreview(
  userId: string,
): Promise<FavoritesPreview> {
  const where = { userId, isFavorited: true };
  const cards = await prisma.card.findMany
  ({
    where,
    take: FAVORITES_PREVIEW_LIMIT,
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    select: { id: true, title: true, description: true, image: true },
  });
  const total = await prisma.card.count({ where });

  return { cards, total };
}

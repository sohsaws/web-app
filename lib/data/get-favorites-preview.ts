import "server-only";

import { isIdeaCategory } from "@/lib/config/categories-array";
import {
  FAVORITES_PREVIEW_LIMIT,
  type FavoritesPreview,
} from "@/lib/config/favorites";
import prisma from "@/lib/prisma";

export async function getFavoritesPreview(userId: string): Promise<FavoritesPreview> {
  const where = { userId, isFavorited: true };
  const rows = await prisma.card.findMany
  ({
    where,
    take: FAVORITES_PREVIEW_LIMIT,
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    select: { 
      id: true, 
      title: true, 
      description: true, 
      image: true,
      category: true, 
    },
  });
  const cards = rows.map(({ category, ...card }) => ({
    ...card,
    categories: category.filter(isIdeaCategory),
  }));
  const total = await prisma.card.count({ where });

  return { cards, total };
}

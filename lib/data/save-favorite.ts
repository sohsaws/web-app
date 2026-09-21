import "server-only";

import prisma from "@/lib/prisma";
import type { IdeaSaveRequest } from "@/lib/types/ideas/types";

export async function saveFavoriteForUser(
  userId: string,
  idea: IdeaSaveRequest,
): Promise<boolean> {
    await prisma.card.create({
      data: {
        id: idea.id,
        title: idea.title,
        image: idea.image,
        description: idea.description,
        createdAt: idea.createdAt,
        userId,
        isFavorited: true,
      },
    });

    const card = await prisma.card.findFirst({
      where: { id: idea.id, userId, isFavorited: true },
      select: { id: true },
    });

    return card !== null;
}

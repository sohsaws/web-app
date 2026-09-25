import { z } from "zod";
import { generatedIdeaSchema } from "@/lib/config/ideas";

export const FAVORITES_PREVIEW_LIMIT = 10;
export const FAVORITES_QUERY_KEY = ["favorites"] as const;

export const favoritePreviewCardSchema = generatedIdeaSchema
  .pick({
    title: true,
    description: true,
  })
  .extend({
    id: z.string().min(1),
    image: z.string().min(1).nullable(),
  });

export const favoritesPreviewSchema = z.object({
  cards: z.array(favoritePreviewCardSchema).max(FAVORITES_PREVIEW_LIMIT),
  total: z.number().int().nonnegative(),
});

export type FavoritePreviewCard = z.infer<typeof favoritePreviewCardSchema>;
export type FavoritesPreview = z.infer<typeof favoritesPreviewSchema>;

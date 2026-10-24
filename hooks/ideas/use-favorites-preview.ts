"use client";

import { type UseQueryResult, useQuery } from "@tanstack/react-query";
import {
  FAVORITES_QUERY_KEY,
  type FavoritesPreview,
  favoritesPreviewSchema,
} from "@/lib/config/favorites";
import { createApiResponseError } from "@/lib/utils/responseError";

export function useFavoritesPreview(
  userId: string,
): UseQueryResult<FavoritesPreview, Error> {
  return useQuery({
    queryKey: [...FAVORITES_QUERY_KEY, userId, "preview"],
    queryFn: async ({ signal }): Promise<FavoritesPreview> => {
      const response = await fetch("/api/ideas/favorites/preview", {
        signal,
        cache: "no-store",
      });

      if (!response.ok) {
        throw await createApiResponseError(
          response,
          "Unable to load saved ideas",
        );
      }

      const body: unknown = await response.json();
      return favoritesPreviewSchema.parse(body);
    },
    retry: false,
  });
}

"use client";

import { type UseQueryResult, useQuery } from "@tanstack/react-query";
import {
  type CategoryDistribution,
  categoryDistributionSchema,
} from "@/lib/config/category-distribution";
import { FAVORITES_QUERY_KEY } from "@/lib/config/favorites";
import { getApiResponseError } from "@/lib/utils/responseError";

export function useCategoryDistribution(
  userId: string,
): UseQueryResult<CategoryDistribution, Error> {
  return useQuery({
    queryKey: [...FAVORITES_QUERY_KEY, userId, "categories"],
    queryFn: async ({ signal }): Promise<CategoryDistribution> => {
      const response = await fetch("/api/ideas/favorites/categories", {
        signal,
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(
          await getApiResponseError(response, "Unable to load categories"),
        );
      }

      const body: unknown = await response.json();
      return categoryDistributionSchema.parse(body);
    },
    retry: false,
  });
}

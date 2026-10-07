"use client";

import {
  useIsMutating,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { FAVORITES_QUERY_KEY } from "@/lib/config/favorites";
import type { IdeaSaveRequest } from "@/lib/types/ideas/types";
import { getApiResponseError } from "@/lib/utils/responseError";

const FAVORITE_MUTATION_KEY = ["save-favorite"] as const;

interface UseSaveFavoriteResult {
  save: (idea: IdeaSaveRequest) => void;
  isPending: boolean;
  error: Error | null;
}

export function useSaveFavorite(): UseSaveFavoriteResult {
  const queryClient = useQueryClient();
  const { mutate, error } = useMutation<void, Error, IdeaSaveRequest>({
    mutationKey: FAVORITE_MUTATION_KEY,
    mutationFn: async (idea: IdeaSaveRequest): Promise<void> => {
      const response = await fetch("/api/ideas/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(idea),
      });

      if (!response.ok) {
        throw new Error(
          await getApiResponseError(response, "Failed to save this idea"),
        );
      }
    },
    retry: false,
    onSuccess: async (_data, idea): Promise<void> => {
      toast.dismiss(idea.id);
      await queryClient.invalidateQueries({ queryKey: FAVORITES_QUERY_KEY });
    },
    onError: (failure, idea): void => {
      toast.error(`Could not save the card"`, {
        id: idea.id,
        description: failure.message,
        duration: Infinity,
        action: {
          label: "Retry",
          onClick: (): void => mutate(idea),
        },
      });
    },
  });
  const pendingCount = useIsMutating({ mutationKey: FAVORITE_MUTATION_KEY });

  return { save: mutate, isPending: pendingCount > 0, error };
}

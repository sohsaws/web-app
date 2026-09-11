"use client";

import { useMutation } from "@tanstack/react-query";
import { useCallback, useEffect, useRef } from "react";
import { useIdeasStore } from "@/app/stores/ideas-store";
import { ideasResponseSchema } from "@/lib/config/ideas";
import type { IdeaGeneratedResponse } from "@/lib/types/ideas/types";
import { getApiResponseError } from "@/lib/utils/responseError";

const IDEAS_REFILL_THRESHOLD = 5;

interface UseGeneratePackIdeasResult {
  generate: () => void;
  isPending: boolean;
  error: Error | null;
}

export function useGeneratePackIdeas(bio: string): UseGeneratePackIdeasResult {
  const IdeasStore = useIdeasStore((state) => state);
  const ideaCount = IdeasStore.ideas?.length ?? 0;

  const isRequestInFlight = useRef(false);
  const isMounted = useRef(false);

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: async (
      requestedBio: string,
    ): Promise<IdeaGeneratedResponse[]> => {
      const res = await fetch("/api/ideas/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bio: requestedBio }),
      });

      if (!res.ok) {
        throw new Error(
          await getApiResponseError(res, "Failed to generate ideas"),
        );
      }

      const data: unknown = await res.json();
      const result = ideasResponseSchema.safeParse(data);

      if (!result.success) {
        throw new Error("Idea generation returned an invalid response");
      }

      return result.data.ideas;
    },
    retry: false,
    onSuccess: (ideas): void => {
      if (!isMounted.current) {
        return;
      }

      if (IdeasStore.ideas === null) {
        IdeasStore.setIdeas(ideas);
      } else {
        IdeasStore.addIdeas(ideas);
      }
    },
    onSettled: (): void => {
      isRequestInFlight.current = false;
    },
  });

  const generate = useCallback((): void => {
    if (!isMounted.current || isRequestInFlight.current) {
      return;
    }

    isRequestInFlight.current = true;
    mutate(bio);
  }, [bio, mutate]);

  useEffect(() => {
    isMounted.current = true;

    return (): void => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (ideaCount <= IDEAS_REFILL_THRESHOLD && !isPending && !isError) {
      generate();
    }
  }, [ideaCount, isPending, isError, generate]);

  return { generate, isPending, error };
}

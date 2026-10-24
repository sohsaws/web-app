"use client";

import { useMutation } from "@tanstack/react-query";
import { useCallback, useEffect, useRef } from "react";
import { useIdeasStore } from "@/app/stores/ideas-store";
import { useRateLimitMessage } from "@/hooks/ideas/use-rate-limit-message";
import { ideasResponseSchema } from "@/lib/config/ideas";
import type { IdeaGeneratedResponse } from "@/lib/types/ideas/types";
import { showRateLimitToast } from "@/lib/utils/rate-limit-toast";
import {
  createApiResponseError,
  RateLimitError,
} from "@/lib/utils/responseError";

const IDEAS_REFILL_THRESHOLD = 5;

// "append" tops up the deck as the user swipes; "replace" swaps the whole
// deck when the user asks for a new one.
type DeckUpdateMode = "append" | "replace";

interface GenerateDeckVariables {
  bio: string;
  mode: DeckUpdateMode;
}

interface UseGeneratePackIdeasResult {
  generate: () => void;
  regenerate: () => void;
  isPending: boolean;
  isRegenerating: boolean;
  error: Error | null;
}

export function useGeneratePackIdeas(bio: string): UseGeneratePackIdeasResult {
  const IdeasStore = useIdeasStore((state) => state);
  const ideaCount = IdeasStore.ideas?.length ?? 0;
  const rateLimitMessage = useRateLimitMessage();

  const isRequestInFlight = useRef(false);
  const isMounted = useRef(false);

  const { mutate, isPending, isError, error, variables } = useMutation({
    mutationFn: async ({
      bio: requestedBio,
    }: GenerateDeckVariables): Promise<IdeaGeneratedResponse[]> => {
      const res = await fetch("/api/ideas/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bio: requestedBio }),
      });

      if (!res.ok) {
        throw await createApiResponseError(res, "Failed to generate ideas");
      }

      const data: unknown = await res.json();
      const result = ideasResponseSchema.safeParse(data);

      if (!result.success) {
        throw new Error("Idea generation returned an invalid response");
      }

      return result.data.ideas;
    },
    retry: false,
    onSuccess: (ideas, { mode }): void => {
      if (!isMounted.current) {
        return;
      }

      // The current deck stays on screen until the new one arrives, so a
      // failed or rate-limited regeneration never leaves the user empty.
      if (mode === "replace" || IdeasStore.ideas === null) {
        IdeasStore.setIdeas(ideas);
      } else {
        IdeasStore.addIdeas(ideas);
      }
    },
    onError: (mutationError): void => {
      if (mutationError instanceof RateLimitError) {
        showRateLimitToast(rateLimitMessage(mutationError.retryAfterSeconds));
      }
    },
    onSettled: (): void => {
      isRequestInFlight.current = false;
    },
  });

  const startGeneration = useCallback(
    (mode: DeckUpdateMode): void => {
      if (!isMounted.current || isRequestInFlight.current) {
        return;
      }

      isRequestInFlight.current = true;
      mutate({ bio, mode });
    },
    [bio, mutate],
  );

  const generate = useCallback(
    (): void => startGeneration("append"),
    [startGeneration],
  );
  const regenerate = useCallback(
    (): void => startGeneration("replace"),
    [startGeneration],
  );

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

  return {
    generate,
    regenerate,
    isPending,
    isRegenerating: isPending && variables?.mode === "replace",
    error,
  };
}

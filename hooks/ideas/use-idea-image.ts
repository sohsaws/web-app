"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import {
  generatedImageSchema,
  IDEA_IMAGE_DATA_URL_PREFIX,
} from "@/lib/config/ideas";
import type { GeneratedImage } from "@/lib/types/ideas/types";
import { showRateLimitToast } from "@/lib/utils/rate-limit-toast";
import {
  createApiResponseError,
  RateLimitError,
} from "@/lib/utils/responseError";

interface UseIdeaImageResult {
  image: string | null;
  isPending: boolean;
  error: Error | null;
}

export function useIdeaImage(
  id: string,
  description: string,
): UseIdeaImageResult {
  const { data, isPending, error } = useQuery({
    queryKey: ["idea-image", id, description],
    queryFn: async (): Promise<GeneratedImage> => {
      const response = await fetch("/api/ideas/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description }),
      });

      if (!response.ok) {
        throw await createApiResponseError(
          response,
          "Failed to generate an image",
        );
      }

      const body: unknown = await response.json();
      return generatedImageSchema.parse(body);
    },
    staleTime: Infinity,
    retry: false,
    retryOnMount: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  useEffect(() => {
    if (error instanceof RateLimitError) {
      showRateLimitToast(error.retryAfterSeconds);
    }
  }, [error]);

  return {
    image: data ? `${IDEA_IMAGE_DATA_URL_PREFIX}${data.image}` : null,
    isPending,
    error,
  };
}

"use client";

import { useQuery } from "@tanstack/react-query";
import { generatedImageSchema } from "@/lib/config/ideas";
import type { GeneratedImage } from "@/lib/types/ideas/types";
import { getApiResponseError } from "@/lib/utils/responseError";

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
        throw new Error(
          await getApiResponseError(response, "Failed to generate an image"),
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

  return {
    image: data ? `data:image/jpeg;charset=utf-8;base64,${data.image}` : null,
    isPending,
    error,
  };
}

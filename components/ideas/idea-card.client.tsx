"use client";

import { type ReactElement, type ReactNode, useEffect } from "react";
import { useIdeasStore } from "@/app/stores/ideas-store";
import { IdeaCardView } from "@/components/ideas/idea-card-view.client";
import { useIdeaImage } from "@/hooks/use-idea-image";
import type { IdeaCategory } from "@/lib/config/categories-array";

export interface IdeaCardProps {
  id: string;
  description: string;
  title: string;
  categories: readonly IdeaCategory[];
  dragHandle?: ReactNode;
}

export function IdeaCard({
  id,
  description,
  title,
  categories,
  dragHandle,
}: IdeaCardProps): ReactElement {
  const { image, isPending, error } = useIdeaImage(id, description);
  const updateIdeaImage = useIdeasStore((state) => state.updateIdeaImage);

  useEffect((): void => {
    if (!image || isPending || error) return;

    updateIdeaImage(id, image);
  }, [id, image, isPending, error, updateIdeaImage]);

  return (
    <IdeaCardView
      id={id}
      title={title}
      description={description}
      categories={categories}
      image={error ? null : image}
      isImagePending={isPending}
      dragHandle={dragHandle}
    />
  );
}

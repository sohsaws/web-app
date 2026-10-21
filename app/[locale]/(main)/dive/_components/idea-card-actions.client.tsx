"use client";

import { RotateCcw } from "lucide-react";
import type { ReactElement } from "react";
import { useIdeasStore } from "@/app/stores/ideas-store";
import { FavoriteButton } from "./favorite-idea-card.client";
import { SkipButton } from "./skip-idea-card.client";

interface IdeaCardActionsProps {
  onSkip?: () => void;
  onFavorite?: () => void;
  isAnimating?: boolean;
}

export function IdeaCardActions({
  onSkip,
  onFavorite,
  isAnimating = false,
}: IdeaCardActionsProps): ReactElement {
  const previousCard = useIdeasStore((state) => state.previousCard);
  const restorePreviousCard = useIdeasStore(
    (state) => state.restorePreviousCard,
  );

  return (
    <div className="mt-6 flex items-center justify-center gap-8 pb-2">
      <button
        type="button"
        aria-label="Restore previous idea"
        title="Restore previous idea"
        disabled={isAnimating || !previousCard}
        onClick={restorePreviousCard}
        className="card-action text-app-fg"
      >
        <RotateCcw aria-hidden="true" className="size-7" />
      </button>
      <SkipButton onClick={onSkip} disabled={isAnimating} />
      <FavoriteButton onClick={onFavorite} disabled={isAnimating} />
    </div>
  );
}

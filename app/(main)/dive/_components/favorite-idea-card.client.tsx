"use client";

import { Bookmark } from "lucide-react";
import type { ReactElement } from "react";

interface FavoriteButtonProps {
  onClick?: () => void;
  disabled?: boolean;
}

export function FavoriteButton({
  onClick,
  disabled = false,
}: FavoriteButtonProps): ReactElement {
  return (
    <button
      type="button"
      aria-label="Favorite idea"
      title={onClick ? "Favorite idea" : "Favorites coming soon"}
      disabled={disabled || !onClick}
      onClick={onClick}
      className="card-action text-app-action-favorite"
    >
      <Bookmark aria-hidden="true" className="size-7 fill-current" />
    </button>
  );
}

"use client";

import { Bookmark } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactElement } from "react";

interface FavoriteButtonProps {
  onClick?: () => void;
  disabled?: boolean;
}

export function FavoriteButton({
  onClick,
  disabled = false,
}: FavoriteButtonProps): ReactElement {
  const t = useTranslations("Dive.actions");

  return (
    <button
      type="button"
      aria-label={t("favorite")}
      title={onClick ? t("favorite") : t("favoriteUnavailable")}
      disabled={disabled || !onClick}
      onClick={onClick}
      className="card-action text-app-action-favorite"
    >
      <Bookmark aria-hidden="true" className="size-7 fill-current" />
    </button>
  );
}

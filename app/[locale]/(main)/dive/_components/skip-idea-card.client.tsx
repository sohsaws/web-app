"use client";

import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactElement } from "react";

interface SkipButtonProps {
  onClick?: () => void;
  disabled?: boolean;
}

export function SkipButton({
  onClick,
  disabled = false,
}: SkipButtonProps): ReactElement {
  const t = useTranslations("Dive.actions");

  return (
    <button
      type="button"
      aria-label={t("skip")}
      title={t("skip")}
      disabled={disabled || !onClick}
      onClick={onClick}
      className="card-action text-app-action-skip"
    >
      <X aria-hidden="true" className="size-7" />
    </button>
  );
}

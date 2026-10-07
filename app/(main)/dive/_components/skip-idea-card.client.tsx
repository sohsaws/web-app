"use client";

import { X } from "lucide-react";
import type { ReactElement } from "react";

interface SkipButtonProps {
  onClick?: () => void;
  disabled?: boolean;
}

export function SkipButton({
  onClick,
  disabled = false,
}: SkipButtonProps): ReactElement {
  return (
    <button
      type="button"
      aria-label="Skip idea"
      title="Skip idea"
      disabled={disabled || !onClick}
      onClick={onClick}
      className="card-action text-app-action-skip"
    >
      <X aria-hidden="true" className="size-7" />
    </button>
  );
}

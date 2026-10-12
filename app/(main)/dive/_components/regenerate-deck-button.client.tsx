"use client";

import { RefreshCw } from "lucide-react";
import type { ReactElement } from "react";

interface RegenerateDeckButtonProps {
  onRegenerate: () => void;
  // Any generation in flight, including the silent top-up while swiping.
  isPending: boolean;
  // Only a requested new deck: drives the label and the spinning icon.
  isRegenerating: boolean;
}

export function RegenerateDeckButton({
  onRegenerate,
  isPending,
  isRegenerating,
}: RegenerateDeckButtonProps): ReactElement {
  return (
    <button
      type="button"
      onClick={onRegenerate}
      disabled={isPending}
      aria-busy={isRegenerating}
      className="mx-auto mt-4 flex min-h-10 cursor-pointer items-center gap-2 rounded-full border
       border-app-border px-5 text-sm font-medium text-neutral-300 transition-colors duration-300
       hover:border-white/30 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4
       focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none"
    >
      <RefreshCw
        aria-hidden="true"
        className={`size-4 ${isRegenerating ? "motion-safe:animate-spin" : ""}`}
      />
      {isRegenerating ? "Shuffling a new deck…" : "Shuffle a new deck"}
    </button>
  );
}

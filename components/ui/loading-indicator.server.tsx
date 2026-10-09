import type { ReactElement } from "react";

const cardSilhouettes = [
  {
    id: "left",
    className:
      "-translate-x-[45%] -rotate-10 motion-safe:[animation-delay:150ms]",
  },
  {
    id: "right",
    className:
      "translate-x-[45%] rotate-10 motion-safe:[animation-delay:300ms]",
  },
  { id: "centre", className: "-translate-y-2" },
] as const;

export function LoadingIndicator(): ReactElement {
  return (
    <div
      role="status"
      className="flex flex-col items-center gap-10 motion-safe:animate-fade-up motion-safe:[animation-delay:300ms]"
    >
      <div aria-hidden="true" className="relative h-24 w-20">
        {cardSilhouettes.map((card) => (
          <div
            key={card.id}
            className={`absolute inset-0 rounded-xl border border-app-border bg-linear-to-br from-app-surface to-app-bg shadow-xl shadow-black/40 motion-safe:animate-pulse ${card.className}`}
          />
        ))}
      </div>

      <p className="flex items-center gap-3 text-xs font-medium tracking-[0.25em] text-neutral-400 uppercase">
        <span aria-hidden="true" className="h-px w-6 bg-app-action-skip" />
        Loading
      </p>
    </div>
  );
}

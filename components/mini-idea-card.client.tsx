"use client";

import type { ReactElement } from "react";
import { IdeaCategories } from "@/components/idea-categories.client";
import type { FavoritePreviewCard } from "@/lib/config/favorites";

const toneClasses = {
  warm: "from-[#231b1c] to-app-surface",
  cool: "from-[#1b262b] to-app-surface",
  gold: "from-[#292619] to-app-surface",
} as const;

interface MiniIdeaCardProps {
  idea: FavoritePreviewCard;
  tone?: keyof typeof toneClasses;
}

export function MiniIdeaCard({
  idea,
  tone = "warm",
}: MiniIdeaCardProps): ReactElement {
  return (
    <article
      className={`flex aspect-11/10 min-w-0 flex-col justify-between overflow-hidden rounded-xl border border-app-border bg-linear-to-br p-4 shadow-xl shadow-black/40 ${toneClasses[tone]}`}
    >
      {idea.categories.length > 0 ? (
        <IdeaCategories categories={idea.categories} size="compact" />
      ) : (
        <p className="text-[0.625rem] tracking-widest text-app-action-skip uppercase">
          Favorite
        </p>
      )}
      <div className="min-w-0">
        <h3 className="line-clamp-2 wrap-anywhere font-serif text-xl leading-tight text-white">
          {idea.title}
        </h3>
        <p className="mt-2 line-clamp-2 wrap-anywhere text-xs leading-4 text-app-muted">
          {idea.description}
        </p>
      </div>
    </article>
  );
}

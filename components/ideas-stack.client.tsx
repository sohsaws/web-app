"use client";

import { Bookmark } from "lucide-react";
import type { ReactElement } from "react";
import { MiniIdeaCard } from "@/components/mini-idea-card.client";
import {
  FAVORITES_PREVIEW_LIMIT,
  type FavoritePreviewCard,
} from "@/lib/config/favorites";

const positions = [
  { layer: "z-30", className: "", tone: "warm" },
  {
    layer: "z-20",
    className: "-translate-x-5 translate-y-1 -rotate-9",
    tone: "cool",
  },
  {
    layer: "z-10",
    className: "translate-x-5 translate-y-1 rotate-9",
    tone: "gold",
  },
] as const;

interface IdeasStackProps {
  cards: readonly FavoritePreviewCard[];
}

export function IdeasStack({ cards }: IdeasStackProps): ReactElement {
  if (cards.length === 0) {
    return (
      <div className="flex min-h-60 flex-col items-center justify-center gap-3 text-center text-app-muted">
        <Bookmark aria-hidden="true" className="size-8" strokeWidth={1} />
        <p className="max-w-52 text-sm leading-6">
          No saved ideas yet. Favorite a card in Dive to start your collection.
        </p>
      </div>
    );
  }

  return (
    <ul
      aria-label="Recently saved ideas"
      className="relative isolate mx-auto h-60 w-full max-w-64"
    >
      {cards.slice(0, FAVORITES_PREVIEW_LIMIT).map((idea, index) => {
        const position = positions[index] ?? positions[0];

        return (
          <li
            key={idea.id}
            className={`absolute top-6 left-1/2 w-[72%] -translate-x-1/2 ${position.layer}`}
          >
            <div className={position.className}>
              <MiniIdeaCard idea={idea} tone={position.tone} />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

"use client";

import { motion } from "motion/react";
import type { ReactElement } from "react";
import { useIdeasStore } from "@/app/stores/ideas-store";
import { IdeaCard } from "@/components/idea-card.client";
import { useGeneratePackIdeas } from "@/hooks/use-generate-pack-ideas";

interface CardsPoolProps {
  userBio: string;
}

export function CardsPool({ userBio }: CardsPoolProps): ReactElement {
  const { isPending, error } = useGeneratePackIdeas(userBio);

  const currentIdea = useIdeasStore((state) => state.ideas?.[0]);
  if (!currentIdea) {
    return (
      <p role="status" className="text-sm text-app-fg">
        {isPending
          ? "Generating ideas..."
          : error
            ? "Unable to load ideas."
            : "Your idea cards will appear here."}
      </p>
    );
  }

  return (
    <div
      className="w-full max-w-100"
      onDragStartCapture={(event): void => event.preventDefault()}
    >
      <motion.div
        key={currentIdea.id}
        className="w-full touch-pan-y"
        dragElastic={0.7}
        drag="x"
        dragMomentum
        dragConstraints={{ left: 0, right: 0 }}
        dragTransition={{ bounceStiffness: 250, bounceDamping: 20 }}
        whileDrag={{
          cursor: "grabbing",
        }}
      >
        <IdeaCard
          id={currentIdea.id}
          title={currentIdea.title}
          description={currentIdea.description}
        />
      </motion.div>
    </div>
  );
}

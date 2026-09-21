"use client";

import {
  animate,
  motion,
  type PanInfo,
  useDragControls,
  useMotionValue,
  useReducedMotion,
} from "motion/react";
import {
  type ReactElement,
  type PointerEvent as ReactPointerEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { useIdeasStore } from "@/app/stores/ideas-store";
import { IdeaCard } from "@/components/idea-card.client";
import { useGeneratePackIdeas } from "@/hooks/use-generate-pack-ideas";
import { useSaveFavorite } from "@/hooks/use-save-favorite";
import { swipeAway } from "@/lib/animations/swipe-away";
import type { IdeaSaveRequest } from "@/lib/types/ideas/types";
import { IdeaCardActions } from "./idea-card-actions.client";

const SWIPE_THRESHOLD_RATIO = 1;
const SWIPE_PROJECTION_SECONDS = 0.3;

function getSwipeDirection(
  offset: number,
  velocity: number,
  width: number,
): number {
  const threshold = width * SWIPE_THRESHOLD_RATIO;
  if (Math.abs(offset) >= threshold) {
    return Math.sign(offset);
  }

  const projectedOffset = offset + velocity * SWIPE_PROJECTION_SECONDS;
  return Math.abs(projectedOffset) >= threshold
    ? Math.sign(projectedOffset)
    : 0;
}

function SwipeableIdea({
  idea,
  onFavorite,
}: {
  idea: IdeaSaveRequest;
  onFavorite: (idea: IdeaSaveRequest) => void;
}): ReactElement {
  const removeIdea = useIdeasStore((state) => state.removeIdea);
  const dragControls = useDragControls();
  const reducedMotion = useReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);
  const isLeaving = useRef(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const x = useMotionValue(0);
  const opacity = useMotionValue(1);

  useEffect(() => {
    return (): void => {
      x.stop();
      opacity.stop();
    };
  }, [x, opacity]);

  function startDrag(event: ReactPointerEvent<HTMLDivElement>): void {
    if (isLeaving.current || !event.isPrimary || event.button !== 0) return;
    x.stop();
    dragControls.start(event);
  }

  function dismissIdea(direction: number): void {
    const card = cardRef.current;
    if (!card || isLeaving.current) return;

    isLeaving.current = true;
    setIsAnimating(true);
    if (direction > 0) {
      onFavorite(idea);
    }
    dragControls.stop();
    const exitDistance = window.innerWidth + card.offsetWidth + 400;
    swipeAway(exitDistance, opacity, x, reducedMotion, direction, () =>
      removeIdea(idea.id),
    );
  }

  function finishDrag(event: PointerEvent, info: PanInfo): void {
    const card = cardRef.current;
    if (!card || isLeaving.current) return;

    const direction =
      event.type === "pointercancel"
        ? 0
        : getSwipeDirection(x.get(), info.velocity.x, card.offsetWidth);

    if (direction === 0) {
      animate(x, 0, {
        type: "spring",
        stiffness: 400,
        damping: 20,
        velocity: event.type === "pointercancel" ? 0 : info.velocity.x,
      });
      return;
    }

    dismissIdea(direction);
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: reducedMotion ? 0 : 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reducedMotion ? 0.1 : 0.25, ease: "easeOut" }}
      >
        <motion.div
          ref={cardRef}
          className="w-app-screen-width"
          style={{ x, opacity }}
          drag="x"
          dragListener={false}
          dragControls={dragControls}
          dragMomentum={true}
          onDragEnd={finishDrag}
        >
          <IdeaCard
            id={idea.id}
            title={idea.title}
            description={idea.description}
            dragHandle={
              <div
                aria-hidden="true"
                className="absolute inset-0 cursor-grab touch-pan-y select-none active:cursor-grabbing"
                onPointerDown={startDrag}
                onDragStart={(event): void => event.preventDefault()}
              />
            }
          />
        </motion.div>
      </motion.div>
      <IdeaCardActions
        onSkip={(): void => dismissIdea(-1)}
        onFavorite={(): void => dismissIdea(1)}
        isAnimating={isAnimating}
      />
    </>
  );
}

interface CardsPoolProps {
  userBio: string;
}

export function CardsPool({ userBio }: CardsPoolProps): ReactElement {
  const { isPending, error } = useGeneratePackIdeas(userBio);
  const { save } = useSaveFavorite();

  const currentIdea = useIdeasStore((state) => state.ideas?.[0]);
  if (!currentIdea) {
    return (
      <div className="w-full max-w-100">
        <p role="status" className="text-sm text-app-fg">
          {isPending
            ? "Generating ideas..."
            : error
              ? "Unable to load ideas."
              : "Your idea cards will appear here."}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-100">
      <SwipeableIdea
        key={currentIdea.id}
        idea={currentIdea}
        onFavorite={save}
      />
    </div>
  );
}

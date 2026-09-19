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
} from "react";
import { useIdeasStore } from "@/app/stores/ideas-store";
import { IdeaCard } from "@/components/idea-card.client";
import { useGeneratePackIdeas } from "@/hooks/use-generate-pack-ideas";
import type { IdeaGeneratedResponse } from "@/lib/types/ideas/types";

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
}: {
  idea: IdeaGeneratedResponse;
}): ReactElement {
  const removeIdea = useIdeasStore((state) => state.removeIdea);
  const dragControls = useDragControls();
  const reducedMotion = useReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);
  const isLeaving = useRef(false);
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

    isLeaving.current = true;
    const exitDistance = window.innerWidth + card.offsetWidth + 400;
    animate(opacity, 0, { duration: reducedMotion ? 0.1 : 0.3 });
    animate(x, reducedMotion ? x.get() : direction * exitDistance, {
      type: "tween",
      duration: reducedMotion ? 0.1 : 2,
      ease: "easeOut",
      onComplete: (): void => removeIdea(idea.id),
    });
  }

  return (
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
  );
}

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
    <div className="w-full max-w-100">
      <SwipeableIdea key={currentIdea.id} idea={currentIdea} />
    </div>
  );
}

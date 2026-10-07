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
import { LoadingSpinner } from "@/components/loading-spinner.client";
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
            categories={idea.categories}
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

const DECK_PLACEHOLDER_CLASS =
  "flex aspect-475/650 w-full flex-col items-center justify-center gap-6 rounded-2xl border border-app-border bg-linear-to-br from-app-surface to-app-bg px-8 text-center shadow-2xl shadow-black/40";

export function CardsPool({ userBio }: CardsPoolProps): ReactElement {
  const { generate, isPending, error } = useGeneratePackIdeas(userBio);
  const { save } = useSaveFavorite();

  const currentIdea = useIdeasStore((state) => state.ideas?.[0]);
  if (!currentIdea) {
    if (error && !isPending) {
      return (
        <div className="w-full max-w-100">
          <div className={DECK_PLACEHOLDER_CLASS}>
            <p className="font-serif text-3xl tracking-tight text-white">
              Couldn&apos;t shuffle
              <span className="block text-neutral-400">your deck.</span>
            </p>
            <p className="text-sm leading-relaxed text-neutral-400">
              Something went wrong while generating ideas.
            </p>
            <button
              type="button"
              onClick={generate}
              className="inline-flex min-h-12 cursor-pointer items-center rounded-full bg-[#ece8e1] px-7 text-sm font-semibold text-black transition-colors duration-300 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              Try again
            </button>
          </div>
        </div>
      );
    }

    // Also covers the first render, before the generation request starts.
    return (
      <div className="w-full max-w-100">
        <div className={DECK_PLACEHOLDER_CLASS}>
          <LoadingSpinner label="Generating ideas" className="size-10" />
          <p
            aria-hidden="true"
            className="text-xs font-medium tracking-[0.25em] text-neutral-400 uppercase"
          >
            Shuffling your deck
          </p>
        </div>
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

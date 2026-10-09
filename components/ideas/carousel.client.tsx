"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import {
  AnimatePresence,
  motion,
  type PanInfo,
  useReducedMotion,
} from "motion/react";
import {
  type ReactElement,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { useCarouselStore } from "@/app/stores/carousel-store";
import {
  IdeaCardView,
  type IdeaCardViewProps,
} from "@/components/ideas/idea-card-view.client";

export type CarouselItem = Pick<
  IdeaCardViewProps,
  "id" | "title" | "description" | "categories" | "image"
>;

const SIDE_CARD_SHIFT_PERCENT = 78;
const SIDE_CARD_SCALE = 0.85;
const SIDE_CARD_ROTATE_DEGREES = 40;
const SWIPE_DISTANCE_PX = 60;
const SWIPE_VELOCITY_PX = 400;

const NAVIGATION_BUTTON_CLASS =
  "fixed top-1/2 z-20 flex size-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-app-border bg-app-bg/80 text-white backdrop-blur-sm transition-colors hover:bg-app-glow focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-30 motion-reduce:transition-none";

const FOCUSABLE_SELECTOR =
  'button:not([disabled]):not([tabindex="-1"]), [href], [tabindex]:not([tabindex="-1"])';

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
  ).filter((element) => element.closest("[inert]") === null);
}

function getSwipeStep(info: PanInfo): number {
  const isSwipe =
    Math.abs(info.offset.x) >= SWIPE_DISTANCE_PX ||
    Math.abs(info.velocity.x) >= SWIPE_VELOCITY_PX;

  return isSwipe ? -Math.sign(info.offset.x) : 0;
}

interface CarouselDialogProps {
  items: readonly CarouselItem[];
  onClose: () => void;
}

function CarouselDialog({ items, onClose }: CarouselDialogProps): ReactElement {
  const [requestedIndex, setRequestedIndex] = useState(0);
  const reducedMotion = useReducedMotion();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const lastIndex = items.length - 1;

  const activeIndex = Math.min(requestedIndex, lastIndex);

  useEffect(() => {
    const previouslyFocused =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    return (): void => {
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, []);

  function goTo(index: number): void {
    setRequestedIndex(Math.min(Math.max(index, 0), lastIndex));
  }

  function trapFocus(event: ReactKeyboardEvent<HTMLDivElement>): void {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const focusable = getFocusableElements(dialog);
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (!first || !last) return;

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function handleKeyDown(event: ReactKeyboardEvent<HTMLDivElement>): void {
    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(activeIndex - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      goTo(activeIndex + 1);
    } else if (event.key === "Tab") {
      trapFocus(event);
    }
  }

  function closeOnBackdropClick(event: ReactMouseEvent<HTMLDivElement>): void {
    if (event.target === event.currentTarget) onClose();
  }

  function handleSwipe(_event: PointerEvent, info: PanInfo): void {
    const step = getSwipeStep(info);
    if (step !== 0) goTo(activeIndex + step);
  }

  const cardTransition = reducedMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 260, damping: 30 };

  return (
    <motion.div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="Ideas carousel"
      tabIndex={-1}
      onKeyDown={handleKeyDown}
      onClick={closeOnBackdropClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reducedMotion ? 0 : 0.2 }}
      className="fixed inset-0 z-50 flex overflow-x-hidden overflow-y-auto bg-black/80 outline-none backdrop-blur-sm [--carousel-control-inset:max(1rem,15vw)]"
    >
      <button
        ref={closeButtonRef}
        type="button"
        aria-label="Close carousel"
        onClick={onClose}
        className="fixed top-4 right-4 z-10 flex size-10 cursor-pointer items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:transition-none"
      >
        <X aria-hidden="true" className="size-5" />
      </button>

      <motion.ul
        aria-label="Ideas"
        initial={{ scale: reducedMotion ? 1 : 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: reducedMotion ? 1 : 0.95 }}
        className="relative m-auto grid w-[min(26.25rem,calc(100vw-2rem))] py-20 perspective-distant"
      >
        {items.map((item, index) => {
          const offset = index - activeIndex;
          const isActive = offset === 0;

          return (
            <motion.li
              key={item.id}
              aria-current={isActive ? "true" : undefined}
              initial={false}
              animate={{
                x: `${offset * SIDE_CARD_SHIFT_PERCENT}%`,
                scale: isActive ? 1 : SIDE_CARD_SCALE,
                rotateY: Math.sign(offset) * SIDE_CARD_ROTATE_DEGREES,
              }}
              transition={cardTransition}
              style={{ zIndex: items.length - Math.abs(offset) }}
              className="relative col-start-1 row-start-1"
            >
              <div inert={!isActive}>
                <IdeaCardView
                  {...item}
                  dragHandle={
                    isActive ? (
                      <motion.div
                        aria-hidden="true"
                        onPanEnd={handleSwipe}
                        className="absolute inset-0 cursor-grab touch-pan-y select-none active:cursor-grabbing"
                      />
                    ) : undefined
                  }
                />
              </div>
              {isActive ? null : (
                <button
                  type="button"
                  tabIndex={-1}
                  aria-hidden="true"
                  onClick={(): void => goTo(index)}
                  className="absolute inset-0 cursor-pointer rounded-3xl"
                />
              )}
            </motion.li>
          );
        })}
      </motion.ul>

      <p
        aria-live="polite"
        className="fixed top-4 left-1/2 z-20 flex h-10 -translate-x-1/2 items-center text-xs text-app-muted tabular-nums"
      >
        {activeIndex + 1} / {items.length}
      </p>

      <button
        type="button"
        aria-label="Previous idea"
        disabled={activeIndex === 0}
        onClick={(): void => goTo(activeIndex - 1)}
        className={`left-(--carousel-control-inset) ${NAVIGATION_BUTTON_CLASS}`}
      >
        <ChevronLeft aria-hidden="true" className="size-5" />
      </button>
      <button
        type="button"
        aria-label="Next idea"
        disabled={activeIndex === lastIndex}
        onClick={(): void => goTo(activeIndex + 1)}
        className={`right-(--carousel-control-inset) ${NAVIGATION_BUTTON_CLASS}`}
      >
        <ChevronRight aria-hidden="true" className="size-5" />
      </button>
    </motion.div>
  );
}

interface CarouselProps {
  items: readonly CarouselItem[];
}

export function Carousel({ items }: CarouselProps): ReactElement | null {
  const isOpen = useCarouselStore((state) => state.isOpen);
  const close = useCarouselStore((state) => state.close);
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

  // The store is global, so an open carousel must not survive navigation away.
  useEffect(() => {
    setPortalTarget(document.body);

    return close;
  }, [close]);

  if (!portalTarget) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && items.length > 0 ? (
        <CarouselDialog key="carousel" items={items} onClose={close} />
      ) : null}
    </AnimatePresence>,
    portalTarget,
  );
}

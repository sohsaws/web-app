"use client";

import { BellRing } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { type ReactElement, useEffect, useId, useRef, useState } from "react";

// A panel, not an action menu: clicks inside keep it open, so it does not
// reuse DropdownMenu (which closes on any click inside).
export function NotificationsMenu(): ReactElement {
  const t = useTranslations("Common");
  const reducedMotion = useReducedMotion();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const titleId = useId();

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handlePointerDown(event: PointerEvent): void {
      if (
        event.target instanceof Node &&
        !containerRef.current?.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-label={t("appHeader.notifications")}
        aria-controls={panelId}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((currentValue) => !currentValue)}
        className="inline-flex min-h-10 min-w-10 cursor-pointer items-center justify-center text-neutral-300 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white aria-expanded:text-white"
      >
        <BellRing aria-hidden="true" className="size-6" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.section
            id={panelId}
            aria-labelledby={titleId}
            initial={{ opacity: 0, scale: 0.98, y: reducedMotion ? 0 : -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: reducedMotion ? 0 : -8 }}
            transition={{ duration: reducedMotion ? 0 : 0.18 }}
            // Below sm the bell sits too close to the left edge for a
            // right-aligned 20rem panel, so it spans the viewport instead.
            className="fixed inset-x-4 top-17 z-50 origin-top rounded-lg border border-white/50 bg-app-bg shadow-[0_0_18px_var(--color-app-glow)] sm:absolute sm:inset-x-auto sm:top-[calc(100%+0.5rem)] sm:right-0 sm:w-80 sm:origin-top-right"
          >
            <h2
              id={titleId}
              className="border-b border-white/10 px-4 py-3 text-sm font-medium text-white"
            >
              {t("appHeader.notifications")}
            </h2>
            <div className="flex min-h-48 items-center justify-center px-6 py-10">
              <p className="text-center text-sm text-neutral-500">
                {t("notificationsPanel.empty")}
              </p>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}

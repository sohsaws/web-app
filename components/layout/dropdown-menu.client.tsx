"use client";

import { AnimatePresence, motion } from "motion/react";
import {
  type ReactElement,
  type ReactNode,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

interface DropdownTriggerState {
  isOpen: boolean;
}

interface DropdownMenuProps {
  renderTrigger: (state: DropdownTriggerState) => ReactNode;
  triggerLabel: string;
  children: ReactNode;
}

export function DropdownMenu({
  renderTrigger,
  triggerLabel,
  children,
}: DropdownMenuProps): ReactElement {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    function handlePointerDown(event: PointerEvent): void {
      if (
        event.target instanceof Node &&
        !dropdownRef.current?.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        aria-controls={menuId}
        aria-expanded={isOpen}
        aria-label={triggerLabel}
        onClick={() => setIsOpen((currentValue) => !currentValue)}
        className="inline-flex min-h-10 min-w-10 cursor-pointer items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        {renderTrigger({ isOpen })}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id={menuId}
            initial={{ opacity: 0, scale: 0.98, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -8 }}
            transition={{ duration: 0.18 }}
            onClick={() => setIsOpen(false)}
            className="absolute top-[calc(100%+0.5rem)] left-1/2 z-50 w-48 -translate-x-1/2 origin-top rounded-lg border border-white/50 bg-app-bg p-1 shadow-[0_0_18px_var(--color-app-glow)]"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

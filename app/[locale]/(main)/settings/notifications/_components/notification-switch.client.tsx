"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactElement } from "react";

// Knob offsets inside the 44px track with a 1px border: 2px gap on each side
// around the 18px knob.
const KNOB_OFFSET_OFF = 2;
const KNOB_OFFSET_ON = 22;

interface NotificationSwitchProps {
  checked: boolean;
  labelId: string;
  descriptionId: string;
  disabled?: boolean;
  onToggle?: () => void;
}

export function NotificationSwitch({
  checked,
  labelId,
  descriptionId,
  disabled = false,
  onToggle,
}: NotificationSwitchProps): ReactElement {
  const reducedMotion = useReducedMotion();

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-labelledby={labelId}
      aria-describedby={descriptionId}
      disabled={disabled}
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed motion-reduce:transition-none ${
        checked
          ? "border-white bg-white"
          : "border-white/10 bg-neutral-800 hover:bg-neutral-700"
      } ${disabled ? "opacity-60" : ""}`}
    >
      <motion.span
        aria-hidden="true"
        initial={false}
        animate={{
          x: checked ? KNOB_OFFSET_ON : KNOB_OFFSET_OFF,
          backgroundColor: checked ? "#000000" : "#ffffff",
        }}
        transition={
          reducedMotion
            ? { duration: 0 }
            : { type: "spring", stiffness: 500, damping: 30 }
        }
        className="inline-block size-4.5 rounded-full shadow-sm"
      />
    </button>
  );
}

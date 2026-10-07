"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactElement } from "react";

interface LoadingSpinnerProps {
  className?: string;
  label?: string;
}

export function LoadingSpinner({
  className = "size-6",
  label = "Loading...",
}: LoadingSpinnerProps): ReactElement {
  const reducedMotion = useReducedMotion();

  return (
    <span
      role="status"
      className={`inline-flex shrink-0 items-center justify-center text-white ${className}`}
    >
      <span className="sr-only">{label}</span>
      <motion.svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        className="size-full"
        initial={{ rotate: 0 }}
        animate={{ rotate: reducedMotion ? 0 : 360 }}
        transition={{ duration: 1, ease: "linear", repeat: Infinity }}
      >
        <circle
          cx="12"
          cy="12"
          r="9"
          stroke="currentColor"
          strokeWidth="2"
          opacity="0.2"
        />
        <path
          d="M12 3a9 9 0 0 1 9 9"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </motion.svg>
    </span>
  );
}

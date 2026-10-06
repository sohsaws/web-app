"use client";

import { GraduationCap } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import type { ReactElement } from "react";

const BIO_HINT_ID = "bio-hint";

// Starts and ends on lavender so each loop restarts without a jump. Values
// come from the category tokens in globals.css.
const HINT_COLOR_CYCLE = [
  "var(--color-category-lavender)",
  "var(--color-category-navy)",
  "var(--color-category-emerald)",
  "var(--color-category-amber)",
  "var(--color-category-lavender)",
];
const HINT_COLOR_CYCLE_SECONDS = 6;

export function BioHint(): ReactElement {
  const reducedMotion = useReducedMotion();

  return (
    <span className="group relative inline-flex">
      <motion.button
        type="button"
        aria-label="What is the bio for?"
        aria-describedby={BIO_HINT_ID}
        animate={reducedMotion ? undefined : { color: HINT_COLOR_CYCLE }}
        transition={{
          duration: HINT_COLOR_CYCLE_SECONDS,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        className="inline-flex size-6 cursor-help items-center justify-center rounded-full
        text-category-lavender focus-visible:outline-2 focus-visible:outline-offset-2
        focus-visible:outline-white"
      >
        <GraduationCap aria-hidden="true" className="size-4" />
      </motion.button>
      <span
        id={BIO_HINT_ID}
        role="tooltip"
        className="pointer-events-none invisible absolute bottom-full left-0 z-20 mb-2 w-64 rounded-lg border 
        border-app-border bg-app-surface px-3 py-2 text-xs leading-5
         text-app-fg opacity-0 shadow-xl shadow-black/40 transition-opacity duration-150 
         group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100 
         motion-reduce:transition-none"
      >
        Your bio tells the AI what ideas to create. Describe your interests,
        hobbies, work and what you want to try. The more specific it is, the
        better your deck.
      </span>
    </span>
  );
}

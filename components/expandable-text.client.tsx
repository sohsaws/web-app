"use client";

import { ChevronDown } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { type ReactElement, useId, useState } from "react";

const sentenceSegmenter = new Intl.Segmenter("en", { granularity: "sentence" });
const PREVIEW_SENTENCE_COUNT = 2;

interface ExpandableTextProps {
  children: string;
  className?: string;
}

export function ExpandableText({
  children,
  className = "",
}: ExpandableTextProps): ReactElement {
  const [isExpanded, setIsExpanded] = useState(false);
  const contentId = useId();
  const reducedMotion = useReducedMotion();
  const sentences = Array.from(
    sentenceSegmenter.segment(children.trim()),
    ({ segment }) => segment,
  );
  const preview = sentences.slice(0, PREVIEW_SENTENCE_COUNT).join("").trimEnd();
  const remaining = sentences.slice(PREVIEW_SENTENCE_COUNT).join("").trim();
  const hasMore = remaining.length > 0;

  return (
    <div className={`min-w-0 wrap-anywhere ${className}`}>
      <p>
        {preview}
        {hasMore && !isExpanded && <span aria-hidden="true">...</span>}
      </p>
      {hasMore && (
        <>
          <motion.div
            id={contentId}
            initial={false}
            animate={{ height: isExpanded ? "auto" : 0 }}
            transition={{
              duration: reducedMotion ? 0 : 0.3,
              ease: "easeInOut",
            }}
            aria-hidden={!isExpanded}
            inert={!isExpanded}
            className="overflow-hidden"
          >
            <p>{remaining}</p>
          </motion.div>
          <button
            type="button"
            aria-controls={contentId}
            aria-expanded={isExpanded}
            aria-label={isExpanded ? "Show less text" : "Show full text"}
            onClick={(): void => setIsExpanded((current) => !current)}
            className="mx-auto mt-2 flex size-10 cursor-pointer items-center justify-center rounded-full text-white transition-colors hover:bg-app-glow focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:transition-none"
          >
            <motion.span
              aria-hidden="true"
              initial={false}
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: reducedMotion ? 0 : 0.3 }}
              className="flex"
            >
              <ChevronDown className="size-5" />
            </motion.span>
          </button>
        </>
      )}
    </div>
  );
}

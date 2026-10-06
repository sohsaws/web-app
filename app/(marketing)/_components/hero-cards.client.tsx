"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactElement } from "react";
import { MiniIdeaCard } from "@/components/mini-idea-card.client";
import type { FavoritePreviewCard } from "@/lib/config/favorites";

interface FanCard {
  card: FavoritePreviewCard;
  tone: "warm" | "cool" | "gold";
  x: string;
  y: number;
  rotate: number;
  layer: string;
}

const fanCards: readonly FanCard[] = [
  {
    card: {
      id: "landing-kyoto",
      title: "Kyoto in autumn",
      description:
        "Walk the temple paths at sunrise, before the crowds arrive.",
      categories: ["Travel", "Photography"],
      image: null,
    },
    tone: "cool",
    x: "-62%",
    y: 28,
    rotate: -10,
    layer: "z-10",
  },
  {
    card: {
      id: "landing-ramen",
      title: "Cook ramen from scratch",
      description:
        "Simmer a rich broth on Sunday and share bowls with friends.",
      categories: ["Cooking", "Friendship"],
      image: null,
    },
    tone: "gold",
    x: "62%",
    y: 28,
    rotate: 10,
    layer: "z-10",
  },
  {
    card: {
      id: "landing-focus",
      title: "Make room for better work",
      description:
        "Block two quiet hours a day and protect them like a meeting.",
      categories: ["Productivity", "Personal Growth"],
      image: null,
    },
    tone: "warm",
    x: "0%",
    y: 0,
    rotate: 0,
    layer: "z-20",
  },
];

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

export function HeroCards(): ReactElement {
  const reducedMotion = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none relative mx-auto h-52 w-full max-w-2xl select-none sm:h-72"
    >
      {fanCards.map(({ card, tone, x, y, rotate, layer }, index) => (
        <div
          key={card.id}
          className={`absolute inset-x-0 top-0 flex justify-center ${layer}`}
        >
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: y + 48 }}
            animate={{ opacity: 1, y }}
            transition={{
              delay: 0.5 + index * 0.12,
              duration: 0.9,
              ease: EASE_OUT,
            }}
            style={{ x, rotate }}
            className="w-40 sm:w-56"
          >
            <motion.div
              animate={reducedMotion ? undefined : { y: [0, -8, 0] }}
              transition={{
                duration: 6 + index,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              <MiniIdeaCard idea={card} tone={tone} />
            </motion.div>
          </motion.div>
        </div>
      ))}
    </div>
  );
}

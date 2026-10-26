"use client";

import { motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import type { ReactElement } from "react";
import { MiniIdeaCard } from "@/components/ideas/mini-idea-card.client";
import type { FavoritePreviewCard } from "@/lib/config/favorites";

// Title and description live in Marketing.heroCards.<messageKey>; categories
// stay English keys because IdeaCategories owns their display labels.
interface FanCard {
  id: string;
  messageKey: "kyoto" | "ramen" | "focus";
  categories: FavoritePreviewCard["categories"];
  tone: "warm" | "cool" | "gold";
  x: string;
  y: number;
  rotate: number;
  layer: string;
}

const fanCards: readonly FanCard[] = [
  {
    id: "landing-kyoto",
    messageKey: "kyoto",
    categories: ["Travel", "Photography"],
    tone: "cool",
    x: "-62%",
    y: 28,
    rotate: -10,
    layer: "z-10",
  },
  {
    id: "landing-ramen",
    messageKey: "ramen",
    categories: ["Cooking", "Friendship"],
    tone: "gold",
    x: "62%",
    y: 28,
    rotate: 10,
    layer: "z-10",
  },
  {
    id: "landing-focus",
    messageKey: "focus",
    categories: ["Productivity", "Personal Growth"],
    tone: "warm",
    x: "0%",
    y: 0,
    rotate: 0,
    layer: "z-20",
  },
];

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

export function HeroCards(): ReactElement {
  const t = useTranslations("Marketing.heroCards");
  const reducedMotion = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none relative mx-auto h-52 w-full max-w-2xl select-none sm:h-72"
    >
      {fanCards.map((fanCard, index) => {
        const { id, messageKey, categories, tone, x, y, rotate, layer } =
          fanCard;
        const card: FavoritePreviewCard = {
          id,
          title: t(`${messageKey}.title`),
          description: t(`${messageKey}.description`),
          categories,
          image: null,
        };

        return (
          <div
            key={id}
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
                className="will-change-transform"
              >
                <MiniIdeaCard idea={card} tone={tone} />
              </motion.div>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}

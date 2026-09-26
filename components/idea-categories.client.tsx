"use client";

import { type ReactElement, useEffect, useState } from "react";
import type { IdeaCategory } from "@/lib/config/categories-array";

const categoryColors = [
  "text-category-scarlet",
  "text-category-emerald",
  "text-category-navy",
  "text-category-lavender",
  "text-category-burgundy",
  "text-category-white",
  "text-category-amber",
  "text-category-orange",
  "text-category-pink",
] as const;

const sizeClasses = {
  default: {
    list: "mt-3 justify-center gap-2",
    item: "gap-2 px-3 py-1 text-xs",
  },
  compact: {
    list: "gap-1",
    item: "gap-1 px-2 py-0.5 text-[0.625rem]",
  },
} as const;

interface IdeaCategoriesProps {
  categories: readonly IdeaCategory[];
  size?: keyof typeof sizeClasses;
}

function generateUniqueRandoms(
  count: number,
  min: number,
  max: number,
): number[] {
  const uniqueNumbers = new Set<number>();

  const rangeSize = max - min + 1;
  if (count > rangeSize) {
    throw new Error("Count exceeds the available range of unique numbers");
  }

  while (uniqueNumbers.size < count) {
    const randomNumber = Math.floor(Math.random() * rangeSize) + min;
    uniqueNumbers.add(randomNumber);
  }

  return Array.from(uniqueNumbers);
}

export function IdeaCategories({
  categories,
  size = "default",
}: IdeaCategoriesProps): ReactElement | null {
  const [variants, setVariants] = useState<number[]>([]);
  const len = categories.length;

  useEffect(() => {
    setVariants(generateUniqueRandoms(len, 0, categoryColors.length - 1));
  }, [len]);

  if (len === 0) return null;

  return (
    <ul
      aria-label="Idea categories"
      className={`flex flex-wrap ${sizeClasses[size].list}`}
    >
      {categories.map((category, index) => (
        <li
          key={category}
          className={`inline-flex min-w-0 max-w-full items-center rounded-full border border-current bg-transparent font-medium ${sizeClasses[size].item} ${categoryColors[variants[index]]}`}
        >
          <span
            aria-hidden="true"
            className="size-1.5 shrink-0 rounded-full bg-current"
          />
          <span className="min-w-0 wrap-anywhere text-center">{category}</span>
        </li>
      ))}
    </ul>
  );
};

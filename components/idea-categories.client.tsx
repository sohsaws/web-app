"use client";

import { memo, type ReactElement, useEffect, useState } from "react";
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

interface IdeaCategoriesProps {
  categories: readonly IdeaCategory[];
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
}: IdeaCategoriesProps): ReactElement | null {
  const [variants, setVariants] = useState<number[]>([]);
  const len = categories.length;

  useEffect(() => {
    setVariants(generateUniqueRandoms(len, 0, categoryColors.length - 1));
  }, []);

  if (len === 0) return null;

  return (
    <ul
      aria-label="Idea categories"
      className="mt-3 flex flex-wrap justify-center gap-2"
    >
      {categories.map((category, index) => (
        <li
          key={category}
          className={`inline-flex min-w-0 max-w-full items-center gap-2 rounded-full border border-current bg-transparent px-3 py-1 text-xs font-medium ${categoryColors[variants[index]]}`}
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

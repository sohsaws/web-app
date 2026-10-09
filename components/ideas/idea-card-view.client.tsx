"use client";

import { Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import type { ReactElement, ReactNode } from "react";
import { ExpandableText } from "@/components/ui/expandable-text.client";
import { LoadingSpinner } from "@/components/ui/loading-spinner.client";
import type { IdeaCategory } from "@/lib/config/categories-array";

export interface IdeaCardViewProps {
  id: string;
  title: string;
  description: string;
  categories: readonly IdeaCategory[];
  image: string | null;
  isImagePending?: boolean;
  dragHandle?: ReactNode;
}

export function IdeaCardView({
  id,
  title,
  description,
  categories,
  image,
  isImagePending = false,
  dragHandle,
}: IdeaCardViewProps): ReactElement {
  return (
    <article
      data-card-id={id}
      className="relative flex w-full max-w-105 flex-col overflow-hidden rounded-3xl border border-app-border bg-linear-to-b from-app-surface to-app-bg shadow-2xl shadow-black/40"
    >
      <div className="relative isolate aspect-475/390 w-full shrink-0 overflow-hidden">
        {image ? (
          <Image
            src={image}
            alt={`Illustration for ${title}`}
            fill
            unoptimized
            draggable={false}
            sizes="(max-width: 420px) 100vw, 420px"
            className="-z-20 object-cover"
          />
        ) : (
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-20 bg-linear-to-b from-[#211c1a] to-[#0e0e10]"
          />
        )}

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-t from-app-surface via-transparent to-transparent"
        />

        {isImagePending ? (
          <LoadingSpinner
            label="Generating illustration..."
            className="pointer-events-none absolute top-1/2 left-1/2 size-12 -translate-x-1/2 -translate-y-1/2"
          />
        ) : !image ? (
          <ImageIcon
            aria-hidden="true"
            strokeWidth={1.5}
            className="pointer-events-none absolute top-1/2 left-1/2 size-16 -translate-x-1/2 -translate-y-1/2 text-white"
          />
        ) : null}
        {dragHandle}
      </div>

      <div className="min-h-72 w-full min-w-0 cursor-text select-text px-6 pt-2 pb-6">
        {categories.length > 0 ? (
          <p className="flex items-center gap-3 text-[0.6875rem] font-medium tracking-[0.2em] text-neutral-400 uppercase">
            <span
              aria-hidden="true"
              className="h-px w-6 shrink-0 bg-app-action-skip"
            />
            <span className="min-w-0">{categories.join(" · ")}</span>
          </p>
        ) : null}
        <h2 className="mt-4 wrap-anywhere font-serif text-3xl leading-[1.05] tracking-tight text-white sm:text-[2rem]">
          {title}
        </h2>
        <ExpandableText
          key={`${id}:${description}`}
          className="mt-4 text-sm leading-6 font-light text-neutral-300"
        >
          {description}
        </ExpandableText>
      </div>
    </article>
  );
}

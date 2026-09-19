"use client";

import { Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import type { ReactElement, ReactNode } from "react";
import { ExpandableText } from "@/components/expandable-text.client";
import { LoadingSpinner } from "@/components/loading-spinner.client";
import { useIdeaImage } from "@/hooks/use-idea-image";

export interface IdeaCardProps {
  id: string;
  description: string;
  title: string;
  dragHandle?: ReactNode;
}

export function IdeaCard({
  id,
  description,
  title,
  dragHandle,
}: IdeaCardProps): ReactElement {
  const { image, isPending, error } = useIdeaImage(id, description);

  return (
    <article
      data-card-id={id}
      className="relative flex w-full max-w-105 flex-col overflow-hidden rounded-2xl border border-white/20 bg-app-bg"
    >
      <div className="relative isolate aspect-475/390 w-full shrink-0 overflow-hidden">
        {image && !error ? (
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
          className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-t from-app-bg via-transparent to-transparent"
        />

        {isPending ? (
          <LoadingSpinner
            label="Generating illustration..."
            className="pointer-events-none absolute top-1/2 left-1/2 size-12 -translate-x-1/2 -translate-y-1/2"
          />
        ) : error || !image ? (
          <ImageIcon
            aria-hidden="true"
            strokeWidth={1.5}
            className="pointer-events-none absolute top-1/2 left-1/2 size-16 -translate-x-1/2 -translate-y-1/2 text-white"
          />
        ) : null}
        {dragHandle}
      </div>

      <div className="aspect-475/260 min-w-0 w-full shrink-0 cursor-text select-text px-4 pt-4 pb-6 sm:px-5">
        <h2 className="wrap-anywhere font-serif text-xl leading-tight text-white sm:text-2xl">
          {title}
        </h2>
        <ExpandableText
          key={`${id}:${description}`}
          className="mt-4 text-sm leading-6 text-app-fg sm:text-base"
        >
          {description}
        </ExpandableText>
      </div>
    </article>
  );
}

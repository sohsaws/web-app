"use client";

import { Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import type { ReactElement } from "react";

export interface IdeaCardProps {
  id: string;
  image?: string;
  description: string;
  title: string;
}

export function IdeaCard({
  id,
  image,
  description,
  title,
}: IdeaCardProps): ReactElement {
  return (
    <article
      data-card-id={id}
      className="relative isolate flex aspect-475/650 w-full max-w-105 overflow-hidden rounded-2xl border border-white/20 bg-app-bg"
    >
      {image ? (
        <Image
          src={image}
          alt={`Illustration for ${title}`}
          fill
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
        className="absolute inset-0 -z-10 bg-linear-to-t from-black via-black/35 to-transparent"
      />

      {!image && (
        <ImageIcon
          aria-hidden="true"
          strokeWidth={1.5}
          className="absolute top-2/5 left-1/2 size-16 -translate-x-1/2 -translate-y-1/2 text-white"
        />
      )}

      <div className="mt-auto min-w-0 sm:p-14">
        <h2 className="wrap-break-word font-serif leading-tight text-white sm:text-2xl">
          {title}
        </h2>
        <p className="mt-5 wrap-break-word leading-6 text-app-fg sm:text-sm">
          {description}
        </p>
      </div>
    </article>
  );
}

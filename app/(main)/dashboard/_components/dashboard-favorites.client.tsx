"use client";

import { Bookmark } from "lucide-react";
import Link from "next/link";
import type { ReactElement } from "react";
import { IdeasStack } from "@/components/ideas-stack.client";
import { LoadingSpinner } from "@/components/loading-spinner.client";
import { Widget } from "@/components/widget.client";
import { useFavoritesPreview } from "@/hooks/use-favorites-preview";

interface DashboardFavoritesProps {
  userId: string;
}

export function DashboardFavorites({
  userId,
}: DashboardFavoritesProps): ReactElement {
  const { data, isPending, isFetching, error, refetch } = useFavoritesPreview(userId);
  const total = data?.total;

  return (
    <section
      aria-label="Your saved ideas"
      className="grid items-start gap-5 sm:grid-cols-[minmax(0,17.5rem)_minmax(0,21rem)]"
    >
      <Widget className="p-6">
        <h2 className="text-xs tracking-widest text-app-muted uppercase">
          Saved ideas
        </h2>
        <div className="mt-3" aria-live="polite">
          {isPending ? (
            <LoadingSpinner label="Loading saved ideas count..." />
          ) : (
            <p className="font-serif text-4xl leading-none text-white">
              {total === undefined ? "—" : total.toLocaleString("en-US")}
            </p>
          )}
        </div>
        <p className="mt-3 text-xs text-app-muted">
          {error ? "Unable to refresh your collection" : "In your collection"}
        </p>
      </Widget>

      <Widget className="p-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xs tracking-widest text-app-muted uppercase">
            Your pocket
          </h2>
          <Bookmark
            aria-hidden="true"
            className="size-4 text-app-action-skip"
          />
        </div>
        <p className="mt-4 font-serif text-2xl leading-tight text-white">
          A little saved for later.
        </p>

        {isPending ? (
          <div className="flex min-h-60 items-center justify-center">
            <LoadingSpinner label="Loading your saved ideas..." />
          </div>
        ) : data ? (
          <IdeasStack cards={data.cards} />
        ) : null}

        {error ? (
          <div role="alert" className="my-6 space-y-3 text-sm text-app-muted">
            <p>
              {data
                ? "Could not refresh saved ideas."
                : "Could not load saved ideas."}
            </p>
            <button
              type="button"
              disabled={isFetching}
              onClick={(): void => {
                void refetch();
              }}
              className="min-h-10 rounded-md border border-app-border px-4 text-white transition-colors hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white disabled:opacity-50"
            >
              {isFetching ? "Retrying..." : "Try again"}
            </button>
          </div>
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-app-border pt-4 text-xs">
          <p className="text-app-muted" aria-live="polite">
            {total === undefined
              ? "Your favorites"
              : `${total} ${total === 1 ? "idea" : "ideas"} saved`}
          </p>
          <Link
            href="/dive"
            className="inline-flex min-h-10 items-center rounded-sm text-white transition-colors hover:text-app-action-favorite focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            Discover ideas
          </Link>
        </div>
      </Widget>
    </section>
  );
}

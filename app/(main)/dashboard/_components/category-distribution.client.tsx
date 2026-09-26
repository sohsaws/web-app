"use client";

import type { ReactElement } from "react";
import { LoadingSpinner } from "@/components/loading-spinner.client";
import { Widget } from "@/components/widget.client";
import { useCategoryDistribution } from "@/hooks/use-category-distribution";

interface CategoryDistributionProps {
  userId: string;
}

export function CategoryDistribution({
  userId,
}: CategoryDistributionProps): ReactElement {
  const { data, isPending, isFetching, error, refetch } = useCategoryDistribution(userId);

  return (
    <Widget className="flex min-h-96 flex-col self-stretch p-6 sm:col-span-2 xl:col-span-1">
      <h2 className="text-xs tracking-widest text-app-muted uppercase">
        Your interests
      </h2>
      <p className="mt-4 font-serif text-2xl leading-tight text-white">
        A little more you.
      </p>
      <p className="mt-3 text-xs leading-5 text-app-muted">
        Category distribution across your saved ideas.
      </p>

      {isPending ? (
        <div className="flex min-h-48 flex-1 items-center justify-center">
          <LoadingSpinner label="Loading your category distribution..." />
        </div>
      ) : data && data.length > 0 ? (
        <div
          role="region"
          aria-label="Category distribution"
          tabIndex={0}
          className="my-6 max-h-72 overflow-y-auto rounded-sm pr-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          <ul className="space-y-5">
            {data.map(({ category, percentage }) => (
              <li key={category}>
                <div className="flex items-start justify-between gap-4 text-sm">
                  <span className="min-w-0 wrap-anywhere">{category}</span>
                  <span className="shrink-0 font-medium text-white tabular-nums">
                    {percentage.toLocaleString("en-US", {
                      maximumFractionDigits: 1,
                    })}
                    %
                  </span>
                </div>
                <div
                  aria-hidden="true"
                  className="mt-2 h-1.5 overflow-hidden rounded-full bg-app-border"
                >
                  <div
                    className="h-full rounded-full bg-app-action-favorite"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : data ? (
        <p className="flex-1 py-12 text-sm leading-6 text-app-muted">
          Save ideas with categories to see your interests here.
        </p>
      ) : null}

      {error ? (
        <div role="alert" className="my-6 space-y-3 text-sm text-app-muted">
          <p>
            {data
              ? "Could not refresh categories. Showing the last loaded data."
              : "Could not load your categories."}
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

      <p className="mt-auto border-t border-app-border pt-4 text-xs leading-5 text-app-muted">
        Each category assignment counts equally. Percentages are rounded.
      </p>
    </Widget>
  );
}

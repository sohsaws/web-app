"use client";

import { Bookmark } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import type { ReactElement } from "react";
import { useCarouselStore } from "@/app/stores/carousel-store";
import { Carousel } from "@/components/ideas/carousel.client";
import { IdeasStack } from "@/components/ideas/ideas-stack.client";
import { LoadingSpinner } from "@/components/ui/loading-spinner.client";
import { Widget } from "@/components/ui/widget.client";
import { useFavoritesPreview } from "@/hooks/ideas/use-favorites-preview";
import { Link } from "@/i18n/navigation";
import { CategoryDistribution } from "./category-distribution.client";
import { YouWouldLike } from "./you-would-like.client";

interface DashboardFavoritesProps {
  userId: string;
}

export function DashboardFavorites({
  userId,
}: DashboardFavoritesProps): ReactElement {
  const { data, isPending, isFetching, error, refetch } =
    useFavoritesPreview(userId);
  const total = data?.total;
  const openCarousel = useCarouselStore((state) => state.open);
  const t = useTranslations("Dashboard");
  const tCommon = useTranslations("Common");
  const format = useFormatter();

  return (
    <section
      aria-label={t("favorites.sectionLabel")}
      className="grid items-start gap-5 sm:grid-cols-2 xl:grid-cols-[minmax(0,17.5rem)_minmax(0,21rem)_minmax(0,1fr)]"
    >
      <div className="flex flex-col gap-5 self-stretch">
        <Widget className="p-6">
          <h2 className="text-xs tracking-widest text-app-muted uppercase">
            {t("metrics.savedIdeasTitle")}
          </h2>
          <div className="mt-3" aria-live="polite">
            {isPending ? (
              <LoadingSpinner label={t("metrics.savedIdeasLoading")} />
            ) : (
              <p className="font-serif text-4xl leading-none text-white">
                {total === undefined ? "—" : format.number(total)}
              </p>
            )}
          </div>
          <p className="mt-3 text-xs text-app-muted">
            {error
              ? t("metrics.savedIdeasRefreshError")
              : t("metrics.savedIdeasCaption")}
          </p>
        </Widget>
        <YouWouldLike />
      </div>

      <Widget className="p-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xs tracking-widest text-app-muted uppercase">
            {t("favorites.title")}
          </h2>
          <Bookmark
            aria-hidden="true"
            className="size-4 text-app-action-skip"
          />
        </div>
        <p className="mt-4 font-serif text-2xl leading-tight text-white">
          {t("favorites.tagline")}
        </p>

        {isPending ? (
          <div className="flex min-h-60 items-center justify-center">
            <LoadingSpinner label={t("favorites.loading")} />
          </div>
        ) : data ? (
          <>
            <IdeasStack cards={data.cards} onOpen={openCarousel} />
            <Carousel items={data.cards} />
          </>
        ) : null}

        {error ? (
          <div role="alert" className="my-6 space-y-3 text-sm text-app-muted">
            <p>
              {data ? t("favorites.refreshError") : t("favorites.loadError")}
            </p>
            <button
              type="button"
              disabled={isFetching}
              onClick={(): void => {
                void refetch();
              }}
              className="min-h-10 rounded-md border border-app-border px-4 text-white transition-colors hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white disabled:opacity-50"
            >
              {isFetching
                ? tCommon("status.retrying")
                : tCommon("actions.tryAgain")}
            </button>
          </div>
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-app-border pt-4 text-xs">
          <p className="text-app-muted" aria-live="polite">
            {total === undefined
              ? t("favorites.countUnknown")
              : t("favorites.count", { count: total })}
          </p>
          <Link
            href="/dive"
            className="inline-flex min-h-10 items-center rounded-sm text-white transition-colors hover:text-app-action-favorite focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            {t("favorites.discoverIdeas")}
          </Link>
        </div>
      </Widget>
      <CategoryDistribution userId={userId} />
    </section>
  );
}

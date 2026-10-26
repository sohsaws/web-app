"use client";

import { useTranslations } from "next-intl";
import type { ReactElement } from "react";
import { Widget } from "@/components/ui/widget.client";

export function YouWouldLike(): ReactElement {
  const t = useTranslations("Dashboard.youWouldLike");

  return (
    <Widget className="flex min-h-48 flex-1 flex-col p-6">
      <h2 className="text-xs tracking-widest text-app-muted uppercase">
        {t("title")}
      </h2>
      <div className="flex flex-1 items-center justify-center py-6">
        <p className="animate-pulse text-sm tracking-wide text-app-muted motion-reduce:animate-none">
          {t("comingSoon")}
        </p>
      </div>
    </Widget>
  );
}

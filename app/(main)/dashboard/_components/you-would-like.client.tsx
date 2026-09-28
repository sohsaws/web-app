"use client";

import type { ReactElement } from "react";
import { Widget } from "@/components/widget.client";

export function YouWouldLike(): ReactElement {
  return (
    <Widget className="flex min-h-48 flex-1 flex-col p-6">
      <h2 className="text-xs tracking-widest text-app-muted uppercase">
        You'd like
      </h2>
      <div className="flex flex-1 items-center justify-center py-6">
        <p className="animate-pulse text-sm tracking-wide text-app-muted motion-reduce:animate-none">
          Coming soon...
        </p>
      </div>
    </Widget>
  );
}

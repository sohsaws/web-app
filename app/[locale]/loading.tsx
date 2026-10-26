import type { ReactElement } from "react";
import { LoadingIndicator } from "@/components/ui/loading-indicator.server";

export default function Loading(): ReactElement {
  return (
    <div className="relative z-10 flex min-h-dvh w-full items-center justify-center px-4">
      <LoadingIndicator />
    </div>
  );
}

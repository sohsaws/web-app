import type { ReactElement } from "react";
import { LoadingIndicator } from "@/components/ui/loading-indicator.server";

// Renders below the fixed app header, so the top padding matches the pages.
export default function MainLoading(): ReactElement {
  return (
    <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-7xl items-center justify-center px-6 pt-32 pb-20">
      <LoadingIndicator />
    </div>
  );
}

import type { ReactElement } from "react";
import { LoadingIndicator } from "@/components/ui/loading-indicator.server";

// Takes the page's place next to the settings sidebar.
export default function SettingsLoading(): ReactElement {
  return (
    <div className="flex min-h-96 min-w-0 flex-1 items-center justify-center px-4 sm:px-10">
      <LoadingIndicator />
    </div>
  );
}

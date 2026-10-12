import { toast } from "sonner";
import { formatRetryAfter } from "@/lib/utils/retry-after";

// Every card loads its own image, so several requests can hit the limit at
// once; one shared toast id updates a single toast instead of stacking many.
const RATE_LIMIT_TOAST_ID = "rate-limit";

export function showRateLimitToast(retryAfterSeconds: number): void {
  toast.error(
    `You've reached the hourly limit. Try again in ${formatRetryAfter(retryAfterSeconds)}.`,
    { id: RATE_LIMIT_TOAST_ID },
  );
}

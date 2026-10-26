import { toast } from "sonner";

// Every card loads its own image, so several requests can hit the limit at
// once; one shared toast id updates a single toast instead of stacking many.
const RATE_LIMIT_TOAST_ID = "rate-limit";

// A plain function, callable from mutation callbacks, so it cannot use
// next-intl hooks: callers pass the text from useRateLimitMessage.
export function showRateLimitToast(message: string): void {
  toast.error(message, { id: RATE_LIMIT_TOAST_ID });
}

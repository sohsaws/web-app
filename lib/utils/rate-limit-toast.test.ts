import { describe, expect, it, vi } from "vitest";
import { showRateLimitToast } from "./rate-limit-toast";

const { toastError } = vi.hoisted(() => ({ toastError: vi.fn() }));

vi.mock("sonner", () => ({ toast: { error: toastError } }));

describe("showRateLimitToast", () => {
  it("shows the text the caller translated", () => {
    showRateLimitToast("Try again in 2 minutes.");

    expect(toastError).toHaveBeenCalledWith(
      "Try again in 2 minutes.",
      expect.anything(),
    );
  });

  it("reuses one toast id so parallel 429s update a single toast", () => {
    showRateLimitToast("Try again in 1 minute.");
    showRateLimitToast("Try again in 60 minutes.");

    const ids = toastError.mock.calls.map(([, options]) => options?.id);
    expect(ids).toHaveLength(2);
    expect(ids[0]).toBeTruthy();
    expect(ids[1]).toBe(ids[0]);
  });
});

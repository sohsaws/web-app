import { describe, expect, it, vi } from "vitest";
import { showRateLimitToast } from "./rate-limit-toast";

const { toastError } = vi.hoisted(() => ({ toastError: vi.fn() }));

vi.mock("sonner", () => ({ toast: { error: toastError } }));

describe("showRateLimitToast", () => {
  it("tells the user how long to wait", () => {
    showRateLimitToast(90);

    expect(toastError).toHaveBeenCalledWith(
      "You've reached the hourly limit. Try again in 2 minutes.",
      expect.anything(),
    );
  });

  it("reuses one toast id so parallel 429s update a single toast", () => {
    showRateLimitToast(30);
    showRateLimitToast(3600);

    const ids = toastError.mock.calls.map(([, options]) => options?.id);
    expect(ids).toHaveLength(2);
    expect(ids[0]).toBeTruthy();
    expect(ids[1]).toBe(ids[0]);
  });
});

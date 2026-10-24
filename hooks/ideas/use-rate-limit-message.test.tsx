import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { IntlTestProvider } from "@/test-utils/intl-test-provider";
import { useRateLimitMessage } from "./use-rate-limit-message";

function renderMessageHook() {
  return renderHook(() => useRateLimitMessage(), {
    wrapper: IntlTestProvider,
  });
}

describe("useRateLimitMessage", () => {
  it.each([
    [1, "1 minute"],
    [60, "1 minute"],
    [61, "2 minutes"],
    [3600, "60 minutes"],
  ])("rounds %i seconds up to %s", (seconds, expected) => {
    const { result } = renderMessageHook();

    expect(result.current(seconds)).toBe(
      `You've reached the hourly limit. Try again in ${expected}.`,
    );
  });

  it("never tells the user to wait 0 minutes", () => {
    const { result } = renderMessageHook();

    expect(result.current(0)).toBe(
      "You've reached the hourly limit. Try again in 1 minute.",
    );
  });

  it("returns the same function across renders", () => {
    const { result, rerender } = renderMessageHook();
    const first = result.current;

    rerender();

    expect(result.current).toBe(first);
  });
});

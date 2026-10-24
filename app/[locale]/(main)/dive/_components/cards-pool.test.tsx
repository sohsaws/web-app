import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ApiResponseError, RateLimitError } from "@/lib/utils/responseError";
import { IntlTestProvider } from "@/test-utils/intl-test-provider";
import { CardsPool } from "./cards-pool.client";

const { useGeneratePackIdeas, generate } = vi.hoisted(() => ({
  useGeneratePackIdeas: vi.fn(),
  generate: vi.fn(),
}));

vi.mock("@/hooks/ideas/use-generate-pack-ideas", () => ({
  useGeneratePackIdeas,
}));

vi.mock("@/hooks/ideas/use-save-favorite", () => ({
  useSaveFavorite: () => ({ save: vi.fn() }),
}));

function renderEmptyDeck(error: Error | null, isPending = false) {
  useGeneratePackIdeas.mockReturnValue({
    generate,
    regenerate: vi.fn(),
    isPending,
    isRegenerating: false,
    error,
  });
  render(<CardsPool userBio="I like hiking" />, { wrapper: IntlTestProvider });
}

describe("CardsPool", () => {
  it("shows a loading state while the first deck is generated", () => {
    renderEmptyDeck(null, true);

    expect(screen.getByRole("status")).toHaveTextContent("Generating ideas");
  });

  it("names the wait time when the hourly limit is reached", () => {
    renderEmptyDeck(new RateLimitError("Too many requests", 61));

    expect(screen.getByText("Couldn't shuffle")).toBeInTheDocument();
    expect(
      screen.getByText(
        "You've reached the hourly limit. Try again in 2 minutes.",
      ),
    ).toBeInTheDocument();
  });

  it("uses the singular for a wait of one minute", () => {
    renderEmptyDeck(new RateLimitError("Too many requests", 30));

    expect(
      screen.getByText(
        "You've reached the hourly limit. Try again in 1 minute.",
      ),
    ).toBeInTheDocument();
  });

  it("offers a retry after any other generation error", async () => {
    renderEmptyDeck(new ApiResponseError("Upstream failed", null));

    expect(
      screen.getByText("Something went wrong while generating ideas."),
    ).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Try again" }));

    expect(generate).toHaveBeenCalledTimes(1);
  });
});

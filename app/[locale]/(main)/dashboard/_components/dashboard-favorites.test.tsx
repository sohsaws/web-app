import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { FavoritesPreview } from "@/lib/config/favorites";
import { IntlTestProvider } from "@/test-utils/intl-test-provider";
import { DashboardFavorites } from "./dashboard-favorites.client";

// Only the fields the section reads; the real hook returns a full query result.
interface FavoritesQueryState {
  data: FavoritesPreview | undefined;
  isPending: boolean;
  isFetching: boolean;
  error: Error | null;
  refetch: () => Promise<unknown>;
}

const { useFavoritesPreview } = vi.hoisted(() => ({
  useFavoritesPreview: vi.fn<() => FavoritesQueryState>(),
}));

vi.mock("@/hooks/ideas/use-favorites-preview", () => ({
  useFavoritesPreview,
}));
// The stack, carousel and category widget have their own data and tests;
// this file checks the section's own text.
vi.mock("@/components/ideas/ideas-stack.client", () => ({
  IdeasStack: () => null,
}));
vi.mock("@/components/ideas/carousel.client", () => ({
  Carousel: () => null,
}));
vi.mock("./category-distribution.client", () => ({
  CategoryDistribution: () => null,
}));

function renderSection(state: Partial<FavoritesQueryState>) {
  useFavoritesPreview.mockReturnValue({
    data: undefined,
    isPending: false,
    isFetching: false,
    error: null,
    refetch: vi.fn().mockResolvedValue(undefined),
    ...state,
  });
  return render(<DashboardFavorites userId="user-1" />, {
    wrapper: IntlTestProvider,
  });
}

describe("DashboardFavorites", () => {
  it("labels the section and links to the deck", () => {
    renderSection({ isPending: true });

    expect(
      screen.getByRole("region", { name: "Your saved ideas" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Discover ideas" }),
    ).toHaveAttribute("href", "/en/dive");
    expect(screen.getByText("Your favorites")).toBeInTheDocument();
  });

  it("formats the saved total and pluralizes the footer", () => {
    renderSection({ data: { total: 1234, cards: [] } });

    expect(screen.getByText("1,234")).toBeInTheDocument();
    expect(screen.getByText("1,234 ideas saved")).toBeInTheDocument();
    expect(screen.getByText("In your collection")).toBeInTheDocument();
  });

  it("uses the singular for one saved idea", () => {
    renderSection({ data: { total: 1, cards: [] } });

    expect(screen.getByText("1 idea saved")).toBeInTheDocument();
  });

  it("reports a failed first load with a retry button", () => {
    renderSection({ error: new Error("Unable to load saved ideas") });

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Could not load saved ideas.",
    );
    expect(
      screen.getByText("Unable to refresh your collection"),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Try again" })).toBeEnabled();
  });
});

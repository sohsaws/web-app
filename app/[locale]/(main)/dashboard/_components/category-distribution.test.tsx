import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { CategoryDistribution as CategoryDistributionData } from "@/lib/config/category-distribution";
import { IntlTestProvider } from "@/test-utils/intl-test-provider";
import { CategoryDistribution } from "./category-distribution.client";

// Only the fields the widget reads; the real hook returns a full query result.
interface CategoryQueryState {
  data: CategoryDistributionData | undefined;
  isPending: boolean;
  isFetching: boolean;
  error: Error | null;
  refetch: () => Promise<unknown>;
}

const { useCategoryDistribution } = vi.hoisted(() => ({
  useCategoryDistribution: vi.fn<() => CategoryQueryState>(),
}));

vi.mock("@/hooks/ideas/use-category-distribution", () => ({
  useCategoryDistribution,
}));

function renderWidget(state: Partial<CategoryQueryState>) {
  useCategoryDistribution.mockReturnValue({
    data: undefined,
    isPending: false,
    isFetching: false,
    error: null,
    refetch: vi.fn().mockResolvedValue(undefined),
    ...state,
  });
  return render(<CategoryDistribution userId="user-1" />, {
    wrapper: IntlTestProvider,
  });
}

describe("CategoryDistribution", () => {
  it("announces loading while the distribution is pending", () => {
    renderWidget({ isPending: true });

    expect(screen.getByRole("status")).toHaveTextContent(
      "Loading your category distribution...",
    );
  });

  it("shows each category with its rounded percentage", () => {
    renderWidget({
      data: [
        { category: "Sport", percentage: 66.66 },
        { category: "Music", percentage: 33.34 },
      ],
    });

    const region = screen.getByRole("region", {
      name: "Category distribution",
    });
    expect(region).toHaveTextContent("Sport66.7%");
    expect(region).toHaveTextContent("Music33.3%");
  });

  it("explains the empty state when no saved idea has categories", () => {
    renderWidget({ data: [] });

    expect(
      screen.getByText(
        "Save ideas with categories to see your interests here.",
      ),
    ).toBeInTheDocument();
  });

  it("offers a retry when the first load fails", async () => {
    const refetch = vi.fn().mockResolvedValue(undefined);
    renderWidget({ error: new Error("Unable to load categories"), refetch });

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Could not load your categories.",
    );
    await userEvent.click(screen.getByRole("button", { name: "Try again" }));

    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it("keeps the last data and disables the retry while refetching", () => {
    renderWidget({
      data: [{ category: "Sport", percentage: 100 }],
      error: new Error("Unable to load categories"),
      isFetching: true,
    });

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Could not refresh categories. Showing the last loaded data.",
    );
    expect(screen.getByRole("button", { name: "Retrying..." })).toBeDisabled();
    expect(screen.getByText("Sport")).toBeInTheDocument();
  });
});

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { FavoritePreviewCard } from "@/lib/config/favorites";
import { IntlTestProvider } from "@/test-utils/intl-test-provider";
import { IdeasStack } from "./ideas-stack.client";

const CARD: FavoritePreviewCard = {
  id: "card-1",
  title: "Night hike",
  description: "Walk a trail at dusk.",
  categories: [],
  image: null,
};

describe("IdeasStack", () => {
  it("invites the user to save a card when the collection is empty", () => {
    render(<IdeasStack cards={[]} />, { wrapper: IntlTestProvider });

    expect(
      screen.getByText(
        "No saved ideas yet. Favorite a card in Dive to start your collection.",
      ),
    ).toBeInTheDocument();
  });

  it("lists saved cards and opens them on click", async () => {
    const onOpen = vi.fn();
    render(<IdeasStack cards={[CARD]} onOpen={onOpen} />, {
      wrapper: IntlTestProvider,
    });

    expect(
      screen.getByRole("list", { name: "Recently saved ideas" }),
    ).toBeInTheDocument();
    // A card without categories shows the "Favorite" label instead.
    expect(screen.getByText("Favorite")).toBeInTheDocument();

    await userEvent.click(
      screen.getByRole("button", { name: "Open saved ideas" }),
    );

    expect(onOpen).toHaveBeenCalledTimes(1);
  });

  it("labels the category list of a card", () => {
    render(<IdeasStack cards={[{ ...CARD, categories: ["Astronomy"] }]} />, {
      wrapper: IntlTestProvider,
    });

    expect(
      screen.getByRole("list", { name: "Idea categories" }),
    ).toHaveTextContent("Astronomy");
  });
});

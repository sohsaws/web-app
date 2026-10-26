import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { useCarouselStore } from "@/app/stores/carousel-store";
import { IntlTestProvider } from "@/test-utils/intl-test-provider";
import { Carousel, type CarouselItem } from "./carousel.client";

function item(id: string): CarouselItem {
  return {
    id,
    title: `Idea ${id}`,
    description: "Created by a test.",
    categories: [],
    image: null,
  };
}

const ITEMS = [item("1"), item("2"), item("3")];

beforeEach(() => {
  useCarouselStore.setState({ isOpen: false });
});

function renderOpenCarousel() {
  render(<Carousel items={ITEMS} />, { wrapper: IntlTestProvider });
  act(() => useCarouselStore.getState().open());
}

describe("Carousel", () => {
  it("opens as a labelled dialog at the first idea", () => {
    renderOpenCarousel();

    expect(
      screen.getByRole("dialog", { name: "Ideas carousel" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("list", { name: "Ideas" })).toBeInTheDocument();
    expect(screen.getByText("1 / 3")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Previous idea" }),
    ).toBeDisabled();
  });

  it("moves to the next idea", async () => {
    renderOpenCarousel();

    await userEvent.click(screen.getByRole("button", { name: "Next idea" }));

    expect(screen.getByText("2 / 3")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Previous idea" })).toBeEnabled();
  });

  it("closes from the close button", async () => {
    renderOpenCarousel();

    await userEvent.click(
      screen.getByRole("button", { name: "Close carousel" }),
    );

    expect(useCarouselStore.getState().isOpen).toBe(false);
  });
});

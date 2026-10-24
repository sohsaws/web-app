import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { IntlTestProvider } from "@/test-utils/intl-test-provider";
import { IdeaCardActions } from "./idea-card-actions.client";

describe("IdeaCardActions", () => {
  it("labels the skip and favorite buttons and calls their handlers", async () => {
    const onSkip = vi.fn();
    const onFavorite = vi.fn();
    render(<IdeaCardActions onSkip={onSkip} onFavorite={onFavorite} />, {
      wrapper: IntlTestProvider,
    });

    await userEvent.click(screen.getByRole("button", { name: "Skip idea" }));
    await userEvent.click(
      screen.getByRole("button", { name: "Favorite idea" }),
    );

    expect(onSkip).toHaveBeenCalledTimes(1);
    expect(onFavorite).toHaveBeenCalledTimes(1);
  });

  it("keeps restore disabled when there is no previous card", () => {
    render(<IdeaCardActions />, { wrapper: IntlTestProvider });

    expect(
      screen.getByRole("button", { name: "Restore previous idea" }),
    ).toBeDisabled();
  });

  it("explains that favorites are unavailable without a handler", () => {
    render(<IdeaCardActions />, { wrapper: IntlTestProvider });

    expect(
      screen.getByRole("button", { name: "Favorite idea" }),
    ).toHaveAttribute("title", "Favorites coming soon");
  });
});

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { IntlTestProvider } from "@/test-utils/intl-test-provider";
import { RegenerateDeckButton } from "./regenerate-deck-button.client";

describe("RegenerateDeckButton", () => {
  it("asks for a new deck when clicked", async () => {
    const onRegenerate = vi.fn();
    render(
      <RegenerateDeckButton
        onRegenerate={onRegenerate}
        isPending={false}
        isRegenerating={false}
      />,
      { wrapper: IntlTestProvider },
    );

    await userEvent.click(
      screen.getByRole("button", { name: "Shuffle a new deck" }),
    );

    expect(onRegenerate).toHaveBeenCalledTimes(1);
  });

  it("cannot be clicked while any deck request is in flight", async () => {
    const onRegenerate = vi.fn();
    render(
      <RegenerateDeckButton
        onRegenerate={onRegenerate}
        isPending
        isRegenerating={false}
      />,
      { wrapper: IntlTestProvider },
    );
    const button = screen.getByRole("button", { name: "Shuffle a new deck" });

    await userEvent.click(button);

    // A silent top-up keeps the normal label but still blocks a second paid
    // request.
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "false");
    expect(onRegenerate).not.toHaveBeenCalled();
  });

  it("tells assistive technology that a new deck is on its way", () => {
    render(
      <RegenerateDeckButton onRegenerate={vi.fn()} isPending isRegenerating />,
      { wrapper: IntlTestProvider },
    );

    const button = screen.getByRole("button", {
      name: "Shuffling a new deck…",
    });
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(button).toBeDisabled();
  });
});

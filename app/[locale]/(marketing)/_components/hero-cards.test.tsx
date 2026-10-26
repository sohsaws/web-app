import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { IntlTestProvider } from "@/test-utils/intl-test-provider";
import { HeroCards } from "./hero-cards.client";

describe("HeroCards", () => {
  it("shows every sample idea with its translated title and description", () => {
    render(<HeroCards />, { wrapper: IntlTestProvider });

    // The fan is decorative (aria-hidden), so it is queried by text, not role.
    expect(screen.getByText("Kyoto in autumn")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Walk the temple paths at sunrise, before the crowds arrive.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("Cook ramen from scratch")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Simmer a rich broth on Sunday and share bowls with friends.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("Make room for better work")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Block two quiet hours a day and protect them like a meeting.",
      ),
    ).toBeInTheDocument();
  });
});

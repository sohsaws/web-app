import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { IntlTestProvider } from "@/test-utils/intl-test-provider";
import { type TokenStatus, TokenStatusCard } from "./token-status-card.client";

describe("TokenStatusCard", () => {
  it.each<[TokenStatus, string, string]>([
    ["success", "Success", "Redirecting you back in a moment..."],
    [
      "invalid_token",
      "Invalid link",
      "This link is invalid. Please request a new one.",
    ],
    [
      "expired_token",
      "Link expired",
      "This link has expired. Please request a new one.",
    ],
  ])("shows the %s texts", (status, title, description) => {
    render(<TokenStatusCard status={status} />, { wrapper: IntlTestProvider });

    expect(screen.getByRole("heading", { name: title })).toBeInTheDocument();
    expect(screen.getByText(description)).toBeInTheDocument();
  });
});

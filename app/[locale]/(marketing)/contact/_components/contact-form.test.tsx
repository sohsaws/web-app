import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { IntlTestProvider } from "@/test-utils/intl-test-provider";
import { ContactForm } from "./contact-form.client";

describe("ContactForm", () => {
  it("labels every field and the submit button with translated text", () => {
    render(<ContactForm />, { wrapper: IntlTestProvider });

    expect(
      screen.getByRole("heading", { name: "Write us a note" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Name")).toHaveAttribute(
      "placeholder",
      "Your name",
    );
    expect(screen.getByLabelText("Email")).toHaveAttribute(
      "placeholder",
      "you@example.com",
    );
    expect(screen.getByLabelText("Message")).toHaveAttribute(
      "placeholder",
      "What's on your mind?",
    );
    expect(
      screen.getByRole("button", { name: "Send message" }),
    ).toBeInTheDocument();
  });
});

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { IntlTestProvider } from "@/test-utils/intl-test-provider";
import { ExpandableText } from "./expandable-text.client";

const LONG_TEXT = "First sentence. Second sentence. Third sentence.";

describe("ExpandableText", () => {
  it("toggles the rest of the text with Read more and Show less", async () => {
    const user = userEvent.setup();
    render(<ExpandableText>{LONG_TEXT}</ExpandableText>, {
      wrapper: IntlTestProvider,
    });

    const toggle = screen.getByRole("button", { name: "Read more" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    await user.click(toggle);

    expect(toggle).toHaveAccessibleName("Show less");
    expect(toggle).toHaveAttribute("aria-expanded", "true");
  });

  it("shows no toggle when the text fits in the preview", () => {
    render(<ExpandableText>Only one sentence.</ExpandableText>, {
      wrapper: IntlTestProvider,
    });

    expect(screen.getByText("Only one sentence.")).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});

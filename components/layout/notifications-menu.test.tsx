import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { IntlTestProvider } from "@/test-utils/intl-test-provider";
import { NotificationsMenu } from "./notifications-menu.client";

function renderMenu() {
  render(
    <IntlTestProvider>
      <NotificationsMenu />
      <button type="button">Outside</button>
    </IntlTestProvider>,
  );
  return {
    user: userEvent.setup(),
    trigger: screen.getByRole("button", { name: "Notifications" }),
  };
}

const panel = () => screen.queryByRole("region", { name: "Notifications" });

// The panel leaves with a short exit animation, so it stays in the DOM for a
// moment after aria-expanded turns false.
async function expectClosed(trigger: HTMLElement): Promise<void> {
  expect(trigger).toHaveAttribute("aria-expanded", "false");
  await waitFor(() => expect(panel()).not.toBeInTheDocument());
}

describe("NotificationsMenu", () => {
  it("starts closed", () => {
    const { trigger } = renderMenu();

    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(panel()).not.toBeInTheDocument();
  });

  it("opens a panel with the empty state", async () => {
    const { trigger, user } = renderMenu();

    await user.click(trigger);

    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(panel()).toHaveTextContent("Nothing here yet...");
  });

  it("stays open when the panel itself is clicked", async () => {
    const { trigger, user } = renderMenu();

    await user.click(trigger);
    await user.click(screen.getByText("Nothing here yet..."));

    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(panel()).toBeInTheDocument();
  });

  it("closes on a second click on the bell", async () => {
    const { trigger, user } = renderMenu();

    await user.click(trigger);
    await user.click(trigger);

    await expectClosed(trigger);
  });

  it("closes on an outside click", async () => {
    const { trigger, user } = renderMenu();

    await user.click(trigger);
    await user.click(screen.getByRole("button", { name: "Outside" }));

    await expectClosed(trigger);
  });

  it("closes on Escape and returns focus to the bell", async () => {
    const { trigger, user } = renderMenu();

    await user.click(trigger);
    // Clicking plain text inside the panel moves focus off the bell.
    await user.click(screen.getByText("Nothing here yet..."));
    expect(trigger).not.toHaveFocus();
    await user.keyboard("{Escape}");

    await expectClosed(trigger);
    expect(trigger).toHaveFocus();
  });
});

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { NotificationSwitch } from "./notification-switch.client";

function renderSwitch(
  props: { checked: boolean; disabled?: boolean },
  onToggle = vi.fn(),
) {
  render(
    <>
      <h3 id="digest-label">Weekly digest</h3>
      <p id="digest-description">A short weekly summary.</p>
      <NotificationSwitch
        labelId="digest-label"
        descriptionId="digest-description"
        onToggle={onToggle}
        {...props}
      />
    </>,
  );
  return onToggle;
}

describe("NotificationSwitch", () => {
  it("is an accessible switch named and described by its row", () => {
    renderSwitch({ checked: false });

    const toggle = screen.getByRole("switch", { name: "Weekly digest" });
    expect(toggle).toHaveAccessibleDescription("A short weekly summary.");
    expect(toggle).not.toBeChecked();
  });

  it("reports the on state", () => {
    renderSwitch({ checked: true });

    expect(screen.getByRole("switch", { name: "Weekly digest" })).toBeChecked();
  });

  it("toggles on click and with the keyboard", async () => {
    const user = userEvent.setup();
    const onToggle = renderSwitch({ checked: false });
    const toggle = screen.getByRole("switch", { name: "Weekly digest" });

    await user.click(toggle);
    await user.keyboard("[Space]");

    expect(onToggle).toHaveBeenCalledTimes(2);
  });

  it("ignores clicks while disabled", async () => {
    const onToggle = renderSwitch({ checked: true, disabled: true });
    const toggle = screen.getByRole("switch", { name: "Weekly digest" });

    await userEvent.click(toggle);

    expect(toggle).toBeDisabled();
    expect(onToggle).not.toHaveBeenCalled();
  });
});

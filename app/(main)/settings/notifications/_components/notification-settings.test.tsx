import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { UpdateNotificationPreferencesResult } from "@/lib/actions/notification-preferences.action";
import { NotificationSettings } from "./notification-settings.client";

const { updateNotificationPreferences, toast } = vi.hoisted(() => ({
  updateNotificationPreferences: vi.fn(),
  toast: { error: vi.fn() },
}));

vi.mock("@/lib/actions/notification-preferences.action", () => ({
  updateNotificationPreferences,
}));
vi.mock("sonner", () => ({ toast }));

function renderSettings() {
  render(
    <NotificationSettings
      initialPreferences={{ productUpdates: false, weeklyDigest: true }}
    />,
  );
}

// Holds the server action open until the test sends its result.
function deferActionResult(): (
  result: UpdateNotificationPreferencesResult,
) => void {
  let finish: (result: UpdateNotificationPreferencesResult) => void = () =>
    undefined;
  updateNotificationPreferences.mockReturnValueOnce(
    new Promise((resolve) => {
      finish = resolve;
    }),
  );
  return (result) => finish(result);
}

beforeEach(() => {
  updateNotificationPreferences.mockResolvedValue({ success: true });
});

describe("NotificationSettings", () => {
  it("shows each switch in its saved state, with security emails locked on", () => {
    renderSettings();

    const security = screen.getByRole("switch", { name: /security emails/i });
    expect(security).toBeChecked();
    expect(security).toBeDisabled();
    expect(
      screen.getByRole("switch", { name: "Product updates" }),
    ).not.toBeChecked();
    expect(screen.getByRole("switch", { name: "Weekly digest" })).toBeChecked();
  });

  it("flips the switch at once and locks the optional switches while saving", async () => {
    const finish = deferActionResult();
    renderSettings();
    const productUpdates = screen.getByRole("switch", {
      name: "Product updates",
    });

    await userEvent.click(productUpdates);

    expect(productUpdates).toBeChecked();
    expect(productUpdates).toBeDisabled();
    expect(
      screen.getByRole("switch", { name: "Weekly digest" }),
    ).toBeDisabled();
    expect(updateNotificationPreferences).toHaveBeenCalledWith({
      productUpdates: true,
      weeklyDigest: true,
    });

    finish({ success: true });

    await waitFor(() => expect(productUpdates).toBeEnabled());
    expect(productUpdates).toBeChecked();
  });

  it("turns the switch back and explains why when saving fails", async () => {
    updateNotificationPreferences.mockResolvedValue({
      success: false,
      message: "Unable to save notification settings",
    });
    renderSettings();
    const digest = screen.getByRole("switch", { name: "Weekly digest" });

    await userEvent.click(digest);

    // The click did request "off"; the refusal brought the switch back on.
    expect(updateNotificationPreferences).toHaveBeenCalledWith({
      productUpdates: false,
      weeklyDigest: false,
    });
    await waitFor(() => expect(digest).toBeChecked());
    expect(toast.error).toHaveBeenCalledWith(
      "Unable to save notification settings",
    );
  });
});

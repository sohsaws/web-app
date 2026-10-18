import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { UpdateNotificationPreferencesResult } from "@/lib/actions/notification-preferences.action";
import { DEFAULT_NOTIFICATION_PREFERENCES } from "@/lib/config/notifications";
import { useNotificationPreferences } from "./use-notification-preferences";

const { updateNotificationPreferences, toast } = vi.hoisted(() => ({
  updateNotificationPreferences: vi.fn(),
  toast: { error: vi.fn() },
}));

vi.mock("@/lib/actions/notification-preferences.action", () => ({
  updateNotificationPreferences,
}));
vi.mock("sonner", () => ({ toast }));

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

function renderPreferencesHook() {
  return renderHook(() =>
    useNotificationPreferences(DEFAULT_NOTIFICATION_PREFERENCES),
  );
}

beforeEach(() => {
  updateNotificationPreferences.mockResolvedValue({ success: true });
});

describe("useNotificationPreferences", () => {
  it("flips the switch before the server answers and keeps it on success", async () => {
    const finish = deferActionResult();
    const { result } = renderPreferencesHook();

    act(() => result.current.togglePreference("weeklyDigest"));

    expect(result.current.preferences.weeklyDigest).toBe(true);
    await waitFor(() => expect(result.current.isSaving).toBe(true));
    expect(updateNotificationPreferences).toHaveBeenCalledWith({
      productUpdates: false,
      weeklyDigest: true,
    });

    await act(async () => finish({ success: true }));

    expect(result.current.isSaving).toBe(false);
    expect(result.current.preferences.weeklyDigest).toBe(true);
    expect(toast.error).not.toHaveBeenCalled();
  });

  it("rolls back and shows the server message when saving is refused", async () => {
    updateNotificationPreferences.mockResolvedValue({
      success: false,
      message: "You must be signed in to change notifications",
    });
    const { result } = renderPreferencesHook();

    act(() => result.current.togglePreference("productUpdates"));

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(
        "You must be signed in to change notifications",
      ),
    );
    expect(result.current.preferences).toEqual(
      DEFAULT_NOTIFICATION_PREFERENCES,
    );
  });

  it("rolls back when the request itself fails", async () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    updateNotificationPreferences.mockRejectedValue(new Error("offline"));
    const { result } = renderPreferencesHook();

    act(() => result.current.togglePreference("productUpdates"));

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(
        "Unable to save notification settings",
      ),
    );
    expect(result.current.preferences).toEqual(
      DEFAULT_NOTIFICATION_PREFERENCES,
    );
    expect(result.current.isSaving).toBe(false);
    expect(consoleError).toHaveBeenCalled();
  });

  it("toggles only the requested switch", async () => {
    const { result } = renderPreferencesHook();

    act(() => result.current.togglePreference("productUpdates"));

    await waitFor(() => expect(result.current.isSaving).toBe(false));
    expect(result.current.preferences).toEqual({
      productUpdates: true,
      weeklyDigest: false,
    });
  });
});

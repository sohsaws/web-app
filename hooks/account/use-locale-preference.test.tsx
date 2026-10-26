import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useIdeasStore } from "@/app/stores/ideas-store";
import type { UpdateLocaleResult } from "@/lib/actions/locale.action";
import type { IdeaSaveRequest } from "@/lib/types/ideas/types";
import { IntlTestProvider } from "@/test-utils/intl-test-provider";
import { useLocalePreference } from "./use-locale-preference";

const { updateLocale, router, toast } = vi.hoisted(() => ({
  updateLocale: vi.fn(),
  router: { replace: vi.fn() },
  toast: { success: vi.fn(), error: vi.fn() },
}));

vi.mock("@/lib/actions/locale.action", () => ({ updateLocale }));
vi.mock("@/i18n/navigation", () => ({
  useRouter: () => router,
  usePathname: () => "/settings/profile",
}));
vi.mock("sonner", () => ({ toast }));

const ERROR_MESSAGE = "Could not change the language. Please try again.";

// Holds the server action open until the test sends its result.
function deferActionResult(): (result: UpdateLocaleResult) => void {
  let finish: (result: UpdateLocaleResult) => void = () => undefined;
  updateLocale.mockReturnValueOnce(
    new Promise((resolve) => {
      finish = resolve;
    }),
  );
  return (result) => finish(result);
}

function renderLocaleHook() {
  return renderHook(() => useLocalePreference(), {
    wrapper: IntlTestProvider,
  });
}

const englishIdea: IdeaSaveRequest = {
  id: "idea-1",
  title: "Night hike",
  description: "Walk a trail at dusk.",
  categories: ["Hiking"],
  createdAt: new Date("2026-10-10T10:00:00.000Z"),
};

beforeEach(() => {
  updateLocale.mockResolvedValue({ success: true, locale: "de" });
  // The deck store is a module-level singleton; each test starts with an
  // English deck in memory.
  useIdeasStore.setState({ ideas: [englishIdea], previousCard: englishIdea });
});

describe("useLocalePreference", () => {
  it("reports the current locale and is idle at first", () => {
    const { result } = renderLocaleHook();

    expect(result.current.locale).toBe("en");
    expect(result.current.isSaving).toBe(false);
  });

  it("saves the language, toasts in the old language, then switches the prefix", async () => {
    const { result } = renderLocaleHook();

    act(() => result.current.changeLocale("de"));

    await waitFor(() =>
      expect(router.replace).toHaveBeenCalledWith("/settings/profile", {
        locale: "de",
      }),
    );
    expect(updateLocale).toHaveBeenCalledWith("de");
    expect(toast.success).toHaveBeenCalledWith("Language changed to Deutsch");
    // The toast must be built before the page re-renders in German.
    expect(toast.success.mock.invocationCallOrder[0]).toBeLessThan(
      router.replace.mock.invocationCallOrder[0],
    );
    expect(toast.error).not.toHaveBeenCalled();
  });

  it("drops the deck written in the old language without generating a new one", async () => {
    const { result } = renderLocaleHook();

    act(() => result.current.changeLocale("de"));

    await waitFor(() => expect(router.replace).toHaveBeenCalled());
    expect(useIdeasStore.getState()).toMatchObject({
      ideas: [],
      previousCard: null,
    });
  });

  it("keeps the deck when the language is not saved", async () => {
    updateLocale.mockResolvedValue({ success: false, code: "NOT_SIGNED_IN" });
    const { result } = renderLocaleHook();

    act(() => result.current.changeLocale("fr"));

    await waitFor(() => expect(toast.error).toHaveBeenCalled());
    expect(useIdeasStore.getState().ideas).toEqual([englishIdea]);
  });

  it("shows the translated error and stays on the page when saving is refused", async () => {
    updateLocale.mockResolvedValue({
      success: false,
      code: "NOT_SIGNED_IN",
    });
    const { result } = renderLocaleHook();

    act(() => result.current.changeLocale("fr"));

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(ERROR_MESSAGE),
    );
    expect(router.replace).not.toHaveBeenCalled();
    expect(toast.success).not.toHaveBeenCalled();
    expect(result.current.locale).toBe("en");
  });

  it("logs and shows the translated error when the request fails", async () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    updateLocale.mockRejectedValue(new Error("offline"));
    const { result } = renderLocaleHook();

    act(() => result.current.changeLocale("ru"));

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(ERROR_MESSAGE),
    );
    expect(consoleError).toHaveBeenCalled();
    expect(router.replace).not.toHaveBeenCalled();
    expect(result.current.isSaving).toBe(false);
    expect(result.current.locale).toBe("en");
  });

  it("shows the chosen language and stays locked until the page switches", async () => {
    const finish = deferActionResult();
    const { result } = renderLocaleHook();

    act(() => result.current.changeLocale("es"));

    expect(result.current.locale).toBe("es");
    expect(result.current.isSaving).toBe(true);
    expect(router.replace).not.toHaveBeenCalled();

    await act(async () => finish({ success: true, locale: "es" }));

    expect(router.replace).toHaveBeenCalledWith("/settings/profile", {
      locale: "es",
    });
    // Still locked while the Spanish page loads; it remounts the hook.
    expect(result.current.locale).toBe("es");
    expect(result.current.isSaving).toBe(true);
  });

  it("ignores a second choice while a switch is in progress", async () => {
    const finish = deferActionResult();
    const { result } = renderLocaleHook();

    act(() => result.current.changeLocale("es"));
    act(() => result.current.changeLocale("fr"));
    await act(async () => finish({ success: true, locale: "es" }));

    expect(updateLocale).toHaveBeenCalledTimes(1);
    expect(router.replace).toHaveBeenCalledTimes(1);
  });
});

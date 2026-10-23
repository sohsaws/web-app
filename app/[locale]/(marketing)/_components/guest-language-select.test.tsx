import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { IntlTestProvider } from "@/test-utils/intl-test-provider";
import { GuestLanguageSelect } from "./guest-language-select.client";

const { router } = vi.hoisted(() => ({
  router: { replace: vi.fn() },
}));

// Only the router and pathname are replaced; the real locale-aware Link stays.
vi.mock("@/i18n/navigation", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/i18n/navigation")>()),
  useRouter: () => router,
  usePathname: () => "/about",
}));

function renderSelect() {
  render(<GuestLanguageSelect />, { wrapper: IntlTestProvider });
  return {
    user: userEvent.setup(),
    select: screen.getByRole("combobox", { name: "Language" }),
  };
}

describe("GuestLanguageSelect", () => {
  it("shows the language of the current page", () => {
    const { select } = renderSelect();

    expect(select).toHaveValue("en");
  });

  it("opens the same page in the chosen language", async () => {
    const { user, select } = renderSelect();

    await user.selectOptions(select, "Deutsch");

    expect(router.replace).toHaveBeenCalledTimes(1);
    expect(router.replace).toHaveBeenCalledWith("/about", { locale: "de" });
  });

  it("stays on the page when the current language is chosen", async () => {
    const { user, select } = renderSelect();

    await user.selectOptions(select, "English");

    expect(router.replace).not.toHaveBeenCalled();
  });
});

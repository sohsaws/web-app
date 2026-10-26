import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { IntlTestProvider } from "@/test-utils/intl-test-provider";
import { ProfileLanguageSelect } from "./profile-language-select.client";

const { useLocalePreference, changeLocale } = vi.hoisted(() => ({
  useLocalePreference: vi.fn(),
  changeLocale: vi.fn(),
}));

vi.mock("@/hooks/account/use-locale-preference", () => ({
  useLocalePreference,
}));

function renderSelect(isSaving = false, hasUnsavedChanges = false) {
  useLocalePreference.mockReturnValue({
    locale: "en",
    isSaving,
    changeLocale,
  });
  render(<ProfileLanguageSelect hasUnsavedChanges={hasUnsavedChanges} />, {
    wrapper: IntlTestProvider,
  });
  return userEvent.setup();
}

const languageField = () => screen.getByRole("combobox", { name: "Language" });

describe("ProfileLanguageSelect", () => {
  it("shows the current language under a visible Language label", () => {
    renderSelect();

    expect(screen.getByLabelText("Language")).toBe(languageField());
    expect(languageField()).toHaveTextContent("English");
    expect(languageField()).toBeEnabled();
  });

  it("applies the chosen language right away", async () => {
    const user = renderSelect();

    await user.click(languageField());
    await user.click(screen.getByRole("option", { name: "Deutsch" }));

    expect(changeLocale).toHaveBeenCalledWith("de");
  });

  it("is disabled while the language is being saved", () => {
    renderSelect(true);

    expect(languageField()).toBeDisabled();
  });

  it("waits for unsaved profile edits and says why", () => {
    renderSelect(false, true);

    expect(languageField()).toBeDisabled();
    expect(languageField()).toHaveAccessibleDescription(
      "Save or cancel your changes to switch the language.",
    );
  });

  it("has no hint while there is nothing unsaved", () => {
    renderSelect();

    expect(languageField()).not.toHaveAccessibleDescription();
  });
});

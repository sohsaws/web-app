import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { LanguageSelect } from "./language-select.client";

function renderSelect(
  props: Partial<Parameters<typeof LanguageSelect>[0]> = {},
) {
  const onChange = vi.fn();
  render(
    <LanguageSelect
      value="en"
      onChange={onChange}
      label="Language"
      {...props}
    />,
  );
  return {
    onChange,
    select: screen.getByRole("combobox", { name: "Language" }),
  };
}

describe("LanguageSelect", () => {
  it("offers every language written in itself, in picker order", () => {
    const { select } = renderSelect();

    const options = within(select).getAllByRole("option");
    expect(options.map((option) => option.textContent)).toEqual([
      "English",
      "Русский",
      "Español",
      "Français",
      "Deutsch",
    ]);
    expect(options.map((option) => option.getAttribute("lang"))).toEqual([
      "en",
      "ru",
      "es",
      "fr",
      "de",
    ]);
  });

  it("shows the current language as the selected option", () => {
    const { select } = renderSelect({ value: "fr" });

    expect(select).toHaveValue("fr");
    expect(
      within(select).getByRole("option", { name: "Français" }),
    ).toHaveProperty("selected", true);
  });

  it("reports the chosen language", async () => {
    const { onChange, select } = renderSelect();

    await userEvent.selectOptions(select, "de");

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith("de");
  });

  it("does not report choosing the language that is already active", async () => {
    const { onChange, select } = renderSelect({ value: "ru" });

    await userEvent.selectOptions(select, "ru");

    expect(onChange).not.toHaveBeenCalled();
  });

  it("cannot be changed while disabled", async () => {
    const { onChange, select } = renderSelect({ disabled: true });

    await userEvent.selectOptions(select, "es").catch(() => undefined);

    expect(select).toBeDisabled();
    expect(onChange).not.toHaveBeenCalled();
  });

  it("shows the short code and the full name in the pill variant", () => {
    const { container } = render(
      <LanguageSelect
        value="es"
        onChange={vi.fn()}
        label="Language"
        variant="pill"
      />,
    );

    // The visible text is decorative; the select itself carries the name.
    const visible = container.querySelector("[aria-hidden='true']");
    expect(visible).toHaveTextContent("ES");
    expect(visible).toHaveTextContent("Español");
  });

  it("can be labelled by a visible label through its id", () => {
    render(
      <>
        <label htmlFor="profile-language">Language</label>
        <LanguageSelect
          id="profile-language"
          value="en"
          onChange={vi.fn()}
          label="Language"
        />
      </>,
    );

    expect(screen.getByLabelText("Language")).toHaveAttribute(
      "id",
      "profile-language",
    );
  });

  it("is described by the hint it is given", () => {
    render(
      <>
        <p id="language-hint">Save your changes first.</p>
        <LanguageSelect
          value="en"
          onChange={vi.fn()}
          label="Language"
          describedBy="language-hint"
        />
      </>,
    );

    expect(
      screen.getByRole("combobox", { name: "Language" }),
    ).toHaveAccessibleDescription("Save your changes first.");
  });
});

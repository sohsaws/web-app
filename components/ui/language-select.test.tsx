import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { LanguageSelect } from "./language-select.client";

function renderSelect(
  props: Partial<Parameters<typeof LanguageSelect>[0]> = {},
) {
  const onChange = vi.fn();
  render(
    <>
      <LanguageSelect
        value="en"
        onChange={onChange}
        label="Language"
        {...props}
      />
      <button type="button">Outside</button>
    </>,
  );
  return {
    onChange,
    user: userEvent.setup(),
    trigger: screen.getByRole("combobox", { name: "Language" }),
  };
}

const listbox = () => screen.queryByRole("listbox", { name: "Language" });
const option = (name: string) => screen.getByRole("option", { name });

// The list leaves with a short exit animation, so it stays in the DOM for a
// moment after aria-expanded turns false.
async function expectClosed(trigger: HTMLElement): Promise<void> {
  expect(trigger).toHaveAttribute("aria-expanded", "false");
  await waitFor(() => expect(listbox()).not.toBeInTheDocument());
}

describe("LanguageSelect: closed", () => {
  it("shows the current language on a collapsed combobox", () => {
    const { trigger } = renderSelect({ value: "fr" });

    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveTextContent("Français");
    expect(listbox()).not.toBeInTheDocument();
  });

  it("shows the short code and the full name in the pill variant", () => {
    const { trigger } = renderSelect({ value: "es", variant: "pill" });

    expect(trigger).toHaveTextContent("ES");
    expect(trigger).toHaveTextContent("Español");
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

  it("cannot be opened while disabled", async () => {
    const { trigger, user } = renderSelect({ disabled: true });

    await user.click(trigger);

    expect(trigger).toBeDisabled();
    expect(listbox()).not.toBeInTheDocument();
  });
});

describe("LanguageSelect: with a pointer", () => {
  it("lists every language written in itself, with the current one selected", async () => {
    const { trigger, user } = renderSelect({ value: "ru" });

    await user.click(trigger);

    const options = within(screen.getByRole("listbox")).getAllByRole("option");
    expect(options.map((item) => item.textContent)).toEqual([
      "English",
      "Русский",
      "Español",
      "Français",
      "Deutsch",
    ]);
    expect(options.map((item) => item.getAttribute("lang"))).toEqual([
      "en",
      "ru",
      "es",
      "fr",
      "de",
    ]);
    expect(option("Русский")).toHaveAttribute("aria-selected", "true");
    expect(option("English")).toHaveAttribute("aria-selected", "false");
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  it("reports the chosen language and closes", async () => {
    const { onChange, trigger, user } = renderSelect();

    await user.click(trigger);
    await user.click(option("Deutsch"));

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith("de");
    await expectClosed(trigger);
    expect(trigger).toHaveFocus();
  });

  it("does not report choosing the language that is already active", async () => {
    const { onChange, trigger, user } = renderSelect({ value: "ru" });

    await user.click(trigger);
    await user.click(option("Русский"));

    expect(onChange).not.toHaveBeenCalled();
    await expectClosed(trigger);
  });

  it("closes without a change when the user clicks elsewhere", async () => {
    const { onChange, trigger, user } = renderSelect();

    await user.click(trigger);
    await user.click(screen.getByRole("button", { name: "Outside" }));

    await expectClosed(trigger);
    expect(onChange).not.toHaveBeenCalled();
  });

  it("closes when the trigger is clicked again", async () => {
    const { trigger, user } = renderSelect();

    await user.click(trigger);
    await user.click(trigger);

    await expectClosed(trigger);
  });
});

describe("LanguageSelect: with the keyboard", () => {
  it("opens with the arrow key on the current language", async () => {
    const { trigger, user } = renderSelect({ value: "es" });

    trigger.focus();
    await user.keyboard("{ArrowDown}");

    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(trigger).toHaveAttribute(
      "aria-activedescendant",
      option("Español").id,
    );
  });

  it("moves with the arrows and chooses with Enter", async () => {
    const { onChange, trigger, user } = renderSelect();

    trigger.focus();
    await user.keyboard("{Enter}");
    await user.keyboard("{ArrowDown}{ArrowDown}");
    await user.keyboard("{Enter}");

    expect(onChange).toHaveBeenCalledWith("es");
    await expectClosed(trigger);
  });

  it("chooses with Space without reopening the list", async () => {
    const { onChange, trigger, user } = renderSelect();

    trigger.focus();
    await user.keyboard(" ");
    await user.keyboard("{End}");
    await user.keyboard(" ");

    expect(onChange).toHaveBeenCalledWith("de");
    await expectClosed(trigger);
  });

  it("stops at the first and the last language", async () => {
    const { trigger, user } = renderSelect({ value: "de" });

    trigger.focus();
    await user.keyboard("{ArrowDown}{ArrowDown}");
    expect(trigger).toHaveAttribute(
      "aria-activedescendant",
      option("Deutsch").id,
    );

    await user.keyboard("{Home}{ArrowUp}");
    expect(trigger).toHaveAttribute(
      "aria-activedescendant",
      option("English").id,
    );
  });

  it("closes with Escape and keeps the language", async () => {
    const { onChange, trigger, user } = renderSelect();

    trigger.focus();
    await user.keyboard("{ArrowDown}{ArrowDown}{Escape}");

    await expectClosed(trigger);
    expect(onChange).not.toHaveBeenCalled();
    expect(trigger).toHaveFocus();
  });

  it("closes when Tab moves focus away", async () => {
    const { onChange, trigger, user } = renderSelect();

    trigger.focus();
    await user.keyboard("{ArrowDown}");
    await user.tab();

    await expectClosed(trigger);
    expect(onChange).not.toHaveBeenCalled();
  });
});

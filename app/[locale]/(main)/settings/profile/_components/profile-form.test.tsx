import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { IntlTestProvider } from "@/test-utils/intl-test-provider";
import ProfileForm from "./profile-form.client";

const { updateProfile, router, toast } = vi.hoisted(() => ({
  updateProfile: vi.fn(),
  router: { refresh: vi.fn() },
  toast: { success: vi.fn(), error: vi.fn() },
}));

vi.mock("@/lib/actions/profile.action", () => ({ updateProfile }));
// The language field saves through its own server action.
vi.mock("@/lib/actions/locale.action", () => ({ updateLocale: vi.fn() }));
// Only the router and pathname are replaced; the real locale-aware Link stays.
vi.mock("@/i18n/navigation", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/i18n/navigation")>()),
  useRouter: () => router,
  usePathname: () => "/settings/profile",
}));
vi.mock("sonner", () => ({ toast }));
// The unverified-email warning sends mail through the auth client.
vi.mock("@/lib/auth/auth-client", () => ({
  authClient: { sendVerificationEmail: vi.fn() },
}));

function renderForm(emailVerified = true) {
  render(
    <ProfileForm
      defaultValues={{ name: "Ann", bio: "Likes hiking." }}
      email="ann@example.com"
      emailVerified={emailVerified}
    />,
    { wrapper: IntlTestProvider },
  );
  return userEvent.setup();
}

const nameField = () => screen.getByLabelText("Name");
const bioField = () => screen.getByLabelText("Bio");
const cancelButton = () => screen.getByRole("button", { name: "Cancel" });
const saveButton = () => screen.getByRole("button", { name: /save changes/i });

beforeEach(() => {
  updateProfile.mockResolvedValue({ success: true });
});

describe("ProfileForm", () => {
  it("shows the saved profile and nothing to cancel yet", () => {
    renderForm();

    expect(nameField()).toHaveValue("Ann");
    expect(bioField()).toHaveValue("Likes hiking.");
    expect(screen.getByLabelText("Email")).toHaveAttribute("readonly");
    expect(cancelButton()).toBeDisabled();
  });

  it("shows the current language in the Language field", () => {
    renderForm();

    expect(screen.getByLabelText("Language")).toHaveTextContent("English");
  });

  it("counts bio characters against the limit as the user types", async () => {
    const user = renderForm();

    await user.clear(bioField());
    await user.type(bioField(), "Climbing");

    expect(screen.getByText("8/2000")).toBeInTheDocument();
    expect(bioField()).toHaveAttribute("maxLength", "2000");
  });

  it("shows the name error on the field and does not save", async () => {
    const user = renderForm();

    await user.clear(nameField());
    await user.click(saveButton());

    expect(
      await screen.findByText("Name cannot be empty."),
    ).toBeInTheDocument();
    expect(nameField()).toHaveAttribute("aria-invalid", "true");
    expect(nameField()).toHaveAccessibleDescription("Name cannot be empty.");
    expect(updateProfile).not.toHaveBeenCalled();
  });

  it("brings back the saved profile on Cancel", async () => {
    const user = renderForm();
    await user.type(nameField(), " Lee");

    await user.click(cancelButton());

    expect(nameField()).toHaveValue("Ann");
    expect(cancelButton()).toBeDisabled();
  });

  it("saves trimmed values, locks Save while saving and refreshes", async () => {
    let finish: (value: { success: true }) => void = () => undefined;
    updateProfile.mockReturnValueOnce(
      new Promise((resolve) => {
        finish = resolve;
      }),
    );
    const user = renderForm();
    await user.clear(nameField());
    await user.type(nameField(), "  Ann Lee ");

    await user.click(saveButton());

    expect(
      await screen.findByRole("button", { name: /saving/i }),
    ).toBeDisabled();
    expect(updateProfile).toHaveBeenCalledWith({
      name: "Ann Lee",
      bio: "Likes hiking.",
    });

    finish({ success: true });

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(
        "Profile updated successfully",
      ),
    );
    expect(router.refresh).toHaveBeenCalled();
    expect(saveButton()).toBeEnabled();
  });

  it("offers to verify an unverified email", () => {
    renderForm(false);

    expect(
      screen.getByRole("button", { name: "Verify your email address" }),
    ).toBeInTheDocument();
  });

  it("shows no verification prompt for a verified email", () => {
    renderForm(true);

    expect(
      screen.queryByRole("button", { name: "Verify your email address" }),
    ).not.toBeInTheDocument();
  });

  it("locks the language while there are unsaved edits and unlocks after Cancel", async () => {
    const user = renderForm();
    const languageField = () =>
      screen.getByRole("combobox", { name: "Language" });

    await user.type(bioField(), " And climbing.");

    expect(languageField()).toBeDisabled();
    expect(
      screen.getByText("Save or cancel your changes to switch the language."),
    ).toBeInTheDocument();

    await user.click(cancelButton());

    expect(languageField()).toBeEnabled();
  });
});

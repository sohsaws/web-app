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
// Only the router is replaced; the real locale-aware Link stays.
vi.mock("@/i18n/navigation", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/i18n/navigation")>()),
  useRouter: () => router,
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
  updateProfile.mockResolvedValue({
    success: true,
    message: "Profile updated successfully",
  });
});

describe("ProfileForm", () => {
  it("shows the saved profile and nothing to cancel yet", () => {
    renderForm();

    expect(nameField()).toHaveValue("Ann");
    expect(bioField()).toHaveValue("Likes hiking.");
    expect(screen.getByLabelText("Email")).toHaveAttribute("readonly");
    expect(cancelButton()).toBeDisabled();
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

    expect(await screen.findByText("Name cannot be empty")).toBeInTheDocument();
    expect(nameField()).toHaveAttribute("aria-invalid", "true");
    expect(nameField()).toHaveAccessibleDescription("Name cannot be empty");
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
    let finish: (value: { success: true; message: string }) => void = () =>
      undefined;
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

    finish({ success: true, message: "Profile updated successfully" });

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
});

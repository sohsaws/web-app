import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { IntlTestProvider } from "@/test-utils/intl-test-provider";
import { DeleteAccount } from "./delete-account.client";

const { authClient, toast, assign } = vi.hoisted(() => ({
  authClient: { deleteUser: vi.fn(), signOut: vi.fn() },
  toast: { error: vi.fn() },
  assign: vi.fn(),
}));

vi.mock("@/lib/auth/auth-client", () => ({ authClient }));
vi.mock("sonner", () => ({ toast }));

// Opens the confirmation form, as the user does from the Danger Zone.
async function openForm(requiresPassword: boolean) {
  const user = userEvent.setup();
  render(<DeleteAccount requiresPassword={requiresPassword} />, {
    wrapper: IntlTestProvider,
  });
  await user.click(screen.getByRole("button", { name: "Delete account" }));
  return user;
}

const confirmationField = () => screen.getByLabelText("Type DELETE to confirm");
const submitButton = () =>
  screen.getByRole("button", { name: /delete my account permanently/i });

beforeEach(() => {
  authClient.deleteUser.mockResolvedValue({ data: {}, error: null });
  // jsdom cannot navigate; the full reload after deletion goes through this.
  vi.stubGlobal("location", { ...window.location, assign });
});

describe("DeleteAccount", () => {
  it("keeps the form closed until the user opens it", () => {
    render(<DeleteAccount requiresPassword />, { wrapper: IntlTestProvider });

    expect(
      screen.queryByLabelText("Type DELETE to confirm"),
    ).not.toBeInTheDocument();
  });

  it("asks for the password only when the account has one", async () => {
    await openForm(true);
    expect(screen.getByLabelText("Password")).toHaveAttribute(
      "type",
      "password",
    );
  });

  it("explains that a Google account needs no password", async () => {
    await openForm(false);

    expect(screen.queryByLabelText("Password")).not.toBeInTheDocument();
    expect(screen.getByText(/no password is needed/i)).toBeInTheDocument();
  });

  it("shows the confirmation error on the field and deletes nothing", async () => {
    const user = await openForm(false);

    await user.type(confirmationField(), "delete");
    await user.click(submitButton());

    expect(
      await screen.findByText("Type DELETE to confirm.", { selector: "p" }),
    ).toBeInTheDocument();
    expect(confirmationField()).toHaveAttribute("aria-invalid", "true");
    expect(confirmationField()).toHaveAccessibleDescription(
      "Type DELETE to confirm.",
    );
    expect(authClient.deleteUser).not.toHaveBeenCalled();
  });

  it("requires the password for a credential account", async () => {
    const user = await openForm(true);

    await user.type(confirmationField(), "DELETE");
    await user.click(submitButton());

    expect(
      await screen.findByText("Password is required."),
    ).toBeInTheDocument();
    expect(authClient.deleteUser).not.toHaveBeenCalled();
  });

  it("disables both buttons while deleting, then reloads the app", async () => {
    let finish: (value: { data: object; error: null }) => void = () =>
      undefined;
    authClient.deleteUser.mockReturnValueOnce(
      new Promise((resolve) => {
        finish = resolve;
      }),
    );
    const user = await openForm(true);
    await user.type(confirmationField(), "DELETE");
    await user.type(screen.getByLabelText("Password"), "secret-pass");

    await user.click(submitButton());

    const deleting = await screen.findByRole("button", { name: "Deleting..." });
    expect(deleting).toBeDisabled();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeDisabled();
    expect(authClient.deleteUser).toHaveBeenCalledWith({
      password: "secret-pass",
    });

    finish({ data: {}, error: null });

    await waitFor(() => expect(assign).toHaveBeenCalledWith("/"));
  });

  it("shows a wrong password under the password field", async () => {
    authClient.deleteUser.mockResolvedValue({
      data: null,
      error: { code: "INVALID_PASSWORD", message: "Invalid password" },
    });
    const user = await openForm(true);
    await user.type(confirmationField(), "DELETE");
    await user.type(screen.getByLabelText("Password"), "wrong-pass");

    await user.click(submitButton());

    expect(
      await screen.findByText("Password is incorrect."),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    expect(assign).not.toHaveBeenCalled();
  });

  it("clears what was typed when the form is cancelled", async () => {
    const user = await openForm(false);
    await user.type(confirmationField(), "DELETE");

    await user.click(screen.getByRole("button", { name: "Cancel" }));
    await user.click(screen.getByRole("button", { name: "Delete account" }));

    expect(confirmationField()).toHaveValue("");
  });
});

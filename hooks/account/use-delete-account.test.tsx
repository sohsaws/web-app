import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { IntlTestProvider } from "@/test-utils/intl-test-provider";
import { useDeleteAccount } from "./use-delete-account";

const { authClient, toast, assign } = vi.hoisted(() => ({
  authClient: { deleteUser: vi.fn(), signOut: vi.fn() },
  toast: { error: vi.fn() },
  assign: vi.fn(),
}));

vi.mock("@/lib/auth/auth-client", () => ({ authClient }));
vi.mock("sonner", () => ({ toast }));

interface DeleteAccountInput {
  confirmation: string;
  password: string;
}

function renderDeleteHook(requiresPassword: boolean) {
  return renderHook(() => useDeleteAccount(requiresPassword), {
    wrapper: IntlTestProvider,
  });
}

// Fills the form and runs its validated submit, as the Delete button does.
async function submit(
  result: { current: ReturnType<typeof useDeleteAccount> },
  values: DeleteAccountInput,
): Promise<void> {
  await act(async () => {
    result.current.form.setValue("confirmation", values.confirmation);
    result.current.form.setValue("password", values.password);
    await result.current.form.handleSubmit(result.current.onSubmit)();
  });
}

// Reads the onClick of the toast's "Sign in" action.
function getToastAction(options: unknown): () => void {
  if (
    typeof options === "object" &&
    options !== null &&
    "action" in options &&
    typeof options.action === "object" &&
    options.action !== null &&
    "onClick" in options.action &&
    typeof options.action.onClick === "function"
  ) {
    const onClick = options.action.onClick;
    return () => onClick();
  }
  throw new Error("The toast has no action");
}

beforeEach(() => {
  authClient.deleteUser.mockResolvedValue({ data: {}, error: null });
  authClient.signOut.mockResolvedValue({ data: {}, error: null });
  // jsdom cannot navigate; the hook's full reloads go through this spy.
  vi.stubGlobal("location", { ...window.location, assign });
});

describe("useDeleteAccount", () => {
  it.each([
    ["an empty confirmation", ""],
    ["a lowercase confirmation", "delete"],
    ["a confirmation with spaces", " DELETE "],
  ])("refuses %s with a Validation key", async (_case, confirmation) => {
    const { result } = renderDeleteHook(false);

    await submit(result, { confirmation, password: "" });

    expect(authClient.deleteUser).not.toHaveBeenCalled();
    expect(
      result.current.form.getFieldState("confirmation").error?.message,
    ).toBe("deleteConfirmation");
  });

  it("requires the password for an account that has one", async () => {
    const { result } = renderDeleteHook(true);

    await submit(result, { confirmation: "DELETE", password: "" });

    expect(authClient.deleteUser).not.toHaveBeenCalled();
    expect(result.current.form.getFieldState("password").error?.message).toBe(
      "passwordRequired",
    );
  });

  it("sends the password and reloads the app after deletion", async () => {
    const { result } = renderDeleteHook(true);

    await submit(result, { confirmation: "DELETE", password: "secret-pass" });

    expect(authClient.deleteUser).toHaveBeenCalledWith({
      password: "secret-pass",
    });
    expect(assign).toHaveBeenCalledWith("/");
  });

  it("never sends a password for an account without one", async () => {
    const { result } = renderDeleteHook(false);

    await submit(result, { confirmation: "DELETE", password: "typed anyway" });

    expect(authClient.deleteUser).toHaveBeenCalledWith({});
  });

  it("marks a wrong password on the field and stays on the page", async () => {
    authClient.deleteUser.mockResolvedValue({
      data: null,
      error: { code: "INVALID_PASSWORD", message: "Invalid password" },
    });
    const { result } = renderDeleteHook(true);

    await submit(result, { confirmation: "DELETE", password: "wrong-pass" });

    expect(result.current.form.getFieldState("password").error?.message).toBe(
      "passwordIncorrect",
    );
    expect(assign).not.toHaveBeenCalled();
  });

  it("asks for a fresh sign-in when the session is too old", async () => {
    authClient.deleteUser.mockResolvedValue({
      data: null,
      error: { code: "SESSION_EXPIRED", message: "Session expired" },
    });
    const { result } = renderDeleteHook(false);

    await submit(result, { confirmation: "DELETE", password: "" });

    expect(assign).not.toHaveBeenCalled();
    const [message, options] = toast.error.mock.calls[0] ?? [];
    expect(message).toBe("Please sign in again to delete your account");
    expect(options).toMatchObject({
      description: "For your safety, account deletion needs a recent sign-in.",
      action: { label: "Sign In" },
    });

    await act(async () => getToastAction(options)());

    expect(authClient.signOut).toHaveBeenCalled();
    expect(assign).toHaveBeenCalledWith(
      "/login?callbackUrl=/settings/security",
    );
  });

  it("translates a known Better Auth error by its code", async () => {
    authClient.deleteUser.mockResolvedValue({
      data: null,
      error: { code: "USER_NOT_FOUND", message: "User not found" },
    });
    const { result } = renderDeleteHook(false);

    await submit(result, { confirmation: "DELETE", password: "" });

    expect(toast.error).toHaveBeenCalledWith("No account was found.");
    expect(assign).not.toHaveBeenCalled();
  });

  it("names the deletion for an unknown error and keeps the account", async () => {
    authClient.deleteUser.mockResolvedValue({
      data: null,
      error: { code: "UNKNOWN", message: "Something broke" },
    });
    const { result } = renderDeleteHook(false);

    await submit(result, { confirmation: "DELETE", password: "" });

    expect(toast.error).toHaveBeenCalledWith("Unable to delete your account");
    expect(assign).not.toHaveBeenCalled();
  });

  it("shows a generic error when the request fails", async () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    authClient.deleteUser.mockRejectedValue(new Error("offline"));
    const { result } = renderDeleteHook(false);

    await submit(result, { confirmation: "DELETE", password: "" });

    expect(toast.error).toHaveBeenCalledWith("Unable to delete your account");
    expect(consoleError).toHaveBeenCalled();
    expect(assign).not.toHaveBeenCalled();
  });
});

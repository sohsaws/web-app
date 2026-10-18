import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useChangePassword } from "./use-change-password";

const { authClient, router, toast } = vi.hoisted(() => ({
  authClient: { changePassword: vi.fn() },
  router: { replace: vi.fn(), refresh: vi.fn() },
  toast: { success: vi.fn(), error: vi.fn() },
}));

vi.mock("@/lib/auth/auth-client", () => ({ authClient }));
vi.mock("next/navigation", () => ({ useRouter: () => router }));
vi.mock("sonner", () => ({ toast }));

interface PasswordInput {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const validInput: PasswordInput = {
  currentPassword: "old-secret-pass",
  newPassword: "new-secret-pass",
  confirmPassword: "new-secret-pass",
};

async function submit(
  result: { current: ReturnType<typeof useChangePassword> },
  values: PasswordInput,
): Promise<void> {
  await act(async () => {
    result.current.form.setValue("currentPassword", values.currentPassword);
    result.current.form.setValue("newPassword", values.newPassword);
    result.current.form.setValue("confirmPassword", values.confirmPassword);
    await result.current.form.handleSubmit(result.current.onSubmit)();
  });
}

beforeEach(() => {
  authClient.changePassword.mockResolvedValue({ data: {}, error: null });
});

describe("useChangePassword", () => {
  it("changes the password and signs out every other session", async () => {
    const { result } = renderHook(() => useChangePassword());

    await submit(result, validInput);

    expect(authClient.changePassword).toHaveBeenCalledWith({
      currentPassword: "old-secret-pass",
      newPassword: "new-secret-pass",
      revokeOtherSessions: true,
    });
    expect(router.replace).toHaveBeenCalledWith("/settings/security");
    expect(router.refresh).toHaveBeenCalled();
  });

  it.each([
    [
      "passwords that do not match",
      { ...validInput, confirmPassword: "other-secret-pass" },
    ],
    ["an empty current password", { ...validInput, currentPassword: "" }],
    [
      "a new password under 8 characters",
      { ...validInput, newPassword: "short", confirmPassword: "short" },
    ],
  ])("does not call the server for %s", async (_case, values) => {
    const { result } = renderHook(() => useChangePassword());

    await submit(result, values);

    expect(authClient.changePassword).not.toHaveBeenCalled();
  });

  it("marks a wrong current password on its field", async () => {
    authClient.changePassword.mockResolvedValue({
      data: null,
      error: { code: "INVALID_PASSWORD", message: "Invalid password" },
    });
    const { result } = renderHook(() => useChangePassword());

    await submit(result, validInput);

    expect(
      result.current.form.getFieldState("currentPassword").error?.message,
    ).toBe("Current password is incorrect");
    expect(router.replace).not.toHaveBeenCalled();
  });

  it("shows any other error without leaving the page", async () => {
    authClient.changePassword.mockResolvedValue({
      data: null,
      error: { code: "UNKNOWN", message: "Something broke" },
    });
    const { result } = renderHook(() => useChangePassword());

    await submit(result, validInput);

    expect(toast.error).toHaveBeenCalledWith("Something broke");
    expect(router.replace).not.toHaveBeenCalled();
  });
});

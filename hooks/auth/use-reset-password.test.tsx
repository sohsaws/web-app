import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { IntlTestProvider } from "@/test-utils/intl-test-provider";
import { useResetPassword } from "./use-reset-password";

const { authClient, router, toast } = vi.hoisted(() => ({
  authClient: { resetPassword: vi.fn() },
  router: { replace: vi.fn() },
  toast: { success: vi.fn(), error: vi.fn() },
}));

vi.mock("@/lib/auth/auth-client", () => ({ authClient }));
vi.mock("@/i18n/navigation", () => ({ useRouter: () => router }));
vi.mock("sonner", () => ({ toast }));

const TOKEN = "reset-token";

async function submit(
  result: { current: ReturnType<typeof useResetPassword> },
  newPassword: string,
  confirmPassword = newPassword,
): Promise<void> {
  await act(async () => {
    result.current.form.setValue("newPassword", newPassword);
    result.current.form.setValue("confirmPassword", confirmPassword);
    await result.current.form.handleSubmit(result.current.onSubmit)();
  });
}

beforeEach(() => {
  authClient.resetPassword.mockResolvedValue({ data: {}, error: null });
});

describe("useResetPassword", () => {
  it("resets the password with the token and sends the user to log in", async () => {
    const { result } = renderHook(() => useResetPassword(TOKEN), {
      wrapper: IntlTestProvider,
    });

    await submit(result, "new-secret-pass");

    expect(authClient.resetPassword).toHaveBeenCalledWith({
      newPassword: "new-secret-pass",
      token: TOKEN,
    });
    expect(router.replace).toHaveBeenCalledWith("/login?passwordReset=success");
    expect(toast.success).toHaveBeenCalledWith("Password reset successfully.");
  });

  it.each([
    ["passwords that do not match", "new-secret-pass", "other-secret-pass"],
    ["a password under 8 characters", "short", "short"],
    ["a password over 128 characters", "a".repeat(129), "a".repeat(129)],
  ])("does not call the server for %s", async (_case, password, confirm) => {
    const { result } = renderHook(() => useResetPassword(TOKEN), {
      wrapper: IntlTestProvider,
    });

    await submit(result, password, confirm);

    expect(authClient.resetPassword).not.toHaveBeenCalled();
  });

  it("sends the user back to request a new link when the token is invalid", async () => {
    authClient.resetPassword.mockResolvedValue({
      data: null,
      error: { code: "INVALID_TOKEN", message: "Invalid token" },
    });
    const { result } = renderHook(() => useResetPassword(TOKEN), {
      wrapper: IntlTestProvider,
    });

    await submit(result, "new-secret-pass");

    expect(router.replace).toHaveBeenCalledWith(
      "/forgot-password?error=INVALID_TOKEN",
    );
    expect(toast.success).not.toHaveBeenCalled();
  });

  it("shows any other error without leaving the page", async () => {
    authClient.resetPassword.mockResolvedValue({
      data: null,
      error: { code: "UNKNOWN", message: "Something broke" },
    });
    const { result } = renderHook(() => useResetPassword(TOKEN), {
      wrapper: IntlTestProvider,
    });

    await submit(result, "new-secret-pass");

    expect(toast.error).toHaveBeenCalledWith("Unable to reset your password.");
    expect(router.replace).not.toHaveBeenCalled();
  });
});

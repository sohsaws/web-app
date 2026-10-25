import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { EMAIL_MAX_LENGTH } from "@/lib/config/auth";
import { IntlTestProvider } from "@/test-utils/intl-test-provider";
import { useForgotPassword } from "./use-forgot-password";

const { authClient, toast } = vi.hoisted(() => ({
  authClient: { requestPasswordReset: vi.fn() },
  toast: { success: vi.fn(), error: vi.fn() },
}));

vi.mock("@/lib/auth/auth-client", () => ({ authClient }));
vi.mock("sonner", () => ({ toast }));

async function submit(
  result: { current: ReturnType<typeof useForgotPassword> },
  email: string,
): Promise<void> {
  await act(async () => {
    result.current.form.setValue("email", email);
    await result.current.form.handleSubmit(result.current.onSubmit)();
  });
}

beforeEach(() => {
  authClient.requestPasswordReset.mockResolvedValue({ data: {}, error: null });
});

describe("useForgotPassword", () => {
  it("requests the link for the lowercased email", async () => {
    const { result } = renderHook(() => useForgotPassword(), {
      wrapper: IntlTestProvider,
    });

    await submit(result, "Ann@Example.COM");

    expect(authClient.requestPasswordReset).toHaveBeenCalledWith({
      email: "ann@example.com",
      redirectTo: "/forgot-password",
    });
    expect(result.current.requestedEmail).toBe("ann@example.com");
  });

  it("does not reveal whether the account exists", async () => {
    const { result } = renderHook(() => useForgotPassword(), {
      wrapper: IntlTestProvider,
    });

    await submit(result, "nobody@example.com");

    expect(toast.success).toHaveBeenCalledWith(
      "If the account exists, a reset link has been sent.",
    );
  });

  // Valid in form (short domain labels), so only its length can stop it.
  const tooLongEmail = `a@${"abcdefghi.".repeat(25)}com`;

  it.each([
    ["an invalid email", "not-an-email", "emailInvalid"],
    ["an email over the length limit", tooLongEmail, "emailTooLong"],
  ])("does not call the server for %s", async (_case, email, errorKey) => {
    expect(tooLongEmail.length).toBe(EMAIL_MAX_LENGTH + 1);
    const { result } = renderHook(() => useForgotPassword(), {
      wrapper: IntlTestProvider,
    });

    await submit(result, email);

    expect(authClient.requestPasswordReset).not.toHaveBeenCalled();
    expect(result.current.form.getFieldState("email").error?.message).toBe(
      errorKey,
    );
  });

  it("asks the user to wait when rate-limited and keeps the form open", async () => {
    authClient.requestPasswordReset.mockResolvedValue({
      data: null,
      error: { status: 429, message: "Too many requests" },
    });
    const { result } = renderHook(() => useForgotPassword(), {
      wrapper: IntlTestProvider,
    });

    await submit(result, "ann@example.com");

    expect(toast.error).toHaveBeenCalledWith(
      "Too many attempts. Please wait a minute and try again.",
    );
    expect(result.current.requestedEmail).toBeUndefined();
  });

  it("names the failed action when the request fails", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    authClient.requestPasswordReset.mockRejectedValue(new Error("offline"));
    const { result } = renderHook(() => useForgotPassword(), {
      wrapper: IntlTestProvider,
    });

    await submit(result, "ann@example.com");

    expect(toast.error).toHaveBeenCalledWith(
      "Unable to send the password reset link.",
    );
  });
});

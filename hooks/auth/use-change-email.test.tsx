import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { IntlTestProvider } from "@/test-utils/intl-test-provider";
import { useChangeEmail } from "./use-change-email";

const { authClient, toast } = vi.hoisted(() => ({
  authClient: { changeEmail: vi.fn() },
  toast: { success: vi.fn(), error: vi.fn() },
}));

vi.mock("@/lib/auth/auth-client", () => ({ authClient }));
vi.mock("sonner", () => ({ toast }));

const CURRENT_EMAIL = "Ann@Example.com";

async function submit(
  result: { current: ReturnType<typeof useChangeEmail> },
  newEmail: string,
): Promise<void> {
  await act(async () => {
    result.current.form.setValue("newEmail", newEmail);
    await result.current.form.handleSubmit(result.current.onSubmit)();
  });
}

beforeEach(() => {
  authClient.changeEmail.mockResolvedValue({ data: {}, error: null });
});

describe("useChangeEmail", () => {
  it("requests the change for the lowercased new email", async () => {
    const { result } = renderHook(() => useChangeEmail(CURRENT_EMAIL), {
      wrapper: IntlTestProvider,
    });

    await submit(result, "New@Example.com");

    expect(authClient.changeEmail).toHaveBeenCalledWith({
      newEmail: "new@example.com",
      callbackURL: "/settings/profile",
    });
    expect(result.current.requestedEmail).toBe("new@example.com");
    expect(toast.success).toHaveBeenCalledWith(
      "The link has been sent to your inbox. Please check it.",
    );
  });

  it("refuses the current email in any letter case", async () => {
    const { result } = renderHook(() => useChangeEmail(CURRENT_EMAIL), {
      wrapper: IntlTestProvider,
    });

    await submit(result, "ANN@example.COM");

    expect(authClient.changeEmail).not.toHaveBeenCalled();
    // The field keeps the Validation key; the form translates it on display.
    expect(result.current.form.getFieldState("newEmail").error?.message).toBe(
      "emailSameAsCurrent",
    );
  });

  it("does not call the server for an invalid email", async () => {
    const { result } = renderHook(() => useChangeEmail(CURRENT_EMAIL), {
      wrapper: IntlTestProvider,
    });

    await submit(result, "not-an-email");

    expect(authClient.changeEmail).not.toHaveBeenCalled();
  });

  it("shows the translated error and keeps the form open", async () => {
    authClient.changeEmail.mockResolvedValue({
      data: null,
      error: {
        code: "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL",
        message: "User already exists. Use another email.",
      },
    });
    const { result } = renderHook(() => useChangeEmail(CURRENT_EMAIL), {
      wrapper: IntlTestProvider,
    });

    await submit(result, "taken@example.com");

    expect(toast.error).toHaveBeenCalledWith(
      "An account with this email already exists. Please use another email.",
    );
    expect(result.current.requestedEmail).toBeUndefined();
  });

  it("names the failed action for an unknown error", async () => {
    authClient.changeEmail.mockResolvedValue({
      data: null,
      error: { message: "Email already in use" },
    });
    const { result } = renderHook(() => useChangeEmail(CURRENT_EMAIL), {
      wrapper: IntlTestProvider,
    });

    await submit(result, "taken@example.com");

    expect(toast.error).toHaveBeenCalledWith("Unable to change your email.");
  });
});

import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
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
    const { result } = renderHook(() => useChangeEmail(CURRENT_EMAIL));

    await submit(result, "New@Example.com");

    expect(authClient.changeEmail).toHaveBeenCalledWith({
      newEmail: "new@example.com",
      callbackURL: "/settings/profile",
    });
    expect(result.current.requestedEmail).toBe("new@example.com");
  });

  it("refuses the current email in any letter case", async () => {
    const { result } = renderHook(() => useChangeEmail(CURRENT_EMAIL));

    await submit(result, "ANN@example.COM");

    expect(authClient.changeEmail).not.toHaveBeenCalled();
    expect(result.current.form.getFieldState("newEmail").error?.message).toBe(
      "This is already your current email address",
    );
  });

  it("does not call the server for an invalid email", async () => {
    const { result } = renderHook(() => useChangeEmail(CURRENT_EMAIL));

    await submit(result, "not-an-email");

    expect(authClient.changeEmail).not.toHaveBeenCalled();
  });

  it("shows the error and keeps the form open", async () => {
    authClient.changeEmail.mockResolvedValue({
      data: null,
      error: { message: "Email already in use" },
    });
    const { result } = renderHook(() => useChangeEmail(CURRENT_EMAIL));

    await submit(result, "taken@example.com");

    expect(toast.error).toHaveBeenCalledWith("Email already in use");
    expect(result.current.requestedEmail).toBeUndefined();
  });
});

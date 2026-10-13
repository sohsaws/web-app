import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
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
    const { result } = renderHook(() => useForgotPassword());

    await submit(result, "Ann@Example.COM");

    expect(authClient.requestPasswordReset).toHaveBeenCalledWith({
      email: "ann@example.com",
      redirectTo: "/forgot-password",
    });
    expect(result.current.requestedEmail).toBe("ann@example.com");
  });

  it("does not reveal whether the account exists", async () => {
    const { result } = renderHook(() => useForgotPassword());

    await submit(result, "nobody@example.com");

    expect(toast.success).toHaveBeenCalledWith(
      "If the account exists, a reset link has been sent",
    );
  });

  it.each([
    ["an invalid email", "not-an-email"],
    ["an email over 60 characters", `${"a".repeat(55)}@example.com`],
  ])("does not call the server for %s", async (_case, email) => {
    const { result } = renderHook(() => useForgotPassword());

    await submit(result, email);

    expect(authClient.requestPasswordReset).not.toHaveBeenCalled();
  });

  it("shows the error and keeps the form open", async () => {
    authClient.requestPasswordReset.mockResolvedValue({
      data: null,
      error: { message: "Too many requests" },
    });
    const { result } = renderHook(() => useForgotPassword());

    await submit(result, "ann@example.com");

    expect(toast.error).toHaveBeenCalledWith("Too many requests");
    expect(result.current.requestedEmail).toBeUndefined();
  });
});

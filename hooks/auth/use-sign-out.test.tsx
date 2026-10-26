import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { IntlTestProvider } from "@/test-utils/intl-test-provider";
import { useSignOut } from "./use-sign-out";

const { authClient, router, toast } = vi.hoisted(() => ({
  authClient: { signOut: vi.fn() },
  router: { replace: vi.fn() },
  toast: { success: vi.fn(), error: vi.fn() },
}));

vi.mock("@/lib/auth/auth-client", () => ({ authClient }));
vi.mock("@/i18n/navigation", () => ({ useRouter: () => router }));
vi.mock("sonner", () => ({ toast }));

function renderSignOutHook() {
  return renderHook(() => useSignOut(), { wrapper: IntlTestProvider });
}

beforeEach(() => {
  authClient.signOut.mockResolvedValue({ data: {}, error: null });
});

describe("useSignOut", () => {
  it("signs out and goes to the login page", async () => {
    const { result } = renderSignOutHook();

    await act(() => result.current.signOut());

    expect(toast.success).toHaveBeenCalledWith("Signed out successfully");
    expect(router.replace).toHaveBeenCalledWith("/login");
    expect(result.current.isPending).toBe(false);
  });

  it.each([
    [
      "a known code",
      "SESSION_EXPIRED",
      "Your session has expired. Please sign in again.",
    ],
    ["an unknown code", "FAILED_TO_GET_SESSION", "Unable to sign out"],
  ])(
    "translates a Better Auth error with %s and stays on the page",
    async (_case, code, expected) => {
      authClient.signOut.mockResolvedValue({
        data: null,
        error: { code, message: "English text from the server" },
      });
      const { result } = renderSignOutHook();

      await act(() => result.current.signOut());

      expect(toast.error).toHaveBeenCalledWith(expected);
      expect(router.replace).not.toHaveBeenCalled();
    },
  );

  it("shows the failure message when the request throws", async () => {
    authClient.signOut.mockRejectedValue(new Error("offline"));
    const { result } = renderSignOutHook();

    await act(() => result.current.signOut());

    expect(toast.error).toHaveBeenCalledWith("Unable to sign out");
    expect(router.replace).not.toHaveBeenCalled();
    expect(result.current.isPending).toBe(false);
  });
});

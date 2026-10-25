import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LOGIN_IDENTIFIER_MAX_LENGTH } from "@/lib/config/auth";
import { IntlTestProvider } from "@/test-utils/intl-test-provider";
import { useLoginForm } from "./use-login-form";

const { authClient, router } = vi.hoisted(() => ({
  authClient: { signIn: { email: vi.fn(), username: vi.fn() } },
  router: { push: vi.fn() },
}));

vi.mock("@/lib/auth/auth-client", () => ({ authClient }));
vi.mock("@/i18n/navigation", () => ({ useRouter: () => router }));

const CALLBACK_URL = "/settings/security";

function renderLoginHook() {
  return renderHook(() => useLoginForm(CALLBACK_URL), {
    wrapper: IntlTestProvider,
  });
}

async function submit(
  result: { current: ReturnType<typeof useLoginForm> },
  identifier: string,
  password = "secret-pass",
): Promise<void> {
  await act(async () => {
    result.current.form.setValue("identifier", identifier);
    result.current.form.setValue("password", password);
    await result.current.form.handleSubmit(result.current.onSubmit)();
  });
}

// Better Auth calls onSuccess itself; the mock does the same on success.
function signInSucceeds(
  _credentials: unknown,
  handlers: { onSuccess: () => void },
): Promise<{ data: object; error: null }> {
  handlers.onSuccess();
  return Promise.resolve({ data: {}, error: null });
}

beforeEach(() => {
  authClient.signIn.email.mockImplementation(signInSucceeds);
  authClient.signIn.username.mockImplementation(signInSucceeds);
});

describe("useLoginForm", () => {
  it("signs in by email and goes to the callback URL", async () => {
    const { result } = renderLoginHook();

    await submit(result, "ann@example.com");

    expect(authClient.signIn.email).toHaveBeenCalledWith(
      {
        email: "ann@example.com",
        password: "secret-pass",
        rememberMe: true,
        callbackURL: CALLBACK_URL,
      },
      expect.anything(),
    );
    expect(authClient.signIn.username).not.toHaveBeenCalled();
    expect(router.push).toHaveBeenCalledWith(CALLBACK_URL);
  });

  it("signs in by username when there is no @", async () => {
    const { result } = renderLoginHook();

    await submit(result, "ann_99");

    expect(authClient.signIn.username).toHaveBeenCalledWith(
      expect.objectContaining({ username: "ann_99" }),
      expect.anything(),
    );
    expect(authClient.signIn.email).not.toHaveBeenCalled();
  });

  it.each([
    ["an identifier with spaces", "ann smith", "secret-pass"],
    ["a too short identifier", "an", "secret-pass"],
    ["a too short password", "ann@example.com", "short"],
  ])("does not call the server for %s", async (_case, identifier, password) => {
    const { result } = renderLoginHook();

    await submit(result, identifier, password);

    expect(authClient.signIn.email).not.toHaveBeenCalled();
    expect(authClient.signIn.username).not.toHaveBeenCalled();
  });

  // The form translates these Validation keys with useValidationMessage.
  it.each([
    ["identifierInvalid", "identifier", "ann smith", "secret-pass"],
    [
      "identifierTooLong",
      "identifier",
      "a".repeat(LOGIN_IDENTIFIER_MAX_LENGTH + 1),
      "secret-pass",
    ],
    ["passwordTooShort", "password", "ann@example.com", "short"],
  ] as const)(
    "reports %s on the %s field",
    async (key, field, identifier, password) => {
      const { result } = renderLoginHook();

      await submit(result, identifier, password);

      expect(result.current.form.getFieldState(field).error?.message).toBe(key);
    },
  );

  it("shows the translated sign-in error and stays on the page", async () => {
    authClient.signIn.email.mockResolvedValue({
      data: null,
      error: {
        code: "INVALID_EMAIL_OR_PASSWORD",
        message: "Invalid email or password",
      },
    });
    const { result } = renderLoginHook();

    await submit(result, "ann@example.com");

    expect(result.current.error).toBe("Invalid email or password.");
    expect(router.push).not.toHaveBeenCalled();
  });

  it("asks the user to wait when Better Auth rate-limits sign-in", async () => {
    // Better Auth's limiter answers 429 with a message but no code.
    authClient.signIn.email.mockResolvedValue({
      data: null,
      error: {
        status: 429,
        message: "Too many requests. Please try again later.",
      },
    });
    const { result } = renderLoginHook();

    await submit(result, "ann@example.com");

    expect(result.current.error).toBe(
      "Too many attempts. Please wait a minute and try again.",
    );
  });

  it.each([
    ["an unknown code", { code: "SOMETHING_NEW", message: "x" }],
    ["no code", { message: "x" }],
  ])("shows a generic error for %s", async (_case, error) => {
    authClient.signIn.email.mockResolvedValue({ data: null, error });
    const { result } = renderLoginHook();

    await submit(result, "ann@example.com");

    expect(result.current.error).toBe(
      "Something went wrong. Please try again.",
    );
  });

  it("shows a generic error when the request fails", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    authClient.signIn.email.mockRejectedValue(new Error("offline"));
    const { result } = renderLoginHook();

    await submit(result, "ann@example.com");

    expect(result.current.error).toBe(
      "Something went wrong. Please try again.",
    );
  });
});

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { IntlTestProvider } from "@/test-utils/intl-test-provider";
import { RegisterForm } from "./register-form.client";

const { authClient, router } = vi.hoisted(() => ({
  authClient: { signUp: { email: vi.fn() }, signIn: { social: vi.fn() } },
  router: { push: vi.fn() },
}));

vi.mock("@/lib/auth/auth-client", () => ({ authClient }));
// Only the router is replaced; the real locale-aware Link stays.
vi.mock("@/i18n/navigation", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/i18n/navigation")>()),
  useRouter: () => router,
}));

interface RegisterInput {
  name: string;
  username: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

const validInput: RegisterInput = {
  name: "Ann",
  username: "ann_99",
  email: "ann@example.com",
  password: "secret-pass",
  passwordConfirm: "secret-pass",
};

function renderForm() {
  render(<RegisterForm />, { wrapper: IntlTestProvider });
  return userEvent.setup();
}

// Pasting instead of typing key by key: these tests are about validation,
// and ~90 keystrokes with re-validation on each one can exceed the test
// timeout on a busy machine.
async function fillField(
  user: ReturnType<typeof userEvent.setup>,
  label: string,
  value: string,
): Promise<void> {
  await user.click(screen.getByLabelText(label));
  await user.paste(value);
}

async function fillAndSubmit(
  user: ReturnType<typeof userEvent.setup>,
  input: RegisterInput,
  { acceptTerms = true } = {},
): Promise<void> {
  await fillField(user, "Name", input.name);
  await fillField(user, "Username", input.username);
  await fillField(user, "Email address", input.email);
  await fillField(user, "Password", input.password);
  await fillField(user, "Password confirmation", input.passwordConfirm);
  if (acceptTerms) {
    await user.click(screen.getByRole("checkbox"));
  }
  await user.click(screen.getByRole("button", { name: "Create account" }));
}

beforeEach(() => {
  authClient.signUp.email.mockResolvedValue({ data: {}, error: null });
});

describe("RegisterForm", () => {
  it("shows the form's username limit of 40 characters", async () => {
    const user = renderForm();

    await fillAndSubmit(user, { ...validInput, username: "a".repeat(41) });

    expect(
      await screen.findByText("Username must be at most 40 characters long."),
    ).toBeInTheDocument();
    expect(authClient.signUp.email).not.toHaveBeenCalled();
  });

  it("says the passwords do not match", async () => {
    const user = renderForm();

    await fillAndSubmit(user, {
      ...validInput,
      passwordConfirm: "other-secret-pass",
    });

    expect(
      await screen.findByText("Passwords do not match."),
    ).toBeInTheDocument();
    expect(authClient.signUp.email).not.toHaveBeenCalled();
  });

  it("asks to accept the terms before signing up", async () => {
    const user = renderForm();

    await fillAndSubmit(user, validInput, { acceptTerms: false });

    expect(
      await screen.findByText("You must accept the terms and conditions."),
    ).toBeInTheDocument();
    expect(authClient.signUp.email).not.toHaveBeenCalled();
  });

  it("shows the translated sign-up error", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    authClient.signUp.email.mockResolvedValue({
      data: null,
      error: { code: "USER_ALREADY_EXISTS", message: "User already exists" },
    });
    const user = renderForm();

    await fillAndSubmit(user, validInput);

    expect(
      await screen.findByText("An account with this email already exists."),
    ).toBeInTheDocument();
    expect(router.push).not.toHaveBeenCalled();
  });

  it("names the failed action when sign-up fails unexpectedly", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    authClient.signUp.email.mockRejectedValue(new Error("offline"));
    const user = renderForm();

    await fillAndSubmit(user, validInput);

    expect(
      await screen.findByText("Unable to create your account."),
    ).toBeInTheDocument();
  });
});

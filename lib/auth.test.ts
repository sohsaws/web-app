import { describe, expect, it, vi } from "vitest";
import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
} from "@/lib/config/auth";

const { sendAuthEmail } = vi.hoisted(() => ({ sendAuthEmail: vi.fn() }));

// Prisma is an empty mock: the email callbacks never touch it, and the limit
// tests stop at the username plugin's length check or fail on the mock right
// after it. The hosted dashboard plugin is stubbed and no email is sent.
vi.mock("@/lib/prisma", () => ({ default: {} }));
vi.mock("@better-auth/infra", () => ({ dash: () => ({ id: "dash" }) }));
vi.mock("@/lib/email/send-auth-email", () => ({ sendAuthEmail }));

const { auth } = await import("./auth");

const url = "https://swiipy.test/api/auth/link?token=abc";
const token = "abc";

// Better Auth types the callback user without additional fields, but passes
// the full database row, locale included.
function userWithLocale(locale: unknown) {
  return {
    id: "user-1",
    createdAt: new Date(),
    updatedAt: new Date(),
    email: "user@example.com",
    emailVerified: true,
    name: "User",
    locale,
  };
}

function sendResetPassword(user: ReturnType<typeof userWithLocale>) {
  const callback = auth.options.emailAndPassword?.sendResetPassword;
  if (!callback) throw new Error("sendResetPassword is not configured");
  return callback({ user, url, token });
}

function sendVerificationEmail(user: ReturnType<typeof userWithLocale>) {
  const callback = auth.options.emailVerification?.sendVerificationEmail;
  if (!callback) throw new Error("sendVerificationEmail is not configured");
  return callback({ user, url, token });
}

function sendChangeEmailConfirmation(user: ReturnType<typeof userWithLocale>) {
  const callback = auth.options.user?.changeEmail?.sendChangeEmailConfirmation;
  if (!callback) {
    throw new Error("sendChangeEmailConfirmation is not configured");
  }
  return callback({ user, newEmail: "new@example.com", url, token });
}

// The real translations are used, so these tests also prove the user's
// locale picks the right messages.
describe("auth emails", () => {
  it("writes the reset password email in the user's language", async () => {
    await sendResetPassword(userWithLocale("de"));

    expect(sendAuthEmail).toHaveBeenCalledWith({
      to: "user@example.com",
      subject: "Swiipy-Passwort zurücksetzen",
      html: expect.stringMatching(/<html[^>]*\slang="de"/),
      text: expect.stringContaining("neues Passwort für dein Swiipy-Konto"),
    });
  });

  it("writes the verification email in the user's language", async () => {
    await sendVerificationEmail(userWithLocale("ru"));

    expect(sendAuthEmail).toHaveBeenCalledWith({
      to: "user@example.com",
      subject: "Подтвердите почту для Swiipy",
      html: expect.stringMatching(/<html[^>]*\slang="ru"/),
      text: expect.stringContaining("принадлежит вам"),
    });
  });

  it("sends the change email confirmation to the current address in the user's language", async () => {
    await sendChangeEmailConfirmation(userWithLocale("fr"));

    expect(sendAuthEmail).toHaveBeenCalledWith({
      to: "user@example.com",
      subject: "Confirmez la modification de votre adresse e-mail Swiipy",
      html: expect.stringMatching(/<html[^>]*\slang="fr"/),
      text: expect.stringContaining("new@example.com"),
    });
  });

  it.each([
    ["an unsupported locale", "xx"],
    ["a missing locale", undefined],
  ])("falls back to English for %s", async (_case, locale) => {
    await sendResetPassword(userWithLocale(locale));

    expect(sendAuthEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        subject: "Reset your Swiipy password",
        html: expect.stringMatching(/<html[^>]*\slang="en"/),
      }),
    );
  });
});

// The forms validate with lib/config/auth.ts; the server must accept exactly
// what they accept, or users see a form rule that the server then breaks.
describe("auth limits", () => {
  it("gives Better Auth the forms' password limits", () => {
    expect(auth.options.emailAndPassword).toMatchObject({
      minPasswordLength: PASSWORD_MIN_LENGTH,
      maxPasswordLength: PASSWORD_MAX_LENGTH,
    });
  });

  // The username plugin checks length before any database lookup, so a
  // name of the maximum length gets past it (and fails later on the mocked
  // database), while one character more is rejected as too long.
  function signInWithUsernameOfLength(length: number) {
    return auth.api.signInUsername({
      body: { username: "a".repeat(length), password: "secret-pass" },
    });
  }

  it("accepts a username of the forms' maximum length", async () => {
    const error: unknown = await signInWithUsernameOfLength(
      USERNAME_MAX_LENGTH,
    ).catch((caught: unknown) => caught);

    expect(error).not.toMatchObject({ body: { code: "USERNAME_TOO_LONG" } });
  });

  it("rejects a username one character over the forms' maximum", async () => {
    await expect(
      signInWithUsernameOfLength(USERNAME_MAX_LENGTH + 1),
    ).rejects.toMatchObject({ body: { code: "USERNAME_TOO_LONG" } });
  });
});

import { describe, expect, it, vi } from "vitest";

const { sendAuthEmail } = vi.hoisted(() => ({ sendAuthEmail: vi.fn() }));

// Only the auth email callbacks run here: no database, no hosted dashboard
// plugin, and no email leaves the process.
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

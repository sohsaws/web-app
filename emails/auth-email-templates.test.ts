import { describe, expect, it } from "vitest";
import englishEmailMessages from "@/messages/en/emails.json";
import { renderChangeEmailConfirmation } from "./change-email-confirmation-template";
import { previewEmailTranslator } from "./config/preview-email-translator";
import { renderResetPasswordEmail } from "./reset-password-template";
import { renderVerificationEmail } from "./verification-template";

// The real English messages; other languages are added later and fall back
// to these.
const messages = englishEmailMessages.Emails;
const t = previewEmailTranslator;
const ONE_HOUR = 60 * 60;
const url = "https://swiipy.test/api/auth/link?token=abc";

// The pretty printer wraps long lines, even inside a sentence or a tag.
function flatten(output: string): string {
  return output.replace(/\s+/g, " ");
}

describe("renderResetPasswordEmail", () => {
  it("takes the subject and body from the English messages", async () => {
    const email = await renderResetPasswordEmail({
      linkExpiresInSeconds: ONE_HOUR,
      locale: "en",
      t,
      url,
    });

    expect(email.subject).toBe(messages.resetPassword.subject);
    expect(email.subject).toBe("Reset your Swiipy password");
    expect(flatten(email.html)).toContain(messages.resetPassword.heading);
    expect(flatten(email.html)).toContain(messages.resetPassword.body);
    expect(flatten(email.html)).toContain(messages.resetPassword.button);
    expect(flatten(email.text)).toContain(
      "This password reset link expires in one hour.",
    );
  });

  it("sets the html lang to the user's locale", async () => {
    const email = await renderResetPasswordEmail({
      linkExpiresInSeconds: ONE_HOUR,
      locale: "de",
      t,
      url,
    });

    expect(email.html).toMatch(/<html[^>]*\slang="de"/);
  });

  it("states an expiry that is not a whole hour in minutes", async () => {
    const email = await renderResetPasswordEmail({
      linkExpiresInSeconds: 30 * 60,
      locale: "en",
      t,
      url,
    });

    expect(flatten(email.text)).toContain(
      "This password reset link expires in 30 minutes.",
    );
  });
});

describe("renderVerificationEmail", () => {
  it("takes the subject and body from the English messages", async () => {
    const email = await renderVerificationEmail({
      linkExpiresInSeconds: ONE_HOUR,
      locale: "en",
      t,
      url,
    });

    expect(email.subject).toBe(messages.verification.subject);
    expect(email.subject).toBe("Verify your Swiipy email");
    expect(flatten(email.html)).toContain(messages.verification.heading);
    expect(flatten(email.html)).toContain(messages.verification.body);
    expect(flatten(email.html)).toContain(messages.verification.button);
    expect(flatten(email.text)).toContain(
      "This verification link expires in one hour.",
    );
  });

  it("keeps the line break inside the ignore notice", async () => {
    const email = await renderVerificationEmail({
      linkExpiresInSeconds: ONE_HOUR,
      locale: "en",
      t,
      url,
    });

    expect(flatten(email.html)).toMatch(
      /If you didn(?:'|&#x27;)t request this, ?<br ?\/?> ?please ignore this email\./,
    );
  });

  it("sets the html lang to the user's locale", async () => {
    const email = await renderVerificationEmail({
      linkExpiresInSeconds: ONE_HOUR,
      locale: "ru",
      t,
      url,
    });

    expect(email.html).toMatch(/<html[^>]*\slang="ru"/);
  });
});

describe("renderChangeEmailConfirmation", () => {
  it("takes the subject and body from the English messages", async () => {
    const email = await renderChangeEmailConfirmation({
      linkExpiresInSeconds: ONE_HOUR,
      locale: "en",
      newEmail: "new@example.com",
      t,
      url,
    });

    expect(email.subject).toBe(messages.changeEmail.subject);
    expect(email.subject).toBe("Confirm your Swiipy email change");
    expect(flatten(email.html)).toMatch(
      /change your Swiipy email address to <strong ?> ?new@example\.com<\/strong ?> ?\. Confirm this request first; we will then verify the new address\./,
    );
    expect(flatten(email.html)).toContain(messages.changeEmail.button);
    expect(flatten(email.text)).toContain(
      "This confirmation link expires in one hour.",
    );
  });

  it("escapes the new address instead of rendering it as html", async () => {
    const email = await renderChangeEmailConfirmation({
      linkExpiresInSeconds: ONE_HOUR,
      locale: "en",
      newEmail: "<img src=x>@example.com",
      t,
      url,
    });

    expect(flatten(email.html)).not.toContain("<img src=x>");
    expect(flatten(email.html)).toContain("&lt;img src=x&gt;@example.com");
  });

  it("sets the html lang to the user's locale", async () => {
    const email = await renderChangeEmailConfirmation({
      linkExpiresInSeconds: ONE_HOUR,
      locale: "fr",
      newEmail: "new@example.com",
      t,
      url,
    });

    expect(email.html).toMatch(/<html[^>]*\slang="fr"/);
  });
});

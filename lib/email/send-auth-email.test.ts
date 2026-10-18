import { beforeEach, describe, expect, it, vi } from "vitest";

const { send } = vi.hoisted(() => ({ send: vi.fn() }));

vi.mock("resend", () => ({
  Resend: class {
    emails = { send };
  },
}));

const email = {
  to: "user@example.com",
  subject: "Verify your Swiipy email",
  html: "<p>Verify</p>",
  text: "Verify",
};

// The sender address is read once at import, so each test imports a fresh
// copy after setting the environment.
async function importSendAuthEmail() {
  vi.resetModules();
  const module = await import("./send-auth-email");
  return module.sendAuthEmail;
}

describe("sendAuthEmail", () => {
  beforeEach(() => {
    send.mockResolvedValue({ data: { id: "email-1" }, error: null });
  });

  it("sends the email from the default sender", async () => {
    vi.stubEnv("RESEND_FROM_EMAIL", undefined);
    const sendAuthEmail = await importSendAuthEmail();

    await expect(sendAuthEmail(email)).resolves.toBeUndefined();
    expect(send).toHaveBeenCalledWith({
      ...email,
      from: "Swiipy <onboarding@resend.dev>",
    });
  });

  it("uses the configured sender address", async () => {
    vi.stubEnv("RESEND_FROM_EMAIL", "Swiipy <auth@swiipy.test>");
    const sendAuthEmail = await importSendAuthEmail();

    await sendAuthEmail(email);

    expect(send).toHaveBeenCalledWith(
      expect.objectContaining({ from: "Swiipy <auth@swiipy.test>" }),
    );
  });

  it("throws when Resend reports an error instead of losing it", async () => {
    const resendError = { name: "validation_error", message: "Invalid `to`" };
    send.mockResolvedValue({ data: null, error: resendError });
    const sendAuthEmail = await importSendAuthEmail();

    const error = await sendAuthEmail(email).catch((caught: unknown) => caught);

    expect(error).toBeInstanceOf(Error);
    expect(error instanceof Error && error.message).toBe(
      "Failed to send authentication email",
    );
    expect(error instanceof Error && error.cause).toBe(resendError);
  });
});

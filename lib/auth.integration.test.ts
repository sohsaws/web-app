import { randomUUID } from "node:crypto";
import { afterAll, describe, expect, it, vi } from "vitest";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// Real Better Auth on the test database. Only side effects leave the
// process: no auth emails, and the dashboard plugin (a hosted Better Auth
// service) is replaced by an empty plugin.
vi.mock("@/lib/email/send-auth-email", () => ({ sendAuthEmail: vi.fn() }));
vi.mock("@better-auth/infra", () => ({ dash: () => ({ id: "dash" }) }));

// The test branch is a copy of production: only users created here, all with
// this run id in their email, are removed in afterAll.
const run = randomUUID();
const PASSWORD = "integration-test-password";

function testEmail(name: string): string {
  return `test-locale-${name}-${run}@example.test`;
}

async function signUp(name: string, cookie?: string) {
  return auth.api.signUpEmail({
    body: { name: "Locale test", email: testEmail(name), password: PASSWORD },
    headers: new Headers(cookie ? { cookie } : {}),
    returnHeaders: true,
  });
}

async function storedLocale(name: string): Promise<string | undefined> {
  const user = await prisma.user.findUnique({
    where: { email: testEmail(name) },
    select: { locale: true },
  });
  return user?.locale;
}

// The session cookie from a sign-up response, as a browser would send it back.
function sessionCookie(responseHeaders: Headers): Headers {
  const cookie = responseHeaders
    .getSetCookie()
    .map((setCookie) => setCookie.split(";")[0])
    .join("; ");
  return new Headers({ cookie });
}

afterAll(async () => {
  await prisma.user.deleteMany({ where: { email: { contains: run } } });
  await prisma.$disconnect();
});

describe("user locale with Better Auth and a real database", () => {
  it("stores the language a guest picked before signing up", async () => {
    await signUp("spanish", "NEXT_LOCALE=es");

    await expect(storedLocale("spanish")).resolves.toBe("es");
  });

  it.each([
    ["without a cookie", "none", undefined],
    ["with an unsupported cookie", "unsupported", "NEXT_LOCALE=kk"],
  ])("falls back to English %s", async (_case, name, cookie) => {
    await signUp(name, cookie);

    await expect(storedLocale(name)).resolves.toBe("en");
  });

  it("lets the user change the language and exposes it in the session", async () => {
    const { headers } = await signUp("changer");
    const requestHeaders = sessionCookie(headers);

    await auth.api.updateUser({
      body: { locale: "de" },
      headers: requestHeaders,
    });

    await expect(storedLocale("changer")).resolves.toBe("de");
    const session = await auth.api.getSession({ headers: requestHeaders });
    expect(session?.user.locale).toBe("de");
  });

  it("rejects an unsupported language through the validator", async () => {
    const { headers } = await signUp("rejected", "NEXT_LOCALE=fr");
    const requestHeaders = sessionCookie(headers);

    // BAD_REQUEST comes from the validator; a broken session would be
    // UNAUTHORIZED and must fail this test.
    await expect(
      auth.api.updateUser({ body: { locale: "kk" }, headers: requestHeaders }),
    ).rejects.toMatchObject({ status: "BAD_REQUEST" });

    await expect(storedLocale("rejected")).resolves.toBe("fr");
  });
});

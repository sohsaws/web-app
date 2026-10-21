import {
  getRedirectUrl,
  unstable_doesMiddlewareMatch,
} from "next/experimental/testing/server";
import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { config, proxy } from "./proxy";

const { getSession } = vi.hoisted(() => ({ getSession: vi.fn() }));

vi.mock("@/lib/auth", () => ({ auth: { api: { getSession } } }));

const ORIGIN = "http://localhost:3000";

function request(path: string, headers: Record<string, string> = {}) {
  return new NextRequest(`${ORIGIN}${path}`, { headers });
}

beforeEach(() => {
  getSession.mockResolvedValue({ user: { id: "u1" } });
});

// The Next 16 docs call this helper unstable_doesProxyMatch, but the installed
// 16.4 still exports it under its middleware name.
describe("proxy matcher", () => {
  it.each(["/", "/about", "/en", "/ru/dashboard", "/de/settings/profile"])(
    "runs on the page %s",
    (url) => {
      expect(unstable_doesMiddlewareMatch({ config, url })).toBe(true);
    },
  );

  it.each(["/api/auth/session", "/_next/static/chunk.js", "/icon.png"])(
    "skips %s",
    (url) => {
      expect(unstable_doesMiddlewareMatch({ config, url })).toBe(false);
    },
  );
});

describe("proxy: locale prefix", () => {
  it("sends a first visit without a language hint to English", async () => {
    const response = await proxy(request("/"));

    expect(getRedirectUrl(response)).toBe(`${ORIGIN}/en`);
  });

  it("follows the browser language for a path without a locale", async () => {
    const response = await proxy(
      request("/about", { "accept-language": "de-DE,de;q=0.9,en;q=0.5" }),
    );

    expect(getRedirectUrl(response)).toBe(`${ORIGIN}/de/about`);
  });

  it("prefers the saved language cookie over the browser language", async () => {
    const response = await proxy(
      request("/about", {
        "accept-language": "de-DE,de;q=0.9",
        cookie: "NEXT_LOCALE=es",
      }),
    );

    expect(getRedirectUrl(response)).toBe(`${ORIGIN}/es/about`);
  });

  it("serves a page that already has a locale without redirecting", async () => {
    const response = await proxy(request("/fr/about"));

    expect(getRedirectUrl(response)).toBeNull();
    expect(getSession).not.toHaveBeenCalled();
  });

  it("treats an unknown first segment as a path, not a locale", async () => {
    const response = await proxy(request("/eu/dashboard"));

    expect(getRedirectUrl(response)).toBe(`${ORIGIN}/en/eu/dashboard`);
    expect(getSession).not.toHaveBeenCalled();
  });
});

describe("proxy: signed-in pages", () => {
  it.each([
    "/ru/dashboard",
    "/ru/dive",
    "/ru/for-you",
    "/ru/settings/security",
  ])(
    "sends a guest on %s to the login page in the same language",
    async (path) => {
      getSession.mockResolvedValue(null);

      const response = await proxy(request(path));

      expect(getRedirectUrl(response)).toBe(`${ORIGIN}/ru/login`);
    },
  );

  it("checks the session with the request's own headers", async () => {
    const cookie = "better-auth.session_token=abc";

    await proxy(request("/en/dashboard", { cookie }));

    const [{ headers }] = getSession.mock.calls[0] ?? [{}];
    expect(headers.get("cookie")).toBe(cookie);
  });

  it("lets a signed-in user through", async () => {
    const response = await proxy(request("/en/dashboard"));

    expect(getRedirectUrl(response)).toBeNull();
  });

  it("adds the locale first and checks the session on the next request", async () => {
    const response = await proxy(request("/dashboard"));

    expect(getRedirectUrl(response)).toBe(`${ORIGIN}/en/dashboard`);
    expect(getSession).not.toHaveBeenCalled();
  });

  it.each(["/en/login", "/en/settingsx", "/en/about"])(
    "does not require a session on %s",
    async (path) => {
      getSession.mockResolvedValue(null);

      const response = await proxy(request(path));

      expect(getRedirectUrl(response)).toBeNull();
      expect(getSession).not.toHaveBeenCalled();
    },
  );
});

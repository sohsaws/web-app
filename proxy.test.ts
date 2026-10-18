import {
  getRedirectUrl,
  unstable_doesMiddlewareMatch,
} from "next/experimental/testing/server";
import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { config, proxy } from "./proxy";

const { getSession } = vi.hoisted(() => ({ getSession: vi.fn() }));

vi.mock("next/headers", () => ({ headers: async () => new Headers() }));
vi.mock("@/lib/auth", () => ({ auth: { api: { getSession } } }));

beforeEach(() => {
  getSession.mockResolvedValue({ user: { id: "u1" } });
});

// The Next 16 docs call this helper unstable_doesProxyMatch, but the installed
// 16.4.0 still exports it under its middleware name.
describe("proxy matcher", () => {
  it.each([
    "/dashboard",
    "/settings",
    "/settings/profile",
    "/settings/security",
  ])("runs on the protected path %s", (url) => {
    expect(unstable_doesMiddlewareMatch({ config, url })).toBe(true);
  });

  it.each(["/", "/about", "/login", "/register", "/api/auth/session"])(
    "skips the public path %s",
    (url) => {
      expect(unstable_doesMiddlewareMatch({ config, url })).toBe(false);
    },
  );
});

describe("proxy", () => {
  it("redirects to /login without a session", async () => {
    getSession.mockResolvedValue(null);

    const response = await proxy(
      new NextRequest("http://localhost:3000/settings/security"),
    );

    expect(getRedirectUrl(response)).toBe("http://localhost:3000/login");
  });

  it("lets a signed-in user through", async () => {
    const response = await proxy(
      new NextRequest("http://localhost:3000/dashboard"),
    );

    expect(getRedirectUrl(response)).toBeNull();
    expect(response.headers.get("x-middleware-next")).toBe("1");
  });
});

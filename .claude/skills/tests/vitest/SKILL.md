---
name: vitest
description: Vitest setup and rules for this project - config, scripts, CI step, mocking boundaries, unit tests, and tests of route handlers and server actions. Read together with ../SKILL.md (strategy). Use before writing or changing any Vitest test or config.
---

# Vitest

Part of the `tests` skill; the strategy and what to test live in
`../SKILL.md`. For client components and hooks also read `../rtl/SKILL.md`.

## Always read the docs first

As of 2026-10-09 Vitest is **5.x**. Check the current docs before writing
config:

- Next.js guide bundled with the installed version:
  `node_modules/next/dist/docs/01-app/02-guides/testing/vitest.md`
- Config: https://vitest.dev/config/
- Projects: https://vitest.dev/guide/projects.html. `vitest.workspace` is
  deprecated since 3.2; use `test.projects`. Since 5.0 `extends` defaults to
  `true`, so each project inherits root options such as `plugins`.
- Module mocking: https://vitest.dev/guide/mocking/modules

## Planned setup (verify against current docs before writing)

- Dev dependencies to propose: `vitest`, `vite-tsconfig-paths` (the `@/*`
  alias), `@vitejs/plugin-react` (TSX), `jsdom` (only for the component
  project, see `../rtl/SKILL.md`).
- `vitest.config.mts` at the project root with two `test.projects`:
  - `node`: `lib/**`, `app/api/**`, server actions, stores; files `*.test.ts`;
  - `jsdom`: components and hooks; files `*.test.tsx`.
- `server-only` throws outside a server build: alias it to an empty module.
  Vite options such as `resolve.alias` go at the **top level**, not inside
  `test`.
- Reset state between tests in the config (`clearMocks` / `restoreMocks`,
  `unstubEnvs`) instead of manual cleanup in every file.
- Scripts: `"test": "vitest run"` (CI, single run) and `"test:watch":
  "vitest"` (local watch mode).
- CI: add `npm test` to `.github/workflows/ci.yml` after the typecheck step,
  only once at least one test exists (`vitest run` fails when no test files
  are found).

## Mocking rules

Mock only the **boundaries** of our code, never the logic under test:

| Boundary | How |
|---|---|
| Session | `vi.mock("@/lib/auth")`; `auth.api.getSession` returns a fake session or `null` |
| DeepInfra | mock `@/lib/ai/deepinfra` (`createDeepInfraClient`) or the `@/lib/ai/generate-ideas` functions the route calls |
| Vercel Blob | `vi.mock("@vercel/blob")` (`put`, `del`); assert which URLs reach `del` |
| Prisma | mock `@/lib/prisma` only for route wiring tests; SQL logic goes to real-DB tests |
| `next/headers` | mock `headers()` for server actions |
| Env | `vi.stubEnv("NAME", "value")`; never real keys; never read `.env*` files |

- `vi.mock` calls are hoisted above the imports. Values used inside a mock
  factory must be created with `vi.hoisted`.
- Partial mocks: use the factory's `importOriginal`; it is async and must be
  awaited.
- Type mocked functions with `vi.mocked(fn)`; never `any`.

## Unit test pattern

```ts
// lib/blob/managed-blob-url.test.ts
import { describe, expect, it } from "vitest";
import { BLOB_FOLDERS, isUserBlobUrl } from "./managed-blob-url";

const store = "https://abc.public.blob.vercel-storage.com";

describe("isUserBlobUrl", () => {
  it("accepts the user's own avatar", () => {
    expect(
      isUserBlobUrl(`${store}/avatars/u1/a.png`, BLOB_FOLDERS.avatars, "u1"),
    ).toBe(true);
  });

  it.each([
    ["another user's avatar", `${store}/avatars/u2/a.png`],
    ["a similar user id", `${store}/avatars/u10/a.png`],
    ["a path that climbs out", `${store}/avatars/u1/../u2/a.png`],
    ["another host", "https://lh3.googleusercontent.com/a.png"],
  ])("rejects %s", (_label, url) => {
    expect(isUserBlobUrl(url, BLOB_FOLDERS.avatars, "u1")).toBe(false);
  });
});
```

Prefer `it.each` tables for edge cases: empty, maximum, invalid.

## Route handler pattern

Call the exported handler directly with a real `Request`:

```ts
// app/api/ideas/image/route.test.ts
import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";

const { getSession, generateImages } = vi.hoisted(() => ({
  getSession: vi.fn(),
  generateImages: vi.fn(),
}));
vi.mock("@/lib/auth", () => ({ auth: { api: { getSession } } }));
vi.mock("@/lib/ai/generate-ideas", () => ({ generateImages }));

function jsonRequest(body: unknown): Request {
  return new Request("http://localhost/api/ideas/image", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/ideas/image", () => {
  beforeEach(() => getSession.mockResolvedValue({ user: { id: "u1" } }));

  it("returns 401 and never calls the AI without a session", async () => {
    getSession.mockResolvedValue(null);
    const response = await POST(jsonRequest({ description: "x" }));
    expect(response.status).toBe(401);
    expect(generateImages).not.toHaveBeenCalled();
  });
});
```

- Assert the status and the public error body, and assert the provider's
  message is **not** in the response.
- One parameterized test can cover "no session → 401" for every protected
  route.

## Server action pattern

Server actions are public endpoints: call them with hostile input (`null`,
arrays, extra fields, wrong types) and assert they refuse **before** reading
the session or touching Prisma. Mock `next/headers` and `@/lib/auth` as in
the route pattern.

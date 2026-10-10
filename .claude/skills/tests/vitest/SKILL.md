---
name: vitest
description: Vitest setup and rules for this project - config, scripts, CI step, mocking boundaries, unit tests, and tests of route handlers and server actions. Read together with ../SKILL.md (strategy). Use before writing or changing any Vitest test or config.
---

# Vitest

Part of the `tests` skill; the strategy and what to test live in
`../SKILL.md`. For client components and hooks also read `../rtl/SKILL.md`.

## Always read the docs first

The project uses **Vitest 4.x** (4.1.11 installed 2026-10-10). Vitest 5 is
the latest major but requires Node `^22.12 || ^24 || >=26` and
`@types/node >=22`; the user runs Node 25 locally and the project has
`@types/node ^20`, so npm resolved 4.x. Move to 5 together with a Node LTS
upgrade. Check the docs for the installed major before writing config:

- Next.js guide bundled with the installed version:
  `node_modules/next/dist/docs/01-app/02-guides/testing/vitest.md`
- Config: https://vitest.dev/config/
- Projects: https://vitest.dev/guide/projects.html. `vitest.workspace` is
  deprecated since 3.2; use `test.projects`. In Vitest 4 a project does
  **not** inherit root options unless it sets `extends: true` (the default
  became `true` only in 5.0), so set it explicitly.
- Module mocking: https://vitest.dev/guide/mocking/modules

## Current setup (2026-10-10)

- Dev dependency: only `vitest`. The `@/*` alias is a one-line
  `resolve.alias` in the config, so `vite-tsconfig-paths` is not needed.
- `vitest.config.mts` at the project root: `environment: "node"`,
  `include: ["**/*.test.ts"]`, `exclude` adds `.next/**` and `e2e/**` to the
  defaults, `clearMocks`, `restoreMocks`, `unstubEnvs`.
- Scripts: `npm test` (`vitest run`, single run, used by CI) and
  `npm run test:watch` (`vitest`, local watch mode).
- CI: `Tests` step runs `npm test` after `Typecheck` in
  `.github/workflows/ci.yml`.
- Tests are colocated next to the code. Playwright E2E tests will live in a
  root `e2e/` folder (decided 2026-10-10).

## Next additions (when the first test needs them)

- **`server-only`**: Next.js provides it internally, so it is not in
  `node_modules`. The first test that imports `lib/data/**` or `lib/ai/**`
  needs a stub module and a `resolve.alias` entry for `"server-only"`.
  Vite options such as `resolve.alias` go at the **top level**, not inside
  `test`.
- **Component tests**: add `jsdom` and RTL (see `../rtl/SKILL.md`), then split
  the config into two `test.projects` with `extends: true`: `node` for
  `*.test.ts` and `jsdom` for `*.test.tsx`. `@vitejs/plugin-react` is needed
  only if TSX transforms require it; check before adding.

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

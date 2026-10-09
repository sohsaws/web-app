---
name: tests
description: Test strategy for this project and the entry point to the Vitest and React Testing Library guides. Use before adding, changing, or reviewing any test, test config, mock, or the CI test step, and when deciding whether a change needs a test.
---

# Tests: strategy and navigation

Strategy agreed with the user on 2026-10-09. **Nothing is installed yet**:
Vitest, RTL and their config arrive with the first unit tests (stage 1). Ask
before adding dev dependencies and state why each is needed.

## Read the tool guide that matches the work

This folder holds one guide per tool. Read the relevant one before writing
code; read both for component tests.

- **`vitest/SKILL.md`**: Vitest config, scripts, CI step, mocking rules,
  unit tests, route handler and server action tests.
- **`rtl/SKILL.md`**: React Testing Library for client components and hooks:
  queries, `user-event`, async UI, TanStack Query wrapper.

## Which tool for which test

| Level | Tool | What |
|---|---|---|
| 0 static | Biome, `tsc` | already in CI |
| 1 unit | Vitest, `node` env | pure logic: schemas, guards, helpers, stores |
| 2 integration | Vitest, `node` env, **no RTL** | route handlers and server actions called directly |
| 2 components | Vitest + RTL, `jsdom` env | client components and hooks with behavior |
| 3 real DB | Vitest + real Postgres | raw SQL, cascades, transactions |
| 4 E2E | Playwright | user journeys in a real browser |

RTL is a library that runs inside Vitest, not a test level. Route and server
action tests need no DOM, so they never use RTL.

## Deciding what to test

Test where **likelihood of a bug × cost of the bug** is high:

1. Access: every protected route and server action answers 401 / refuses
   without a session.
2. Ownership: a user can touch only their own cards and blobs
   (`isUserBlobUrl` in `lib/blob/managed-blob-url.ts`).
3. Money: invalid or unauthenticated requests never reach DeepInfra (assert
   the mocked client was **not called**).
4. Account deletion: blobs deleted before the DB cascade; a blob failure
   aborts the deletion.
5. Input boundaries: Zod schemas in `lib/config/*`, runtime guards in server
   actions (`isNotificationPreferences`).
6. Main journey: sign in → `/dive` → swipe right → card in "Your pocket" (E2E).

Pick the **cheapest test that can actually catch that kind of bug**. Mocking
Prisma in a test of a raw SQL query only proves the mock returns what it was
told; such logic needs a real database.

When fixing a bug, first write a test that reproduces it, then fix.

## What not to test

- What TypeScript already guarantees, trivial code, third-party library
  behavior (test *our* schema rules, not Zod itself).
- Tailwind classes, styles, animation timing. Visual checks come later via
  Playwright screenshots once the design is stable; accessibility via axe in
  E2E. Logic hidden in animations (for example the swipe threshold) is
  extracted and unit-tested.
- `async` Server Components: Vitest cannot render them; cover them with E2E.

## Files and naming

- Tests are **colocated** next to the code: `managed-blob-url.ts` →
  `managed-blob-url.test.ts`; components use `.test.tsx`.
- Logic that needs a test but lives inside a component (for example
  `getSwipeDirection` in `cards-pool.client.tsx`) moves to `lib/` first.
- Test names describe behavior: `it("rejects another user's avatar URL")`.

## Snapshots

Avoid snapshots of components: they fail on every change and get updated
blindly. Allowed for small, stable, meaningful output, for example the text
version of React Email templates, preferably with `toMatchInlineSnapshot()`.

## Validation

After adding or changing tests run `npx vitest run` twice; a different result
on the second run means a flaky test, which must be fixed, not ignored. Never
delete or skip a failing test to make CI green.

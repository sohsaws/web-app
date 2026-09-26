---
name: typescript
description: Engineering judgment checklist for this strict TypeScript Next.js App Router project. Use before writing, changing, reviewing, or suggesting any TypeScript/React code, route handlers, server actions, hooks, Prisma queries, Better Auth code, or Zod schemas. Covers design principles, the pre-code validation loop, Next.js file conventions, data access, auth, and Biome tooling.
---

# Engineering Judgment

Write code that is correct, readable, maintainable, and proportionate to the
problem. A future maintainer should understand it quickly. Avoid cleverness that
hides bugs.

When the user asks to improve repository guidance, update this skill with
focused lessons from the current codebase, not generic rules.

## Design principles

### SOLID, applied pragmatically

- Single Responsibility: each function, component, action, route, or module has
  one clear reason to change.
- Open/Closed: add behavior through clear extension points instead of editing
  many unrelated places.
- Liskov Substitution: every valid implementation of an accepted shape must
  behave safely.
- Interface Segregation: do not force broad props, configs, or service APIs when
  the caller needs a small slice.
- Dependency Inversion: depend on small stable abstractions when that reduces
  real coupling.

Do not add interfaces, factories, or layers unless they remove real complexity
or protect a real boundary.

### KISS

If a plain function or small component solves it, use that. Good simple code has
clear names, local obvious control flow, no unnecessary state, input validation
near boundaries, and visible failure paths.

### DRY

Avoid meaningful duplication: business rules, validation schemas, tokens,
messages, and API response shapes.

- Define related constants once in a canonical config object under
  `lib/config/`. Derive lookup tables, allowed-value lists, union types, and UI
  strings from it instead of repeating literals across files.
- Keep stable domain entities and their invariants in `lib/entities`. That
  folder does not exist yet; shared types currently live in `lib/types/`. Colocate
  component-, hook-, form-, and transport-specific types with their owner. Move
  them to a shared module only when several layers truly consume them.
- Prefer harmless duplication over a vague premature abstraction. Two similar
  UI pieces can stay separate until the shared pattern is stable.

### YAGNI

Do not build future features before they are needed. Leave extension points only
where the current code naturally suggests them.

### Least astonishment

Code behaves as its name and location suggest. Components render UI. Hooks are
named `useSomething`. Server actions validate and authorize their own mutation.

## Complexity and understanding

Understanding beats compactness. Avoid both long repetitive code and dense
clever code. Aim for:

- small named helpers for repeated or non-obvious logic;
- explicit branches for important states;
- semantic types for important domain concepts;
- early returns for invalid states;
- comments only for non-obvious decisions.

When code is hard to follow, improve names and structure first. Add
abstractions only when they reduce real cognitive load.

## Validation loop before suggesting or writing code

Walk through every step before proposing or applying code:

1. **Syntax.** Imports, exports, JSX structure, types, async/await, file
   boundaries.
2. **Runtime.** Null/undefined, loading states, race conditions, stale state,
   redirects, error paths.
3. **Security.** Authentication, authorization, server-side validation,
   secrets, file uploads, user-controlled input.
4. **Data model.** Prisma schema constraints, unique indexes, relations,
   existing migrations.
5. **React/Next.** Server/client boundaries, hook rules, route groups, server
   actions, route handlers, session updates.
6. **UX.** Disabled states, toasts, form feedback, mobile layout, empty/error
   states, text fit.
7. **Maintainability.** Naming, duplication, coupling, hidden side effects,
   obviousness of future edits.
8. **Wider impact.** Does a narrow fix break another route, component, token,
   auth flow, or shared helper?

A change that looks correct locally must still be checked in the wider app flow.

## Project preferences

- Reuse the existing stack: Next.js App Router, Prisma, Better Auth, React Hook
  Form, Zod, Sonner, TanStack Query, Zustand, Tailwind v4, Biome, strict
  TypeScript.
- Validate on the server even when the client already validates with Zod.
- Keep auth-required mutations behind Better Auth server-side session and
  authorization checks.
- Prefer semantic app-level tokens for repeated colors, sizes, and layout
  values. See the tailwind skill.
- Make precise, line-level patches. Do not delete and reinsert unchanged code,
  large blocks, or whole files when an in-place edit works.
- Add central wrappers, such as for toast messages, only when repetition is
  real.
- Never call hook-like components as plain functions. Make them real components
  or real hooks.

## Modern TypeScript

- Treat `strict` as a design tool. Model nullability, loading, empty, and error
  states explicitly.
- No `any`. Keep unknown input as `unknown` until validation narrows it.
- Prefer inferred local types, exported domain types for shared contracts, and
  Zod schemas at runtime boundaries.
- Use `import type` for type-only imports.
- No non-null assertions as a shortcut around missing checks.
- Use discriminated unions for multi-state flows: auth status, token
  validation, uploads, async form results.
- Keep data-fetching contracts narrow. Response types reflect what the UI
  consumes, not whole database records.
- Prisma models, TypeScript types, and runtime validation of AI responses are
  related but separate. Prefer a Prisma payload type or a Zod schema as the
  single canonical source instead of hand-duplicating the contract.
- Never import server-only modules such as Prisma into client components,
  client hooks, or `"use client"` files.

## Next.js App Router

- Default to Server Components. Use Client Components only for state, effects,
  browser APIs, event handlers, client-only libraries, and interactive
  animation.
- Name ordinary components `name.client.tsx` and `name.server.tsx`. Keep
  framework filenames unchanged: `page.tsx`, `layout.tsx`, `route.ts`,
  `loading.tsx`, `error.tsx`.
- Every `page.tsx` is a Server Component. It composes route-local components
  from `_components/` or reusable ones from root `components/`. Interactivity
  lives below the page boundary.
- A component used by one route stays in that route's `_components/`. Promote it
  to root `components/` only when truly reused.
- React-hook logic that coordinates business data, requests, mutations, or
  domain state goes in a named hook under root `hooks/`. Small presentational
  state may stay local.
- Static rendering is not the opposite of Server Components. A server-rendered
  page is static if it avoids request-time data.
- Mark intentionally static marketing pages with
  `export const dynamic = "error"` so accidental dynamic APIs fail loudly.
- Route handlers for HTTP APIs and external boundaries. Server actions for
  internal mutations and form workflows.
- Server data helpers go in `lib/data/`. Mutation actions go in `lib/actions/`.
- Zustand stores currently live in `app/stores/`.

## Better Auth

- Better Auth is the only user and auth system. Do not add Clerk, Auth0, or
  NextAuth packages, APIs, components, schema fields, or middleware.
- Server config lives in `lib/auth.ts`. The React client lives in
  `lib/auth/auth-client.ts`.
- Use Better Auth server APIs in Server Components, layouts, route handlers,
  `proxy.ts`, and server actions.
- Use the Better Auth React client and its hooks only in Client Components.
- Enforce protected routes at a boundary such as `proxy.ts` or a route-group
  layout, not with scattered page checks.
- When enabling a Better Auth plugin, add every field it needs to the Prisma
  schema, create and apply a migration, and regenerate the client before
  testing the flow.
- Remove stale Clerk, Auth0, NextAuth, and custom-auth leftovers as related code
  is migrated. Do not rely on them.

## Biome and tooling

- Read `package.json` before running scripts.
- Read `biome.json` before formatting or lint advice. Biome enforces strict
  TypeScript, React, a11y, and no-`any` rules.
- Read `tsconfig.json` before diagnosing type behavior. Strict mode and the
  `@/*` path alias are enabled.
- If the editor cannot find Biome, verify the workspace root and the local
  binary at `node_modules/.bin/biome`.

## Reference-driven UI work

A Magic UI reference repo sits next to this app at `../magicui-reference-2`.
When using any repo as inspiration, first read its instructions, entry points,
global styles, config files, and local skills or registry metadata. Extract
durable patterns. Do not copy architecture wholesale.

Patterns worth applying selectively:

- Keep marketing and docs route groups mostly static for SEO and CDN caching.
  Avoid `auth()`, `cookies()`, `headers()`, and request-dependent redirects in
  pages meant to be pre-rendered.
- Treat `robots.ts`, `sitemap.ts`, metadata helpers, and public docs files as
  part of discoverability, not afterthoughts.
- For registry-style components, separate primitives, examples, metadata,
  generated output, and docs. Metadata declares extra dependencies, CSS
  variables, and keyframes so installs stay reproducible.
- Wrap generated or third-party UI in local section components instead of
  heavily editing their internals.
- For motion-heavy or responsive UI, check keyboard access, mobile overflow,
  readability under effects, and client-component cost.

## Reviewing code

Prioritize in this order:

1. correctness bugs;
2. security and data integrity risks;
3. broken user flows;
4. maintainability problems;
5. style and naming.

Be direct about weak design decisions. Explain the reason and the safer
alternative.

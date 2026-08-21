# Agent Instructions

These instructions govern work in this repository. They are written for Codex and other coding agents working with the user as a technical partner.

## Role

- Act as a senior engineering partner and mentor, not as the user's manager.
- Be direct, pragmatic, and technical. Explain trade-offs clearly, then help the user decide.
- Do not silently make architectural decisions when the impact is broad. State the assumption or ask.
- Prefer small, understandable changes over clever or heavily abstracted code.

## Repository Orientation

- Workspace root: this repository root, referred to as `<workspace root>`.
- Application root: `my-app/`.
- Most project commands, package metadata, and configs live under `my-app/`, not the workspace root.
- Before substantial work, inspect the current project shape. Useful files to check:
  - `my-app/package.json` for scripts, dependencies, and package-manager expectations.
  - `my-app/biome.json` for formatter, lint, a11y, React, and TypeScript rules.
  - `my-app/tsconfig.json` for TypeScript strictness, path aliases, and compiler behavior.
  - `my-app/next.config.ts`, `my-app/proxy.ts`, `my-app/app/layout.tsx`, and relevant route-group layouts.
  - `my-app/prisma/schema.prisma` before data-model or database work.
- Re-check these files time to time, especially after dependency, tooling, auth, or project-structure changes.

## Privacy And Environment Files

- Do not read `.env`, `.env.*`, secret files, private keys, or token/config files unless the user explicitly asks and it is necessary.
- It is fine to check that env files exist by filename.
- Never print secret values into the conversation.
- When env values are needed, ask the user to verify the names or provide redacted examples.

## TypeScript Standard

- This is a strict TypeScript application. Treat `strict` and `strictNullChecks` as real design constraints, not noise.
- Avoid `any`. Use narrow types, `unknown` with explicit refinement, Zod schemas, or generated Prisma/Clerk/Next types.
- Prefer `import type` for types.
- Do not use non-null assertions unless there is a clear invariant and no safer local narrowing.
- Validate data at trust boundaries: route handlers, server actions, form submissions, upload endpoints, and external callbacks.
- Keep types close to the domain they describe. Do not create broad global types for local data.

## Stack Snapshot

- Next.js App Router with React 19 and TypeScript.
- Tailwind CSS v4 through PostCSS with tokens in `app/globals.css`.
- Clerk is the active auth direction. Existing NextAuth files may still be present during migration; do not assume they are authoritative.
- Prisma 7 with PostgreSQL adapters.
- Biome is the formatter/linter. Scripts currently live in `my-app/package.json`.
- React Hook Form, Zod, Sonner, React Email, Vercel Blob, Motion, Lucide, and TanStack Query are available dependencies.

## Command And Navigation Conventions

- You may navigate with normal shell commands such as `cd`, `Get-ChildItem`, `rg`, and package scripts.
- Prefer `rg` / `rg --files` for searching.
- Run commands from `my-app/` when using project scripts like `npm run build`, `npm run check`, `npm run lint`, `npm run dev`, and `npm run format`.
- Before suggesting or running a command, check `my-app/package.json` because scripts may change.
- Do not run destructive commands such as recursive deletion, resets, or broad cleanup without explicit approval.
- Do not commit, push, or rewrite git history unless the user explicitly asks.

## Editing Rules

- Before modifying any file, describe the intended change and ask the user for explicit permission. Do not edit until the user confirms. A direct request in the current message to make a specific edit counts as permission only for that exact edit.
- Keep patches focused around the requested lines and related behavior.
- Do not delete and recreate a whole file unless the file is genuinely unrecoverable or the user explicitly requests it.
- Do not modify unrelated files while fixing a local issue.
- Preserve user changes in a dirty worktree. Never revert changes you did not make unless the user asks.
- Use existing project patterns before introducing a new abstraction.
- Add comments only for non-obvious reasons or constraints.

## Next.js And React Rules

- Server Components are the default. Add `"use client"` only when a component needs hooks, browser APIs, event handlers, client-side state, animation state, or client-only libraries.
- Static rendering and Server Components are different concepts. A Server Component can still be static if it avoids request-time APIs.
- For pages intended to be static and SEO-friendly, avoid `cookies()`, `headers()`, request-bound auth checks, uncached fetches, and request-dependent redirects.
- Use `export const dynamic = "error"` when a static route should fail loudly if someone introduces dynamic behavior. Use `force-static` only when that behavior is intended.
- Keep route-local components in `app/**/_components` when they are not shared.
- Put reusable primitives in `components/ui`, generated/adapted visual primitives in dedicated folders, and shared app shell pieces in `components/layout`.
- Make client/server boundaries visible in filenames when useful: `*.client.tsx` and `*.server.tsx`.

## Data Access

- Client reads that need caching, stale state, or deduping can use TanStack Query with native `fetch`.
- Server reads should use direct server helpers, Prisma, or Next's `fetch` caching where appropriate.
- Use server actions mainly for internal mutations: form submissions, account changes, profile updates, deletes, and operations that need `revalidatePath`, `revalidateTag`, or `redirect`.
- Use route handlers for HTTP boundaries: client-side queries, external callbacks/webhooks, upload endpoints, and APIs consumed outside a single server action.
- Never import Prisma or server-only code into client components or client hooks.

## Auth Rules

- Clerk is the target auth system.
- Use Clerk server APIs in server components, layouts, route handlers, middleware/proxy, and server actions.
- Use Clerk client hooks/components only inside client components.
- During migration, remove or isolate stale NextAuth assumptions before relying on auth behavior.
- Protected routes should be enforced at the route boundary, preferably middleware/proxy or a route-group layout, not by scattered page-level checks.

## Styling And UX

- Prefer Tailwind v4 tokens in `app/globals.css` for repeated design values.
- Prefer Tailwind classes and arbitrary values for one-off layout behavior.
- Add raw CSS, custom variants, or `@utility` only when a pattern repeats or cannot be expressed clearly in Tailwind classes.
- Keep the visual style sparse, dark, neutral, and readable unless the user asks otherwise.
- Check mobile width, text overflow, fixed headers/footers, scroll behavior, and keyboard focus states for UI changes.
- Do not stack high-motion effects without a clear reason. Decorative effects should be non-interactive and `aria-hidden` when appropriate.

## Tooling And Validation

- Biome config is `my-app/biome.json`; the Biome extension should be pointed at the `my-app` workspace or binary.
- TypeScript config is `my-app/tsconfig.json`; strict mode is enabled.
- Use validation proportional to risk:
  - Small UI-only change: read changed files and suggest or run `npm run check` if allowed.
  - Shared logic, auth, data, or routing change: run or suggest `npm run check` and `npm run build`.
  - Dependency changes: inspect `package.json` and `package-lock.json`, and report audit warnings.
- If validation cannot be run, say exactly what was not run and why.

## Communication

- Keep responses concise, but do not hide important reasoning.
- When making an assumption, state it.
- When a requested approach is risky, explain the risk and offer the safer alternative.
- At completion, list changed files, important commands run, validation status, and any open risks.

# Project Memory

Durable project decisions and context. Imported into `CLAUDE.md`, so it loads
every session. Re-read it if it may have changed during a session. When the user
makes a new project decision, add or update a dated line here and remove lines
that turn out to be wrong.

Migrated from `.codex/memory/MEMORY.md` on 2026-09-26.

## Working relationship

- Act as the user's pair-programming partner and technical mentor, not an
  autonomous replacement for the developer. Explain findings, trade-offs,
  proposed code, and why it fits the project.
- By default, only analyze and propose code. Edit project code only with the
  user's direct permission for that change. Read-only inspection and
  diagnostics are always allowed.
- The user prefers clean structure, focused patches, direct mentorship, and
  practical explanations over heavy-handed control.

## Stack and auth

- Strict TypeScript Next.js App Router app with Tailwind v4, Biome,
  Prisma/PostgreSQL, Better Auth, TanStack Query, Zustand, Sonner, and Motion.
- Better Auth is the only user/auth system. Clerk and Auth0 are not part of the
  target architecture. Remove legacy references as related code is migrated.
- Review snapshot (2026-08-13): Prisma uses Better Auth models (`User`,
  `Account`, `Session`, `Verification`), but some routes/actions still
  referenced removed legacy fields and models such as `clerkId`, `username`,
  `bio`, `passwordHash`, and `verificationToken`. Verify the current state
  before relying on auth or user data.
- Known leftovers (2026-09-26): a `clerk-captcha` element in the register page,
  and a NextAuth path in the `include` list of `tsconfig.json`.
- Destructive auth/database migrations are acceptable while the database holds
  only disposable test data. Still say when a migration drops data.
- Database is on Neon's Free plan.

## File conventions

- Name ordinary Client and Server Components `name.client.tsx` and
  `name.server.tsx`. Next.js convention files keep their framework names.
- Components used by one route live in that route's `_components/`. Genuinely
  reusable components live in root `components/`.
- Every `page.tsx` is a Server Component. Interactive behavior sits below the
  page boundary.
- React-hook logic that works with business data goes in named hooks under root
  `hooks/`. Small purely visual state stays local.
- Reused CSS rules and global style primitives go in `app/globals.css`. One-off
  styling stays local with Tailwind utilities.

## MVP product decisions

- **Dashboard** is the primary decision workspace: top navigation (`Dashboard`,
  `Explore`, and a disabled coming-soon area), a `Welcome back, {userName}`
  greeting, a swipe deck, a Favorites preview linking to a dedicated page, a
  `Most likely` placeholder, and space for metrics.
- **Card lifecycle.** AI-generated cards are transient until liked. A dismissed
  card is never stored in PostgreSQL; only a bounded in-memory undo history is
  kept. A liked card becomes persistent Favorites data and is deleted when the
  user removes it from Favorites.
- **Deck persistence.** The active generated deck should survive a reload but
  stay browser-session scoped, cleared when the tab/session ends or the user
  signs out. Zustand is installed and stores exist in `app/stores/`, but
  session-scoped persistence is not implemented yet (2026-09-26).
- **Generation pipeline is an open decision.** Either generate a full batch and
  make the user wait, or generate an initial batch and replenish while they
  swipe. Do not assume either until the user chooses.
- **Images are optional for the MVP.** First confirm a suitable free
  image-generation provider exists. If images are used, persist only images of
  liked cards in Vercel Blob. Dismissed-card images must never become orphaned
  blobs.
- **Most likely** is a future AI recommendation built from at least 20 liked
  cards, eventually run by a free task scheduler at an undecided interval. The
  MVP shows only a placeholder.

## Dashboard metrics

- Planned MVP metrics: `Saved ideas` (total plus a recent-period delta),
  `Most likely progress` (`likedCount / 20`), and `Ideas explored` for the
  current browser session.
- Sources stay explicit. Saved ideas and the Most likely threshold come from
  persistent Favorites data in PostgreSQL. Ideas explored is session-scoped
  state in Zustand/sessionStorage unless historical counters are added later.
- Future candidates: save rate, dominant interest categories, completed
  decisions per week, activity streak, average cards reviewed before a final
  decision. Prefer metrics that reflect delivered value over vanity stats.
- **Category distribution (decided 2026-09-25).** Percentage is the share of
  all category assignments across the user's saved cards: occurrences of a
  category divided by total category assignments, times 100. Do not divide by
  card count or weight cards equally. Show only categories present in saved
  cards. Implemented as a parameterized PostgreSQL aggregation in
  `lib/data/get-category-distribution.ts`, an authenticated
  `GET /api/ideas/favorites/categories`, and a separate TanStack Query under the
  favorites key. No stored function, persisted percentages, or client-side
  full-collection aggregation. The widget sits to the right of "Your pocket" on
  desktop. The earlier card-count-based widget was reverted.

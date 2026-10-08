# Project Memory

Durable project decisions and context. Imported into `CLAUDE.md`, so it loads
every session. Re-read it if it may have changed during a session. When the user
makes a new project decision, add or update a dated line here and remove lines
that turn out to be wrong.

Migrated from `.codex/memory/MEMORY.md` on 2026-09-26.

## ⭐⭐⭐ THIRD NAV PAGE: AI PERSONALIZATION — FULL SPEC (decided 2026-10-04) ⭐⭐⭐

**READ THIS WHOLE SECTION BEFORE ANY WORK ON THE THIRD NAV PAGE. It was agreed
with the user over a long discussion on 2026-10-03/04. Nothing here is built
yet. Do not re-propose rejected ideas.**

### What the feature is

**The third page of the app (after "Overview" `/dashboard` and "Dive" `/dive`)
turns the user's swipes into concrete, real-world suggestions found by an AI
that can call tools.** Saved (liked) idea cards are the input. The output is a
list of specific things to do, with real links: places to go, clubs or sections
to join, films, series, games, articles, channels, and so on.

- **Example, focused user:** most likes are about sport. Suggest real gyms,
  sections, matches, sports films or series, with links.
- **Example, scattered user:** likes are mixed (cinema, music, games). Suggest
  broad real options: the nearest cinema, a computer club, a concert venue.
- **Topics are completely unpredictable:** anything from cooking and games to
  astrophysics papers or true-crime documentaries. The design must not assume
  a fixed set of domains.
- **Why it matters:** it is the reward for swiping. More likes give better
  suggestions, which makes the user want to swipe more. Value must come from
  the user's own swipe data, so it is something ChatGPT cannot give in one
  prompt.

### Ideas the user REJECTED (do not suggest again)

- **List of all registered users with online/offline status.** Social features
  are excessive for the MVP; seeing who is online has no purpose without an
  action between people. The old "Community" users list is superseded.
- **Public feed of shared ideas, "Popular this week", collections, challenges.**
- **Archetypes / personality types / "-core" aesthetics / Wrapped-style
  portrait of the user.** "Who you are" was judged low-value information.
- **Tournament of favorites / "decision of the day" / AI-made poster.** Not
  chosen.

### Trigger rule (approved 2026-10-04)

- **Runs after every 30 new saves, at most once per 24 hours per user.**
- On each card save the server checks:
  `lifetimeSaves - savesAtLastRun >= 30` **AND** last run was ≥ 24h ago (or
  there was no run yet). If both hold, start a run and store the current time
  and current `lifetimeSaves`.
- **`lifetimeSaves` only grows.** Unsaving a card does not lower it, so
  unsave/re-save cannot farm runs. (Saved cards are deleted from the DB when
  unfavorited, so counting current favorites would be exploitable.)
- **No pending flag and no scheduler.** A threshold blocked by the cooldown
  simply fires on the next save after the cooldown ends. Accepted trade-off: if
  the user stops saving, the deferred run waits for their next save.
- DB fields needed on the user: `lifetimeSaves`, `lastPersonalizedAt`,
  `savesAtLastPersonalization` (names not final).

### How a run works

1. **Input:** the user's saved cards (title, description, categories), about
   4–5k tokens for 30 cards. The existing category distribution can be added
   as a summary.
2. **Our code picks the tools, not the model.** Content tools (web search,
   later TMDB/RAWG-style APIs) are always available. A places tool is given
   only if the user has a location set / consented. If there is no consent the
   model simply never receives that tool; a prompt rule is not enough.
3. **The model plans, calls tools, maybe several rounds**, then returns
   recommendations as structured output (Zod-validated): title, short
   description, why it fits, link.
4. **Grounding guard:** our code drops any recommendation whose link did not
   come from tool results. The AI never invents places, addresses, or URLs.
5. **Save the result to the DB** and show it on the third page.

### Architecture decisions and reasoning

- **Background execution.** A tool loop can take 20–60+ s, so it must not
  block the card save. Plan: the save creates a run with status
  `pending`, the work continues after the response via Next.js `after()` (or a
  queue like QStash/Inngest if needed), and the status becomes `ready` or
  `failed`. The page shows progress / "preparing" / results / error.
- **Prevent double runs** while one is still `pending`.
- **Hard cap on tool-loop rounds** (about 5) to stop runaway costs.
- **Start as a pipeline, not a free-form agent:** model turns likes into search
  queries, our code calls the APIs, model selects and explains. Fewer and
  predictable calls. Can evolve into a full tool-calling agent later.
- **RAG vs MCP (discussed):** RAG fits our own data later (pgvector exists on
  Neon); it does not replace live APIs for places or films. MCP is just one
  packaging for tools; on Vercel serverless, plain OpenRouter tool calling is
  simpler. The user's "use tools for real facts" idea is correct in spirit.
- **Web search is the core source** because topics are open-ended. Candidate
  providers: OpenRouter web search (paid, via Exa), Tavily, Brave Search, Exa.
  Specialized APIs (TMDB films/series, RAWG games, maps for places) are
  quality add-ons per domain.
- **Location for the MVP: a city field in the profile.** Browser geolocation
  with a small pre-permission modal ("we use location for better
  personalization, enable it?") is deferred because it is harder and because
  coordinates are only available while the user is on the page. If
  coordinates are ever stored, store them coarse (district level).
- **Results storage for the MVP:** one JSON column on the run record,
  validated with Zod on read. A separate recommendations table only when
  per-item actions ("went there", "not interested") are needed.
- **Model:** tool calling needs a capable model; free OpenRouter models are
  weak at it. Plan a cheap paid model for this feature.

### Cost and budget (estimates, verify current prices)

- One run ≈ 3–5 model calls (~40k tokens) + ~5 searches ≈ **$0.03–0.05**.
  Search dominates the cost.
- **$10 OpenRouter pay-as-you-go is enough for development** (~200 runs). As
  far as known, topping up ≥ $10 also raises the free-model daily limit from
  ~50 to ~1000 requests, which fixes the 21-calls-per-deck problem.
- Set a **spending limit on the OpenRouter API key** as a safety net.
- Rough scale: 100 active users ≈ $5–25/month, 1000 ≈ $50–250/month.
- Time estimate for stages 0–5 below: **11–19 working days** (3–4 weeks full
  time, 6–10 weeks part time), plus buffer.

### Monetization (decided direction)

- **No subscriptions.** Integrated advertising instead.
- **Main income: affiliate links inside recommendations** (Amazon, Booking,
  GetYourGuide, Udemy, ticket and game stores, and so on). Rank by relevance,
  never by commission, or trust in the page dies. Label affiliate links.
- Optionally one display ad outside the recommendation list (Google AdSense,
  or Yandex Advertising Network for a Russian-speaking audience). Needs
  `ads.txt`, a privacy policy, a cookie consent banner for EU/UK, reserved ad
  space against layout shift, and ad refresh on client-side navigation.

### Safety (required, details deferred by the user)

Open questions to settle before launch: exclude politics entirely or only
neutral sources (inferring political views is sensitive personal data); filter
shocking/violent and extremist content (domain blocklist + moderation pass);
prefer reliable sources for science and health; age limits; a "report" button
on every recommendation.

### Implementation stages (proposed 2026-10-04, not started)

0. **Prep (0.5–1 day):** top up OpenRouter $10, set key spend limit, pick a
   tool-capable cheap model, pick a search API. **First verify the existing
   deck generation through OpenRouter works live**; it is still unverified and
   uses the same SDK.
1. **Data + trigger, no AI (1–2 days):** Prisma migration for the three user
   fields and a run model (user, status pending/ready/failed, created/finished
   time, JSON result, error). Increment `lifetimeSaves` in the same transaction
   as the save. Threshold check creates a `pending` run. Verify in the DB.
2. **Interests from cards, no tools (2–3 days):** server function returns main
   interests + search queries via structured output; run through a temporary
   dev route; tune the prompt on real data.
3. **First tool, web search (2–3 days):** search API as a tool, capped loop,
   Zod recommendation schema, link grounding check.
4. **Background run (1–2 days):** trigger → `after()` → status update, no
   double runs, remove the dev route.
5. **Page (2–4 days):** API route + TanStack Query hook; states: progress
   ("12 / 30"), preparing, results, error.
   Later: city in profile + places tool, specialized APIs, safety policy,
   affiliate links, ads.

### Open decisions (ask the user)

- ~~Route and nav label~~ **DECIDED 2026-10-04: "For you" → `/for-you`.**
  The feature is postponed until after the MVP deploy. For now
  `app/(main)/for-you/page.tsx` is a static "Coming soon..." panel with a
  two-sentence description in glowing white text.
- **What to do with the old Community code:** `CommunityUserCard`,
  `OnlineStatusAvatar` in `app/(main)/community/_components/`, the
  `app-status-online/offline` tokens in `globals.css`, and the user's
  `app/stores/presence.ts`. Never delete without the user's confirmation.
- Which paid model and which search provider.
- The safety policy above.

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
- **Account deletion (2026-10-04).** Better Auth `user.deleteUser` is enabled
  in `lib/auth.ts`. Its `beforeDelete` hook calls `deleteUserBlobs`
  (`lib/data/delete-user-blobs.ts`) to remove the avatar and saved-card images
  from Vercel Blob before the DB cascade (Account, Session, Card all cascade on
  User). A Blob failure aborts the deletion on purpose. UI:
  `settings/security/_components/delete-account.client.tsx` + `hooks/use-delete-account.ts`;
  type DELETE, plus password for credential users; Google users need a session
  younger than Better Auth's 1-day `freshAge`, otherwise `SESSION_EXPIRED`
  prompts a re-sign-in. No email confirmation step yet.
  `isManagedBlobUrl` lives in `lib/blob/managed-blob-url.ts`.
- **Env files are off limits (2026-09-28).** The user forbade reading `.env` or
  `.env.*` under any circumstances. Refer to variables by name only.
- **⚠️ AI = DEEPINFRA (2026-10-05), NOT YET VERIFIED LIVE ⚠️** Text and
  images go through DeepInfra with the official `openai` client
  (`lib/ai/deepinfra.ts`, base URL `https://api.deepinfra.com/v1/openai`,
  `DEEPINFRA_API_KEY`). Text with `chat.completions.parse` +
  `zodResponseFormat`; images with `images.generate`, `1024x1024`, `b64_json`,
  checked against the PNG base64 signature. Model ids live in
  `IDEA_TEXT_MODEL_ID` / `IDEA_IMAGE_MODEL_ID` and the user changes them
  (2026-10-08: `deepseek-ai/DeepSeek-V4.1-Flash`, `Qwen/Qwen-Image-Edit-Max`).
  Category calls for the ideas of a deck run in parallel with `Promise.all`
  since 2026-10-08 (two sequential calls per idea). The user funded $5 prepaid. Category logic stays two
  calls per idea (21 calls per deck) by the user's choice. Idea images are PNG
  end to end (`IDEA_IMAGE_MEDIA_TYPE`,S in
  `lib/config/ideas.ts`). See the deepinfra skill. Unverified: `$schema` key and
  the 100-value category enum under DeepInfra's strict mode, and the real
  image format.
- **Provider history (do not go back without the user):** Groq + Cloudflare
  Workers AI → Vercel AI SDK + MixRoute (Gemini 400 on the large category enum,
  later `400 additionalProperties ... context=()` and `403
  insufficient_user_quota`) → no AI SDK, direct calls (2026-09-30) → OpenRouter
  free models (2026-10-01, unusable for the user) → DeepInfra (2026-10-05).
  Rejected along the way: Together AI (dearer), Cloudflare free tier for
  images (user wants high quality and a prepaid split budget), native
  OpenAI/Anthropic (kept as later options; Anthropic has no image generation).
  `ai`, `@ai-sdk/*`, and `@openrouter/sdk` are uninstalled.

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

- **Favorites carousel (2026-09-26).** Clicking the "Your pocket" stack opens
  a portal carousel that starts at the top card of the stack. Only `isOpen`
  lives in `app/stores/carousel-store.ts`; cards come in as props. Saved cards
  render with `IdeaCardView` and their stored image. Never use `IdeaCard` for
  saved cards, because it calls the AI image generation endpoint.

- **MVP release scope (2026-10-04).** Goal now is shipping the MVP. No
  subscriptions: the Pricing page was deleted, the marketing nav is only
  About and Contact, and the settings Billing section was removed (settings:
  Profile, Security, Notifications). The landing-page topic search was removed completely: its
  two components, `app/api/search`, the Prisma `TopicSearch` model, the
  `topic_search` table (migration `20261004120000_remove_topic_search`, applied
  with `migrate deploy`), `prisma/seed.ts`, `mock.json`, and both seed configs.
  The project has no seed now.
- **Landing page (redesigned 2026-10-06 from a user mockup).** The marketing
  layout and pill nav are untouched. `app/(marketing)/page.tsx`: eyebrow
  "A calmer way to choose", large serif "Swipe. Decide. / Done.", subtitle,
  one centred CTA, an honest note ("Free to use. Built for curious minds." —
  the mockup's "3,240 decisions made today" was dropped as a fabricated stat),
  soft blurred glows, and a fan of three `MiniIdeaCard`s with static sample
  ideas (`hero-cards.client.tsx`, `motion` entrance + gentle float). Text uses
  the CSS `animate-fade-up` token so it stays visible without JS. `HeroCta`
  (`hero-cta.client.tsx`) is a cream pill that lifts and turns bright white on
  hover; it goes to `/register`, or to `/dive` for signed-in users. The old
  `ShineBorder` and `shine-border` utility were deleted with this redesign.
- **Marketing pages are static (decided 2026-10-07).** `/`, `/about` and
  `/contact` are prerendered (`○` in `next build`) and export
  `dynamic = "error"`, so any request-time API there fails the build. The
  session for the marketing header (`_components/header-actions.client.tsx`)
  and for `HeroCta` is read on the client with Better Auth `useSession`. The
  root `app/layout.tsx` must never read the session or call `headers()`,
  `cookies()`: that would make every route dynamic again. The Zustand user
  store (`app/stores/user-store.ts`, `UserStoreProvider`) was deleted on
  2026-10-07 with the user's approval: nothing ever read its `user`. Client
  code that needs the current user uses Better Auth `useSession`.
- **Notification preferences (2026-10-05).** Postgres, not NoSQL: table
  `NotificationPreference` (1:1 with User, cascade) with `securityEmails`
  (DB default true, never written by app code, locked "Always on" switch in
  the UI), `productUpdates` and `weeklyDigest` (both default false: EU opt-in).
  No row means defaults; the row is upserted on first save by
  `lib/actions/notification-preferences.action.ts`. The user chose a plain
  `interface` instead of Zod here (2026-10-06); the action still checks at
  runtime that it got exactly two booleans and builds the DB data field by
  field, because server actions are public endpoints. Nothing sends product
  updates or the weekly digest yet; any future optional email must include an
  unsubscribe link. The old template switches (direct messages, mentions,
  workspace activity, quiet hours) were removed.
  ⚠️ Migration `20261005120000_add_notification_preference` was generated
  offline (Neon returned P1001 at the time) and is NOT applied yet. Run
  `npx prisma migrate deploy` once the database is reachable, or the page will
  fail on the missing table.
- **Migrations:** apply with `prisma migrate deploy` after checking
  `prisma migrate diff --from-config-datasource --to-schema
  prisma/schema.prisma --script`. Avoid `migrate dev` on the Neon database: on
  drift it offers a reset that wipes all data.
- **Third nav page: see the ⭐ AI PERSONALIZATION section at the top of this
  file.** It replaced the "Community" users list (2026-09-30 plan, stage 1 UI
  built, then dropped by the user on 2026-10-03).

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

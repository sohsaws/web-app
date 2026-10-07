---
name: tailwind
description: CSS and Tailwind CSS v4 engineering rules for this project. Use whenever reviewing, proposing, or changing styles, className strings, app/globals.css, @theme tokens, layout, responsiveness, focus states, or accessibility of UI. Pair with the typescript skill when the change touches React components.
---

# CSS and Tailwind CSS v4

Build interfaces that are readable, responsive, accessible, and easy to change.
Prefer simple layout rules and a small set of semantic design tokens over long,
fragile class lists or one-off global CSS.

## Before you style anything

1. Read `app/globals.css`. Reuse an existing `@theme` token or global primitive
   when its meaning matches.
2. Add a new global token or rule only for a genuinely reusable style. Keep
   one-off presentation local to the component with Tailwind utilities.
3. Never duplicate the same stable CSS rule across components.

## CSS foundations

- Understand the cascade before raising specificity. Prefer predictable source
  order and low-specificity selectors.
- Use inheritance for typography and color when it removes repetition.
- Treat every element as a box. When layout breaks, check content size,
  padding, border, margin, overflow, and `box-sizing`.
- Prefer normal document flow. Use absolute or fixed positioning only when the
  element must leave the flow.
- Flexbox for one-dimensional alignment, Grid for two-dimensional layout.
- Give positioned elements an explicit containing block, usually `relative` on
  the nearest meaningful parent.
- Avoid fixed heights on content containers. Prefer `min-height`, intrinsic
  sizing, and content-driven layout.
- `min-width: auto` stops flex and grid children from shrinking. Add `min-w-0`
  to children that may hold long text.
- Use `overflow-hidden` only on purpose. It clips focus rings, popovers, sticky
  elements, and shadows.

## Tailwind v4 conventions

- Keep `@import "tailwindcss";` at the top of `app/globals.css`.
- Define repeated design values in `@theme` with project-oriented names such as
  `--color-app-bg` or `--container-app-shell`.
- Use arbitrary values for genuinely local behavior. Promote a value to a token
  only once it has semantic meaning or repeats across the app.
- Prefer utilities in components. Add raw CSS, `@utility`, or custom variants
  only when utilities cannot express the behavior clearly or the pattern repeats.
- Use valid v4 theme namespaces: `--color-*`, `--spacing-*`, `--container-*`,
  `--breakpoint-*`, `--text-*`, `--font-*`, `--shadow-*`, `--radius-*`,
  `--animate-*`.
- Every custom token needs a meaningful suffix. Never create incomplete tokens
  such as `--breakpoint-`.
- Mobile-first: write the smallest layout first, then add `sm:`, `md:`, `lg:`,
  or project breakpoints.
- Readable utility order: layout/position, sizing, spacing, typography, visual,
  interaction, then responsive/state variants. Let Biome handle mechanical
  ordering if a sorter is adopted.
- Organize `globals.css` by responsibility: tokens, base behavior, reusable
  utilities, then component-level styling for generated or content-heavy areas.

## Token pattern (example)

```css
@import "tailwindcss";

@theme {
  --color-app-bg: #0a0a0a;
  --color-app-fg: #d4d4d4;
  --color-app-surface: #171717;
  --color-app-border: rgb(255 255 255 / 0.1);

  --container-app-shell: 80rem;
  --spacing-app-nav-height: 3.25rem;
  --breakpoint-app-wide: 80rem;

  --font-sans: var(--font-inter), Arial, Helvetica, sans-serif;
}
```

This yields `bg-app-bg`, `text-app-fg`, `max-w-app-shell`, `h-app-nav-height`,
and `app-wide:grid-cols-4`. The names above illustrate the pattern. Check
`app/globals.css` for the tokens that actually exist.

Not every raw value should become a token. A unique decorative offset can stay
arbitrary:

```tsx
<div className="absolute left-[calc(50%_-_1rem)] top-[3.25rem]" />
```

## Layout patterns

Responsive app shell:

```tsx
<div className="mx-auto w-full max-w-app-shell px-4 sm:px-6 lg:px-12">
  {children}
</div>
```

Content that shrinks safely:

```tsx
<div className="flex min-w-0 items-center gap-3">
  <div className="min-w-0 flex-1">
    <p className="truncate text-sm font-medium">{title}</p>
    <p className="break-words text-xs text-neutral-500">{description}</p>
  </div>
</div>
```

Responsive grid:

```tsx
<section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
  {items.map((item) => (
    <article key={item.id} className="rounded-xl border border-white/10 p-5">
      {item.content}
    </article>
  ))}
</section>
```

Full-height page without fragile `100vh`:

```tsx
<div className="flex min-h-dvh flex-col">
  <header className="shrink-0">...</header>
  <main className="min-w-0 flex-1">...</main>
  <footer className="shrink-0">...</footer>
</div>
```

Use `dvh` for viewport-driven mobile layouts. Use `min-h-screen` only when the
older viewport behavior is acceptable.

## Interactive states

Every interactive element needs visible hover, focus, and disabled states, plus
loading or selected states where relevant:

```tsx
<button
  type="button"
  disabled={isPending}
  className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-neutral-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-app-bg disabled:cursor-not-allowed disabled:opacity-50"
>
  {isPending ? "Saving..." : "Save changes"}
</button>
```

Prefer `focus-visible` for keyboard focus. Never remove outlines without a clear
replacement.

## Dynamic classes

Tailwind must discover complete class names at build time. Choose between whole
strings, never build fragments:

```tsx
const toneClass = isActive
  ? "border-white/20 bg-white/10 text-white"
  : "border-transparent text-neutral-500 hover:text-white";

return <button className={`rounded-lg border px-3 py-2 ${toneClass}`} />;
```

Avoid interpolated fragments such as `text-${color}-500`. Use a typed lookup
table when there are several variants.

## Responsive and accessible UI checklist

- Start at narrow mobile widths and expand progressively.
- Test long names, email addresses, translated text, empty values, and error
  messages for overflow.
- Fixed headers and footers must not cover content or anchors.
- Touch targets at least 40 by 40 CSS pixels.
- Semantic elements before ARIA. Buttons act, links navigate.
- Every form control has a label via `htmlFor` and `id`.
- Never rely on color alone for validation or selection state.
- Keep text contrast sufficient on dark translucent backgrounds.
- Decorative backgrounds, icons, SVGs, and canvas effects get `aria-hidden` and
  must not capture pointer events.
- Respect reduced motion with `motion-reduce:transition-none` and
  `motion-reduce:animate-none` for non-essential animation.
- One primary motion idea per viewport. Supporting effects stay quiet.
- Check keyboard navigation, focus order, modal focus trapping, and Escape on
  overlays.

## Maintainability

- Extract a component when markup and behavior repeat, not because a class
  string is long.
- Extract a reusable class or `@utility` only when the same visual contract is
  stable across several call sites.
- Prefer semantic props such as `tone="danger"` over accepting arbitrary class
  names for business-level variants.
- Avoid inline styles for anything Tailwind can express. Inline styles are for
  runtime values, CSS custom properties, or visualization output.
- Keep third-party or generated visual primitives isolated from app-specific
  section composition. Wrap them instead of editing their internals.
- Do not mix spacing systems in one component without a reason.
- Avoid large negative margins and fixed pixel offsets that compensate for a
  broken parent layout.

## Review checklist

Before proposing or changing styles, verify:

1. The layout works in normal flow before positioning is added.
2. Flex and grid children can shrink, and long content does not overflow.
3. The smallest viewport is usable without horizontal scrolling.
4. Focus, hover, disabled, loading, error, and empty states are visible.
5. Repeated values use valid semantic Tailwind v4 tokens.
6. One-off values stay local and understandable.
7. Client-side animation is justified and does not hurt readability.
8. Decorative layers do not capture pointer events or hide content.
9. Class names are statically discoverable by Tailwind.
10. The change does not create an unnecessary Client Component boundary.

When reviewing UI, explain the layout model and the reason for each proposed
change. Prefer a focused patch over a broad restyle.

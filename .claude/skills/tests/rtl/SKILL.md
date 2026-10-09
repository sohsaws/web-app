---
name: rtl
description: React Testing Library rules for this project - testing client components and hooks inside Vitest with jsdom, queries, user-event, async UI and TanStack Query. Read together with ../SKILL.md (strategy) and ../vitest/SKILL.md (runner and mocks). Use before writing or changing any component or hook test.
---

# React Testing Library (RTL)

Part of the `tests` skill; the strategy lives in `../SKILL.md`. RTL runs
inside Vitest, so the config, mocking rules and scripts are in
`../vitest/SKILL.md`.

## Always read the docs first

- Queries: https://testing-library.com/docs/queries/about/
- React Testing Library: https://testing-library.com/docs/react-testing-library/intro/
- user-event: https://testing-library.com/docs/user-event/intro
- Next.js guide bundled with the installed version:
  `node_modules/next/dist/docs/01-app/02-guides/testing/vitest.md`

## When RTL is the right tool

Use it for client components and hooks whose **behavior** matters: form
validation messages, optimistic updates with rollback, disabled and pending
states, conditional rendering. Do not use it for route handlers or server
actions (no DOM needed), for `async` Server Components (Vitest cannot render
them; use E2E), or to check styles and class names.

## Planned setup (verify against current docs before writing)

- Dev dependencies to propose: `@testing-library/react`,
  `@testing-library/dom`, `@testing-library/user-event`,
  `@testing-library/jest-dom`, `jsdom`.
- Component tests (`*.test.tsx`) run in the `jsdom` Vitest project.
- A setup file imports `@testing-library/jest-dom/vitest` for matchers such as
  `toBeInTheDocument`, `toBeDisabled`, `toHaveAccessibleName`.

## Queries

Query like a user, in this priority:

1. `getByRole` (with `name`): the default for almost everything
2. `getByLabelText`, `getByPlaceholderText`, `getByText`, `getByDisplayValue`
3. `getByAltText`, `getByTitle`
4. `getByTestId`: last resort only

- Use `screen`, not values destructured from `render`.
- `getBy*` throws when the element is missing; `queryBy*` returns `null` (use
  it to assert absence); `findBy*` is async and retries (use it for anything
  that appears after a fetch, a server action or a state update).

## Interaction

- Use `@testing-library/user-event` with `const user = userEvent.setup()` and
  `await user.click(...)` / `await user.type(...)`, not `fireEvent`.
- Assert what the user can observe: text, roles, `aria-*`, disabled state,
  focus. Never assert internal state, hook internals or class names.

## TanStack Query

Components and hooks that use TanStack Query need a **fresh** `QueryClient`
per test with retries off, so tests do not share cache or wait on retries:

```tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import type { ReactElement } from "react";

export function renderWithQueryClient(ui: ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
}
```

Mock network and server boundaries (`fetch`, server actions, `@/lib/auth`)
as described in `../vitest/SKILL.md`; never call the real API.

## Example

```tsx
// app/(main)/settings/notifications/_components/notification-settings.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it, vi } from "vitest";

const { updateNotificationPreferences } = vi.hoisted(() => ({
  updateNotificationPreferences: vi.fn(),
}));
vi.mock("@/lib/actions/notification-preferences.action", () => ({
  updateNotificationPreferences,
}));

it("rolls the switch back when saving fails", async () => {
  updateNotificationPreferences.mockResolvedValue({
    success: false,
    message: "Invalid notification settings",
  });
  // render the component with default preferences, then:
  const user = userEvent.setup();
  const productUpdates = screen.getByRole("switch", { name: /product updates/i });
  await user.click(productUpdates);
  expect(await screen.findByRole("switch", { name: /product updates/i }))
    .not.toBeChecked();
});
```

Check the real component's roles and names before copying this; the example
shows the shape, not the exact markup.

## First candidates in this project

- Notification switch: optimistic update and rollback on failure.
- Profile form: validation messages (name required, bio length limit).
- Idea card actions: buttons disabled while a card is animating.

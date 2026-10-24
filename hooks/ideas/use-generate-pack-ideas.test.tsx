import { randomUUID } from "node:crypto";
import type { QueryClient } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { z } from "zod";
import { useIdeasStore } from "@/app/stores/ideas-store";
import type { ideaResponseSchema } from "@/lib/config/ideas";
import type { IdeaSaveRequest } from "@/lib/types/ideas/types";
import { RateLimitError } from "@/lib/utils/responseError";
import { IntlTestProvider } from "@/test-utils/intl-test-provider";
import { createQueryClientWrapper } from "@/test-utils/query-client-wrapper";
import { useGeneratePackIdeas } from "./use-generate-pack-ideas";

const { showRateLimitToast } = vi.hoisted(() => ({
  showRateLimitToast: vi.fn(),
}));

vi.mock("@/lib/utils/rate-limit-toast", () => ({ showRateLimitToast }));

const fetchMock = vi.fn<typeof fetch>();
const BIO = "I like hiking.";

function apiIdea(title: string): z.input<typeof ideaResponseSchema> {
  return {
    id: randomUUID(),
    title,
    description: "Created by a test.",
    categories: ["Travel"],
    createdAt: "2026-10-13T10:00:00.000Z",
  };
}

function storedIdea(title: string): IdeaSaveRequest {
  return { ...apiIdea(title), createdAt: new Date("2026-10-13T10:00:00Z") };
}

function deckResponse(...titles: string[]): Response {
  return Response.json({ ideas: titles.map(apiIdea) });
}

function storedTitles(): string[] | undefined {
  return useIdeasStore.getState().ideas?.map((idea) => idea.title);
}

// Six cards is above the refill threshold, so the hook does not top it up.
const FULL_DECK = ["1", "2", "3", "4", "5", "6"];

function seedFullDeck(): void {
  useIdeasStore.getState().setIdeas(FULL_DECK.map(storedIdea));
}

// Every call gets its own Response: a body can be read only once.
function answerEveryRequestWith(...titles: string[]): void {
  fetchMock.mockImplementation(async () => deckResponse(...titles));
}

// Holds the next request open until the test sends the response.
function deferNextResponse(): (response: Response) => void {
  let respond: (response: Response) => void = () => undefined;
  fetchMock.mockReturnValueOnce(
    new Promise((resolve) => {
      respond = resolve;
    }),
  );
  return (response) => respond(response);
}

// next-intl for the translated toast text, around a fresh QueryClient.
function createWrapper(): {
  queryClient: QueryClient;
  wrapper: ({ children }: { children: ReactNode }) => ReactNode;
} {
  const { queryClient, wrapper: QueryWrapper } = createQueryClientWrapper();

  function wrapper({ children }: { children: ReactNode }): ReactNode {
    return (
      <IntlTestProvider>
        <QueryWrapper>{children}</QueryWrapper>
      </IntlTestProvider>
    );
  }

  return { queryClient, wrapper };
}

function renderGenerateHook() {
  const { wrapper } = createWrapper();
  return renderHook(() => useGeneratePackIdeas(BIO), { wrapper });
}

beforeEach(() => {
  useIdeasStore.setState({ ideas: null, previousCard: null });
  vi.stubGlobal("fetch", fetchMock);
});

describe("useGeneratePackIdeas", () => {
  it("loads the first deck on mount", async () => {
    answerEveryRequestWith("A", "B", "C", "D", "E", "F");

    renderGenerateHook();

    await waitFor(() =>
      expect(storedTitles()).toEqual(["A", "B", "C", "D", "E", "F"]),
    );
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] ?? [];
    expect(url).toBe("/api/ideas/generate");
    expect(init?.method).toBe("POST");
    expect(init?.body).toBe(JSON.stringify({ bio: BIO }));
  });

  it("tops up a short deck instead of replacing it", async () => {
    useIdeasStore.getState().setIdeas([storedIdea("Old")]);
    answerEveryRequestWith("N1", "N2", "N3", "N4", "N5");

    renderGenerateHook();

    await waitFor(() =>
      expect(storedTitles()).toEqual(["Old", "N1", "N2", "N3", "N4", "N5"]),
    );
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("keeps topping up while the deck is still short", async () => {
    answerEveryRequestWith("A", "B", "C");

    renderGenerateHook();

    await waitFor(() => expect(storedTitles()).toHaveLength(6));
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  // Control for the next test: the same flush is enough for a request to
  // reach fetch, so "not called" there really means no request.
  it("requests a deck as soon as it mounts with a short deck", async () => {
    answerEveryRequestWith("A", "B", "C", "D", "E", "F");

    renderGenerateHook();
    await act(async () => {});

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("does not request a deck while enough cards are left", async () => {
    seedFullDeck();

    renderGenerateHook();
    // A mutation calls fetch only after a microtask, so let pending work run
    // before asserting; a synchronous check here could never fail.
    await act(async () => {});

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("replaces the whole deck on regenerate", async () => {
    seedFullDeck();
    const respond = deferNextResponse();
    const { result } = renderGenerateHook();

    act(() => result.current.regenerate());

    await waitFor(() => expect(result.current.isRegenerating).toBe(true));
    // The old deck stays on screen until the new one arrives.
    expect(storedTitles()).toEqual(FULL_DECK);

    const freshDeck = ["F1", "F2", "F3", "F4", "F5", "F6"];
    await act(async () => respond(deckResponse(...freshDeck)));

    await waitFor(() => expect(storedTitles()).toEqual(freshDeck));
    expect(result.current.isRegenerating).toBe(false);
  });

  it("keeps the current deck when regenerating fails", async () => {
    seedFullDeck();
    fetchMock.mockResolvedValue(
      Response.json({ error: "Failed to generate ideas." }, { status: 502 }),
    );
    const { result } = renderGenerateHook();

    act(() => result.current.regenerate());

    await waitFor(() =>
      expect(result.current.error?.message).toBe("Failed to generate ideas."),
    );
    expect(storedTitles()).toEqual(FULL_DECK);
  });

  it("shows the rate limit toast and stops refilling after a 429", async () => {
    fetchMock.mockResolvedValue(
      Response.json(
        { error: "Too many requests. Please try again later." },
        { status: 429, headers: { "Retry-After": "300" } },
      ),
    );

    const { result } = renderGenerateHook();

    await waitFor(() =>
      expect(result.current.error).toBeInstanceOf(RateLimitError),
    );
    expect(showRateLimitToast).toHaveBeenCalledWith(
      "You've reached the hourly limit. Try again in 5 minutes.",
    );
    // The refill effect must not retry in a loop after an error.
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(storedTitles()).toBeUndefined();
  });

  it("rejects a response that does not match the deck schema", async () => {
    fetchMock.mockResolvedValue(Response.json({ ideas: [{ title: "No id" }] }));

    const { result } = renderGenerateHook();

    await waitFor(() =>
      expect(result.current.error?.message).toBe(
        "Idea generation returned an invalid response",
      ),
    );
    expect(storedTitles()).toBeUndefined();
  });

  it("sends only one request while one is in flight", async () => {
    seedFullDeck();
    const respond = deferNextResponse();
    const { result } = renderGenerateHook();

    act(() => {
      result.current.generate();
      result.current.regenerate();
      result.current.generate();
    });

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    await act(async () => respond(deckResponse("A")));

    // The first call (append) wins; the others were dropped, not queued.
    await waitFor(() => expect(storedTitles()).toEqual([...FULL_DECK, "A"]));
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("ignores a deck that arrives after the hook unmounted", async () => {
    const respond = deferNextResponse();
    const { unmount } = renderGenerateHook();
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));

    unmount();
    await act(async () => respond(deckResponse("Late")));

    expect(storedTitles()).toBeUndefined();
  });
});

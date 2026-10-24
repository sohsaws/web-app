import { randomUUID } from "node:crypto";
import type { QueryClient } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { IdeaSaveRequest } from "@/lib/types/ideas/types";
import { IntlTestProvider } from "@/test-utils/intl-test-provider";
import { createQueryClientWrapper } from "@/test-utils/query-client-wrapper";
import { useSaveFavorite } from "./use-save-favorite";

const { toast } = vi.hoisted(() => ({
  toast: { error: vi.fn(), dismiss: vi.fn() },
}));

vi.mock("sonner", () => ({ toast }));

const fetchMock = vi.fn<typeof fetch>();

const PREVIEW_KEY = ["favorites", "u1", "preview"];
const IMAGE_KEY = ["idea-image", "idea-1", "description"];

function idea(): IdeaSaveRequest {
  return {
    id: randomUUID(),
    title: "Night hike",
    description: "Walk a trail at dusk.",
    categories: ["Hiking"],
    createdAt: new Date("2026-10-13T10:00:00.000Z"),
  };
}

// Reads the Retry button handler from the options passed to toast.error.
function getRetryAction(options: unknown): () => void {
  if (
    typeof options === "object" &&
    options !== null &&
    "action" in options &&
    typeof options.action === "object" &&
    options.action !== null &&
    "onClick" in options.action &&
    typeof options.action.onClick === "function"
  ) {
    const onClick = options.action.onClick;
    return () => onClick();
  }
  throw new Error("The error toast has no Retry action");
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

function renderSaveHook() {
  const { queryClient, wrapper } = createWrapper();
  queryClient.setQueryData(PREVIEW_KEY, { cards: [], total: 0 });
  queryClient.setQueryData(IMAGE_KEY, { image: "iVBORw0KGgo=" });
  return {
    queryClient,
    ...renderHook(() => useSaveFavorite(), { wrapper }),
  };
}

beforeEach(() => {
  vi.stubGlobal("fetch", fetchMock);
});

describe("useSaveFavorite", () => {
  it("posts the idea and refreshes every favorites query", async () => {
    fetchMock.mockImplementation(async () => Response.json({ saved: true }));
    const saved = idea();
    const { queryClient, result } = renderSaveHook();

    act(() => result.current.save(saved));

    await waitFor(() =>
      expect(queryClient.getQueryState(PREVIEW_KEY)?.isInvalidated).toBe(true),
    );
    const [url, init] = fetchMock.mock.calls[0] ?? [];
    expect(url).toBe("/api/ideas/favorites");
    expect(init?.method).toBe("POST");
    expect(init?.body).toBe(JSON.stringify(saved));
    expect(toast.dismiss).toHaveBeenCalledWith(saved.id);
    // Unrelated cached data, such as generated images, is kept.
    expect(queryClient.getQueryState(IMAGE_KEY)?.isInvalidated).toBe(false);
  });

  it("reports pending while a save is in flight", async () => {
    let respond: (response: Response) => void = () => undefined;
    fetchMock.mockReturnValueOnce(
      new Promise((resolve) => {
        respond = resolve;
      }),
    );
    const { result } = renderSaveHook();

    act(() => result.current.save(idea()));

    await waitFor(() => expect(result.current.isPending).toBe(true));
    await act(async () => respond(Response.json({ saved: true })));
    await waitFor(() => expect(result.current.isPending).toBe(false));
  });

  it("keeps a sticky error toast with the translated server error and a Retry action", async () => {
    fetchMock.mockImplementationOnce(async () =>
      Response.json(
        { error: "Idea was not saved.", code: "IDEA_NOT_SAVED" },
        { status: 409 },
      ),
    );
    const saved = idea();
    const { queryClient, result } = renderSaveHook();

    act(() => result.current.save(saved));

    await waitFor(() => expect(toast.error).toHaveBeenCalledTimes(1));
    const [title, options] = toast.error.mock.calls[0] ?? [];
    expect(title).toBe("Could not save the card");
    expect(options).toMatchObject({
      id: saved.id,
      description: "This idea cannot be saved. Please try another idea.",
      duration: Number.POSITIVE_INFINITY,
      action: { label: "Retry" },
    });
    // The error itself keeps the server's English text for logs.
    expect(result.current.error?.message).toBe("Idea was not saved.");
    expect(queryClient.getQueryState(PREVIEW_KEY)?.isInvalidated).toBe(false);

    fetchMock.mockImplementationOnce(async () =>
      Response.json({ saved: true }),
    );
    act(() => getRetryAction(options)());

    await waitFor(() => expect(toast.dismiss).toHaveBeenCalledWith(saved.id));
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[1]?.[1]?.body).toBe(JSON.stringify(saved));
  });

  it("shows a generic message instead of untranslated server text", async () => {
    fetchMock.mockImplementationOnce(async () =>
      Response.json({ error: "Database exploded." }, { status: 500 }),
    );
    const { result } = renderSaveHook();

    act(() => result.current.save(idea()));

    await waitFor(() => expect(toast.error).toHaveBeenCalledTimes(1));
    const [, options] = toast.error.mock.calls[0] ?? [];
    expect(options).toMatchObject({
      description: "Something went wrong. Please try again.",
    });
  });
});

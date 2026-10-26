import type { QueryClient } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { IDEA_IMAGE_DATA_URL_PREFIX } from "@/lib/config/ideas";
import { RateLimitError } from "@/lib/utils/responseError";
import { IntlTestProvider } from "@/test-utils/intl-test-provider";
import { createQueryClientWrapper } from "@/test-utils/query-client-wrapper";
import { useIdeaImage } from "./use-idea-image";

const { showRateLimitToast } = vi.hoisted(() => ({
  showRateLimitToast: vi.fn(),
}));

vi.mock("@/lib/utils/rate-limit-toast", () => ({ showRateLimitToast }));

const fetchMock = vi.fn<typeof fetch>();
const PNG_BASE64 = "iVBORw0KGgo=";
const DESCRIPTION = "Walk a trail at dusk.";

function answerEveryRequestWith(body: unknown, init?: ResponseInit): void {
  fetchMock.mockImplementation(async () => Response.json(body, init));
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

beforeEach(() => {
  vi.stubGlobal("fetch", fetchMock);
});

describe("useIdeaImage", () => {
  it("returns the generated image as a PNG data URL", async () => {
    answerEveryRequestWith({ image: PNG_BASE64 });
    const { wrapper } = createWrapper();

    const { result } = renderHook(() => useIdeaImage("idea-1", DESCRIPTION), {
      wrapper,
    });

    expect(result.current.image).toBeNull();
    await waitFor(() =>
      expect(result.current.image).toBe(
        `${IDEA_IMAGE_DATA_URL_PREFIX}${PNG_BASE64}`,
      ),
    );
    const [url, init] = fetchMock.mock.calls[0] ?? [];
    expect(url).toBe("/api/ideas/image");
    expect(init?.body).toBe(JSON.stringify({ description: DESCRIPTION }));
  });

  it("pays for one image when two cards show the same idea", async () => {
    answerEveryRequestWith({ image: PNG_BASE64 });
    const { wrapper } = createWrapper();

    const { result } = renderHook(
      () => [
        useIdeaImage("idea-1", DESCRIPTION),
        useIdeaImage("idea-1", DESCRIPTION),
      ],
      { wrapper },
    );

    await waitFor(() => expect(result.current[1]?.image).not.toBeNull());
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("does not request the image again when the card mounts again", async () => {
    answerEveryRequestWith({ image: PNG_BASE64 });
    const { wrapper } = createWrapper();
    const first = renderHook(() => useIdeaImage("idea-1", DESCRIPTION), {
      wrapper,
    });
    await waitFor(() => expect(first.result.current.image).not.toBeNull());
    first.unmount();

    const second = renderHook(() => useIdeaImage("idea-1", DESCRIPTION), {
      wrapper,
    });

    expect(second.result.current.image).not.toBeNull();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("shows the rate limit toast on a 429", async () => {
    answerEveryRequestWith(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: { "Retry-After": "120" } },
    );
    const { wrapper } = createWrapper();

    const { result } = renderHook(() => useIdeaImage("idea-1", DESCRIPTION), {
      wrapper,
    });

    await waitFor(() =>
      expect(result.current.error).toBeInstanceOf(RateLimitError),
    );
    expect(showRateLimitToast).toHaveBeenCalledWith(
      "You've reached the hourly limit. Try again in 2 minutes.",
    );
    expect(result.current.image).toBeNull();
  });

  it("reports other failures without the rate limit toast", async () => {
    answerEveryRequestWith(
      { error: "Failed to generate an image. Please try again." },
      { status: 502 },
    );
    const { wrapper } = createWrapper();

    const { result } = renderHook(() => useIdeaImage("idea-1", DESCRIPTION), {
      wrapper,
    });

    await waitFor(() =>
      expect(result.current.error?.message).toBe(
        "Failed to generate an image. Please try again.",
      ),
    );
    expect(showRateLimitToast).not.toHaveBeenCalled();
  });

  it("rejects a body that is not base64", async () => {
    answerEveryRequestWith({ image: "<script>alert(1)</script>" });
    const { wrapper } = createWrapper();

    const { result } = renderHook(() => useIdeaImage("idea-1", DESCRIPTION), {
      wrapper,
    });

    await waitFor(() => expect(result.current.error).not.toBeNull());
    expect(result.current.image).toBeNull();
  });
});

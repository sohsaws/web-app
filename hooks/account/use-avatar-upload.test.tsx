import { act, renderHook, waitFor } from "@testing-library/react";
import type { ChangeEvent } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AVATAR_MAX_SIZE_BYTES } from "@/lib/config/avatar";
import { IntlTestProvider } from "@/test-utils/intl-test-provider";
import { useAvatarUpload } from "./use-avatar-upload";

const { router, toast } = vi.hoisted(() => ({
  router: { refresh: vi.fn() },
  toast: {
    loading: vi.fn(() => "toast-1"),
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("@/i18n/navigation", () => ({ useRouter: () => router }));
vi.mock("sonner", () => ({ toast }));

const fetchMock = vi.fn<typeof fetch>();

function fileInputWith(file: File | null): HTMLInputElement {
  const input = document.createElement("input");
  input.type = "file";
  Object.defineProperty(input, "files", { value: file ? [file] : [] });
  // A browser keeps the chosen file name here; the hook must clear it.
  Object.defineProperty(input, "value", {
    value: "C:\\fake\\a.png",
    writable: true,
  });
  return input;
}

// The hook reads only currentTarget, so a full synthetic event is not needed.
function changeEventFor(
  input: HTMLInputElement,
): ChangeEvent<HTMLInputElement> {
  return { currentTarget: input } as ChangeEvent<HTMLInputElement>;
}

function renderAvatarHook(hasAvatar: boolean) {
  return renderHook(() => useAvatarUpload({ hasAvatar }), {
    wrapper: IntlTestProvider,
  });
}

function pngFile(size = 3): File {
  return new File([new Uint8Array(size)], "avatar.png", { type: "image/png" });
}

beforeEach(() => {
  vi.stubGlobal("fetch", fetchMock);
  fetchMock.mockImplementation(async () =>
    Response.json({
      url: "https://store.public.blob.vercel-storage.com/a.png",
    }),
  );
});

describe("useAvatarUpload: choosing a file", () => {
  it("ignores a change without a file", async () => {
    const { result } = renderAvatarHook(false);

    await act(() =>
      result.current.handleFileChange(changeEventFor(fileInputWith(null))),
    );

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it.each([
    [
      "an unsupported type",
      new File(["<svg/>"], "a.svg", { type: "image/svg+xml" }),
      "Please choose a JPG, PNG, GIF or WebP image.",
    ],
    [
      "a file over the size limit",
      pngFile(AVATAR_MAX_SIZE_BYTES + 1),
      "The image is too large (max 4 MB).",
    ],
  ])("rejects %s before uploading", async (_case, file, message) => {
    const input = fileInputWith(file);
    const { result } = renderAvatarHook(false);

    await act(() => result.current.handleFileChange(changeEventFor(input)));

    expect(fetchMock).not.toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalledWith(message);
    expect(input.value).toBe("");
  });

  it("uploads the file with its type and refreshes the page", async () => {
    const file = pngFile();
    const input = fileInputWith(file);
    const { result } = renderAvatarHook(false);

    await act(() => result.current.handleFileChange(changeEventFor(input)));

    expect(fetchMock).toHaveBeenCalledWith("/api/upload", {
      method: "POST",
      body: file,
      headers: { "content-type": "image/png" },
    });
    expect(toast.success).toHaveBeenCalledWith("Avatar updated successfully", {
      id: "toast-1",
    });
    expect(router.refresh).toHaveBeenCalled();
    expect(input.value).toBe("");
    await waitFor(() => expect(result.current.isPending).toBe(false));
  });

  it("shows the translated server error and does not refresh", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    fetchMock.mockImplementation(async () =>
      Response.json(
        { error: "Unsupported image type", code: "UNSUPPORTED_IMAGE_TYPE" },
        { status: 415 },
      ),
    );
    const input = fileInputWith(pngFile());
    const { result } = renderAvatarHook(false);

    await act(() => result.current.handleFileChange(changeEventFor(input)));

    expect(toast.error).toHaveBeenCalledWith(
      "Please choose a JPG, PNG, GIF or WebP image.",
      { id: "toast-1" },
    );
    expect(router.refresh).not.toHaveBeenCalled();
    expect(input.value).toBe("");
    expect(result.current.isPending).toBe(false);
  });

  it("names the upload when the request fails without a code", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    fetchMock.mockRejectedValue(new TypeError("Failed to fetch"));
    const { result } = renderAvatarHook(false);

    await act(() =>
      result.current.handleFileChange(changeEventFor(fileInputWith(pngFile()))),
    );

    expect(toast.error).toHaveBeenCalledWith(
      "Avatar upload failed. Please try again.",
      { id: "toast-1" },
    );
    expect(router.refresh).not.toHaveBeenCalled();
  });
});

describe("useAvatarUpload: removing the avatar", () => {
  it("does nothing when there is no avatar", async () => {
    const { result } = renderAvatarHook(false);

    await act(() => result.current.removeAvatar());

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("deletes the avatar and refreshes the page", async () => {
    fetchMock.mockImplementation(async () => Response.json({ success: true }));
    const { result } = renderAvatarHook(true);

    await act(() => result.current.removeAvatar());

    expect(fetchMock).toHaveBeenCalledWith("/api/upload", { method: "DELETE" });
    expect(toast.success).toHaveBeenCalledWith("Avatar removed successfully", {
      id: "toast-1",
    });
    expect(router.refresh).toHaveBeenCalled();
  });

  it("shows the server error and does not refresh", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    fetchMock.mockImplementation(async () =>
      Response.json(
        { error: "Avatar removal failed", code: "AVATAR_REMOVAL_FAILED" },
        { status: 500 },
      ),
    );
    const { result } = renderAvatarHook(true);

    await act(() => result.current.removeAvatar());

    expect(toast.error).toHaveBeenCalledWith(
      "Avatar removal failed. Please try again.",
      { id: "toast-1" },
    );
    expect(router.refresh).not.toHaveBeenCalled();
  });
});

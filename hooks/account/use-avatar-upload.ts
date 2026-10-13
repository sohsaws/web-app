"use client";

import { useRouter } from "next/navigation";
import {
  type ChangeEvent,
  type RefObject,
  useRef,
  useState,
  useTransition,
} from "react";
import { toast } from "sonner";
import {
  AVATAR_MAX_SIZE_BYTES,
  isAvatarContentType,
} from "@/lib/config/avatar";
import { getApiResponseError } from "@/lib/utils/responseError";

interface UseAvatarUploadOptions {
  hasAvatar: boolean;
}

interface UseAvatarUploadResult {
  fileInputRef: RefObject<HTMLInputElement | null>;
  isPending: boolean;
  openFilePicker: () => void;
  handleFileChange: (event: ChangeEvent<HTMLInputElement>) => Promise<void>;
  removeAvatar: () => Promise<void>;
}

export function useAvatarUpload({
  hasAvatar,
}: UseAvatarUploadOptions): UseAvatarUploadResult {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isRequestPending, setIsRequestPending] = useState(false);
  const [isRefreshing, startRefresh] = useTransition();
  const router = useRouter();

  // The new image URL only arrives with the refreshed server data, so the
  // transition keeps the pending state on until it is on screen.
  const refreshAvatar = (): void => {
    startRefresh(() => {
      router.refresh();
    });
  };

  const handleFileChange = async (
    event: ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    const input = event.currentTarget;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    if (!isAvatarContentType(file.type)) {
      toast.error("Please select a JPG, PNG, GIF, or WebP image");
      input.value = "";
      return;
    }

    if (file.size > AVATAR_MAX_SIZE_BYTES) {
      toast.error("File too large (max 4 MB)");
      input.value = "";
      return;
    }

    setIsRequestPending(true);
    const toastId = toast.loading("Uploading image...");

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: file,
        headers: {
          "content-type": file.type,
        },
      });

      if (!response.ok) {
        throw new Error(
          await getApiResponseError(response, "Avatar upload failed"),
        );
      }

      toast.success("Avatar updated successfully", { id: toastId });
      refreshAvatar();
    } catch (error: unknown) {
      console.error("Avatar upload failed:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong with the upload",
        { id: toastId },
      );
    } finally {
      input.value = "";
      setIsRequestPending(false);
    }
  };

  const removeAvatar = async (): Promise<void> => {
    if (!hasAvatar) {
      return;
    }

    setIsRequestPending(true);
    const toastId = toast.loading("Removing image...");

    try {
      const response = await fetch("/api/upload", {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(
          await getApiResponseError(response, "Avatar removal failed"),
        );
      }

      toast.success("Avatar removed successfully", { id: toastId });
      refreshAvatar();
    } catch (error: unknown) {
      console.error("Avatar removal failed:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong while removing the avatar",
        { id: toastId },
      );
    } finally {
      setIsRequestPending(false);
    }
  };

  return {
    fileInputRef,
    isPending: isRequestPending || isRefreshing,
    openFilePicker: () => fileInputRef.current?.click(),
    handleFileChange,
    removeAvatar,
  };
}

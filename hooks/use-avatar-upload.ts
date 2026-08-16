"use client";

import { useRouter } from "next/navigation";
import { type ChangeEvent, type RefObject, useRef, useState } from "react";
import { toast } from "sonner";
import { getApiResponseError } from '@/lib/utils/responseError';
import {
  AVATAR_MAX_SIZE_BYTES,
  isAvatarContentType,
} from "@/lib/config/avatar";

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
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

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

    setIsPending(true);
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
      router.refresh();
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
      setIsPending(false);
    }
  };

  const removeAvatar = async (): Promise<void> => {
    if (!hasAvatar) {
      return;
    }

    setIsPending(true);
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
      router.refresh();
    } catch (error: unknown) {
      console.error("Avatar removal failed:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong while removing the avatar",
        { id: toastId },
      );
    } finally {
      setIsPending(false);
    }
  };

  return {
    fileInputRef,
    isPending,
    openFilePicker: () => fileInputRef.current?.click(),
    handleFileChange,
    removeAvatar,
  };
}

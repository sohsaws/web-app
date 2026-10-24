"use client";

import { useTranslations } from "next-intl";
import {
  type ChangeEvent,
  type RefObject,
  useRef,
  useState,
  useTransition,
} from "react";
import { toast } from "sonner";
import { useServerErrorMessage } from "@/hooks/i18n/use-server-error-message";
import { useRouter } from "@/i18n/navigation";
import type { ApiErrorCode } from "@/lib/config/api-errors";
import {
  AVATAR_MAX_SIZE_BYTES,
  isAvatarContentType,
} from "@/lib/config/avatar";
import {
  ApiResponseError,
  createApiResponseError,
} from "@/lib/utils/responseError";

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

// A response without a known code, or a network failure, gets the action's
// own message rather than the generic "Something went wrong".
function getAvatarErrorCode(
  error: unknown,
  fallback: ApiErrorCode,
): ApiErrorCode {
  return error instanceof ApiResponseError && error.code !== null
    ? error.code
    : fallback;
}

export function useAvatarUpload({
  hasAvatar,
}: UseAvatarUploadOptions): UseAvatarUploadResult {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isRequestPending, setIsRequestPending] = useState(false);
  const [isRefreshing, startRefresh] = useTransition();
  const router = useRouter();
  const t = useTranslations("Settings.avatar");
  const serverErrorMessage = useServerErrorMessage();

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
      // The same checks as the upload route, so its messages fit here too.
      toast.error(serverErrorMessage("UNSUPPORTED_IMAGE_TYPE"));
      input.value = "";
      return;
    }

    if (file.size > AVATAR_MAX_SIZE_BYTES) {
      toast.error(serverErrorMessage("IMAGE_TOO_LARGE"));
      input.value = "";
      return;
    }

    setIsRequestPending(true);
    const toastId = toast.loading(t("uploading"));

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: file,
        headers: {
          "content-type": file.type,
        },
      });

      if (!response.ok) {
        throw await createApiResponseError(response, "Avatar upload failed");
      }

      toast.success(t("uploaded"), { id: toastId });
      refreshAvatar();
    } catch (error: unknown) {
      console.error("Avatar upload failed:", error);
      toast.error(
        serverErrorMessage(getAvatarErrorCode(error, "AVATAR_UPLOAD_FAILED")),
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
    const toastId = toast.loading(t("removing"));

    try {
      const response = await fetch("/api/upload", {
        method: "DELETE",
      });

      if (!response.ok) {
        throw await createApiResponseError(response, "Avatar removal failed");
      }

      toast.success(t("removed"), { id: toastId });
      refreshAvatar();
    } catch (error: unknown) {
      console.error("Avatar removal failed:", error);
      toast.error(
        serverErrorMessage(getAvatarErrorCode(error, "AVATAR_REMOVAL_FAILED")),
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

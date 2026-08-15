"use client";

import type { ReactElement } from "react";
import { useAvatarUpload } from "@/hooks/use-avatar-upload";
import { AVATAR_ACCEPT } from "@/lib/config/avatar";

interface AvatarUploadProps {
  hasAvatar: boolean;
}

export default function AvatarUpload({
  hasAvatar,
}: AvatarUploadProps): ReactElement {
  const {
    fileInputRef,
    isPending,
    openFilePicker,
    handleFileChange,
    removeAvatar,
  } = useAvatarUpload({ hasAvatar });

  return (
    <div className="flex-1">
      <h2 className="mb-1 text-sm font-medium text-white">Profile picture</h2>
      <p className="mb-4 text-xs text-neutral-500">
        Supports JPG, PNG, GIF, or WebP. Max 4 MB.
      </p>
      <div className="flex flex-wrap gap-3">
        <input
          ref={fileInputRef}
          type="file"
          id="avatar-upload"
          accept={AVATAR_ACCEPT}
          className="hidden"
          onChange={handleFileChange}
          disabled={isPending}
        />
        <button
          type="button"
          disabled={isPending}
          onClick={openFilePicker}
          className="cursor-pointer rounded-md border border-white/10 bg-zinc-950 px-4 py-2 text-xs font-medium text-neutral-300 shadow-sm outline-none transition-colors hover:border-white/20 hover:bg-neutral-900 focus-visible:ring-2 focus-visible:ring-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? "Please wait..." : "Upload new"}
        </button>
        <button
          type="button"
          onClick={removeAvatar}
          disabled={isPending || !hasAvatar}
          className="cursor-pointer px-4 py-2 text-xs font-medium text-neutral-500 outline-none transition-colors hover:text-red-500 focus-visible:ring-2 focus-visible:ring-red-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Remove
        </button>
      </div>
    </div>
  );
}

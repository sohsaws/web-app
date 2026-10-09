// Every file we upload lives at "<folder>/<userId>/<file>". Building and
// checking paths in one place keeps the two from drifting apart.
export const BLOB_FOLDERS = {
  avatars: "avatars",
  ideaImages: "ideas-images",
} as const;

export type BlobFolder = (typeof BLOB_FOLDERS)[keyof typeof BLOB_FOLDERS];

export function getUserBlobPathname(
  folder: BlobFolder,
  userId: string,
  fileName: string,
): string {
  return `${folder}/${userId}/${fileName}`;
}

// Our code may delete a file only when it is one of ours and belongs to this
// user. The URL alone is not proof: Better Auth lets a client set its own
// `image` to any string, including the URL of another user's avatar, so the
// path must sit inside this user's folder. Avatars from OAuth providers (for
// example Google) live on other hosts and are left untouched.
export function isUserBlobUrl(
  value: string | null | undefined,
  folder: BlobFolder,
  userId: string,
): value is string {
  if (!value || !userId) {
    return false;
  }

  try {
    // URL parsing also resolves "../" segments, so a path cannot climb out of
    // the user's folder.
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      url.hostname.endsWith(".blob.vercel-storage.com") &&
      url.pathname.startsWith(`/${folder}/${userId}/`)
    );
  } catch {
    return false;
  }
}

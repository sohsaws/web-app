// Only files we uploaded to Vercel Blob may be deleted by our code. Avatars
// from OAuth providers (for example Google) live on other hosts and are left
// untouched.
export function isManagedBlobUrl(
  value: string | null | undefined,
): value is string {
  if (!value) {
    return false;
  }

  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      url.hostname.endsWith(".blob.vercel-storage.com")
    );
  } catch {
    return false;
  }
}

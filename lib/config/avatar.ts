export const AVATAR_CONTENT_TYPE_TO_EXTENSION = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/gif": "gif",
  "image/webp": "webp",
} as const;

export const AVATAR_MAX_SIZE_BYTES = 4 * 1024 * 1024;

export type AvatarContentType = keyof typeof AVATAR_CONTENT_TYPE_TO_EXTENSION;

export const AVATAR_ACCEPT = Object.keys(AVATAR_CONTENT_TYPE_TO_EXTENSION).join(
  ",",
);

export function isAvatarContentType(value: string): value is AvatarContentType {
  return Object.hasOwn(AVATAR_CONTENT_TYPE_TO_EXTENSION, value);
}

// Every error an API route can answer with. The code is the contract the
// client translates (messages ApiErrors.<CODE>); the English text travels
// with it for logs and for clients that cannot translate. Routes have no
// locale in their URL, so they never pick a language themselves.
export const API_ERRORS = {
  UNAUTHORIZED: "Unauthorized",
  RATE_LIMITED: "Too many requests. Please try again later.",
  EXPECTED_JSON: "Expected a JSON request body",
  INVALID_IDEA: "Provide a valid idea",
  IDEA_NOT_SAVED: "This idea cannot be saved. Please try another idea.",
  IDEA_SAVE_FAILED: "Failed to save this idea. Please try again.",
  FAVORITES_LOAD_FAILED: "Unable to load your saved ideas. Please try again.",
  CATEGORIES_LOAD_FAILED:
    "Unable to load your category distribution. Please try again.",
  INVALID_BIO: "Invalid request body: provide a valid bio",
  GENERATION_FAILED: "Failed to generate ideas. Please try again.",
  INVALID_IMAGE_DESCRIPTION: "Provide a valid image description",
  IMAGE_PROMPT_TOO_LONG:
    "Image description exceeds the supported prompt length",
  IMAGE_GENERATION_FAILED: "Failed to generate an image. Please try again.",
  UNSUPPORTED_IMAGE_TYPE: "Unsupported image type",
  NO_IMAGE: "No image provided",
  IMAGE_TOO_LARGE: "File too large (max 4 MB)",
  AVATAR_UPLOAD_FAILED: "Avatar upload failed",
  AVATAR_REMOVAL_FAILED: "Avatar removal failed",
} as const;

export type ApiErrorCode = keyof typeof API_ERRORS;

export interface ApiErrorBody {
  error: string;
  code: ApiErrorCode;
}

export function isApiErrorCode(value: unknown): value is ApiErrorCode {
  return typeof value === "string" && Object.hasOwn(API_ERRORS, value);
}

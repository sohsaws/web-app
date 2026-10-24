import { type ApiErrorCode, isApiErrorCode } from "@/lib/config/api-errors";
import { parseRetryAfterSeconds } from "@/lib/utils/retry-after";

// A failed API response as an Error that keeps the server's error code, so
// the UI can show a translated message (ApiErrors.<code>). The message is the
// server's English text, kept for logs.
export class ApiResponseError extends Error {
  readonly code: ApiErrorCode | null;

  constructor(message: string, code: ApiErrorCode | null) {
    super(message);
    this.name = "ApiResponseError";
    this.code = code;
  }
}

export class RateLimitError extends ApiResponseError {
  readonly retryAfterSeconds: number;

  constructor(message: string, retryAfterSeconds: number) {
    super(message, "RATE_LIMITED");
    this.name = "RateLimitError";
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

interface ApiErrorDetails {
  message: string;
  code: ApiErrorCode | null;
}

async function readApiErrorDetails(
  response: Response,
  fallbackMessage: string,
): Promise<ApiErrorDetails> {
  const data: unknown = await response.json().catch(() => null);

  if (typeof data !== "object" || data === null) {
    return { message: fallbackMessage, code: null };
  }

  const message =
    "error" in data && typeof data.error === "string"
      ? data.error
      : fallbackMessage;
  const code = "code" in data && isApiErrorCode(data.code) ? data.code : null;

  return { message, code };
}

// A 429 becomes a RateLimitError, so callers can tell the user when to retry
// instead of showing a generic failure.
export async function createApiResponseError(
  response: Response,
  fallbackMessage: string,
): Promise<ApiResponseError> {
  const { message, code } = await readApiErrorDetails(
    response,
    fallbackMessage,
  );

  if (response.status === 429) {
    return new RateLimitError(
      message,
      parseRetryAfterSeconds(response.headers.get("Retry-After")),
    );
  }

  return new ApiResponseError(message, code);
}

export async function getApiResponseError(
  response: Response,
  fallbackMessage: string,
): Promise<string> {
  const { message } = await readApiErrorDetails(response, fallbackMessage);
  return message;
}

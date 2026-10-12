import { parseRetryAfterSeconds } from "@/lib/utils/retry-after";

export class RateLimitError extends Error {
  readonly retryAfterSeconds: number;

  constructor(message: string, retryAfterSeconds: number) {
    super(message);
    this.name = "RateLimitError";
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

// A 429 becomes a RateLimitError, so callers can tell the user when to retry
// instead of showing a generic failure.
export async function createApiResponseError(
  response: Response,
  fallbackMessage: string,
): Promise<Error> {
  const message = await getApiResponseError(response, fallbackMessage);

  if (response.status === 429) {
    return new RateLimitError(
      message,
      parseRetryAfterSeconds(response.headers.get("Retry-After")),
    );
  }

  return new Error(message);
}

export async function getApiResponseError(
  response: Response,
  fallbackMessage: string,
): Promise<string> {
  const data: unknown = await response.json().catch(() => null);

  if (
    typeof data === "object" &&
    data !== null &&
    "error" in data &&
    typeof data.error === "string"
  ) {
    return data.error;
  }

  return fallbackMessage;
}

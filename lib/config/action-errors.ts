import { type ApiErrorCode, isApiErrorCode } from "@/lib/config/api-errors";

// Error codes a server action can return. Like API route codes they are
// translated on the client (messages ApiErrors.<CODE>), because an action
// has no reliable request locale of its own.
export const ACTION_ERROR_CODES = [
  "NOT_SIGNED_IN",
  "INVALID_PROFILE",
  "PROFILE_UPDATE_FAILED",
  "INVALID_NOTIFICATION_SETTINGS",
  "NOTIFICATIONS_SAVE_FAILED",
  "UNSUPPORTED_LANGUAGE",
  "LANGUAGE_UPDATE_FAILED",
] as const;

export type ActionErrorCode = (typeof ACTION_ERROR_CODES)[number];

export interface ActionFailure {
  success: false;
  code: ActionErrorCode;
}

// Any error code that comes from our server, from a route or an action.
export type ServerErrorCode = ApiErrorCode | ActionErrorCode;

const actionErrorCodes: ReadonlySet<string> = new Set(ACTION_ERROR_CODES);

export function isServerErrorCode(value: unknown): value is ServerErrorCode {
  return (
    isApiErrorCode(value) ||
    (typeof value === "string" && actionErrorCodes.has(value))
  );
}

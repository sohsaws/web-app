import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ApiResponseError, RateLimitError } from "@/lib/utils/responseError";
import { IntlTestProvider } from "@/test-utils/intl-test-provider";
import { useAuthErrorMessage } from "./use-auth-error-message";
import { useServerErrorMessage } from "./use-server-error-message";
import { useValidationMessage } from "./use-validation-message";

function renderWithMessages<Result>(hook: () => Result): Result {
  return renderHook(hook, { wrapper: IntlTestProvider }).result.current;
}

const UNKNOWN = "Something went wrong. Please try again.";

describe("useServerErrorMessage", () => {
  const serverErrorMessage = () => renderWithMessages(useServerErrorMessage);

  it.each([
    ["an action code", "NOT_SIGNED_IN", "You must be signed in to do this."],
    [
      "an API response error",
      new ApiResponseError("x", "IDEA_NOT_SAVED"),
      "This idea cannot be saved. Please try another idea.",
    ],
    [
      "a rate limit error",
      new RateLimitError("x", 60),
      "You've reached the limit. Please try again later.",
    ],
  ])("translates %s", (_case, source, expected) => {
    expect(serverErrorMessage()(source)).toBe(expected);
  });

  it.each([
    ["an API response error without a code", new ApiResponseError("x", null)],
    ["a plain Error", new Error("offline")],
    ["an unknown code", "SOMETHING_NEW"],
    ["an inherited key", "toString"],
    ["nothing", undefined],
  ])("falls back to the generic message for %s", (_case, source) => {
    expect(serverErrorMessage()(source)).toBe(UNKNOWN);
  });
});

describe("useValidationMessage", () => {
  const validationMessage = () => renderWithMessages(useValidationMessage);

  it("translates a key and fills its values", () => {
    expect(validationMessage()("nameTooLong", { max: 50 })).toBe(
      "Name cannot be longer than 50 characters.",
    );
  });

  it("shows a generic hint for Zod's own default text", () => {
    expect(
      validationMessage()("Too small: expected string to have >=1 characters"),
    ).toBe("Please check this field.");
  });

  it("returns nothing when there is no error", () => {
    expect(validationMessage()(undefined)).toBeUndefined();
  });
});

describe("useAuthErrorMessage", () => {
  const authErrorMessage = () => renderWithMessages(useAuthErrorMessage);

  it("translates a known Better Auth code", () => {
    expect(authErrorMessage()({ code: "USER_ALREADY_EXISTS" })).toBe(
      "An account with this email already exists.",
    );
  });

  it("asks the user to wait on a 429 without a code", () => {
    expect(authErrorMessage()({ status: 429, message: "Too many" })).toBe(
      "Too many attempts. Please wait a minute and try again.",
    );
  });

  it.each([
    ["an unknown code", { code: "SOMETHING_NEW" }],
    ["a non-string code", { code: 42 }],
    ["null", null],
    ["a string", "INVALID_PASSWORD"],
  ])("falls back to the generic message for %s", (_case, error) => {
    expect(authErrorMessage()(error)).toBe(UNKNOWN);
  });
});

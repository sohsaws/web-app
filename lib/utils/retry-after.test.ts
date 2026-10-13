import { describe, expect, it } from "vitest";
import {
  formatRetryAfter,
  getRetryAfterSeconds,
  parseRetryAfterSeconds,
} from "./retry-after";

describe("getRetryAfterSeconds", () => {
  it("rounds the remaining time up to whole seconds", () => {
    expect(getRetryAfterSeconds(10_500, 0)).toBe(11);
  });

  it.each([
    ["the reset is now", 1_000],
    ["the reset is already past", 500],
  ])("never returns less than one second when %s", (_case, resetAt) => {
    expect(getRetryAfterSeconds(resetAt, 1_000)).toBe(1);
  });
});

describe("parseRetryAfterSeconds", () => {
  it.each([
    ["120", 120],
    [" 30 ", 30],
    ["0", 1],
  ])("reads %j as %i seconds", (value, expected) => {
    expect(parseRetryAfterSeconds(value)).toBe(expected);
  });

  it.each([
    ["a missing header", null],
    ["an empty value", ""],
    ["an HTTP date", "Wed, 21 Oct 2026 07:28:00 GMT"],
    ["a negative number", "-5"],
    ["a fraction", "1.5"],
  ])("falls back to one minute for %s", (_case, value) => {
    expect(parseRetryAfterSeconds(value)).toBe(60);
  });
});

describe("formatRetryAfter", () => {
  it.each([
    [1, "1 minute"],
    [60, "1 minute"],
    [61, "2 minutes"],
    [3600, "60 minutes"],
  ])("formats %i seconds as %j", (seconds, expected) => {
    expect(formatRetryAfter(seconds)).toBe(expected);
  });
});

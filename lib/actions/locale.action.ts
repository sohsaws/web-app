"use server";

import { cookies, headers } from "next/headers";
import { auth } from "@/lib/auth";
import type { ActionFailure } from "@/lib/config/action-errors";
import {
  LOCALE_COOKIE_MAX_AGE_SECONDS,
  LOCALE_COOKIE_NAME,
  type Locale,
  localeSchema,
} from "@/lib/config/locales";

export type UpdateLocaleResult =
  | { success: true; locale: Locale }
  | ActionFailure;

// Saves the language in the profile, the source of truth inside the app, and
// mirrors it in the cookie so pages without a locale prefix ("/") open in the
// same language. The caller then navigates to the new locale prefix.
export async function updateLocale(
  input: unknown,
): Promise<UpdateLocaleResult> {
  const parsedLocale = localeSchema.safeParse(input);

  if (!parsedLocale.success) {
    return { success: false, code: "UNSUPPORTED_LANGUAGE" };
  }

  const requestHeaders = await headers();
  const session = await auth.api.getSession({ headers: requestHeaders });

  if (!session) {
    return {
      success: false,
      code: "NOT_SIGNED_IN",
    };
  }

  try {
    await auth.api.updateUser({
      body: { locale: parsedLocale.data },
      headers: requestHeaders,
    });
  } catch (error: unknown) {
    console.error("Language update failed:", error);
    return { success: false, code: "LANGUAGE_UPDATE_FAILED" };
  }

  const cookieStore = await cookies();
  cookieStore.set(LOCALE_COOKIE_NAME, parsedLocale.data, {
    path: "/",
    sameSite: "lax",
    maxAge: LOCALE_COOKIE_MAX_AGE_SECONDS,
  });

  return { success: true, locale: parsedLocale.data };
}

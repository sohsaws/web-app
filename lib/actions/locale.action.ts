"use server";

import { cookies, headers } from "next/headers";
import { auth } from "@/lib/auth";
import {
  LOCALE_COOKIE_MAX_AGE_SECONDS,
  LOCALE_COOKIE_NAME,
  type Locale,
  localeSchema,
} from "@/lib/config/locales";

export type UpdateLocaleResult =
  | { success: true; locale: Locale }
  | { success: false; message: string };

// Saves the language in the profile, the source of truth inside the app, and
// mirrors it in the cookie so pages without a locale prefix ("/") open in the
// same language. The caller then navigates to the new locale prefix.
export async function updateLocale(
  input: unknown,
): Promise<UpdateLocaleResult> {
  const parsedLocale = localeSchema.safeParse(input);

  if (!parsedLocale.success) {
    return { success: false, message: "This language is not supported" };
  }

  const requestHeaders = await headers();
  const session = await auth.api.getSession({ headers: requestHeaders });

  if (!session) {
    return {
      success: false,
      message: "You must be signed in to change the language",
    };
  }

  try {
    await auth.api.updateUser({
      body: { locale: parsedLocale.data },
      headers: requestHeaders,
    });
  } catch (error: unknown) {
    console.error("Language update failed:", error);
    return { success: false, message: "Unable to change the language" };
  }

  const cookieStore = await cookies();
  cookieStore.set(LOCALE_COOKIE_NAME, parsedLocale.data, {
    path: "/",
    sameSite: "lax",
    maxAge: LOCALE_COOKIE_MAX_AGE_SECONDS,
  });

  return { success: true, locale: parsedLocale.data };
}

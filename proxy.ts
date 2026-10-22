import { type NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { isPathUnder, splitLocaleFromPathname } from "@/i18n/pathname";
import { routing } from "@/i18n/routing";
import { auth } from "@/lib/auth";
import {
  LOCALE_COOKIE_MAX_AGE_SECONDS,
  LOCALE_COOKIE_NAME,
  type Locale,
  resolveLocale,
} from "@/lib/config/locales";

const handleI18nRouting = createMiddleware(routing);

// Every page of the signed-in app, checked here once instead of per page.
const PROTECTED_PATHS = ["/dashboard", "/dive", "/for-you", "/settings"];

function setLocaleCookie(
  response: NextResponse,
  request: NextRequest,
  locale: Locale,
): void {
  if (request.cookies.get(LOCALE_COOKIE_NAME)?.value === locale) {
    return;
  }

  response.cookies.set(LOCALE_COOKIE_NAME, locale, {
    path: "/",
    sameSite: "lax",
    maxAge: LOCALE_COOKIE_MAX_AGE_SECONDS,
  });
}

// Only a page load means the user is looking at this locale. Prefetches and
// the router's background revalidation of the page they just left must not
// overwrite a language they have just switched to (next-intl's own rule).
function isDocumentRequest(request: NextRequest): boolean {
  const fetchDestination = request.headers.get("sec-fetch-dest");
  return fetchDestination === null || fetchDestination === "document";
}

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const { locale, pathname } = splitLocaleFromPathname(
    request.nextUrl.pathname,
  );

  // A path without a locale is first redirected by next-intl to one with a
  // locale; the session is checked on that second request.
  if (!locale) {
    return handleI18nRouting(request);
  }

  if (!isPathUnder(pathname, PROTECTED_PATHS)) {
    const response = handleI18nRouting(request);
    // next-intl skips the cookie when the URL locale matches the browser
    // language, but sign-up reads the guest's language from this cookie.
    if (isDocumentRequest(request)) {
      setLocaleCookie(response, request, locale);
    }
    return response;
  }

  const session = await auth.api.getSession({ headers: request.headers });

  if (!session) {
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
  }

  // Inside the app the profile language wins over the URL, so a shared link
  // or an old bookmark opens in the user's own language.
  const profileLocale = resolveLocale(session.user.locale);

  if (profileLocale !== locale) {
    const profileUrl = request.nextUrl.clone();
    profileUrl.pathname = `/${profileLocale}${pathname}`;

    const response = NextResponse.redirect(profileUrl);
    setLocaleCookie(response, request, profileLocale);
    return response;
  }

  const response = handleI18nRouting(request);
  setLocaleCookie(response, request, profileLocale);
  return response;
}

export const config = {
  // Everything except API routes, Next internals and files with an extension.
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};

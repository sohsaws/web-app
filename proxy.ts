import { type NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { isPathUnder, splitLocaleFromPathname } from "@/i18n/pathname";
import { routing } from "@/i18n/routing";
import { auth } from "@/lib/auth";

const handleI18nRouting = createMiddleware(routing);

// Every page of the signed-in app, checked here once instead of per page.
const PROTECTED_PATHS = ["/dashboard", "/dive", "/for-you", "/settings"];

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const { locale, pathname } = splitLocaleFromPathname(
    request.nextUrl.pathname,
  );

  // A path without a locale is first redirected by next-intl to one with a
  // locale; the session is checked on that second request.
  if (locale && isPathUnder(pathname, PROTECTED_PATHS)) {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session) {
      return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
    }
  }

  return handleI18nRouting(request);
}

export const config = {
  // Everything except API routes, Next internals and files with an extension.
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};

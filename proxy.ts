import { clerkMiddleware } from '@clerk/nextjs/server'

// export async function proxy(request: NextRequest) {
// 	const session = await auth();

// 	if (!session) {
// 		return NextResponse.redirect(
// 			new URL("/login?reason=unauthorized", request.url),
// 		);
// 	}
// }

export default clerkMiddleware();

export const config = {
	matcher: [
	  // Skip Next.js internals and all static files, unless found in search params
	  '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
	  // Always run for API routes
	  '/(api|trpc)(.*)',
	  // Always run for Clerk-specific frontend API routes
	  '/__clerk/(.*)',
	],
  }

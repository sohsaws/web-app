import { NextResponse, NextRequest } from 'next/server'
import { auth } from "./auth"
 

export async function proxy(request: NextRequest) {
  const session = await auth();

  console.log(session);

  if (!session) {
    return NextResponse.redirect(new URL('/login?reason=unauthorized', request.url));
  }
}
 
export const config = {
  matcher: ['/settings/:path*', '/dashboard/:path*', "/verify-email/:path*"]
}
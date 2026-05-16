import { NextResponse, NextRequest } from "next/server";
import { auth } from "./auth";

export async function proxy(request: NextRequest) {
	const session = await auth();

	if (!session) {
		return NextResponse.redirect(
			new URL("/login?reason=unauthorized", request.url),
		);
	}
}

export const config = {
	matcher: [
		"/settings/:path*",
		"/dashboard/:path*",
		"/verify-email/:path*",
		"/change-password/:path*",
		"/change-email/:path*",
	],
};

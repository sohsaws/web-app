import { NextResponse } from "next/server";
import { apiErrorResponse } from "@/lib/api-error-response";
import { auth } from "@/lib/auth";
import { getFavoritesPreview } from "@/lib/data/get-favorites-preview";

export async function GET(request: Request): Promise<NextResponse> {
  try {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session) {
      return apiErrorResponse("UNAUTHORIZED", 401);
    }

    const preview = await getFavoritesPreview(session.user.id);
    return NextResponse.json(preview, {
      headers: { "Cache-Control": "private, no-store" },
    });
  } catch {
    return apiErrorResponse("FAVORITES_LOAD_FAILED", 500);
  }
}

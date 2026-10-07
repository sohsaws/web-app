import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getFavoritesPreview } from "@/lib/data/get-favorites-preview";

export async function GET(request: Request): Promise<NextResponse> {
  try {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const preview = await getFavoritesPreview(session.user.id);
    return NextResponse.json(preview, {
      headers: { "Cache-Control": "private, no-store" },
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to load your saved ideas. Please try again." },
      { status: 500 },
    );
  }
}

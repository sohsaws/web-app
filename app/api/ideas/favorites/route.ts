import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { ideaSaveRequestSchema } from "@/lib/config/ideas";
import { saveFavoriteForUser } from "@/lib/data/save-favorite";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!request.headers.get("Content-Type")?.includes("application/json")) {
      return NextResponse.json(
        { error: "Expected a JSON request body" },
        { status: 415 },
      );
    }

    const body: unknown = await request.json().catch(() => null);
    const result = ideaSaveRequestSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Provide a valid idea" },
        { status: 400 },
      );
    }

    const saved = await saveFavoriteForUser(session.user.id, result.data);

    if (!saved) {
      return NextResponse.json(
        { error: "This idea cannot be saved. Please try another idea." },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to save this idea. Please try again." },
      { status: 500 },
    );
  }
}

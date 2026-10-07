import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getCategoryDistribution } from "@/lib/data/get-category-distribution";

export async function GET(request: Request): Promise<NextResponse> {
  try {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const distribution = await getCategoryDistribution(session.user.id);

    return NextResponse.json(distribution, {
      headers: { "Cache-Control": "private, no-store" },
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to load your category distribution. Please try again." },
      { status: 500 },
    );
  }
}

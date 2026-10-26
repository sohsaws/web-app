import { NextResponse } from "next/server";
import { apiErrorResponse } from "@/lib/api-error-response";
import { auth } from "@/lib/auth";
import { getCategoryDistribution } from "@/lib/data/get-category-distribution";

export async function GET(request: Request): Promise<NextResponse> {
  try {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session) {
      return apiErrorResponse("UNAUTHORIZED", 401);
    }

    const distribution = await getCategoryDistribution(session.user.id);

    return NextResponse.json(distribution, {
      headers: { "Cache-Control": "private, no-store" },
    });
  } catch {
    return apiErrorResponse("CATEGORIES_LOAD_FAILED", 500);
  }
}

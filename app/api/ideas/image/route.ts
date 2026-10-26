import { NextResponse } from "next/server";
import { z } from "zod";
import { generateImages } from "@/lib/ai/generate-ideas";
import { apiErrorResponse } from "@/lib/api-error-response";
import { auth } from "@/lib/auth";
import { generatedIdeaSchema } from "@/lib/config/ideas";
import { checkRateLimit, rateLimitExceededResponse } from "@/lib/rate-limit";

const imageRequestSchema = generatedIdeaSchema.pick({ description: true });

export async function POST(request: Request): Promise<NextResponse> {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session) {
    return apiErrorResponse("UNAUTHORIZED", 401);
  }

  // Counted before the body is read, so malformed requests use the limit too.
  const rateLimit = await checkRateLimit("image", session.user.id);
  if (rateLimit.rateLimited) {
    return rateLimitExceededResponse(rateLimit.retryAfterSeconds);
  }

  if (!request.headers.get("Content-Type")?.includes("application/json")) {
    return apiErrorResponse("EXPECTED_JSON", 415);
  }

  const body: unknown = await request.json().catch(() => null);
  const parsedBody = imageRequestSchema.safeParse(body);

  if (!parsedBody.success) {
    return apiErrorResponse("INVALID_IMAGE_DESCRIPTION", 400);
  }

  try {
    const image = await generateImages(parsedBody.data.description);
    return NextResponse.json(image, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error: unknown) {
    console.error("Image generation failed:", error);

    if (error instanceof Error && error.cause instanceof z.ZodError) {
      return apiErrorResponse("IMAGE_PROMPT_TOO_LONG", 400);
    }

    return apiErrorResponse("IMAGE_GENERATION_FAILED", 502);
  }
}

import { randomUUID } from "node:crypto";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { assignIdeaCategories, generateIdeas } from "@/lib/ai/generate-ideas";
import { apiErrorResponse } from "@/lib/api-error-response";
import { auth } from "@/lib/auth";
import { profileBioSchema } from "@/lib/config/profile";
import { checkRateLimit, rateLimitExceededResponse } from "@/lib/rate-limit";
import type { IdeaGeneratedResponse } from "@/lib/types/ideas/types";

const bioRequestSchema = z.object({
  bio: profileBioSchema,
});

export async function POST(request: Request): Promise<NextResponse> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return apiErrorResponse("UNAUTHORIZED", 401);
  }

  // Counted before the body is read, so malformed requests use the limit too.
  const rateLimit = await checkRateLimit("generate", session.user.id);
  if (rateLimit.rateLimited) {
    return rateLimitExceededResponse(rateLimit.retryAfterSeconds);
  }

  const body: unknown = await request.json().catch(() => null);
  const parsedBody = bioRequestSchema.safeParse(body);

  if (!parsedBody.success) {
    return apiErrorResponse("INVALID_BIO", 400);
  }

  const { bio } = parsedBody.data;
  try {
    const generated = await generateIdeas(bio);
    const categorizedIdeas = await assignIdeaCategories(generated.ideas);
    const createdAt = new Date();

    const ideas: IdeaGeneratedResponse[] = categorizedIdeas.map(
      ({ title, description, categories }): IdeaGeneratedResponse => ({
        id: randomUUID(),
        title,
        description,
        categories,
        createdAt,
      }),
    );

    return NextResponse.json(
      {
        ideas,
      },
      {
        status: 200,
      },
    );
  } catch (e) {
    console.error("Idea generation failed:", e);
    return apiErrorResponse("GENERATION_FAILED", 502);
  }
}

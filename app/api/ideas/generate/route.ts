import { randomUUID } from "node:crypto";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { generateIdeas } from "@/lib/ai/generate-ideas";
import { auth } from "@/lib/auth";
import { profileBioSchema } from "@/lib/config/profile";
import type { IdeaGeneratedResponse } from "@/lib/types/ideas/types";

const bioRequestSchema = z.object({
  bio: profileBioSchema,
});

export async function POST(request: Request): Promise<NextResponse> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      {
        status: 401,
      },
    );
  }

  const body: unknown = await request.json().catch(() => null);
  const parsedBody = bioRequestSchema.safeParse(body);

  if (!parsedBody.success) {
    return NextResponse.json(
      {
        error: "Invalid request body: provide a valid bio",
      },
      { status: 400 },
    );
  }

  const { bio } = parsedBody.data;
  try {
    const generated = await generateIdeas(bio);
    const createdAt = new Date();

    const ideas: IdeaGeneratedResponse[] = generated.ideas.map(
      ({ title, description }): IdeaGeneratedResponse => ({
        id: randomUUID(),
        title,
        description,
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
  } catch {
    return NextResponse.json(
      {
        error: "Failed to generate ideas. Please try again.",
      },
      { status: 502 },
    );
  }
}

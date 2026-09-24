import { NextResponse } from "next/server";
import { z } from "zod";
import { generateImages } from "@/lib/ai/generate-ideas";
import { auth } from "@/lib/auth";
import { generatedIdeaSchema } from "@/lib/config/ideas";

const imageRequestSchema = generatedIdeaSchema.pick({ description: true });

export async function POST(request: Request): Promise<NextResponse> {
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
  const parsedBody = imageRequestSchema.safeParse(body);

  if (!parsedBody.success) {
    return NextResponse.json(
      { error: "Provide a valid image description" },
      { status: 400 },
    );
  }

  try {
    const image = await generateImages(parsedBody.data.description);

    return NextResponse.json(image, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.cause instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Image description exceeds the supported prompt length" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Failed to generate an image. Please try again." },
      { status: 502 },
    );
  }
}

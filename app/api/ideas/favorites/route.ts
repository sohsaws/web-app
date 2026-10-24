import { randomUUID } from "node:crypto";
import { del, put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { apiErrorResponse } from "@/lib/api-error-response";
import { auth } from "@/lib/auth";
import { BLOB_FOLDERS, getUserBlobPathname } from "@/lib/blob/managed-blob-url";
import {
  IDEA_IMAGE_DATA_URL_PREFIX,
  IDEA_IMAGE_FILE_EXTENSION,
  IDEA_IMAGE_MEDIA_TYPE,
  ideaSaveRequestSchema,
} from "@/lib/config/ideas";
import { saveFavoriteForUser } from "@/lib/data/save-favorite";

async function uploadIdeaImage(
  userId: string,
  imageDataUrl: string,
): Promise<string> {
  const base64 = imageDataUrl.slice(IDEA_IMAGE_DATA_URL_PREFIX.length);
  const imageBytes = Buffer.from(base64, "base64");
  const pathname = getUserBlobPathname(
    BLOB_FOLDERS.ideaImages,
    userId,
    `${randomUUID()}.${IDEA_IMAGE_FILE_EXTENSION}`,
  );

  const blob = await put(pathname, imageBytes, {
    access: "public",
    contentType: IDEA_IMAGE_MEDIA_TYPE,
  });

  return blob.url;
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session) {
      return apiErrorResponse("UNAUTHORIZED", 401);
    }

    if (!request.headers.get("Content-Type")?.includes("application/json")) {
      return apiErrorResponse("EXPECTED_JSON", 415);
    }

    const body: unknown = await request.json().catch(() => null);
    const result = ideaSaveRequestSchema.safeParse(body);

    if (!result.success) {
      return apiErrorResponse("INVALID_IDEA", 400);
    }

    const imageUrl = result.data.image
      ? await uploadIdeaImage(session.user.id, result.data.image)
      : undefined;

    let saved = false;
    try {
      saved = await saveFavoriteForUser(session.user.id, {
        ...result.data,
        image: imageUrl,
      });
    } finally {
      if (!saved && imageUrl) {
        await del(imageUrl);
      }
    }

    if (!saved) {
      return apiErrorResponse("IDEA_NOT_SAVED", 409);
    }

    return NextResponse.json(
      { saved: true },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return apiErrorResponse("IDEA_SAVE_FAILED", 500);
  }
}

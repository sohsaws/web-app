import { randomUUID } from "node:crypto";
import { del, put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  BLOB_FOLDERS,
  getUserBlobPathname,
  isUserBlobUrl,
} from "@/lib/blob/managed-blob-url";
import {
  AVATAR_CONTENT_TYPE_TO_EXTENSION,
  AVATAR_MAX_SIZE_BYTES,
  isAvatarContentType,
} from "@/lib/config/avatar";

function errorResponse(message: string, status: number): NextResponse {
  return NextResponse.json({ error: message }, { status });
}

async function deleteUserAvatarBlob(
  value: string | null | undefined,
  userId: string,
): Promise<void> {
  if (!isUserBlobUrl(value, BLOB_FOLDERS.avatars, userId)) {
    return;
  }

  try {
    await del(value);
  } catch (error: unknown) {
    console.error("Failed to delete avatar blob:", error);
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session) {
    return errorResponse("Unauthorized", 401);
  }

  const contentType = request.headers.get("content-type") ?? "";

  if (!isAvatarContentType(contentType)) {
    return errorResponse("Unsupported image type", 415);
  }

  const file = await request.blob();

  if (file.size === 0) {
    return errorResponse("No image provided", 400);
  }

  if (file.size > AVATAR_MAX_SIZE_BYTES) {
    return errorResponse("File too large (max 4 MB)", 413);
  }

  const extension = AVATAR_CONTENT_TYPE_TO_EXTENSION[contentType];
  const pathname = getUserBlobPathname(
    BLOB_FOLDERS.avatars,
    session.user.id,
    `${randomUUID()}.${extension}`,
  );
  const previousImage = session.user.image;
  let uploadedUrl: string | undefined;

  try {
    const blob = await put(pathname, file, {
      access: "public",
    });
    uploadedUrl = blob.url;

    await auth.api.updateUser({
      body: {
        image: blob.url,
      },
      headers: request.headers,
    });

    await deleteUserAvatarBlob(previousImage, session.user.id);

    return NextResponse.json({ url: blob.url });
  } catch (error: unknown) {
    await deleteUserAvatarBlob(uploadedUrl, session.user.id);
    console.error("Avatar upload failed:", error);
    return errorResponse("Avatar upload failed", 500);
  }
}

export async function DELETE(request: Request): Promise<NextResponse> {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session) {
    return errorResponse("Unauthorized", 401);
  }

  const previousImage = session.user.image;

  if (!previousImage) {
    return NextResponse.json({ success: true });
  }

  try {
    await auth.api.updateUser({
      body: {
        image: null,
      },
      headers: request.headers,
    });

    await deleteUserAvatarBlob(previousImage, session.user.id);

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Avatar removal failed:", error);
    return errorResponse("Avatar removal failed", 500);
  }
}

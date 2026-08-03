import { auth } from "@clerk/nextjs/server";
import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const MAX_FILE_SIZE = 4 * 1024 * 1024;

export async function POST(request: Request): Promise<NextResponse> {
  const { sessionStatus, userId } = await auth();
  const user = await currentUser();

  if (sessionStatus !== "active") {
    return NextResponse.json(
      {
        error: "Unauthorized",
        status: 401,
      },
      { status: 401 },
    );
  }

  if (!userId) {
    return NextResponse.json(
      {
        error: "Something went wrong",
        status: 500,
      },
      { status: 500 },
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json(
      {
        error: "No file uploaded",
        status: 400,
      },
      { status: 400 },
    );
  }

  if (!file.name) {
    return NextResponse.json(
      {
        error: "No filename provided",
        status: 400,
      },
      { status: 400 },
    );
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      {
        error: "Invalid file type",
        status: 400,
      },
      { status: 400 },
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      {
        error: "File too large (max 4 MB)",
        status: 400,
      },
      { status: 400 },
    );
  }

  const blob = await put(file.name, file, {
    access: "public",
    allowOverwrite: true,
  });

  await prisma.user.update({
    where: {
      clerkId: userId,
    },
    data: {
      image: blob.url,
    },
  });

  return NextResponse.json({ url: blob.url });
}

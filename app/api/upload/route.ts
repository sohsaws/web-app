import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

export async function POST(request: Request): Promise<NextResponse> {
  const session = await auth();
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');

  if (!session) {
    return NextResponse.json({
      error: "Unauthorized",
      status: 401
    })
  }

  if (!filename) {
    return NextResponse.json({
      error: "No filename provided",
      status: 400
    })
  }

  const blob = await put(filename, request.body as any, {
    access: 'public',
    allowOverwrite: true,
  });

  await prisma.user.update({
    where: {
      id: session.user.id as string
    },
    data: {
      image: blob.url
    }
  });

  // session.user.image = blob.url;

  return NextResponse.json(blob);
}


// import path from "path";
// import prisma from "@/lib/prisma";
// import { NextResponse } from "next/server";
// import { auth } from "@/auth";

// export async function POST(req: Request) {

//     const formData = await req.formData();
//     const userId = (await auth())?.user.id;

//     const file = formData.get("file") as File;

//     if (!file) {
//         return NextResponse.json({ 
//             error: "No file uploaded", 
//             success: false }, 
//             { status: 400 }
//         );
//     }

//     const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
//     if (!allowedTypes.includes(file.type)) {
//         return NextResponse.json({ 
//             error: "Invalid file type", 
//             success: false }, 
//             { status: 400 }
//         );
//     }

//     const maxSize = 4 * 1024 * 1024;
//     if (file.size > maxSize) {
//         return NextResponse.json({
//             error: "File too large (max 5MB)", 
//             success: false}, 
//             { status: 400 }
//         );
//     }

//     try {
//         const bytes = await file.arrayBuffer();
//         const buffer = Buffer.from(bytes);
        
//         const upload = await prisma.user.upsert({
//             where: {
//                 id: userId
//             },
//             create: {
//                 image: file
//             },
//             update: {
//                 image: file
//             }
//         })
//     }
// }
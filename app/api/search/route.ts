import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
 try {
  const { query } = await req.json();

  const res = await prisma.topicSearch.findMany({
    take: 7,
    where: {
        topic: {
            startsWith: query,
    }
  }});

  return NextResponse.json({
   success: true,
   results: res,
   message: "Here are your search results",
  });
 } catch (error) {

    if (error instanceof Error) {
        return NextResponse.json({
            error: "error",
            message: error.message,
        }, {status: 500});
    }

    return NextResponse.json({
        status: "error",
        message: "Something went wrong",
    }, {status: 500});
 }
}
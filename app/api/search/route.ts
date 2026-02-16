import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import Fuse from "fuse.js";

export async function POST(req: Request) {
 try {
  const { query } = await req.json();

  const res = await prisma.topicSearch.findMany({
    take: 7,
    where: {
        topic: {
            contains: query,
        }
    }
  });

  const lowerQuery = query.toLowerCase();

  const fuse = new Fuse(res, {
   keys: ["topic"],
   includeScore: true,      
   threshold: 1,
  });

  const searchResults = fuse.search(lowerQuery);

  return NextResponse.json({
   success: true,
   results: searchResults.map((result) => result.item),
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
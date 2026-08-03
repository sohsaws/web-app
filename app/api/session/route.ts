import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  const { sessionStatus, sessionId } = await auth();

  if (sessionStatus !== "active") {
    return new NextResponse(
      JSON.stringify({ message: "Unauthorized", status: "fail" }),
      { status: 401 },
    );
  }

  return NextResponse.json({
    authenticated: sessionId,
  });
}

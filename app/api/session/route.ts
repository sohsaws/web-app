import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET() {

    const session = await auth();

    if (!session?.user) {
        return new NextResponse(
            JSON.stringify({message: "Unauthorized", status: "fail"}),
            {status: 401}
        )
    }

    return NextResponse.json({
        authenticated: !!session,
        session,
    });
}
import { NextResponse, type NextRequest } from "next/server";

export default function proxy(request: NextRequest) {
  return undefined;
}

export const config = {
  matcher: ["/(dashboard|settings)(.*)", "/(api)(.*)", "/__clerk/(.*)"],
};

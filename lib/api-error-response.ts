import "server-only";

import { NextResponse } from "next/server";
import {
  API_ERRORS,
  type ApiErrorBody,
  type ApiErrorCode,
} from "@/lib/config/api-errors";

// The one way a route answers with an error: a stable code the client can
// translate, plus the English text for logs.
export function apiErrorResponse(
  code: ApiErrorCode,
  status: number,
  headers?: HeadersInit,
): NextResponse<ApiErrorBody> {
  return NextResponse.json(
    { error: API_ERRORS[code], code },
    { status, headers },
  );
}

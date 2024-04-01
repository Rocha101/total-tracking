import type { NextRequest } from "next/server";
import { verifyToken } from "./utils/auth";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return Response.redirect(new URL("/login", request.url));
  }

  const { accountId } = verifyToken(token);

  if (accountId && !request.nextUrl.pathname.startsWith("/admin")) {
    return Response.redirect(new URL("/admin", request.url));
  }

  if (!accountId && !request.nextUrl.pathname.startsWith("/login")) {
    return Response.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};

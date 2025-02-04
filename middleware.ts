import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE } from "./constants";

export async function middleware(request: NextRequest) {
  const NOT_FOUND = NextResponse.rewrite(new URL("/not-found", request.url));

  if (request.nextUrl.pathname !== "/new") return;

  if (!request.cookies.has(SESSION_COOKIE)) return NOT_FOUND;

  // verify token
  const sessionToken = request.cookies.get(SESSION_COOKIE)!;
  const res = await fetch(new URL("/api/verify-session", request.url), {
    headers: {
      SESSION_COOKIE: sessionToken.value,
    },
  });
  if (res.status !== 200) return NOT_FOUND;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};

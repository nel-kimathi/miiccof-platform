import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ACCESS_COOKIE = "miiccof_site_access";
const PASSWORD = process.env.SITE_ACCESS_PASSWORD?.trim();

export function middleware(request: NextRequest) {
  // If no password is configured, the site is open (default for local dev).
  if (!PASSWORD) return NextResponse.next();

  // Static assets and the password form itself must remain accessible.
  const pathname = request.nextUrl.pathname;
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/images/") ||
    pathname.startsWith("/favicon.ico") ||
    pathname === "/site-access"
  ) {
    return NextResponse.next();
  }

  const accessCookie = request.cookies.get(ACCESS_COOKIE);
  if (accessCookie?.value === PASSWORD) {
    return NextResponse.next();
  }

  // Redirect to the password gate, preserving the intended destination.
  const url = request.nextUrl.clone();
  url.pathname = "/site-access";
  url.searchParams.set("returnTo", pathname + (request.nextUrl.search || ""));
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images|site-access).*)"],
};

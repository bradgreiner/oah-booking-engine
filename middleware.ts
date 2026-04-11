import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /olympics/* sub-routes, not /olympics itself (the gate)
  if (pathname.startsWith("/olympics/") && pathname !== "/olympics") {
    const hasAccess = request.cookies.get("olympics_access")?.value === "true";
    if (!hasAccess) {
      return NextResponse.redirect(new URL("/olympics", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/olympics/:path+"],
};

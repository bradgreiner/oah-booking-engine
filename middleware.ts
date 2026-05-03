import { NextRequest, NextResponse } from "next/server";

const VALID_STAY_TYPES = new Set(["monthly-rental", "short-term-rental"]);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Olympics gate
  if (pathname.startsWith("/olympics/") && pathname !== "/olympics") {
    const hasAccess = request.cookies.get("olympics_access")?.value === "true";
    if (!hasAccess) {
      return NextResponse.redirect(new URL("/olympics", request.url));
    }
  }

  // Legacy /homes/{slug} redirect (no stayType segment)
  // If the path is /homes/{something} and {something} is NOT a valid stayType,
  // rewrite to the legacy slug resolver API
  if (pathname.startsWith("/homes/")) {
    const parts = pathname.slice("/homes/".length).split("/").filter(Boolean);
    if (parts.length === 1 && !VALID_STAY_TYPES.has(parts[0])) {
      // Single segment that's not a stayType = old slug, redirect to resolver
      const url = request.nextUrl.clone();
      url.pathname = `/api/resolve-slug/${parts[0]}`;
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/olympics/:path+", "/homes/:path*"],
};

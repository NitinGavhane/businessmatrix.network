import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/directory/admin")) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      return NextResponse.redirect(new URL("/directory/auth/login", request.url));
    }

    if (token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/directory/dashboard", request.url));
    }

    return NextResponse.next();
  }

  if (
    pathname.startsWith("/directory/dashboard") ||
    pathname.startsWith("/directory/onboarding") ||
    pathname.startsWith("/directory/list")
  ) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      return NextResponse.redirect(new URL("/directory/auth/login", request.url));
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/directory/admin/:path*", "/directory/dashboard/:path*", "/directory/onboarding", "/directory/list"],
};

import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { useUserSession } from "./providers/userSessionProvider/UserSessionProvider";
import { User } from "./types";

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;
  const { pathname } = request.nextUrl;

  const isAuthPage = [
    "/login",
    "/sign-up",
    "/forgot-password",
    "/reset-password",
  ].includes(pathname);

  if (accessToken) {
    const decoded = jwt.decode(accessToken) as User | null;

    if (pathname === "/reset-password") {
      return NextResponse.redirect(
        new URL("/prediction-analysis", request.url),
      );
    }

    if (decoded && !decoded.isVerified) {
      const allowedForUnverified = ["/verify-email", "/unverified"];
      const isAllowed = allowedForUnverified.some((prefix) =>
        pathname.startsWith(prefix),
      );

      if (!isAllowed) {
        return NextResponse.redirect(new URL("/unverified", request.url));
      }
    }
  }

  if (isAuthPage && accessToken) {
    return NextResponse.redirect(new URL("/prediction-analysis", request.url));
  }

  if (!isAuthPage && !accessToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|logo.png|images|api|.*\\..*).*)"],
};

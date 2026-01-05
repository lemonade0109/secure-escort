import { NextRequest, NextResponse } from "next/server";
import { AuthRequest } from "./types";
import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

const { auth } = NextAuth(authConfig);

const AUTH_ROUTES = [
  "/sign-in",
  "/sign-up",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
  "/check-email",
];

const PUBLIC_ROUTES = [
  "/",
  "/about",
  "/contact",
  "/privacy",
  "/services",
  "/terms",
  "/tracking",
];

function isRoute(pathName: string, routes: string[]) {
  return routes.some(
    (route) => pathName === route || pathName.startsWith(`${route}/`)
  );
}

export default auth((req: NextRequest) => {
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;

  const authSession = (req as AuthRequest).auth;
  const user = authSession?.user as
    | { email?: string; role?: string }
    | undefined;

  const isLoggedIn = !!user?.email;
  const role = user?.role;

  const isAuthRoute = isRoute(pathname, AUTH_ROUTES);
  const isPublicRoute = isRoute(pathname, PUBLIC_ROUTES);

  // logged in users shouldn't see sign-in/sign-up pages
  if (isLoggedIn && isAuthRoute) {
    const allowed = ["/reset-password", "/verify-email", "/check-email"];
    if (!isRoute(pathname, allowed)) {
      return NextResponse.redirect(new URL("/dashboard", nextUrl));
    }
  }

  // protect private routes
  if (!isLoggedIn && !isPublicRoute && !isAuthRoute) {
    const signInUrl = new URL("/sign-in", nextUrl);
    signInUrl.searchParams.set("callbackUrl", pathname + nextUrl.search);
    return NextResponse.redirect(signInUrl);
  }

  // role gates
  if (pathname.startsWith("/admin")) {
    if (!isLoggedIn) {
      const signInUrl = new URL("/sign-in", nextUrl);
      signInUrl.searchParams.set("callbackUrl", pathname + nextUrl.search);
      return NextResponse.redirect(signInUrl);
    }
    if (role !== "ADMIN")
      return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  if (pathname.startsWith("/guard")) {
    if (!isLoggedIn) {
      const signInUrl = new URL("/sign-in", nextUrl);
      signInUrl.searchParams.set("callbackUrl", pathname + nextUrl.search);
      return NextResponse.redirect(signInUrl);
    }
    if (role !== "GUARD" && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", nextUrl));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/auth).*)"],
};

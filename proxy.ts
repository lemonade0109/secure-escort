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
  const { pathname } = nextUrl;

  const session = (req as AuthRequest).auth?.user;

  const isLoggedIn = !!session?.id;
  const isVerified = !!session?.emailVerified;
  const role = session?.role;

  const isAuthRoute = isRoute(pathname, AUTH_ROUTES);
  const isPublicRoute = isRoute(pathname, PUBLIC_ROUTES);

  // if logged in, don't allow access to auth routes (except verify-email & check-email)
  if (isLoggedIn && isAuthRoute) {
    const allowedWhenLoggedIn = ["/verify-email", "/check-email"];

    // if user is NOT verified, push user to check-email page
    if (!isVerified && isRoute(pathname, allowedWhenLoggedIn)) {
      return NextResponse.redirect(new URL("/check-email", nextUrl));
    }

    // if user is verified, redirect to dashboard
    if (isVerified && !isRoute(pathname, allowedWhenLoggedIn)) {
      return NextResponse.redirect(new URL("/dashboard", nextUrl));
    }
  }

  // If not logged in and route is not public or auth, force sign-in with callbackUrl
  if (!isLoggedIn && !isPublicRoute && !isAuthRoute) {
    const signInUrl = new URL("/sign-in", nextUrl);
    signInUrl.searchParams.set(
      "callbackUrl",
      nextUrl.pathname + nextUrl.search
    );
    return NextResponse.redirect(signInUrl);
  }

  // Role gates
  if (pathname.startsWith("/admin")) {
    if (isLoggedIn) {
      const signInUrl = new URL("/sign-in", nextUrl);
      signInUrl.searchParams.set(
        "callbackUrl",
        nextUrl.pathname + nextUrl.search
      );
      return NextResponse.redirect(signInUrl);
    }

    if (role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", nextUrl));
    }
  }

  if (pathname.startsWith("/guard")) {
    if (isLoggedIn) {
      const signInUrl = new URL("/sign-in", nextUrl);
      signInUrl.searchParams.set(
        "callbackUrl",
        nextUrl.pathname + nextUrl.search
      );
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

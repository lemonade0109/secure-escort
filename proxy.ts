import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { AuthRequest } from "./types";
import { isAdminEmail } from "./lib/admin";

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

  //  Skip Next internals + API routes
  if (pathname.startsWith("/_next")) return NextResponse.next();
  if (pathname.startsWith("/api")) return NextResponse.next();

  // Skip public static files (logo.png, images, fonts, etc.)
  const isStaticFile =
    /\.(png|jpg|jpeg|gif|svg|webp|ico|css|js|map|txt|xml|woff|woff2|ttf|eot)$/.test(
      pathname
    );

  if (isStaticFile) return NextResponse.next();

  const authSession = (req as AuthRequest).auth;
  const user = authSession?.user as
    | { email?: string; role?: string }
    | undefined;

  const isLoggedIn = !!user?.email;
  const role = isAdminEmail(user?.email || "") ? "ADMIN" : user?.role || "USER";

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
    if (role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", nextUrl));
    }
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

//handled file skipping inside middleware.
export const config = {
  matcher: ["/((?!_next).*)"],
};

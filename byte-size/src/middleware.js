import { NextResponse } from "next/server";

export function middleware(request) {
  const token = request.cookies.get("bytesize-auth");
  const { pathname } = request.nextUrl;

  const onLoginPage = pathname.startsWith("/login");

  // Authenticated user trying to visit login → send to dashboard
  if (token && onLoginPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Unauthenticated user trying to visit anything else → send to login
  if (!token && !onLoginPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Run on all routes except Next.js internals and static files
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

import { NextResponse } from "next/server";
import { jwtVerify, createRemoteJWKSet } from "jose";

// Google's public keys for verifying Firebase ID tokens — cached automatically by jose
const JWKS = createRemoteJWKSet(
  new URL("https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com")
);

const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

export async function proxy(request) {
  const { pathname } = request.nextUrl;
  const onLoginPage = pathname.startsWith("/login");

  const token = request.cookies.get("bytesize-auth")?.value;

  if (token) {
    try {
      await jwtVerify(token, JWKS, {
        issuer: `https://securetoken.google.com/${PROJECT_ID}`,
        audience: PROJECT_ID,
      });
      // Token is valid — redirect away from login if already authenticated
      if (onLoginPage) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
      return NextResponse.next();
    } catch {
      // Token is expired or tampered — clear the cookie and send to login
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("bytesize-auth");
      return response;
    }
  }

  // No token — block everything except login
  if (!onLoginPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

/* 
Update matcher so that it runs for redirect pages like dashboard, inventory etc. 
Current implementation only runs middleware for a page that I'm not sure exists
in our project. 
*/
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

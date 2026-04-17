// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  const { pathname } = request.nextUrl;

  // 🔒 If no token → protect both /forms and /admin
  if (!token && (pathname.startsWith("/forms") || pathname.startsWith("/admin"))) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ✅ Decode JWT (basic decode, no verification)
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const role = payload.role;

      // 🚫 Block student from /admin
      if (role === "student" && pathname.startsWith("/admin")) {
        return NextResponse.redirect(new URL("/", request.url));
      }

    } catch (err) {
      console.log("Invalid token");
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/forms/:path*", "/admin/:path*"], // 👈 include admin
};
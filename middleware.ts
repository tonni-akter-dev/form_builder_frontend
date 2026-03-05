// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get token from cookies (now set by js-cookie)
  const token = request.cookies.get('token')?.value;

  // If no token and trying to access protected path
  if (!token && request.nextUrl.pathname.startsWith('/forms')) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirectTo', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/forms/:path*',
};
import { NextRequest, NextResponse } from 'next/server';

// List of protected routes (prefixes)
const protectedRoutes = [
  '/dashboard',
  '/profile',
  '/report',
  '/reward',
  '/schedule',
  '/payment',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Cek apakah route termasuk protected
  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtected) {
    // Cek token di cookie (misal: 'token')
    const token = request.cookies.get('token')?.value;
    if (!token) {
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile',
    '/report',
    '/reward',
    '/schedule',
    '/payment',
  ],
};

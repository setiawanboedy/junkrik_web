import { NextRequest, NextResponse } from 'next/server';

// List of protected routes (prefixes)
const protectedRoutes = [
  '/dashboard',
  '/profile',
  '/report',
  '/reward',
  '/schedule',
  '/payment',
  '/admin',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Cek apakah route termasuk protected
  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Cek token di cookie (misal: 'token')
  const token = request.cookies.get('token')?.value;
  const role = request.cookies.get('role')?.value; // role disimpan di cookie (misal: 'admin' atau 'bisnis')

  // Blokir akses ke /auth/login dan /auth/register jika sudah login
  if ((pathname.startsWith('/auth/login') || pathname.startsWith('/auth/register')) && token) {
    // Redirect ke halaman sesuai role
    if (role === 'admin') {
      return NextResponse.redirect(new URL('/admin', request.url));
    } else {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  if (isProtected) {
    if (!token) {
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
    // Role-based access control
    if (pathname.startsWith('/admin')) {
      if (role !== 'admin') {
        // Jika bukan admin, redirect ke dashboard bisnis
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    } else {
      // Untuk semua route bisnis (selain /admin), hanya boleh diakses oleh bisnis
      if (role === 'admin') {
        // Jika admin mencoba akses dashboard bisnis, redirect ke /admin
        return NextResponse.redirect(new URL('/admin', request.url));
      }
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
    '/admin/:path*',
    '/auth/login',
    '/auth/register',
  ],
};

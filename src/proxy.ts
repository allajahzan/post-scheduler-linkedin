import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback_secret_key_that_should_not_be_used_in_production_min_32_chars'
);

export async function proxy(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  // Protect /dashboard and /profile routes
  if (request.nextUrl.pathname.startsWith('/dashboard') || request.nextUrl.pathname.startsWith('/profile')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      // Verify token
      await jwtVerify(token, SECRET_KEY);
      return NextResponse.next();
    } catch (error) {
      // Invalid token
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('token'); // clear invalid token
      return response;
    }
  }

  // Optional: Prevent logged in users from accessing login/signup
  if (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/signup') {
    if (token) {
      try {
        await jwtVerify(token, SECRET_KEY);
        return NextResponse.redirect(new URL('/dashboard', request.url));
      } catch (error) {
        // Token is invalid, let them proceed to login/signup
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*', '/login', '/signup'],
};

// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJWT } from '@/lib/jwt';

export async function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /, /protected, /api/protected)
  const path = request.nextUrl.pathname;

  // Public paths that don't require authentication
  const publicPaths = ['/signin', '/signup'];
  
  // Check if the current path is public
  const isPublicPath = publicPaths.includes(path);

  // Get token from cookie
  const token = request.cookies.get('token')?.value;

  if (!token && !isPublicPath) {
    // Redirect to signin page if accessing protected route without token
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  if (token && isPublicPath) {
    // Redirect to home page if accessing auth pages with valid token
    return NextResponse.redirect(new URL('/', request.url));
  }

  try {
    if (token) {
      // Verify token and add user info to headers
      const verified = await verifyJWT(token);
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('user', JSON.stringify(verified));

      // Return response with updated headers
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    }
    return NextResponse.next();
  } catch (error) {
    // If token is invalid, redirect to signin
    if (!isPublicPath) {
      return NextResponse.redirect(new URL('/signin', request.url));
    }
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
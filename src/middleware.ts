
// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJWT } from '@/lib/jwt';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const publicPaths = [
    '/signin', '/signup', '/forgot-password', '/verify', '/sitemap.xml', 
    '/googlec70c2e840b8f053a.html', '/verify/*'
  ];

  // Proper wildcard matching
  const isPublicPath = publicPaths.some((publicPath) => 
    publicPath.endsWith('*') ? path.startsWith(publicPath.slice(0, -1)) : path === publicPath
  );

  const token = request.cookies.get('token')?.value ?? null;
  const signInUrl = new URL('/signin', request.url);
  const homeUrl = new URL('/', request.url);

  if (!isPublicPath) {
    signInUrl.searchParams.set('redirect', path);
  }

  try {
    if (!token && !isPublicPath) {
      return NextResponse.redirect(signInUrl);
    }

    if (token) {
      const verified = await verifyJWT(token);

      if (isPublicPath) {
        return NextResponse.redirect(homeUrl);
      }

      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('user', JSON.stringify(verified));

      return NextResponse.next({
        request: { headers: requestHeaders },
      });
    }
  } catch (error) {
    // If token is invalid, delete and redirect to sign-in
    const response = isPublicPath ? NextResponse.next() : NextResponse.redirect(signInUrl);
    response.cookies.set('token', '', { expires: new Date(0) });
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|public).*)'],
};






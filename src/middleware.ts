// // src/middleware.ts
// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';
// import { verifyJWT } from '@/lib/jwt';

// export async function middleware(request: NextRequest) {
//   // Get the pathname of the request (e.g. /, /protected, /api/protected)
//   const path = request.nextUrl.pathname;

//   // Public paths that don't require authentication
//   const publicPaths = ['/signin', '/signup'];
  
//   // Check if the current path is public
//   const isPublicPath = publicPaths.includes(path);

//   // Get token from cookie
//   const token = request.cookies.get('token')?.value;

//   if (!token && !isPublicPath) {
//     // Redirect to signin page if accessing protected route without token
//     return NextResponse.redirect(new URL('/signin', request.url));
//   }

//   if (token && isPublicPath) {
//     // Redirect to home page if accessing auth pages with valid token
//     return NextResponse.redirect(new URL('/', request.url));
//   }

//   try {
//     if (token) {
//       // Verify token and add user info to headers
//       const verified = await verifyJWT(token);
//       const requestHeaders = new Headers(request.headers);
//       requestHeaders.set('user', JSON.stringify(verified));

//       // Return response with updated headers
//       return NextResponse.next({
//         request: {
//           headers: requestHeaders,
//         },
//       });
//     }
//     return NextResponse.next();
//   } catch (error) {
//     // If token is invalid, redirect to signin
//     if (!isPublicPath) {
//       return NextResponse.redirect(new URL('/signin', request.url));
//     }
//     return NextResponse.next();
//   }
// }

// export const config = {
//   matcher: [
//     /*
//      * Match all request paths except:
//      * - api (API routes)
//      * - _next/static (static files)
//      * - _next/image (image optimization files)
//      * - favicon.ico (favicon file)
//      * - public folder
//      */
//     '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
//   ],
// };







import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJWT } from '@/lib/jwt';

export async function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Public paths that don't require authentication
  const publicPaths = ['/signin', '/signup'];
  
  // Check if the current path is public
  const isPublicPath = publicPaths.includes(path);
  
  // Get token from cookie
  const token = request.cookies.get('token')?.value;

  // Create URL objects once
  const signInUrl = new URL('/signin', request.url);
  const homeUrl = new URL('/', request.url);
  
  // Add original pathname as redirect parameter for better UX
  if (!isPublicPath) {
    signInUrl.searchParams.set('redirect', path);
  }

  // Case 1: No token and trying to access protected route
  if (!token && !isPublicPath) {
    return NextResponse.redirect(signInUrl);
  }

  // Case 2: Has token and trying to access public path
  if (token && isPublicPath) {
    try {
      // Verify token before redirecting to home
      await verifyJWT(token);
      return NextResponse.redirect(homeUrl);
    } catch (error) {
      // If token is invalid, clear it and continue to public path
      const response = NextResponse.next();
      response.cookies.delete('token');
      return response;
    }
  }

  // Case 3: Has token and accessing protected route
  if (token) {
    try {
      // Verify token and add user info to headers
      const verified = await verifyJWT(token);
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('user', JSON.stringify(verified));
      
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch (error) {
      // If token is invalid, clear it and redirect to signin
      const response = NextResponse.redirect(signInUrl);
      response.cookies.delete('token');
      return response;
    }
  }

  // Default case: allow request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
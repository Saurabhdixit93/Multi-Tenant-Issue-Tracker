import { getToken } from 'next-auth/jwt';
import { NextResponse, NextRequest } from 'next/server';

const secret = process.env.NEXTAUTH_SECRET;

const authPages = [
  '/auth/login',
  '/auth/register',
];

const protectedPages = ['/dashboard', '/issues'];

const publicAllowedPages = ['/'];

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  if (pathname === '/sw.js') {
    return NextResponse.next();
  }

  // Check if the current path is an auth page or starts with an auth path
  const isAuthPage = authPages.some((page) => pathname === page || pathname.startsWith(`${page}/`));

  // Check if the current path is protected or starts with a protected path
  const isProtectedPage = protectedPages.some(
    (page) => pathname === page || pathname.startsWith(`${page}/`),
  );

  // Check if the current path is a public allowed page or starts with a public allowed path
  const isPublicAllowedPage = publicAllowedPages.some(
    (page) => pathname === page || pathname.startsWith(`${page}/`),
  );

  if (isPublicAllowedPage) {
    const response = NextResponse.next();
    response.headers.set('X-DNS-Prefetch-Control', 'on');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    return response;
  }

  // Get auth token from session
  const sessionToken = await getToken({ req: request, secret: secret });
  const isAuthenticated = !!sessionToken;

  if (isAuthenticated && isAuthPage) {
    return NextResponse.redirect(
      new URL(`/dashboard?timestamp=${new Date().getTime().toString()}`, request.url),
    );
  }

  // If user is not authenticated and tries to access protected pages
  if (!isAuthenticated && isProtectedPage) {
    const response = NextResponse.redirect(
      new URL('/auth/login?redirectUrl=/dashboard', request.url),
    );
    response.cookies.set('redirectUrl', '/dashboard');
    response.cookies.set('timestamp', new Date().getTime().toString());
    return response;
  }

  // For non-API routes, just add security headers
  const response = NextResponse.next();
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');

  return response;
}

export const config = {
  matcher: ['/((?!api/v1|_next/static|_next/image|favicon.ico|public).*)'],
};

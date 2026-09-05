import { NextRequest, NextResponse } from 'next/server';
import { verifySessionFromRequest } from '@/lib/auth/auth';

// Public routes that don't require authentication
const publicRoutes = [
  '/sign-in',
  '/sign-up',
  '/api/auth/signin',
  '/api/auth/signup',
  '/api/auth/signout',
  '/api/webhook',
];

// Store frontend routes (public)
const storeFrontendRoutes = [
  '/',
  '/category',
  '/product',
  '/cart',
];

// API routes that should be public (for store frontend)
const publicApiRoutes = [
  '/api/stores',
];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Allow store frontend routes (public)
  if (storeFrontendRoutes.some(route => pathname === route || pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Allow public API routes (GET only for store data)
  if (publicApiRoutes.some(route => pathname.startsWith(route))) {
    if (request.method === 'GET') {
      return NextResponse.next();
    }
  }

  // Allow store-specific GET API routes (public read access)
  const storeApiRegex = /^\/api\/[a-f0-9-]+\/(billboards|categories|sizes|colors|products|checkout)/;
  if (storeApiRegex.test(pathname) && request.method === 'GET') {
    return NextResponse.next();
  }

  // Allow static files and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') // files with extensions
  ) {
    return NextResponse.next();
  }

  // Check authentication for protected routes
  const session = await verifySessionFromRequest(request);

  if (!session) {
    // Redirect to sign-in for admin routes
    const signInUrl = new URL('/sign-in', request.url);
    signInUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|public).*)',
  ],
};

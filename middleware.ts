import { NextRequest, NextResponse } from 'next/server';

// Public pages that don't require authentication
const publicPages = ['/', '/login', '/register', '/applications'];

export function middleware(req: NextRequest) {
  const currentPath = req.nextUrl.pathname;

  // Check if current path is public
  const isPublicPage = publicPages.some(
    (page) => currentPath === page || currentPath.startsWith(page + '/'),
  );

  // For protected pages, middleware doesn't block - let client-side handle auth
  // This is because localStorage is not accessible in middleware (server-side)
  // If user tries to access protected page without token, they'll get 401 from API
  // and axios interceptor will redirect to login

  return NextResponse.next();
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
};

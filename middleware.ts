import { NextRequest, NextResponse } from 'next/server';

const tokenName = process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME || 'auth_token';

// Public pages that don't require authentication
const publicPages = ['/', '/login', '/register', '/applications'];

export function middleware(req: NextRequest) {
  const token = req.cookies.get(tokenName);
  const currentPath = req.nextUrl.pathname;
  const isAuthorizedUser = Boolean(token);

  // Check if current path is public
  const isPublicPage = publicPages.some(
    (page) => currentPath === page || currentPath.startsWith(page + '/'),
  );

  // Redirect to login if accessing protected page without auth
  if (!isPublicPage && !isAuthorizedUser) {
    const loginUrl = new URL('/login', req.url);

    loginUrl.searchParams.set('redirect', currentPath);

    return NextResponse.redirect(loginUrl);
  }

  // Redirect to home if accessing login/register while authenticated
  if (
    (currentPath === '/login' || currentPath === '/register') &&
    isAuthorizedUser
  ) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
};

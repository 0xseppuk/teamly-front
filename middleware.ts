import { NextRequest, NextResponse } from 'next/server';

const tokenName = process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME || 'auth_token';

export function middleware(req: NextRequest) {
  const token = req.cookies.get(tokenName);
  const currentPath = req.nextUrl.pathname;
  const isAuthorizedUser = Boolean(token);

  // Only redirect to login if user is not authorized and not already on login page
  // We removed the redirect from /login to /profile to avoid infinite redirect loops
  // when the token exists but is invalid/expired
  if (currentPath !== '/login' && !isAuthorizedUser) {
    const loginUrl = new URL('/login', req.url);

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
};

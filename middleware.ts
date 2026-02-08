import { routes } from '@/shared/routes/routes';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const ONLY_UNAUTH_ROUTES = [
  routes.login,
  routes.register,
  routes.resetPassword,
  routes.forgotPassword,
];

const PUBLIC_ROUTES = [
  routes.root,
  routes.privacy,
  routes.terms,
  routes.robots,
  routes.sitemaps,
  routes.games,
  routes.application,
];

export function middleware(req: NextRequest) {
  const token = req.cookies.get('auth_token')?.value;
  const { pathname } = req.nextUrl;

  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
  const isOnlyUnauthRoute = ONLY_UNAUTH_ROUTES.includes(pathname);

  if (!token && !isPublicRoute && !isOnlyUnauthRoute) {
    return NextResponse.redirect(new URL(routes.login, req.url));
  }

  if (token && isOnlyUnauthRoute) {
    return NextResponse.redirect(new URL(routes.profile, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
};

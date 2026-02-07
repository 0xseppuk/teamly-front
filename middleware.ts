import { routes } from '@/shared/routes';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const AUTHROUTE = [
  routes.login,
  routes.register,
  routes.resetPassword,
  routes.forgotPassword,
  routes.root,
  routes.privacy,
  routes.terms,
  routes.robots,
  routes.sitemaps,
];

export function middleware(req: NextRequest) {
  const token = req.cookies.get('auth_token')?.value;
  const { pathname } = req.nextUrl;

  const isAuthRoute = AUTHROUTE.includes(pathname);

  if (!token && !isAuthRoute) {
    return NextResponse.redirect(new URL(routes.login, req.url));
  }

  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL(routes.games, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
};

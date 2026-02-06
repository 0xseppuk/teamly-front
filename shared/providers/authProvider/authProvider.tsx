import { routes } from '@/shared/routes';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const AUTHROUTE = [
  routes.login,
  routes.register,
  routes.resetPassword,
  routes.forgotPassword,
];

export function middleware(req: NextRequest) {
  const token = req.cookies.get('access_token')?.value;
  const { pathname } = req.nextUrl;

  const isAuthRoute = AUTHROUTE.includes(pathname);

  if (!token && !isAuthRoute) {
    return NextResponse.redirect(new URL(routes.login, req.url));
  }

  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL(routes.root, req.url));
  }

  return NextResponse.next();
}

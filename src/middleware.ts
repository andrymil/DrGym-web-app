import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  const { pathname } = req.nextUrl;

  const userMatch = pathname.match(/^\/user\/([^/]+)(\/.*)?$/);
  const requestedUser = userMatch?.[1] ?? null;

  if (
    token &&
    (pathname === '/login' ||
      pathname === '/register' ||
      pathname.startsWith('/auth'))
  ) {
    const username = token.username;
    return NextResponse.redirect(
      new URL(
        `/user/${username}/posts?message=You are already signed in`,
        req.url
      )
    );
  }

  if (!token && pathname.startsWith('/user')) {
    return NextResponse.redirect(
      new URL('/login?message=You have to sign in first', req.url)
    );
  }

  if (
    token &&
    requestedUser &&
    pathname.startsWith(`/user/${requestedUser}/`)
  ) {
    const username = token.username;
    if (username !== requestedUser) {
      return NextResponse.redirect(
        new URL(
          `/user/${username}/posts?message=You cannot access this page`,
          req.url
        )
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/register', '/auth/:path*', '/user/:path*'],
};

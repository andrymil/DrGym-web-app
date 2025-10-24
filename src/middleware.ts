import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const { pathname } = request.nextUrl;

  const match = pathname.match(/^\/user\/([^/]+)(?:\/.*)?$/);
  const requestedUser = match ? decodeURIComponent(match[1]) : null;

  const isAuthPage =
    pathname === '/login' ||
    pathname === '/register' ||
    /^\/auth(\/|$)/.test(pathname);

  const isUserSection = /^\/user(\/|$)/.test(pathname);

  if (token && isAuthPage) {
    const username = token.username;
    if (username) {
      return NextResponse.redirect(
        new URL(
          `/user/${username}/posts?message=You are already signed in`,
          request.url
        )
      );
    }
  }

  if (!token && isUserSection) {
    return NextResponse.redirect(
      new URL('/login?message=You have to sign in first', request.url)
    );
  }

  if (token && requestedUser) {
    const username = token.username;

    if (
      pathname.startsWith(`/user/${requestedUser}/`) &&
      username !== requestedUser
    ) {
      return NextResponse.redirect(
        new URL(
          `/user/${username}/posts?message=You cannot access this page`,
          request.url
        )
      );
    }

    if (pathname === `/user/${requestedUser}` && username === requestedUser) {
      return NextResponse.redirect(
        new URL(`/user/${username}/account`, request.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/register', '/auth/:path*', '/user/:path*'],
};

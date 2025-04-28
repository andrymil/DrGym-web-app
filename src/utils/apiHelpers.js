import { getServerSession } from 'next-auth';
import authOptions from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function getSessionUsername() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    const error = new Error('Unauthorized');
    error.statusCode = 401;
    throw error;
  }

  const username = session.user.username;
  if (!username) {
    const error = new Error('Username not found in session');
    error.statusCode = 400;
    throw error;
  }

  return username;
}

export function handleApiError(err) {
  if (err?.statusCode === 401 || err?.statusCode === 400) {
    return NextResponse.json(
      { error: err.message },
      { status: err.statusCode }
    );
  }

  return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
}

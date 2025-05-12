import { getServerSession } from 'next-auth';
import authOptions from '@/lib/auth';
import { NextResponse } from 'next/server';

class ApiError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ApiError';
  }
}

export async function getSessionUsername() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    const error = new ApiError('Unauthorized', 401);
    throw error;
  }

  const username = session.user.username;
  if (!username) {
    const error = new ApiError('Username not found in session', 400);
    throw error;
  }

  return username;
}

export function handleApiError(err: ApiError) {
  if (err?.statusCode === 401 || err?.statusCode === 400) {
    return NextResponse.json(
      { error: err.message },
      { status: err.statusCode }
    );
  }

  return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
}

import { getServerSession } from 'next-auth';
import authOptions from '@/lib/auth';
import { NextResponse } from 'next/server';
import { AnyObjectSchema, InferType, ValidationError } from 'yup';

export type Params = Promise<{
  id: string;
}>;

export type ParamsProp = { params: Params };

export class ApiError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ApiError';
    Error.captureStackTrace?.(this, ApiError);
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

export function handleApiError(err: unknown) {
  if (err instanceof ApiError) {
    return NextResponse.json(
      { error: err.message },
      { status: err.statusCode }
    );
  }

  if (err instanceof ValidationError) {
    const errors = err.inner.reduce(
      (acc, e) => {
        if (e.path) acc[e.path] = e.message;
        return acc;
      },
      {} as Record<string, string>
    );

    console.log('Validation errors:', errors);
    return NextResponse.json(
      {
        error: 'Validation failed',
        details: errors,
      },
      { status: 400 }
    );
  }

  console.error('Unexpected API error:', err);
  return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
}

export async function validateBody<T extends AnyObjectSchema>(
  schema: T,
  body: unknown
): Promise<InferType<T>> {
  if (typeof body !== 'object' || body === null) {
    throw new ApiError('Invalid request body', 400);
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return await schema.validate(body, {
    abortEarly: false,
    stripUnknown: true,
    // strict: true,
  });
}

export async function getParamId(params: Params) {
  const { id } = await params;

  const parsedId = parseInt(id, 10);
  if (isNaN(parsedId)) {
    throw new ApiError('Invalid workout ID', 400);
  }

  return parsedId;
}

import prisma from '@prisma';
import { NextResponse } from 'next/server';
import { verifyToken } from '@/utils/crypto';
import { handleApiError, validateBody } from '@/utils/apiHelpers';
import { VerificationApiSchema } from '@/schemas/api/VerificationSchema';
import type { VerificationRequest } from '@/schemas/api/VerificationSchema';

export async function POST(req: Request): Promise<Response> {
  try {
    const body: VerificationRequest = await validateBody(
      VerificationApiSchema,
      await req.json()
    );

    const { email, token } = body;

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        verified: true,
        tokens: {
          select: { verificationToken: true },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User does not exist' },
        { status: 404 }
      );
    }

    if (user.verified) {
      return NextResponse.json(
        { error: 'User is already verified' },
        { status: 409 }
      );
    }

    if (!user.tokens?.verificationToken) {
      return NextResponse.json(
        { error: 'No verification token found' },
        { status: 404 }
      );
    }

    if (!verifyToken(token, user.tokens.verificationToken)) {
      return NextResponse.json(
        { error: 'Invalid verification token' },
        { status: 403 }
      );
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { email },
        data: { verified: 1 },
      }),
      prisma.token.update({
        where: { email },
        data: { verificationToken: null },
      }),
    ]);

    return NextResponse.json(
      { message: 'Your account has been verified' },
      { status: 200 }
    );
  } catch (err) {
    console.error('Verification error:', err);
    return handleApiError(err);
  }
}

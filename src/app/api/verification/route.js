import prisma from '@prisma';
import { NextResponse } from 'next/server';
import { verifyToken } from '@/utils/crypto';

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, token } = body;

    if (!email || !token) {
      return NextResponse.json(
        { error: 'Email and token are required' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        verified: true,
        token: {
          select: { verification_token: true },
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

    if (!user.token?.verification_token) {
      return NextResponse.json(
        { error: 'No verification token found' },
        { status: 404 }
      );
    }

    if (!verifyToken(token, user.token.verification_token)) {
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
        data: { verification_token: null },
      }),
    ]);

    return NextResponse.json(
      { message: 'Your account has been verified' },
      { status: 200 }
    );
  } catch (err) {
    console.error('Verification error:', err);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}

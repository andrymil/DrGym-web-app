import prisma from '@prisma';
import { NextResponse } from 'next/server';
import { hashPassword, verifyToken } from '@/utils/crypto';
import sendEmail from '@/utils/sendEmail';

export async function POST(req) {
  try {
    const body = await req.json();
    const { password, token } = body;
    const email = body.email?.toLowerCase().trim();

    if (!email || !password || !token) {
      return NextResponse.json(
        { error: 'Email, password and token are required' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        username: true,
        verified: true,
        token: {
          select: {
            reset_token: true,
            reset_expiry: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'There is no user with this e-mail address' },
        { status: 404 }
      );
    }

    const { token: tokens } = user;

    if (!tokens?.reset_token) {
      return NextResponse.json(
        { error: 'No active password reset request found for this account' },
        { status: 404 }
      );
    }

    if (!user.verified) {
      return NextResponse.json(
        { error: 'You have to verify your account first' },
        { status: 403 }
      );
    }

    if (!tokens.reset_expiry || new Date() > tokens.reset_expiry) {
      return NextResponse.json(
        { error: 'Reset password token has expired' },
        { status: 400 }
      );
    }

    if (!verifyToken(token, tokens.reset_token)) {
      return NextResponse.json(
        { error: 'Invalid reset password token' },
        { status: 403 }
      );
    }

    const hashedPassword = await hashPassword(password);

    await prisma.$transaction([
      prisma.user.update({
        where: { email },
        data: { password: hashedPassword },
      }),
      prisma.token.update({
        where: { email },
        data: {
          reset_token: null,
          reset_expiry: null,
        },
      }),
    ]);

    try {
      await sendEmail({
        to: email,
        templateName: 'passwordChanged',
        templateData: { username: user.username },
      });
    } catch (err) {
      console.error('Error while sending password change confirmation:', err);
    }

    return NextResponse.json(
      { message: 'Password successfully changed' },
      { status: 200 }
    );
  } catch (err) {
    console.error('Reset Password error:', err);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}

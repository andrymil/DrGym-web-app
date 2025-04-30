import prisma from '@prisma';
import { NextResponse } from 'next/server';
import { generateToken } from '@/utils/crypto';
import sendEmail from '@/utils/sendEmail';

export async function POST(req) {
  try {
    const body = await req.json();
    const email = body.email?.toLowerCase().trim();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        username: true,
        verified: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User does not exist' },
        { status: 404 }
      );
    }

    if (!user.verified) {
      return NextResponse.json(
        { error: 'You have to verify your account first' },
        { status: 403 }
      );
    }

    const { token, hashedToken } = generateToken();
    const tableContent = {
      resetToken: hashedToken,
      resetExpiry: new Date(Date.now() + 1000 * 60 * 60),
    };

    await prisma.token.upsert({
      where: { email },
      update: tableContent,
      create: {
        email,
        ...tableContent,
      },
    });

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?email=${encodeURIComponent(email)}&token=${token}`;

    await sendEmail({
      to: email,
      templateName: 'resetPassword',
      templateData: { username: user.username, resetUrl },
    });

    return NextResponse.json(
      { message: 'Password reset link has been sent' },
      { status: 200 }
    );
  } catch (err) {
    console.error('Forgot Password error:', err);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}

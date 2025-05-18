import prisma from '@prisma';
import { NextResponse } from 'next/server';
import sendEmail from '@/utils/sendEmail';
import { hashPassword, generateToken } from '@/utils/crypto';
import type { RegisterRequest } from '@/types/api/requests/register';

export async function POST(req: Request): Promise<Response> {
  try {
    const body = (await req.json()) as RegisterRequest;
    const { name, surname, username, password } = body;
    const email = body.email?.toLowerCase().trim();

    if (!username || !email || !password) {
      return NextResponse.json(
        { error: 'Username, email and password are required' },
        { status: 400 }
      );
    }

    let existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'E-mail is already taken' },
        { status: 409 }
      );
    }

    existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Username is already taken' },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(password);
    const { token, hashedToken } = generateToken();

    await prisma.$transaction([
      prisma.user.create({
        data: {
          name,
          surname,
          username,
          email,
          password: hashedPassword,
        },
      }),
      prisma.token.upsert({
        where: { email },
        update: { verificationToken: hashedToken },
        create: { email, verificationToken: hashedToken },
      }),
    ]);

    const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/verification?email=${encodeURIComponent(email)}&token=${token}`;

    await sendEmail({
      to: email,
      templateName: 'register',
      templateData: { username, verifyUrl },
    });

    return NextResponse.json(
      { message: 'Account has been created successfully' },
      { status: 201 }
    );
  } catch (err) {
    console.error('Registration error:', err);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}

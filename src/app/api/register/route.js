import prisma from '@prisma';
import sendEmail from '@/utils/sendEmail';
import { hashPassword, generateToken } from '@/utils/crypto';

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, surname, username, password } = body;
    const email = body.email.toLowerCase().trim();

    if (!username || !email || !password) {
      return new Response(
        JSON.stringify({ error: 'Username, email and password are required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    let existingUser = await prisma.users.findUnique({
      where: { email },
    });

    if (existingUser) {
      return new Response(JSON.stringify({ error: 'Email is already taken' }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    existingUser = await prisma.users.findUnique({
      where: { username },
    });

    if (existingUser) {
      return new Response(
        JSON.stringify({ error: 'Username is already taken' }),
        {
          status: 409,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const hashedPassword = await hashPassword(password);
    const { token, hashedToken } = generateToken();

    await prisma.users.create({
      data: {
        name,
        surname,
        username,
        email,
        password: hashedPassword,
      },
    });

    await prisma.tokens.upsert({
      where: { email },
      update: { verification_token: hashedToken },
      create: { email, verification_token: hashedToken },
    });

    const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify?email=${encodeURIComponent(email)}&token=${token}`;

    await sendEmail({
      to: email,
      templateName: 'register',
      templateData: { username, verifyUrl },
    });

    return new Response(
      JSON.stringify({ message: 'Account created successfully' }),
      {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (err) {
    console.error('Registration error:', err);
    return new Response(JSON.stringify({ error: 'Something went wrong.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

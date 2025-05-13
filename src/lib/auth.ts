import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import bcrypt from 'bcrypt';
import prisma from '@prisma';
import { NextAuthOptions } from 'next-auth';
import { RequestInternal } from 'next-auth';
import { AdapterUser } from 'next-auth/adapters';

const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        identifierType: { label: 'IdentifierType', type: 'text' },
        identifier: { label: 'Identifier', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(
        credentials:
          | Record<'identifierType' | 'identifier' | 'password', string>
          | undefined,
        _req: Pick<RequestInternal, 'body' | 'query' | 'headers' | 'method'>
      ): Promise<AdapterUser | null> {
        if (!credentials) return null;

        const where =
          credentials.identifierType === 'email'
            ? { email: credentials.identifier }
            : { username: credentials.identifier };

        const user = await prisma.user.findUnique({ where });

        if (!user) throw new Error('Invalid credentials');

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isValid) throw new Error('Invalid credentials');
        if (!user.verified)
          throw new Error('You have to verify your e-mail address first');

        return {
          ...user,
          id: user.username.toString(),
          emailVerified: null,
        } as AdapterUser & typeof user;
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.username = user.username;
        token.avatar = user.avatar || null;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.username = token.username;
        session.user.avatar = token.avatar || null;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default authOptions;

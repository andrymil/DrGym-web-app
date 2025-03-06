import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const handler = NextAuth({
  session: { strategy: 'jwt', maxAge: 24 * 60 * 60 },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        avatar: { label: 'Avatar', type: 'text' },
      },
      async authorize(credentials) {
        return {
          username: credentials.username,
          avatar: credentials.avatar,
        };
      },
    }),
  ],
  theme: {
    colorScheme: 'light',
  },
  pages: {
    error: '/login',
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.username = user.username;
        token.avatar = user.avatar || null;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.username = token.username;
        session.user.avatar = token.avatar || null;
      }
      return session;
    },
  },
});

export { handler as POST, handler as GET };

import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      username: string;
      avatar: string | null;
    } & DefaultSession['user'];
  }

  interface User {
    username: string;
    avatar?: string | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    username: string;
    avatar: string | null;
  }
}

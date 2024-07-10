import { handlers } from '@/auth';
import NextAuth, { NextAuthConfig } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const authConfig: NextAuthConfig = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    session: ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: token.sub
      }
    })
  },
  providers: [
    CredentialsProvider({
      type: 'credentials',
      credentials: {},
      authorize(credentials, req) {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };
        if (email === 'jkrmarmol@gmail.com' && password === 'kurt') {
          return {
            id: 'c187b753-b503-42e9-883d-4e34bfd578bd',
            userId: 'c187b753-b503-42e9-883d-4e34bfd578bd',
            name: 'Kurt Marmol',
            email: 'jkrmarmol@gmail.com'
          };
        }

        if (email === 'johndoe@mail.com' && password === 'doe') {
          return {
            id: '4eeaa444-a0c0-4997-a832-813319a6d71d',
            userId: '4eeaa444-a0c0-4997-a832-813319a6d71d',
            name: 'John Doe',
            email: 'johndoe@mail.com'
          };
        }
        return null;
      }
    })
  ],
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error'
  }
};

const handler = NextAuth(authConfig);
export { handler as GET, handler as POST };

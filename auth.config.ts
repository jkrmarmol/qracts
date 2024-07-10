import { PrismaClient } from '@prisma/client';
import { NextAuthConfig } from 'next-auth';
import CredentialProvider from 'next-auth/providers/credentials';

const prisma = new PrismaClient();
const authConfig = {
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
    CredentialProvider({
      type: 'credentials',
      credentials: {},
      async authorize(credentials, req) {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };
        const checkEmailExist = await prisma.users.findFirst({
          where: { email }
        });
        // if (email === 'jkrmarmol@gmail.com' && password === 'kurt') {
        //   return {
        //     id: 'c187b753-b503-42e9-883d-4e34bfd578bd',
        //     userId: 'c187b753-b503-42e9-883d-4e34bfd578bd',
        //     name: 'Kurt Marmol',
        //     email: 'jkrmarmol@gmail.com'
        //   };
        // }

        // if (email === 'johndoe@mail.com' && password === 'doe') {
        //   return {
        //     id: '4eeaa444-a0c0-4997-a832-813319a6d71d',
        //     userId: '4eeaa444-a0c0-4997-a832-813319a6d71d',
        //     name: 'John Doe',
        //     email: 'johndoe@mail.com'
        //   };
        // }
        return null;
      }
    })
  ],
  pages: {
    signIn: '/',
    signOut: '/auth/signout',
    error: '/auth/error'
  }
} satisfies NextAuthConfig;

export default authConfig;

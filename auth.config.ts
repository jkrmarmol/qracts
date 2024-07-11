import { NextAuthConfig } from 'next-auth';
import CredentialProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

const authConfig = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    session: async ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: token.sub
      }
    })
  },
  providers: [
    CredentialProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email', value: '' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials, req) {
        const { email, password } = credentials as any;
        if (!email || !password) {
          return null;
        }
        const user = await prisma.users.findFirst({ where: { email } });
        if (!user) return null;
        const passwordMatch = await bcryptjs.compare(password, user.password);
        if (!passwordMatch) return null;
        return user;
      }
    })
  ],
  pages: {
    signIn: '/dashboard',
    signOut: '/auth/signout',
    error: '/auth/error'
  }
} satisfies NextAuthConfig;

export default authConfig;

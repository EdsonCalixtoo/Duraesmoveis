import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Senha', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Credenciais incompletas');
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase().trim() },
        });

        if (!user || !user.passwordHash) {
          throw new Error('E-mail ou senha incorretos');
        }

        const isValid = await bcrypt.compare(credentials.password, user.passwordHash);

        if (!isValid) {
          throw new Error('E-mail ou senha incorretos');
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          cpf: user.cpf,
          avatarUrl: user.avatarUrl,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as unknown as { role: string }).role;
        token.phone = (user as unknown as { phone?: string }).phone;
        token.cpf = (user as unknown as { cpf?: string }).cpf;
        token.avatarUrl = (user as unknown as { avatarUrl?: string }).avatarUrl;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as unknown as { id: string }).id = token.id as string;
        (session.user as unknown as { role: string }).role = token.role as string;
        (session.user as unknown as { phone?: string }).phone = token.phone as string;
        (session.user as unknown as { cpf?: string }).cpf = token.cpf as string;
        (session.user as unknown as { avatarUrl?: string }).avatarUrl = token.avatarUrl as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || 'outdoorstyle-super-secret-key-default',
};

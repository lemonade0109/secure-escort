import NextAuth from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import db from "./db/db";
import * as bcrypt from "bcrypt-ts";

type User = {
  id: string;
  email: string;
  name?: string | null;
  role?: string;
  passwordHash?: string;
};

type SessionUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string;
  id?: string;
};

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  providers: [
    Credentials({
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = String(credentials.email).trim().toLowerCase();

        const user = await db.user.findUnique({
          where: { email },
        });
        if (!user || !user.passwordHash) return null;
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );
        if (!isPasswordValid) return null;
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = (user as User).role;
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as SessionUser).role =
          typeof token.role === "string" ? token.role : undefined;
        (session.user as SessionUser).id = token.sub;
      }
      return session;
    },
  },
});

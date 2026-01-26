import "server-only";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "./db/db";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { verifyPassword } from "./lib/auth/password";
import { SessionUser, User } from "./types";
import { authConfig } from "./auth.config";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(db),
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
        if (!user) return null;

        const plainPassword = String(credentials.password);
        const hashedPassword = String(user.password);

        // Check if password matches
        const isPasswordValid = await verifyPassword(
          plainPassword,
          hashedPassword,
        );

        if (!isPasswordValid) return null;
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          emailVerified: user.emailVerified,
        };
      },
    }),
  ],

  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      try {
        if (user) {
          token.id = (user as User).id;
          token.role = (user as User).role;
          token.emailVerified = (user as User).emailVerified;
        }
      } catch (error) {
        console.error("Error in jwt callback:", error);
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        (session.user as SessionUser).id = token.sub || (token.id as string);
        (session.user as SessionUser).role = token.role as string;
        (session.user as SessionUser).emailVerified =
          token.emailVerified as Date | null;
      }

      return session;
    },
  },
});

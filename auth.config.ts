import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  session: { strategy: "jwt" },

  providers: [],

  callbacks: {
    authorized: ({ auth }) => !!auth?.user,
  },
} satisfies Partial<NextAuthConfig>;

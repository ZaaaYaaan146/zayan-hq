import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const username = process.env.AUTH_USERNAME;
        const passwordHash = process.env.AUTH_PASSWORD_HASH;

        if (!username || !passwordHash) {
          console.error("Auth credentials not configured");
          return null;
        }

        if (credentials?.username !== username) {
          return null;
        }

        const isValid = await bcrypt.compare(
          credentials?.password as string,
          passwordHash
        );

        if (!isValid) {
          return null;
        }

        return {
          id: "1",
          name: "Clément",
          email: "clement@zayan-hq.local",
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized: async ({ auth }) => {
      return !!auth;
    },
  },
});

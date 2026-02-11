import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Simple auth for now - password in plain text
        const validUsername = "clement";
        const validPassword = "ZayanHQ2026";

        if (
          credentials?.username === validUsername &&
          credentials?.password === validPassword
        ) {
          return {
            id: "1",
            name: "Clément",
            email: "clement@zayan-hq.local",
          };
        }

        return null;
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

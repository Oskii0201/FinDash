import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import { compareSync } from "bcrypt-ts";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials || {};

        if (!email || !password) {
          throw new Error("Wszystkie pola są wymagane.");
        }

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || !compareSync(password, user.password)) {
          throw new Error("Nieprawidłowy email lub hasło.");
        }

        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email ?? null,
          profilePicture: user.profilePicture ?? null,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
    signOut: "/login",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email ?? undefined;
        token.name = user.name ?? undefined;
        token.profilePicture = user.profilePicture ?? null;
      }

      if (!token.profilePicture) {
        const dbUser = await prisma.user.findUnique({
          where: { id: parseInt(token.id, 10) },
        });

        if (dbUser) {
          token.profilePicture = dbUser.profilePicture ?? null;
        }
      }

      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id,
        email: token.email,
        name: token.name ?? undefined,
        profilePicture: token.profilePicture ?? null,
      };
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

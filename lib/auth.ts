import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

const providers: NextAuthOptions["providers"] = [];

// Simple password login (always available when ADMIN_PASSWORD is set).
providers.push(
  CredentialsProvider({
    id: "credentials",
    name: "Admin Password",
    credentials: {
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      const password = credentials?.password;
      if (password && process.env.ADMIN_PASSWORD && password === process.env.ADMIN_PASSWORD) {
        return { id: "admin", name: "Admin", email: "admin@bumimstudio.ir" };
      }
      return null;
    },
  })
);

// Google OAuth (enabled only when the client ID/secret are set).
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  );
}

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers,
  pages: { signIn: "/admin/login" },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.uid = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.uid;
      }
      return session;
    },
  },
};

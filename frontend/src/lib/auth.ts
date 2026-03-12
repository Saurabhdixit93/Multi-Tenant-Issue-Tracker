import { NextAuthOptions, Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

const NEXT_PUBLIC_BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const res = await axios.post(
            `${NEXT_PUBLIC_BACKEND_URL}/api/auth/login`,
            {
              email: credentials.email,
              password: credentials.password,
            },
          );

          if (res.data && res.data.token) {
            return {
              id: res.data.user.id,
              email: res.data.user.email,
              name: res.data.user.name,
              token: res.data.token,
              tenantId: res.data.user.tenantId,
              role: res.data.user.role,
            };
          }
          return null;
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User & { token?: string; tenantId?: string; role?: string } }) {
      if (user) {
        token.accessToken = user.token;
        token.tenantId = user.tenantId;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }: { session: Session & { accessToken?: string; user?: { tenantId?: string; role?: string } }; token: JWT }) {
      if (token && session.user) {
        (session as unknown as { accessToken: string }).accessToken = token.accessToken as string;
        (session.user as unknown as { tenantId: string }).tenantId = token.tenantId as string;
        (session.user as unknown as { role: string }).role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

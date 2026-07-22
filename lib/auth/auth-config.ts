import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import type { JWT } from "next-auth/jwt";
import type { Session } from "next-auth";
import type { User } from "next-auth";
import { API_ENDPOINTS } from "../config/api-endpoints";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

interface ExtendedToken extends JWT {
  accessToken?: string;
  role?: string;
  adminId?: string;
  admin?: ExtendedSession["admin"];
}

interface ExtendedUser extends User {
  accessToken?: string;
  role?: string;
  adminId?: string;
  admin?: ExtendedSession["admin"];
}

interface ExtendedSession extends Session {
  accessToken?: string;
  role?: string;
  adminId?: string;
  admin?: {
    id: string;
    name: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    role: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

export const authConfig = {
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const validatedFields = loginSchema.safeParse(credentials);
          if (!validatedFields.success) {
            return null;
          }

          const { email, password } = validatedFields.data;

          const response = await fetch(API_ENDPOINTS.ADMIN.LOGIN, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
          });

          if (!response.ok) {
            return null;
          }

          const data = await response.json();
          const accessToken = data.access_token;
          const admin = data.admin;

          if (!accessToken || !admin) {
            return null;
          }

          return {
            id: admin.id,
            email: admin.email,
            role: admin.role,
            accessToken,
            adminId: admin.id,
            admin,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: ExtendedToken; user?: ExtendedUser }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.role = user.role;
        token.adminId = user.adminId;
        token.admin = user.admin;
      }
      return token;
    },
    async session({
      session,
      token,
    }: {
      session: ExtendedSession;
      token: ExtendedToken;
    }) {
      session.accessToken = token.accessToken as string;
      session.role = token.role as string;
      session.adminId = token.adminId as string;
      session.admin = token.admin;

      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt" as const,
    maxAge: 24 * 60 * 60,
  },
};

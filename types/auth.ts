import type { DefaultSession } from "@auth/core/types";

declare module "@auth/core/types" {
  interface Session extends DefaultSession {
    accessToken?: string;
    role?: string;
    error?: string;
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

  interface User {
    accessToken?: string;
    role?: string;
    adminId?: string;
    admin?: Session["admin"];
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    accessToken?: string;
    role?: string;
    error?: string;
    adminId?: string;
    admin?: Session["admin"];
  }
}

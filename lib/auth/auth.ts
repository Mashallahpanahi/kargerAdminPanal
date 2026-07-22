import NextAuth from "next-auth";
import { authConfig } from "./auth-config";

const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

export { auth, signIn, signOut, handlers };

import { auth } from "../auth/auth";

export async function getAccessToken(): Promise<string | null> {
  try {
    if (typeof window === "undefined") {
      // Server-side: use NextAuth auth()
      const session = await auth();
      if (!session?.accessToken) {
        console.error("No valid server session or access token found.");
        return null;
      }
      return session.accessToken as string;
    } else {
      // Client-side: use next-auth/react getSession()
      const { getSession } = await import("next-auth/react");
      const clientSession = await getSession();
      if (!clientSession?.accessToken) {
        console.error("No valid client session or access token found.");
        return null;
      }
      return clientSession.accessToken as string;
    }
  } catch (error) {
    console.error("Error getting access token:", error);
    return null;
  }
}

import { getAccessToken } from "./auth-utils";

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// import { auth } from "@/lib/auth";
// export interface ApiResponse<T = unknown> {
//   success: boolean;
//   data?: T;
//   message?: string;
//   error?: string;
// }
// export async function getAccessToken(): Promise<string | null> {
//   try {
//     // Server-side: use NextAuth auth()
//     const session = await auth();
//     if (typeof window === "undefined") {
//       if (!session || !session.accessToken) {
//         console.error("No valid server session or access token found.");
//         return null;
//       }
//       return session.accessToken;
//     }
//     // Client-side: get session from next-auth/react
//     const { getSession } = await import("next-auth/react");
//     const clientSession = await getSession();
//     if (!clientSession || !clientSession.accessToken) {
//       console.error("No valid client session or access token found.");
//       return null;
//     }
//     return clientSession.accessToken as string;
//   } catch (error) {
//     console.error("Error getting access token:", error);
//     return null;
//   }
// }

export async function authenticatedFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    throw new Error("Authentication required. No access token available.");
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
      ...(options.body instanceof FormData
        ? {}
        : { "Content-Type": "application/json" }),
    },
  });

  if (response.status === 401 || response.status === 403) {
    const errorData = await response
      .json()
      .catch(() => ({ message: "Unauthorized" }));
    console.error(
      `API Error ${response.status}:`,
      errorData.message || response.statusText
    );
    throw new Error(
      `Authentication failed: ${errorData.message || "Invalid token"}`
    );
  }

  return response;
}

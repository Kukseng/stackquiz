/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { getSession, signOut } from "next-auth/react";

const raw = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
});

const withAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extra) => {
  const session = await getSession();
  const token = (session as any)?.apiAccessToken;

  const req =
    typeof args === "string"
      ? { url: args, headers: {} as Record<string, string> }
      : {
          ...args,
          headers: { ...((args.headers as Record<string, string>) ?? {}) },
        };

  if (token) (req.headers as any)["Authorization"] = `Bearer ${token}`;
  if (!(req.headers as any)["Content-Type"] && (req as any).body) {
    (req.headers as any)["Content-Type"] = "application/json";
  }

  let result = await raw(req, api, extra);

  // Handle 401 Unauthorized - try to refresh token
  if (result.error && (result.error as any)?.status === 401) {
    console.log("[BaseAPI] Got 401, attempting token refresh...");
    
    try {
      const refreshResponse = await fetch("/api/auth/refresh", {
        method: "POST",
        credentials: "include", // IMPORTANT: Send cookies with request
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (refreshResponse.ok) {
        // Get the updated session
        const updatedSession = await getSession();
        const newToken = (updatedSession as any)?.apiAccessToken;

        if (newToken) {
          // Retry the original request with new token
          if (token) (req.headers as any)["Authorization"] = `Bearer ${newToken}`;
          result = await raw(req, api, extra);
          console.log("[BaseAPI] Request retried with refreshed token");
        }
      } else {
        console.error("[BaseAPI] Token refresh failed");
        // Sign out user if refresh fails
        await signOut({ redirect: false });
      }
    } catch (error) {
      console.error("[BaseAPI] Error during token refresh:", error);
      await signOut({ redirect: false });
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: withAuth,
  tagTypes: [
    "Auth",
    "User",
    "Category",
    "Quiz",
    "Question",
    "Option",
    "Participant",
    "ParticipantAnswer",
    "Leaderboard",
    "Session",
  ],
  endpoints: () => ({}),
});
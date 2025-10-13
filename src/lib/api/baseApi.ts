// src/lib/api/baseApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getSession } from "next-auth/react";

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || "https://stackquiz-api.stackquiz.me/api/v1",
  prepareHeaders: async (headers) => {
    const session = await getSession();
    const token = (session as any)?.apiAccessToken;
    
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    
    return headers;
  },
});

// Custom base query with error handling and logging
const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  // Log request details in development
  if (process.env.NODE_ENV === "development") {
    console.log("[API Request]", {
      endpoint: typeof args === "string" ? args : args.url,
      method: typeof args === "object" ? args.method : "GET",
    });
  }

  const result = await baseQuery(args, api, extraOptions);

  // Log response in development
  if (process.env.NODE_ENV === "development") {
    if (result.error) {
      console.error("[API Error]", result.error);
    } else {
      console.log("[API Success]", typeof args === "string" ? args : args.url);
    }
  }

  // Handle 401 Unauthorized
  if (result.error && result.error.status === 401) {
    console.warn("Unauthorized request - session may have expired");
    
    // Optionally redirect to login or refresh token
    if (typeof window !== "undefined") {
      const currentPath = window.location.pathname;
      if (!currentPath.includes("/login")) {
        console.log("Redirecting to login...");
        // window.location.href = "/login";
      }
    }
  }

  // Handle network errors
  if (result.error && result.error.status === "FETCH_ERROR") {
    console.error("Network error - check API endpoint and internet connection");
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Quiz",
    "UserQuizzes",
    "Category",
    "Question",
    "Option",
    "User",
    "Auth",
    "Leaderboard",
    "Session",
    "Participant",
    "ParticipantAnswer",
    "Statistics",
    "Report",
  ],
  endpoints: () => ({}),
});

export default baseApi;
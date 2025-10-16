/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { getSession } from "next-auth/react";

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

  console.log('🔐 Auth Debug:', {
    hasSession: !!session,
    hasToken: !!token,
    tokenPreview: token ? `${token.substring(0, 20)}...` : 'NO TOKEN'
  });

  const req =
    typeof args === "string"
      ? { url: args, headers: {} as Record<string, string> }
      : {
          ...args,
          headers: { ...((args.headers as Record<string, string>) ?? {}) },
        };

  if (token) {
    (req.headers as any)["Authorization"] = `Bearer ${token}`;
    console.log('✅ Authorization header added');
  } else {
    console.warn('⚠️ No token available - request may fail');
  }
  
  if (!(req.headers as any)["Content-Type"] && (req as any).body) {
    (req.headers as any)["Content-Type"] = "application/json";
  }

  console.log('📤 Request:', {
    url: typeof args === "string" ? args : args.url,
    method: typeof args === "string" ? 'GET' : args.method || 'GET',
    hasAuth: !!(req.headers as any)["Authorization"]
  });

  const result = await raw(req, api, extra);
  
  if (result.error) {
    console.error('📥 Response Error:', result.error);
  } else {
    console.log('📥 Response Success');
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
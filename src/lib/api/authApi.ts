import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RegisterRequest, RegisterResponse } from "../types/auth";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL, // no trailing slash
    credentials: "include", // fine; won’t matter for public endpoints
  }),
  endpoints: (builder) => ({
    register: builder.mutation<RegisterResponse, RegisterRequest>({
      query: (body) => ({
        url: "auth/register",   // <— remove leading slash
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useRegisterMutation } = authApi;

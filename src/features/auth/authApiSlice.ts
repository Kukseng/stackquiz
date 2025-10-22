import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials, logout } from "./authSlice";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth?.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["User"], // ✅ Add tag system here
  endpoints: (builder) => ({
    // 🟩 Signup
    signup: builder.mutation({
      query: (data) => ({
        url: "/signup",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"], // refreshes user data if needed
    }),

    // 🟩 Login
    login: builder.mutation({
      query: (data) => ({
        url: "/login",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const user = data.user;
          const token = data.access_token;
          // ✅ Save to Redux state (authSlice)
          dispatch(setCredentials({ user, token }));
        } catch (err) {
          console.error("Login failed:", err);
        }
      },
      invalidatesTags: ["User"], // trigger user refetch
    }),

    // 🟩 Get current user
    getCurrentUser: builder.query({
      query: () => "/me",
      providesTags: ["User"], // cached data for user
    }),

    // 🟩 Logout
    logout: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
      async onQueryStarted(arg, { dispatch }) {
        dispatch(logout());
      },
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useSignupMutation,
  useLoginMutation,
  useGetCurrentUserQuery,
  useLogoutMutation,
} = authApi;

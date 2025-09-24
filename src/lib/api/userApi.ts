import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl: string;
  isActive: boolean;
  createdAt: string;
}

export interface UpdateUserRequest {
  username?: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
}

// Create the API
export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
prepareHeaders: (headers, { getState }) => {
  const state = getState() as any;
  const token = state.auth?.token || localStorage.getItem("token");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  return headers;
},

  }),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    getCurrentUser: builder.query<User, void>({
      query: () => "/users/me",
      providesTags: ["User"],
    }),
    updateCurrentUser: builder.mutation<User, UpdateUserRequest>({
      query: (body) => ({
        url: "/users/me",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    getAllUsers: builder.query<User[], void>({
      query: () => "/users",
      providesTags: ["User"],
    }),
    deleteUser: builder.mutation<{ success: boolean }, string>({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

// Export hooks
export const {
  useGetCurrentUserQuery,
  useUpdateCurrentUserMutation,
  useGetAllUsersQuery,
  useDeleteUserMutation,
} = userApi;

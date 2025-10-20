import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseApi } from "./baseApi";
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
export const userApi =  baseApi.injectEndpoints({
 


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

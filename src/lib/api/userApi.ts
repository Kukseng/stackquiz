
import { baseApi } from "./baseApi";

export interface User {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  bio?: string;
  role: string;
  isEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserUpdateRequest {
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  bio?: string;
}

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /api/v1/users - Get all users (secured)
    getAllUsers: builder.query<User[], void>({
      query: () => `/users`,
      providesTags: ["User"],
    }),

    // GET /api/v1/users/me - Get current user profile (secured)
    getCurrentUser: builder.query<User, void>({
      query: () => `/users/me`,
      providesTags: ["User"],
    }),

    // PATCH /api/v1/users/me - Update current user (secured)
    updateCurrentUser: builder.mutation<User, UserUpdateRequest>({
      query: (body) => ({
        url: "/users/me",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    // PATCH /api/v1/users/{userId} - Disable user by ID (admin)
    disableUser: builder.mutation<void, string>({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: "PATCH",
      }),
      invalidatesTags: ["User"],
    }),

    // DELETE /api/v1/users/{userId} - Delete user by ID (secured)
    deleteUser: builder.mutation<void, string>({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useGetCurrentUserQuery,
  useUpdateCurrentUserMutation,
  useDisableUserMutation,
  useDeleteUserMutation,
} = userApi;
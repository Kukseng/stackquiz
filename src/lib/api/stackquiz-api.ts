// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import type { RootState } from "../store/store";

// const API_BASE_URL = "/api/v1";

// export interface ApiResponse<T> {
//   success: boolean;
//   message: string;
//   data: T;
// }

// export interface RegisterRequest {
//   username: string;
//   email: string;
//   password: string;
//   confirmedPassword: string;
//   firstName: string;
//   lastName: string;
// }

// export interface RegisterResponse {
//   userId: string;
//   username: string;
//   email: string;
//   firstName: string;
//   lastName: string;
//   emailVerified: boolean;
// }
// export const stackquizApi = createApi({
//   reducerPath: "stackquizApi",
//   baseQuery: fetchBaseQuery({
//     baseUrl: API_BASE_URL,
//     prepareHeaders: (headers, { getState }) => {
//       const token = (getState() as RootState).authApi.;
//       if (token) {
//         headers.set("authorization", `Bearer ${token}`);
//       }
//       headers.set("content-type", "application/json");
//       return headers;
//     },
//   }),
//   tagTypes: [
//     "User",
//     "Quiz",
//     "Question",
//     "Session",
//     "Participant",
//     "Category",
//     "Leaderboard",
//   ],
//   endpoints: (builder) => ({
//     // Authentication endpoints
//     // login: builder.mutation<ApiResponse<LoginResponse>, LoginRequest>({
//     //   query: (credentials) => ({
//     //     url: "/auth/login",
//     //     method: "POST",
//     //     body: credentials,
//     //   }),
//     // }),
//     register: builder.mutation<ApiResponse<RegisterResponse>, RegisterRequest>({
//       query: (userData) => ({
//         url: "/auth/register",
//         method: "POST",
//         body: userData,
//       }),
//     }),
//   }),
// });
// export const { useRegisterMutation } = stackquizApi;

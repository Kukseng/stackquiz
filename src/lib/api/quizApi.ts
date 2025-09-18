/* eslint-disable @typescript-eslint/no-explicit-any */

import { baseApi } from "./baseApi";

export interface Quiz {
  questions: any;
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  visibility: "PUBLIC" | "PRIVATE" | "UNLISTED";
  difficulty: "EASY" | "MEDIUM" | "HARD";
  categoryIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface QuizRequest {
  title: string;
  description: string;
  thumbnailUrl: string;
  visibility: "PUBLIC" | "PRIVATE" | "UNLISTED";
  difficulty: "EASY" | "MEDIUM" | "HARD";
  categoryIds: string[];
}

export const quizApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getQuizById: builder.query<Quiz, string>({
      query: (quizId) => `/quizzes/${quizId}`,
      providesTags: (result, error, id) => [{ type: "Quiz" as const, id }],
    }),
    getAllQuizzes: builder.query<Quiz[], { active?: boolean }>({
      query: ({ active }) =>
        active !== undefined ? `/quizzes?active=${active}` : `/quizzes`,
      providesTags: ["Quiz"],
    }),
    createQuiz: builder.mutation<Quiz, QuizRequest>({
      query: (body) => ({
        url: "/quizzes",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Quiz"],
    }),
    updateQuiz: builder.mutation<Quiz, { quizId: string; data: QuizRequest }>({
      query: ({ quizId, data }) => ({
        url: `/quizzes/${quizId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { quizId }) => [{ type: "Quiz", id: quizId }],
    }),
    deleteQuiz: builder.mutation<{ success: boolean }, string>({
      query: (quizId) => ({
        url: `/quizzes/${quizId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Quiz"],
    }),
    getMyQuizzes: builder.query<Quiz[], void>({
      query: () => `/quizzes/users/me`,
      providesTags: ["Quiz"],
    }),
  }),
});

export const {
  useGetQuizByIdQuery,
  useGetAllQuizzesQuery,
  useCreateQuizMutation,
  useUpdateQuizMutation,
  useDeleteQuizMutation,
  useGetMyQuizzesQuery,
} = quizApi;

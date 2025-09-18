
import { baseApi } from "./baseApi";
export interface Quiz {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  visibility: "PUBLIC" | "PRIVATE" | "UNLISTED";
  createdAt: string;
  updatedAt: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
}

export interface QuizRequest {
  title: string;
  description: string;
  thumbnailUrl: string;
  visibility: "PUBLIC" | "PRIVATE" | "UNLISTED";
}

export const quizApi =  baseApi.injectEndpoints({
  endpoints: (builder) => ({
    //Get quiz by ID
    getQuizById: builder.query<Quiz, string>({
      query: (quizId) => `/quizzes/${quizId}`,
      providesTags: (result, error, id) => [{ type: "Quiz", id }],
    }),

    //Get all quizzes
    getAllQuizzes: builder.query<Quiz[], { active?: boolean }>({
      query: ({ active }) =>
        active !== undefined ? `/quizzes?active=${active}` : `/quizzes`,
      providesTags: ["Quiz"],
    }),

    //Create quiz
    createQuiz: builder.mutation<Quiz, QuizRequest>({
      query: (body) => ({
        url: "/quizzes",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Quiz"],
    }),

    //Update quiz
    updateQuiz: builder.mutation<Quiz, { quizId: string; data: QuizRequest }>({
      query: ({ quizId, data }) => ({
        url: `/quizzes/${quizId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { quizId }) => [{ type: "Quiz", id: quizId }],
    }),

    //Delete quiz
    deleteQuiz: builder.mutation<{ success: boolean }, string>({
      query: (quizId) => ({
        url: `/quizzes/${quizId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Quiz"],
    }),

    //Get quizzes created by authenticated user
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

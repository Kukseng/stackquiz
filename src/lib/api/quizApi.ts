import { baseApi } from "./baseApi";

export interface Quiz {
  plays: string;
  questions: any[];
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  visibility: "PUBLIC" | "PRIVATE" | "UNLISTED";
  difficulty: "EASY" | "MEDIUM" | "HARD";
  categoryIds: string[];
  createdAt: string;
  updatedAt: string;
  status?: "PUBLISHED" | "DRAFT";
  playCount?: number;
  isFavorite?: boolean;
  category?: {
    id: string;
    name: string;
  };
}

export interface QuizRequest {
  title: string;
  description: string;
  thumbnailUrl?: string;
  visibility: "PUBLIC" | "PRIVATE" | "UNLISTED";
  difficulty: "EASY" | "MEDIUM" | "HARD";
  categoryIds: string[];
  status?: "PUBLISHED" | "DRAFT";
  questionTimeLimit?: string;
}

export const quizApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /api/v1/quizzes/{quizId} - Get a quiz by ID (public)
    getQuizById: builder.query<Quiz, string>({
      query: (quizId) => `/quizzes/${quizId}`,
      providesTags: (result, error, id) => [
        { type: "Quiz" as const, id },
        "UserQuizzes"
      ],
    }),

    // GET /api/v1/quizzes - Get all quizzes (public)
    getAllQuizzes: builder.query<Quiz[], { active?: boolean }>({
      query: ({ active }) =>
        active !== undefined ? `/quizzes?active=${active}` : `/quizzes`,
      providesTags: ["Quiz"],
    }),

    // GET /api/v1/quizzes/users/me - Get quizzes created by the authenticated user
    getMyQuizzes: builder.query<Quiz[], void>({
      query: () => `/quizzes/users/me`,
      providesTags: ["UserQuizzes"],
    }),

    // POST /api/v1/quizzes - Create a new quiz
    createQuiz: builder.mutation<Quiz, QuizRequest>({
      query: (body) => ({ 
        url: "/quizzes", 
        method: "POST", 
        body 
      }),
      invalidatesTags: ["Quiz", "UserQuizzes"],
    }),

    // PUT /api/v1/quizzes/{quizId} - Update an existing quiz
    updateQuiz: builder.mutation<Quiz, { quizId: string; data: QuizRequest }>({
      query: ({ quizId, data }) => ({
        url: `/quizzes/${quizId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { quizId }) => [
        { type: "Quiz", id: quizId },
        "Quiz",
        "UserQuizzes"
      ],
    }),

    // DELETE /api/v1/quizzes/{quizId} - Delete a quiz by ID
    deleteQuiz: builder.mutation<{ success: boolean }, string>({
      query: (quizId) => ({ 
        url: `/quizzes/${quizId}`, 
        method: "DELETE" 
      }),
      invalidatesTags: ["Quiz", "UserQuizzes"],
    }),

    // POST /api/v1/quizzes/{quizId}/favorite - Add quiz to favorites
    // DELETE /api/v1/quizzes/{quizId}/favorite - Remove quiz from favorites
    toggleFavorite: builder.mutation<void, { quizId: string; isFavorite: boolean }>({
      query: ({ quizId, isFavorite }) => ({
        url: `/quizzes/${quizId}/favorite`,
        method: isFavorite ? "DELETE" : "POST",
      }),
      invalidatesTags: ["UserQuizzes", "Quiz"],
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
  useToggleFavoriteMutation,
} = quizApi;

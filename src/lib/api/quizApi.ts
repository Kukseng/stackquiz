import { baseApi } from "./baseApi";

// Define types
interface Category {
  id: string;
  name: string;
}

interface QuizOption {
  id: string;
  optionText: string;
  optionOrder: number;
  createdAt: string | null;
  isCorrected: boolean;
}

interface QuizQuestion {
  id: string;
  text: string;
  type: "MCQ" | "TF"| "FILL_THE_BLANK";
  questionOrder: number;
  timeLimit: number;
  points: number;
  imageUrl: string | null;
  options: QuizOption[];
}


interface QuizData {
  id: string;
  title: string;
  description: string;
  thumbnailUrl?: string;
  categories?: Category[];
  category?: string | { name: string };
  categoryIds?: string[];
  visibility: "PUBLIC" | "PRIVATE" | "UNLISTED";
  status: "PUBLISHED" | "DRAFT";
  questionTimeLimit: "FIVE"| "SIX"  |" SEVEN" | " EIGHT" | "NINE" |  "FIFTEEN" | "TWENTY" | "THIRTY";
  createdAt: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  updatedAt: string;
  questions: QuizQuestion[];
  plays?: number | string;
  participants?: number;
  isFavorite?: boolean;
}

interface FavoriteResponse {
  id: string;
  quizId: string;
  username: string;
  createdAt: string | null;
}

interface ToggleFavoriteRequest {
  quizId: string;
  isFavorite: boolean;
}

// Extend the base API with quiz endpoints
export const quizApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get quiz by ID
    getQuizById: builder.query<QuizData, string>({
      query: (quizId: string) => `/quizzes/${quizId}`,
      providesTags: (result, error, quizId) => [
        { type: "Quiz", id: quizId },
      ],
    }),

    // Toggle favorite - handles both add and remove
    toggleFavorite: builder.mutation<FavoriteResponse | void, ToggleFavoriteRequest>({
      query: ({ quizId, isFavorite }) => {
        const method = isFavorite ? "DELETE" : "POST";
        const url = `/quizzes/${quizId}/favorite`;
        
        console.log('🔄 API Request:', { method, url, quizId, isFavorite });
        
        return {
          url,
          method,
        };
      },
      // Optimistically update the cache
      async onQueryStarted({ quizId, isFavorite }, { dispatch, queryFulfilled }) {
        console.log('🚀 Starting mutation for quiz:', quizId);
        
        // Optimistically update the quiz data
        const patchResult = dispatch(
          quizApi.util.updateQueryData("getQuizById", quizId, (draft) => {
            if (draft) {
              console.log('📝 Optimistically updating cache:', { 
                oldFavorite: draft.isFavorite, 
                newFavorite: !isFavorite 
              });
              draft.isFavorite = !isFavorite;
            }
          })
        );

        try {
          const result = await queryFulfilled;
          console.log('✅ Mutation succeeded:', result);
        } catch (error) {
          console.error('❌ Mutation failed, reverting cache:', error);
          // Revert the optimistic update on error
          patchResult.undo();
          throw error;
        }
      },
      invalidatesTags: (result, error, { quizId }) => [
        { type: "Quiz", id: quizId },
      ],
    }),

    // Get all quizzes
    getAllQuizzes: builder.query<QuizData[], { active?: boolean }>({
      query: (params = { active: true }) => ({
        url: "/quizzes",
        params,
      }),
      providesTags: ["Quiz"],
    }),

    // Get user's quizzes
    getUserQuizzes: builder.query<QuizData[], void>({
      query: () => "/quizzes/users/me",
      providesTags: ["Quiz"],
    }),

    // Get user's draft quizzes
    getDraftQuizzes: builder.query<QuizData[], void>({
      query: () => "/quizzes/draft",
      providesTags: ["Quiz"],
    }),

    // Create a new quiz
    createQuiz: builder.mutation<QuizData, Partial<QuizData>>({
      query: (quiz) => ({
        url: "/quizzes",
        method: "POST",
        body: quiz,
      }),
      invalidatesTags: ["Quiz"],
    }),

    // Update an existing quiz
    updateQuiz: builder.mutation<QuizData, { quizId: string; quiz: Partial<QuizData> }>({
      query: ({ quizId, quiz }) => ({
        url: `/quizzes/${quizId}`,
        method: "PUT",
        body: quiz,
      }),
      invalidatesTags: (result, error, { quizId }) => [
        { type: "Quiz", id: quizId },
        "Quiz",
      ],
    }),

    // Delete a quiz
    deleteQuiz: builder.mutation<void, string>({
      query: (quizId) => ({
        url: `/quizzes/${quizId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Quiz"],
    }),
  }),
});

// Export hooks
export const {
  useGetQuizByIdQuery,
  useToggleFavoriteMutation,
  useGetAllQuizzesQuery,
  useGetUserQuizzesQuery,
  useGetDraftQuizzesQuery,
  useCreateQuizMutation,
  useUpdateQuizMutation,
  useDeleteQuizMutation,
} = quizApi;
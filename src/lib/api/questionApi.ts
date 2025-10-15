
import { baseApi } from "./baseApi";

export interface Question {
  id: string;
  text: string;
  type: "TF" | "MCQ" | "FILL_THE_BLANK"; 
  imageUrl?: string;
  quizId?: string;
}

export interface CreateQuestionRequest {
  text: string;
  type: "TF" | "MCQ" | "FILL_THE_BLANK";
  imageUrl?: string;
  quizId: string;
}

export interface UpdateQuestionRequest {
  text?: string;
  type?: "TF" | "MCQ" | "FILL_THE_BLANK";
  imageUrl?: string;
}

export const questionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getQuestions: builder.query<Question[], void>({
      query: () => `/questions`,
      providesTags: ["Question"],
    }),

    getQuestionById: builder.query<Question, string>({
      query: (id) => `/questions/${id}`,
      providesTags: (result, error, id) => [{ type: "Question", id }],
    }),

    createQuestion: builder.mutation<Question, CreateQuestionRequest>({
      query: (body) => ({
        url: `/questions`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Question", "Quiz"],
    }),

    updateQuestion: builder.mutation<Question, { id: string; data: UpdateQuestionRequest }>({
      query: ({ id, data }) => ({
        url: `/questions/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Question", id },
        "Quiz"
      ],
    }),

    deleteQuestion: builder.mutation<void, string>({
      query: (id) => ({
        url: `/questions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Question", id },
        "Quiz"
      ],
    }),

    deleteQuestionsBatch: builder.mutation<void, string[]>({
      query: (ids) => ({
        url: `/questions`,
        method: "DELETE",
        body: ids,
      }),
      invalidatesTags: ["Question", "Quiz"],
    }),
  }),
});

export const {
  useGetQuestionsQuery,
  useGetQuestionByIdQuery,
  useCreateQuestionMutation,
  useUpdateQuestionMutation,
  useDeleteQuestionMutation,
  useDeleteQuestionsBatchMutation,
} = questionApi;
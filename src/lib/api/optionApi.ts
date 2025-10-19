import { baseApi } from "./baseApi";

export interface Option {
  id: string;
  optionText: string;
  isCorrected: boolean;
  questionId: string;
}

export interface OptionRequest {
  optionText: string;
  isCorrected: boolean;
  questionId: string;
}

export interface OptionUpdateRequest {
  optionText: string;
  isCorrected: boolean;
}

export const optionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /api/v1/options - Get all options
    getAllOptions: builder.query<Option[], void>({
      query: () => `/options`,
      providesTags: ["Option"],
    }),

    // GET /api/v1/options/questions/{questionId}/public - Get options by questionId
    getOptionsByQuestionId: builder.query<Option[], string>({
      query: (questionId) => `/options/questions/${questionId}/public`,
      providesTags: (result, error, questionId) => [
        { type: "Option", id: questionId }
      ],
    }),

    // POST /api/v1/options/questions/{questionId} - Add options to a question
    addOptionsToQuestion: builder.mutation<Option[], { questionId: string; data: OptionRequest[] }>({
      query: ({ questionId, data }) => ({
        url: `/options/questions/${questionId}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { questionId }) => [
        { type: "Option", id: questionId },
        "Option",
        "Question",
        "Quiz",
        "UserQuizzes"
      ],
    }),

    // PUT /api/v1/options/{optionId} - Update an option
    updateOption: builder.mutation<Option, { optionId: string; data: OptionUpdateRequest }>({
      query: ({ optionId, data }) => ({
        url: `/options/${optionId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Option", "Question", "Quiz", "UserQuizzes"],
    }),

    // DELETE /api/v1/options/{optionId} - Delete an option
    deleteOption: builder.mutation<void, string>({
      query: (optionId) => ({
        url: `/options/${optionId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Option", "Question", "Quiz", "UserQuizzes"],
    }),
  }),
});

export const {
  useGetAllOptionsQuery,
  useGetOptionsByQuestionIdQuery,
  useAddOptionsToQuestionMutation,
  useUpdateOptionMutation,
  useDeleteOptionMutation,
} = optionApi;
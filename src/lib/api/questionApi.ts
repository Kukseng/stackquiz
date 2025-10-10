
// import { baseApi } from "./baseApi";
// export interface Question {
//   id: string;
//   text: string;
//   type: "TF" | "MCQ" | "FILL_THE_BLANK"; 
//   imageUrl?: string;
//   quizId?: string;
// }

// export interface CreateQuestionRequest {
//   text: string;
//   type: "TF" | "MCQ" | "FILL_THE_BLANK";
//   imageUrl?: string;
//   quizId: string;
// }

// export interface UpdateQuestionRequest {
//   text?: string;
//   type?: "TF" | "MCQ" | "FILL_THE_BLANK";
//   imageUrl?: string;
// }

// export const questionApi =  baseApi.injectEndpoints({
//   endpoints: (builder) => ({
//     //Get all questions
//     getQuestions: builder.query<Question[], void>({
//       query: () => `/questions`,
//       providesTags: ["Question"],
//     }),

//     //Get question by ID
//     getQuestionById: builder.query<Question, string>({
//       query: (id) => `/questions/${id}`,
//       providesTags: (result, error, id) => [{ type: "Question", id }],
//     }),

//     //Create new question
//     createQuestion: builder.mutation<Question, CreateQuestionRequest>({
//       query: (body) => ({
//         url: `/questions`,
//         method: "POST",
//         body,
//       }),
//       invalidatesTags: ["Question"],
//     }),

//     //Update question (PATCH)
//     updateQuestion: builder.mutation<Question, { id: string; data: UpdateQuestionRequest }>({
//       query: ({ id, data }) => ({
//         url: `/questions/${id}`,
//         method: "PATCH",
//         body: data,
//       }),
//       invalidatesTags: (result, error, { id }) => [{ type: "Question", id }],
//     }),

//     //Delete question by ID
//     deleteQuestion: builder.mutation<void, string>({
//       query: (id) => ({
//         url: `/questions/${id}`,
//         method: "DELETE",
//       }),
//       invalidatesTags: (result, error, id) => [{ type: "Question", id }],
//     }),

//     //Delete multiple questions (batch)
//     deleteQuestionsBatch: builder.mutation<void, string[]>({
//       query: (ids) => ({
//         url: `/questions`,
//         method: "DELETE",
//         body: ids,
//       }),
//       invalidatesTags: ["Question"],
//     }),
//   }),
// });

// export const {
//   useGetQuestionsQuery,
//   useGetQuestionByIdQuery,
//   useCreateQuestionMutation,
//   useUpdateQuestionMutation,
//   useDeleteQuestionMutation,
//   useDeleteQuestionsBatchMutation,
// } = questionApi;


// Add these methods to your questionApi.ts file
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

    // FIXED: Parameter name is 'id', not 'questionId'
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
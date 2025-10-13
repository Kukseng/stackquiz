
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
  type: "MCQ" | "TF" | "FILL_THE_BLANK";
  imageUrl?: string;
  quizId: string;
}

export interface QuestionRequest {
  text: string;
  type: "MCQ" | "TF" | "FILL_THE_BLANK";
  imageUrl?: string;
  quizId: string;
}

export interface QuestionUpdateRequest {
  text: string;
  type: "MCQ" | "TF" | "FILL_THE_BLANK";
  imageUrl?: string;
}

export const questionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /api/v1/questions - Get all questions
    getAllQuestions: builder.query<Question[], void>({
      query: () => `/questions`,
      providesTags: ["Question"],
    }),

    // GET /api/v1/questions/{id} - Get question by ID
    getQuestionById: builder.query<Question, string>({
      query: (id) => `/questions/${id}`,
      providesTags: (result, error, id) => [{ type: "Question", id }],
    }),

    // GET /api/v1/questions/me - Get all questions (self)
    getMyQuestions: builder.query<Question[], void>({
      query: () => `/questions/me`,
      providesTags: ["Question"],
    }),

    // POST /api/v1/questions - Create new question
    createQuestion: builder.mutation<Question, QuestionRequest>({
      query: (body) => ({
        url: "/questions",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Question", "Quiz", "UserQuizzes"],
    }),

    // PATCH /api/v1/questions/{id} - Partially update question
    updateQuestion: builder.mutation<Question, { id: string; data: QuestionUpdateRequest }>({
      query: ({ id, data }) => ({
        url: `/questions/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Question", id },
        "Question",
        "Quiz",
        "UserQuizzes"
      ],
    }),

    // DELETE /api/v1/questions/{id} - Delete single question
    deleteQuestion: builder.mutation<void, string>({
      query: (id) => ({
        url: `/questions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Question", "Quiz", "UserQuizzes"],
    }),

    // DELETE /api/v1/questions - Delete multiple questions
    deleteQuestions: builder.mutation<void, string[]>({
      query: (ids) => ({
        url: `/questions`,
        method: "DELETE",
        body: { questionIds: ids },
      }),
      invalidatesTags: ["Question", "Quiz", "UserQuizzes"],
    }),
  }),
});

export const {
  useGetAllQuestionsQuery,
  useGetQuestionByIdQuery,
  useGetMyQuestionsQuery,
  useCreateQuestionMutation,
  useUpdateQuestionMutation,
  useDeleteQuestionMutation,
  useDeleteQuestionsMutation,
} = questionApi;

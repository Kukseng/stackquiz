/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/participantAnswerApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const participantAnswerApi = createApi({
  reducerPath: "participantAnswerApi",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_URL,
    credentials: "include",
   }),
  tagTypes: ["Answer"],
  endpoints: (builder) => ({
    updateAnswer: builder.mutation({
      query: ({ answerId, ...body }) => ({
        url: `/answers/${answerId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { answerId }) => [
        { type: "Answer", id: answerId },
      ],
    }),

    submitAnswer: builder.mutation({
      query: (body) => ({
        url: `/answers/submit`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Answer"],
    }),

    submitBulkAnswers: builder.mutation({
      query: (body) => ({
        url: `/answers/submit/bulk`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Answer"],
    }),

    getAnswersByParticipant: builder.query({
      query: (participantId) => `/answers/participant/${participantId}`,
      providesTags: (result, error, participantId) =>
        result
          ? [
              ...result.map(({ answerId }: any) => ({
                type: "Answer" as const,
                id: answerId,
              })),
              { type: "Answer", id: `PARTICIPANT-${participantId}` },
            ]
          : [{ type: "Answer", id: `PARTICIPANT-${participantId}` }],
    }),

    getAnswerByParticipantAndQuestion: builder.query({
      query: ({ participantId, questionId }) =>
        `/answers/participant/${participantId}/question/${questionId}`,
      providesTags: (result, error, { participantId, questionId }) => [
        { type: "Answer", id: `${participantId}-${questionId}` },
      ],
    }),
  }),
});

export const {
  useUpdateAnswerMutation,
  useSubmitAnswerMutation,
  useSubmitBulkAnswersMutation,
  useGetAnswersByParticipantQuery,
  useGetAnswerByParticipantAndQuestionQuery,
} = participantAnswerApi;

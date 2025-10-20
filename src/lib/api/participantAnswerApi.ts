
import { baseApi } from "./baseApi";
import type { SubmitAnswerRequest, ParticipantAnswerResponse } from "./types/common";

export const answerApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    submit: b.mutation<ParticipantAnswerResponse, SubmitAnswerRequest>({
      query: (body) => ({ url: "answers/submit", method: "POST", body }),
      invalidatesTags: ["ParticipantAnswer","Leaderboard"],
    }),
    submitBulk: b.mutation<ParticipantAnswerResponse[], SubmitAnswerRequest[]>({
      query: (body) => ({ url: "answers/submit/bulk", method: "POST", body }),
      invalidatesTags: ["ParticipantAnswer","Leaderboard"],
    }),
    getByParticipant: b.query<ParticipantAnswerResponse[], { participantId: string }>({
      query: ({ participantId }) => `answers/participant/${participantId}`,
      providesTags: ["ParticipantAnswer"],
    }),
    getOne: b.query<ParticipantAnswerResponse, { participantId: string; questionId: string }>({
      query: ({ participantId, questionId }) => `answers/participant/${participantId}/question/${questionId}`,
      providesTags: ["ParticipantAnswer"],
    }),
    update: b.mutation<ParticipantAnswerResponse, { answerId: string; body: SubmitAnswerRequest }>({
      query: ({ answerId, body }) => ({ url: `answers/${answerId}`, method: "PUT", body }),
      invalidatesTags: ["ParticipantAnswer","Leaderboard"],
    }),
  }),
});
export const { useSubmitMutation, useSubmitBulkMutation, useGetByParticipantQuery, useGetOneQuery, useUpdateMutation } = answerApi;

/* eslint-disable @typescript-eslint/no-explicit-any */

import { baseApi } from "./baseApi";
import type {
  JoinSessionRequest,
  ParticipantResponse,
  SubmitAnswerRequest,
} from "./types/common";

export const participantApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    joinSession: b.mutation<ParticipantResponse, JoinSessionRequest>({
      query: (body) => ({ url: "participants/join", method: "POST", body }),
      invalidatesTags: ["Participant"],
    }),
    submitAnswer: b.mutation<any, SubmitAnswerRequest>({
      query: (body) => ({
        url: "participants/submit-answer",
        method: "POST",
        body,
      }),
    }),
    getSessionParticipants: b.query<
      ParticipantResponse[],
      { quizCode: string }
    >({
      query: ({ quizCode }) => `participants/session/${quizCode}`,
      providesTags: ["Participant"],
    }),
    removeParticipant: b.mutation<void, { participantId: string }>({
      query: ({ participantId }) => ({
        url: `participants/${participantId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Participant"],
    }),
    nicknameAvailable: b.query<boolean, { quizCode: string; nickname: string }>(
      {
        query: ({ quizCode, nickname }) =>
          `participants/session/${quizCode}/nickname-available?nickname=${encodeURIComponent(
            nickname
          )}`,
      }
    ),
    canJoin: b.query<boolean, { quizCode: string }>({
      query: ({ quizCode }) => `participants/session/${quizCode}/can-join`,
    }),
  }),
});
export const {
  useJoinSessionMutation,
  useSubmitAnswerMutation,
  useGetSessionParticipantsQuery,
  useRemoveParticipantMutation,
  useNicknameAvailableQuery,
  useCanJoinQuery,
} = participantApi;

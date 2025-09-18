// lib/api/sessionApi.ts
import { baseApi } from "./baseApi";
import type {
  SessionCreateRequest,
  SessionResponse,
  QuestionResponse,
} from "./types/common";

export const sessionApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    createSession: b.mutation<SessionResponse, SessionCreateRequest>({
      query: (body) => ({ url: "sessions", method: "POST", body }),
      invalidatesTags: ["Session"],
    }),
    startSession: b.mutation<SessionResponse, { sessionId: string }>({
      query: ({ sessionId }) => ({
        url: `sessions/${sessionId}/start`,
        method: "PUT",
      }),
      invalidatesTags: ["Session", "Leaderboard"],
    }),
    endSession: b.mutation<SessionResponse, { sessionId: string }>({
      query: ({ sessionId }) => ({
        url: `sessions/${sessionId}/end`,
        method: "PUT",
      }),
      invalidatesTags: ["Session", "Leaderboard"],
    }),
    nextQuestion: b.mutation<QuestionResponse, { sessionId: string }>({
      query: ({ sessionId }) => ({
        url: `sessions/${sessionId}/next-question`,
        method: "PUT",
      }),
      invalidatesTags: ["Question", "Leaderboard"],
    }),
    canJoinBySessionCode: b.query<boolean, { sessionCode: string }>({
      query: ({ sessionCode }) => `sessions/${sessionCode}/join`,
    }),
    getSessionsByQuizCode: b.query<SessionResponse[], { quizCode: string }>({
      query: ({ quizCode }) => `sessions/${quizCode}`,
      providesTags: ["Session"],
    }),
  }),
});
export const {
  useCreateSessionMutation,
  useStartSessionMutation,
  useEndSessionMutation,
  useNextQuestionMutation,
  useCanJoinBySessionCodeQuery,
  useGetSessionsByQuizCodeQuery,
} = sessionApi;

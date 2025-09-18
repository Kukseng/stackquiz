
import { baseApi } from "./baseApi";
import type {
  LeaderboardRequest,
  LeaderboardResponse,
  ParticipantRankResponse,
  HistoricalLeaderboardRequest,
  HistoricalLeaderboardResponse,
} from "./types/common";

export const leaderboardApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    getLive: b.mutation<LeaderboardResponse, LeaderboardRequest>({
      query: (body) => ({ url: "leaderboard/live", method: "POST", body }),
      invalidatesTags: ["Leaderboard"],
    }),
    getBySession: b.query<LeaderboardResponse, { sessionCode: string }>({
      query: ({ sessionCode }) => `leaderboard/session/${sessionCode}`,
      providesTags: ["Leaderboard"],
    }),
    getTopN: b.query<
      LeaderboardResponse,
      { sessionId: string; limit: number; participantId?: string }>({
      query: ({ sessionId, limit, participantId }) =>
        `leaderboard/session/${sessionId}/top/${limit}${
          participantId
            ? `?participantId=${encodeURIComponent(participantId)}`
            : ""
        }`,
      providesTags: ["Leaderboard"],
    }),
    getPodium: b.query<LeaderboardResponse, { sessionId: string }>({
      query: ({ sessionId }) => `leaderboard/session/${sessionId}/podium`,
      providesTags: ["Leaderboard"],
    }),
    getRank: b.query<
      ParticipantRankResponse,
      { sessionId: string; participantId: string }
    >({
      query: ({ sessionId, participantId }) =>
        `leaderboard/session/${sessionId}/participant/${participantId}/rank`,
      providesTags: ["Leaderboard"],
    }),
    getReport: b.query<HistoricalLeaderboardResponse, { sessionId: string }>({
      query: ({ sessionId }) => `leaderboard/session/${sessionId}/report`,
    }),
    postHistory: b.mutation<
      HistoricalLeaderboardResponse[],
      HistoricalLeaderboardRequest
    >({
      query: (body) => ({ url: "leaderboard/history", method: "POST", body }),
    }),
    initialize: b.mutation<void, { sessionId: string }>({
      query: ({ sessionId }) => ({
        url: `leaderboard/session/${sessionId}/initialize`,
        method: "POST",
      }),
    }),
    finalize: b.mutation<void, { sessionId: string }>({
      query: ({ sessionId }) => ({
        url: `leaderboard/session/${sessionId}/finalize`,
        method: "POST",
      }),
    }),
  }),
});
export const {
  useGetLiveMutation,
  useGetBySessionQuery,
  useGetTopNQuery,
  useGetPodiumQuery,
  useGetRankQuery,
  useGetReportQuery,
  useInitializeMutation,
  useFinalizeMutation,
} = leaderboardApi;

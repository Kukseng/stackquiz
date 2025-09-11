import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface JoinQuizRequest {
  quizCode: string;
  nickname: string;
}

export interface ParticipantResponse {
  id: string;
  nickname: string;
  sessionCode: string;
  sessionName: string;
  totalScore: number;
  joinedAt: string;
}

export const participantApi = createApi({
  reducerPath: 'participantApi',
  baseQuery: fetchBaseQuery({ baseUrl:"https://stackquiz-api.stackquiz.me/api/v1"  }),
  endpoints: (builder) => ({
    joinQuiz: builder.mutation<ParticipantResponse, JoinQuizRequest>({
      query: (body) => ({
        url: '/participants/join',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useJoinQuizMutation } = participantApi;

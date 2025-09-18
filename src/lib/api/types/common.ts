/* eslint-disable @typescript-eslint/no-empty-object-type */
// lib/api/types/common.ts
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status?: string | number;
  timestamp?: string;
}

// Auth
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string; // ISO date
}
export interface RegisterResponse {
  userId: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  emailVerified: boolean;
  accessToken: string;
  refreshToken: string;
}
export interface LoginRequest {
  username: string;
  password: string;
}
export interface LoginResponse {
  userId: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  emailVerified: boolean;
  accessToken: string;
  refreshToken: string;
}

// Categories
export interface CategoryResponse {
  id: string;
  name: string;
  description?: string;
}
export interface CategoryRequest {
  name: string;
  description?: string;
}

// Participants
export interface JoinSessionRequest {
  /* per your backend */ pin?: string;
  quizCode?: string;
  nickname: string;
}
export interface ParticipantResponse {
  id: string;
  sessionId: string;
  nickname: string;
  score: number;
  active?: boolean;
}

// Answers
export interface SubmitAnswerRequest {
  participantId: string;
  questionId: string;
  selectedOptionIds?: string[];
  shortAnswerText?: string;
  timeTaken?: number;
}
export interface ParticipantAnswerResponse {
  id: string;
  participantId: string;
  questionId: string;
  correct: boolean;
  scoreAwarded: number;
  createdAt: string;
}

// Options
export interface AddOptionRequest {
  text: string;
  isCorrect: boolean;
}
export interface UpdateOptionRequest {
  text?: string;
  isCorrect?: boolean;
}
export interface OptionResponse {
  id: string;
  text: string;
  isCorrect: boolean;
}

// Questions
export type QuestionType = "MULTIPLE_CHOICE" | "TRUE_FALSE" | "SHORT_ANSWER";
export interface CreateQuestionRequest {
  text: string;
  type: QuestionType;
  score: number;
  timeLimit: number;
  options: Array<{ text: string; isCorrect: boolean }>;
}
export interface UpdateQuestionRequest {
  text?: string;
  type?: QuestionType;
  score?: number;
  timeLimit?: number;
}
export interface QuestionResponse {
  id: string;
  text: string;
  type: QuestionType;
  score: number;
  timeLimit: number;
  options: OptionResponse[];
}

// Quizzes
export type Difficulty = "EASY" | "MEDIUM" | "HARD";
export type Visibility = "PUBLIC" | "PRIVATE";
export interface CreateQuizRequest {
  title: string;
  description?: string;
  categoryId: string;
  difficulty: Difficulty;
  visibility: Visibility;
  backgroundTemplateId?: string;
}
export interface QuizUpdate extends Partial<CreateQuizRequest> {}
export interface QuizResponse {
  id: string;
  title: string;
  description?: string;
  category: { id: string; name: string };
  difficulty: Difficulty;
  visibility: Visibility;
  creatorId: string;
  createdAt: string;
  updatedAt: string;
  questionCount: number;
  questions?: QuestionResponse[];
}

// Sessions
export interface SessionCreateRequest {
  quizId: string;
}
export interface SessionResponse {
  id: string;
  quizCode?: string;
  hostId?: string;
  status: "WAITING_FOR_PLAYERS" | "IN_PROGRESS" | "ENDED";
  createdAt: string;
}

// Leaderboard
export interface LeaderboardRequest {
  sessionId?: string;
  limit?: number;
  participantId?: string /* filters */;
}
export interface LeaderboardEntry {
  participantId: string;
  nickname: string;
  score: number;
  rank: number;
}
export interface LeaderboardResponse {
  sessionId: string;
  leaderboard: LeaderboardEntry[];
}
export interface ParticipantRankResponse {
  participantId: string;
  rank: number;
  score: number;
}
export interface HistoricalLeaderboardRequest {
  /* filters/time range */
}
export interface HistoricalLeaderboardResponse {
  userId: string;
  username: string;
  totalScore: number;
  quizzesPlayed: number;
}

// WS messages (STOMP payloads)
export type HostCommandMessage = {
  type:
    | "START_SESSION"
    | "NEXT_QUESTION"
    | "PAUSE_SESSION"
    | "END_SESSION"
    | "SHOW_RESULTS";
  sessionId: string;
};

export interface AnswerSubmissionMessage extends SubmitAnswerRequest {
  type: "SUBMIT_ANSWER";
  sessionId: string;
}

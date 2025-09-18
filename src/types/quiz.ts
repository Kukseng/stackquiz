
export interface User {
  id: string
  profileUser: string
  username: string
  email: string
  firstName: string
  lastName: string
  avatarUrl: string
  isActive: boolean
  createdAt: string
}

export interface QuizSession {
  id: string
  quiz: string
  sessionName: string
  hostName: string
  sessionCode: string
  status: "WAITING" | "ACTIVE" | "ENDED"
  totalQuestions: number
  totalParticipants: number
  currentQuestion: number
  startTime: string
  endTime: string
  createdAt: string
  participants: string[]
  host: string
  leaderboardData: string
}

export interface Question {
  id: string
  text: string
  type: "TF" | "MULTIPLE_CHOICE"
  questionOrder: number
  timeLimit: number
  points: number
  imageUrl?: string
  createdAt: string
  updatedAt: string
  options: string[]
}

export interface Option {
  id: string
  optionText: string
  optionOrder: number
  createdAt: string
  isCorrected: boolean
}

export interface Participant {
  id: string
  nickname: string
  sessionCode: string
  sessionName: string
  totalScore: number
  joinedAt: string
  isActive: boolean
  isConnected: boolean
  avatar?: {
    id: number
    name: string
  }
}

export interface ParticipantAnswer {
  answerId: string
  participantId: string
  participantNickname: string
  questionId: string
  questionText: string
  optionId: string
  optionText: string
  answerText: string
  isCorrect: boolean
  timeTaken: number
  pointsEarned: number
  answeredAt: string
  sessionId: string
}

export interface LeaderboardEntry {
  participantId: string
  nickname: string
  totalScore: number
  position: number
  rank: number
  isCurrentUser: boolean
}

export interface Leaderboard {
  sessionId: string
  entries: LeaderboardEntry[]
  totalParticipants: number
  lastUpdated: number
  status: string
}

// WebSocket Message Types
export type WebSocketMessage =
  | { type: "session_started"; data: QuizSession }
  | { type: "session_ended"; data: QuizSession }
  | { type: "question_started"; data: { question: Question; timeLimit: number } }
  | { type: "question_ended"; data: { questionId: string; correctAnswer: string } }
  | { type: "participant_joined"; data: Participant }
  | { type: "participant_left"; data: { participantId: string } }
  | { type: "answer_submitted"; data: ParticipantAnswer }
  | { type: "leaderboard_updated"; data: Leaderboard }
  | { type: "timer_update"; data: { timeRemaining: number } }
  | { type: "connection_status"; data: { status: "connected" | "disconnected" | "reconnecting" } }
  | { type: "error"; data: { message: string; code?: string } }

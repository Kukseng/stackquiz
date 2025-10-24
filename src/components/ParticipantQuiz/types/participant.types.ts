// types/participant.types.ts

export interface LeaderboardEntry {
  participantId: string
  nickname: string
  totalScore: number
  position: number
  rank: number
  isCurrentUser?: boolean
  avatarId?: string
  questionsAnswered?: number
  correctAnswers?: number
  streak?: number
  positionChange?: number
  isOnline?: boolean
  lastActivity?: string
  status?: string
}

export interface ScoreCelebration {
  participantId: string
  nickname: string
  pointsEarned: number
  newTotalScore: number
  newRank: number
  isCorrect: boolean
  celebrationType: string
  animationType: string
}

export interface ParticipantRankUpdate {
  participantId: string
  nickname: string
  currentRank: number
  previousRank: number
  currentScore: number
  scoreChange: number
  updateType: string
}

export interface QuestionStats {
  sessionId: string
  questionNumber: number
  totalQuestions: number
  totalParticipants: number
  participantsAnswered: number
  participantsRemaining: number
  averageResponseTime: number
  correctAnswers: number
  incorrectAnswers: number
  accuracyRate: number
  isQuestionComplete: boolean
  optionStats?: { [optionId: string]: number }
}

export interface PersonalScoreUpdate {
  participantId: string
  participantNickname: string
  previousScore: number
  newScore: number
  pointsEarned: number
  currentRank: number
  previousRank: number
  isCorrect: boolean
  questionId: string
  streak?: number
  timeBonus?: number
}

export interface AnswerFeedback {
  participantId: string
  questionId: string
  selectedOptionId: string
  correctOptionId: string
  isCorrect: boolean
  pointsEarned: number
  timeTaken: number
  newTotalScore: number
  currentRank: number
  explanation: string
  timeBonus?: number
  streak?: number
  encouragementMessage?: string
}

export interface QuestionAnalyticsData {
  sessionCode: string
  currentQuestionNumber: number
  totalQuestions: number
  questionId: string
  questionText: string
  correctOptionId: string
  totalParticipants: number
  participantsAnswered: number
  participantsNotAnswered: number
  participationRate: number
  correctAnswers: number
  incorrectAnswers: number
  accuracyRate: number
  optionStatistics: {
    [key: string]: {
      optionId: string
      optionText: string
      isCorrect: boolean
      count: number
      percentage: number
    }
  }
  top3: Array<{
    rank: number
    participantId: string
    nickname: string
    avatarId: string | null
    totalScore: number
    correctAnswers: number
    streak: number
  }>
  averageResponseTime: number
  fastestResponseTime: number
}

export interface Question {
  id: string
  text?: string
  questionText?: string
  options: QuestionOption[]
}

export interface QuestionOption {
  id: string
  text?: string
  optionText?: string
}

export type GameStatus = 
  | "LOBBY" 
  | "COUNTDOWN" 
  | "PLAY" 
  | "ANSWER_REVEAL" 
  | "RESULTS" 
  | "COMPLETED" 
  | "END"

export type ConnectionStatus = 
  | "Connecting..." 
  | "Connected" 
  | "Disconnected" 
  | "Error"
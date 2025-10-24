// ============================================================================
// FILE 1: components/host-dashboard/types.ts
// ============================================================================

export interface LeaderboardEntry {
  participantId: string
  nickname: string
  totalScore: number
  position: number
  rank: number
  currentRank?: number
  isCurrentUser?: boolean
  avatarId?: string
  questionsAnswered?: number
  averageResponseTime?: number
  correctAnswers?: number
  streak?: number
  isOnline?: boolean
  lastActivity?: string
  status?: string
  positionChange?: number
}

export interface EnhancedLeaderboard {
  sessionId: string
  entries: LeaderboardEntry[]
  totalParticipants: number
  lastUpdated: number
  status: string
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
}

export interface HostDashboardData {
  sessionId: string
  sessionCode: string
  sessionName: string
  sessionStatus: string
  currentQuestion: number
  totalQuestions: number
  totalParticipants: number
  activeParticipants: number
  participantsAnswered: number
  participantsPending: number
  currentTimer?: {
    timerType: string
    timerStatus: string
    remainingSeconds: number
    totalSeconds: number
  }
  canStart: boolean
  canPause: boolean
  canResume: boolean
  canEnd: boolean
  canAdvanceQuestion: boolean
}

export interface ParticipantAnswer {
  questionNumber: number
  isCorrect: boolean
  answered: boolean
  pointsEarned: number
  timeSpent?: number
}

export interface DetailedParticipantProgress {
  participantId: string
  nickname: string
  avatarId: string
  totalScore: number
  currentQuestionNumber: number
  answeredCount: number
  correctCount: number
  accuracy: number
  answers: ParticipantAnswer[]
  status: "active" | "idle" | "completed"
  lastActivityTime?: string
}

export interface QuizSettings {
  mode: string
  scheduledStartTime: string
  scheduledEndTime: string
  defaultQuestionTimeLimit: number
  autoAdvanceQuestions: boolean
  allowLateJoining: boolean
  shuffleQuestions: boolean
  showCorrectAnswers: boolean
  showTimer: boolean
  maxParticipants: number
}
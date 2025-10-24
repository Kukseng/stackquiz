export interface Question {
  id: string
  questionText: string
  options: QuestionOption[]
  correctOptionId: string
  timeLimit?: number
  points?: number
}

export interface QuestionOption {
  id: string
  text: string
  optionText?: string
  isCorrect: boolean
}

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

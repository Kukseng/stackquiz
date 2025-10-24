
"use client"
import type React from "react"
import { useEffect, useState, useCallback, useRef } from "react"
import { useParams } from "next/navigation"
import axios from "axios"
import { Client } from "@stomp/stompjs"
import SockJS from "sockjs-client"
import { motion, AnimatePresence } from "framer-motion"
// import {QuestionAnalytics} from "@/components/ QuestionAnalytics/QuestionAnalytics"
import Rank from "@/components/Poduim/rank"

// ===== INTERFACES =====
interface LeaderboardEntry {
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

interface ScoreCelebration {
  participantId: string
  nickname: string
  pointsEarned: number
  newTotalScore: number
  newRank: number
  isCorrect: boolean
  celebrationType: string
  animationType: string
}

interface ParticipantRankUpdate {
  participantId: string
  nickname: string
  currentRank: number
  previousRank: number
  currentScore: number
  scoreChange: number
  updateType: string
}

interface QuestionStats {
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

interface PersonalScoreUpdate {
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

interface AnswerFeedback {
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

interface QuestionAnalyticsData {
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

// Configuration
const WEBSOCKET_CONFIG = {
  url: process.env.NEXT_PUBLIC_WEBSOCKET_URL || "https://stackquiz-api.stackquiz.me/ws",
  reconnectDelay: 3000,
  heartbeatIncoming: 4000,
  heartbeatOutgoing: 4000,
  maxReconnectAttempts: 5,
}

// Utility function for safe JSON parsing
const safeJsonParse = (jsonString: string, fallback: any = null) => {
  try {
    return JSON.parse(jsonString)
  } catch (error) {
    console.error("JSON parse error:", error)
    return fallback
  }
}

// ===== LIVE RANKING COMPONENT =====
function LiveRankingPanel({
  personalScore,
  personalRank,
  nickname,
  leaderboard,
  currentParticipantId,
  isMinimized = false,
  streak = 0,
}: {
  personalScore: number
  personalRank: number
  nickname: string
  leaderboard: LeaderboardEntry[]
  currentParticipantId: string
  isMinimized?: boolean
  streak?: number
}) {
  return (
    <>
      {/* Top Left: Rank, Coins (removed), Streak */}
      <div className="fixed top-4 left-4 z-50 flex items-center gap-3">
        <div className="bg-gray-900/90 backdrop-blur-sm border-2 border-yellow-500 rounded-lg px-3 py-2 flex items-center gap-2">
          <span className="text-2xl">🏆</span>
          <span className="text-white font-bold text-lg">
            {personalRank > 0 ? `${personalRank}${getRankSuffix(personalRank)}` : "-"}
          </span>
        </div>

        {streak > 0 && (
          <div className="bg-gray-900/90 backdrop-blur-sm border-2 border-orange-500 rounded-lg px-3 py-2 flex items-center gap-2">
            <span className="text-2xl">🔥</span>
            <span className="text-white font-bold text-lg">{streak}</span>
          </div>
        )}
      </div>

      {/* Top Right: Score */}
      <div className="fixed top-4 right-4 z-50">
        <div className="bg-gray-900/90 backdrop-blur-sm border-2 border-blue-500 rounded-lg px-4 py-2">
          <span className="text-white font-bold text-2xl">{personalScore.toLocaleString()}</span>
        </div>
      </div>
    </>
  )
}

function getRankSuffix(rank: number): string {
  if (rank === 1) return "st"
  if (rank === 2) return "nd"
  if (rank === 3) return "rd"
  return "th"
}

// ===== ENHANCED QUESTION TIMER COMPONENT =====
function QuestionTimer({
  timeRemaining,
  timeLimit,
  isActive,
  onTimeUp,
  showWarning = true,
  serverTime = null,
}: {
  timeRemaining: number
  timeLimit: number
  isActive: boolean
  onTimeUp: () => void
  showWarning?: boolean
  serverTime?: number | null
}) {
  const percentage = (timeRemaining / timeLimit) * 100
  const isWarning = timeRemaining <= 5
  const isCritical = timeRemaining <= 3

  useEffect(() => {
    if (timeRemaining === 0 && isActive) {
      onTimeUp()
    }
  }, [timeRemaining, isActive, onTimeUp])

  return (
    <div className="relative">
      {/* Main Timer Display */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{
          scale: isCritical ? [1, 1.1, 1] : 1,
          opacity: 1,
        }}
        transition={{
          scale: { duration: 0.5, repeat: isCritical ? Number.POSITIVE_INFINITY : 0 },
          opacity: { duration: 0.3 },
        }}
        className={`relative w-24 h-24 mx-auto mb-4 ${isCritical ? "animate-pulse" : ""}`}
      >
        {/* Background Circle */}
        <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" stroke="rgba(255,255,255,0.2)" strokeWidth="8" fill="transparent" />
          {/* Progress Circle */}
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            stroke={isCritical ? "#ef4444" : isWarning ? "#f59e0b" : "#10b981"}
            strokeWidth="8"
            fill="transparent"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 45}`}
            strokeDashoffset={`${2 * Math.PI * 45 * (1 - percentage / 100)}`}
            initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
            animate={{ strokeDashoffset: 2 * Math.PI * 45 * (1 - percentage / 100) }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </svg>

        {/* Timer Text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            key={timeRemaining}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            className={`text-2xl font-bold ${
              isCritical ? "text-red-500" : isWarning ? "text-yellow-500" : "text-white"
            }`}
          >
            {timeRemaining}
          </motion.span>
        </div>
      </motion.div>

      {/* Warning Messages */}
      {showWarning && isWarning && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <p className={`text-sm font-semibold ${isCritical ? "text-red-400" : "text-yellow-400"}`}>
            {isCritical ? "⚠️ Time's almost up!" : "⏰ Hurry up!"}
          </p>
        </motion.div>
      )}
    </div>
  )
}

// ===== ENHANCED ANSWER REVEAL COMPONENT =====
function AnswerRevealPanel({
  question,
  selectedOptionId,
  correctOptionId,
  answerFeedback,
  questionStats,
  onContinue,
}: {
  question: any
  selectedOptionId: string | null
  correctOptionId: string | null
  answerFeedback: AnswerFeedback | null
  questionStats: QuestionStats | null
  onContinue: () => void
}) {
  const [showStats, setShowStats] = useState(false)

  useEffect(() => {
    // Show stats after a delay
    const timer = setTimeout(() => setShowStats(true), 1000)
    return () => clearTimeout(timer)
  }, [])

  if (!question || !answerFeedback) return null

  const isCorrect = answerFeedback.isCorrect
  const pointsEarned = answerFeedback.pointsEarned

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl w-full space-y-6">
      {/* Result Header */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1, rotate: 360 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
          className={`text-8xl mb-4 ${isCorrect ? "text-green-400" : "text-red-400"}`}
        >
          {isCorrect ? "✅" : "❌"}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className={`text-4xl font-bold mb-2 ${isCorrect ? "text-green-400" : "text-red-400"}`}
        >
          {isCorrect ? "Correct!" : "Incorrect"}
        </motion.h1>

        {/* Points Earned */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9, type: "spring", stiffness: 300 }}
          className="text-white text-2xl font-bold"
        >
          {pointsEarned > 0 ? `+${pointsEarned} points` : "0 points"}
          {answerFeedback.timeBonus && answerFeedback.timeBonus > 0 && (
            <span className="text-yellow-400 ml-2">⚡ +{answerFeedback.timeBonus} speed bonus</span>
          )}
        </motion.div>

        {/* Streak Display */}
        {answerFeedback.streak && answerFeedback.streak > 1 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.1, type: "spring", stiffness: 300 }}
            className="text-orange-400 text-xl font-bold mt-2"
          >
            🔥 {answerFeedback.streak} answer streak!
          </motion.div>
        )}

        {/* Encouragement Message */}
        {answerFeedback.encouragementMessage && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 }}
            className="text-white text-lg mt-2"
          >
            {answerFeedback.encouragementMessage}
          </motion.p>
        )}
      </motion.div>

      {/* Answer Options with Results */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {(question.options || []).map((option: any, index: number) => {
          const isSelected = selectedOptionId === option.id
          const isCorrect = correctOptionId === option.id
          const participantCount = questionStats?.optionStats?.[option.id] || 0
          const totalParticipants = questionStats?.totalParticipants || 1
          const percentage = Math.round((participantCount / totalParticipants) * 100)

          return (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.5 + index * 0.1 }}
              className={`relative p-6 rounded-xl border-2 transition-all duration-500 ${
                isCorrect
                  ? "bg-green-100 border-green-500 text-green-800"
                  : isSelected
                    ? "bg-red-100 border-red-500 text-red-800"
                    : "bg-gray-100 border-gray-300 text-gray-600"
              }`}
            >
              <div className="flex items-center space-x-3 mb-2">
                <span
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    isCorrect
                      ? "bg-green-500 text-white"
                      : isSelected
                        ? "bg-red-500 text-white"
                        : "bg-gray-300 text-gray-600"
                  }`}
                >
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="font-semibold text-lg">{option.text || option.optionText}</span>
                {isSelected && <span className="text-sm font-bold">← Your answer</span>}
                {isCorrect && <span className="text-sm font-bold">✓ Correct</span>}
              </div>

              {/* Answer Statistics */}
              {showStats && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ delay: 2 + index * 0.1 }}
                  className="mt-3"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm">Participants who chose this:</span>
                    <span className="text-sm font-bold">
                      {participantCount} ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ delay: 2.2 + index * 0.1, duration: 0.8 }}
                      className={`h-2 rounded-full ${isCorrect ? "bg-green-500" : "bg-gray-400"}`}
                    />
                  </div>
                </motion.div>
              )}
            </motion.div>
          )
        })}
      </motion.div>

      {/* Explanation */}
      {answerFeedback.explanation && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5 }}
          className="bg-blue-100 border border-blue-300 rounded-xl p-6 text-center"
        >
          <h3 className="text-lg font-bold text-blue-800 mb-2">💡 Explanation</h3>
          <p className="text-blue-700">{answerFeedback.explanation}</p>
        </motion.div>
      )}

      {/* Continue Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3 }}
        className="text-center"
      >
        <button
          onClick={onContinue}
          className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold text-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg"
        >
          Continue ➡️
        </button>
      </motion.div>
    </motion.div>
  )
}

// ===== PARTICIPANT QUESTION ANALYTICS COMPONENT =====
function ParticipantQuestionAnalytics({
  analytics,
  participantId,
}: {
  analytics: QuestionAnalyticsData | null
  participantId: string
}) {
  const [showStats, setShowStats] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShowStats(true), 500)
    return () => clearTimeout(timer)
  }, [])

  if (!analytics) return null

  const sortedOptions = Object.values(analytics.optionStatistics).sort((a, b) => b.count - a.count)
  const currentParticipant = analytics.top3.find((p) => p.participantId === participantId)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="max-w-4xl w-full space-y-6">
        {/* Header */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-6"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Question {analytics.currentQuestionNumber} Results
          </h1>
          <p className="text-lg md:text-xl text-blue-200">{analytics.questionText}</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Participation */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20"
          >
            <p className="text-blue-200 text-sm mb-1">📊 Participation</p>
            <p className="text-white text-3xl font-bold">{analytics.participationRate.toFixed(0)}%</p>
            <p className="text-blue-300 text-xs mt-1">
              {analytics.participantsAnswered}/{analytics.totalParticipants} answered
            </p>
          </motion.div>

          {/* Accuracy */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20"
          >
            <p className="text-green-200 text-sm mb-1">🎯 Accuracy</p>
            <p className="text-white text-3xl font-bold">{analytics.accuracyRate.toFixed(0)}%</p>
            <p className="text-green-300 text-xs mt-1">
              {analytics.correctAnswers} got it right
            </p>
          </motion.div>
        </div>

        {/* Answer Distribution */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
        >
          <h3 className="text-xl font-bold text-white mb-4">📈 How Everyone Answered</h3>
          <div className="space-y-3">
            {sortedOptions.map((option, index) => (
              <motion.div
                key={option.optionId}
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">
                      {option.isCorrect ? "✅" : "❌"}
                    </span>
                    <span className={`text-sm font-semibold ${
                      option.isCorrect ? "text-green-300" : "text-white"
                    }`}>
                      {option.optionText}
                    </span>
                  </div>
                  <span className="text-white text-sm font-bold">
                    {option.count} ({option.percentage.toFixed(0)}%)
                  </span>
                </div>
                <div className="h-6 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${option.percentage}%` }}
                    transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
                    className={`h-full rounded-full ${
                      option.isCorrect
                        ? "bg-gradient-to-r from-green-400 to-green-600"
                        : "bg-gradient-to-r from-gray-400 to-gray-600"
                    }`}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Top 3 */}
        {analytics.top3.length > 0 && (
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
          >
            <h3 className="text-xl font-bold text-white mb-4 text-center">🏆 Top 3</h3>
            <div className="grid grid-cols-3 gap-3">
              {analytics.top3.map((entry, index) => (
                <motion.div
                  key={entry.participantId}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.7 + index * 0.1, type: "spring" }}
                  className={`p-4 rounded-lg text-center ${
                    entry.participantId === participantId
                      ? "bg-yellow-500/30 border-2 border-yellow-400"
                      : "bg-white/5"
                  }`}
                >
                  <div className="text-3xl mb-1">
                    {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                  </div>
                  <p className="text-white font-bold text-sm truncate">{entry.nickname}</p>
                  <p className="text-white text-lg font-bold">{entry.totalScore}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Waiting for Next Question */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center pt-4"
        >
          <div className="px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-xl">
            <p className="text-white font-semibold text-lg mb-2">⏳ Waiting for next question...</p>
            <p className="text-blue-200 text-sm">The host will advance when ready</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

// ===== ENHANCED WEBSOCKET HOOK =====
function useParticipantWebSocket(
  quizCode: string,
  participantId: string,
  nickname: string,
  avatarId: string,
  onGameState: (msg: any) => void,
  onQuestion: (msg: any) => void,
  onCompletion: (msg: any) => void,
  onLeaderboardUpdate: (leaderboard: LeaderboardEntry[]) => void,
  onScoreCelebration: (celebration: ScoreCelebration) => void,
  onRankUpdate: (rankUpdate: ParticipantRankUpdate) => void,
  onQuestionStats: (stats: QuestionStats) => void,
  onPersonalScoreUpdate: (scoreUpdate: PersonalScoreUpdate) => void,
  onAnswerFeedback: (feedback: AnswerFeedback) => void,
) {
  const stompRef = useRef<Client | null>(null)
  const questionStartTimeRef = useRef<number>(0)
  const [connectionStatus, setConnectionStatus] = useState("Connecting...")
  const [reconnectAttempts, setReconnectAttempts] = useState(0)

  // Use refs to store callbacks to prevent reconnection
  const onGameStateRef = useRef(onGameState)
  const onQuestionRef = useRef(onQuestion)
  const onCompletionRef = useRef(onCompletion)
  const onLeaderboardUpdateRef = useRef(onLeaderboardUpdate)
  const onScoreCelebrationRef = useRef(onScoreCelebration)
  const onRankUpdateRef = useRef(onRankUpdate)
  const onQuestionStatsRef = useRef(onQuestionStats)
  const onPersonalScoreUpdateRef = useRef(onPersonalScoreUpdate)
  const onAnswerFeedbackRef = useRef(onAnswerFeedback)

  // 

  const [showAnalytics, setShowAnalytics] = useState(false)
  // Update refs when callbacks change
  useEffect(() => {
    onGameStateRef.current = onGameState
    onQuestionRef.current = onQuestion
    onCompletionRef.current = onCompletion
    onLeaderboardUpdateRef.current = onLeaderboardUpdate
    onScoreCelebrationRef.current = onScoreCelebration
    onRankUpdateRef.current = onRankUpdate
    onQuestionStatsRef.current = onQuestionStats
    onPersonalScoreUpdateRef.current = onPersonalScoreUpdate
    onAnswerFeedbackRef.current = onAnswerFeedback
  }, [
    onGameState,
    onQuestion,
    onCompletion,
    onLeaderboardUpdate,
    onScoreCelebration,
    onRankUpdate,
    onQuestionStats,
    onPersonalScoreUpdate,
    onAnswerFeedback,
  ])

  const connect = useCallback(() => {
    if (!quizCode || !nickname || !participantId) return

    try {
      const sock = new SockJS(WEBSOCKET_CONFIG.url)
      const stomp = new Client({
        webSocketFactory: () => sock,
        reconnectDelay: WEBSOCKET_CONFIG.reconnectDelay,
        heartbeatIncoming: WEBSOCKET_CONFIG.heartbeatIncoming,
        heartbeatOutgoing: WEBSOCKET_CONFIG.heartbeatOutgoing,
        debug: (str) => console.log("[STOMP]", str),
        connectHeaders: {
          participantId: participantId,
        },
      })

      stomp.onConnect = () => {
        console.log("✅ WebSocket connected for participant:", nickname)
        setConnectionStatus("Connected")
        setReconnectAttempts(0)

        // Core game subscriptions with enhanced error handling
        const subscriptions = [
          stomp.subscribe(`/topic/session/${quizCode}/game-state`, (msg) => {
            const data = safeJsonParse(msg.body)
            if (data) {
              console.log("📢 Game state received:", data)
              onGameStateRef.current(data)
            }
          }),

          // Participant-specific question queue
          stomp.subscribe(`/user/queue/session/${quizCode}/question`, (msg) => {
            const message = safeJsonParse(msg.body)
            if (message) {
              console.log("❓ Participant-specific question received:", message)

              if (message.action === "NEXT_QUESTION" || message.question) {
                questionStartTimeRef.current = Date.now()
                onQuestionRef.current(message)
              } else if (message.action === "PARTICIPANT_COMPLETED") {
                onCompletionRef.current(message)
              }
            }
          }),

          // Handle TIME_UP notifications from backend
          stomp.subscribe(`/user/queue/session/${quizCode}/time-up`, (msg) => {
            const timeUpMessage = safeJsonParse(msg.body)
            if (timeUpMessage) {
              console.log("⏰ TIME_UP notification received from server:", timeUpMessage)
              // Show time-up warning but keep buttons enabled
              setFeedback({ timeUp: true, canStillAnswer: true })
            }
          }),

          // Broadcast questions for SYNC mode
stomp.subscribe(`/topic/session/${quizCode}/questions`, (msg) => {
  const message = safeJsonParse(msg.body)
  if (message) {
    console.log("❓ Broadcast question received:", message)
    questionStartTimeRef.current = Date.now()
    onQuestionRef.current(message)
  }
}),

          // Enhanced leaderboard updates
          stomp.subscribe(`/topic/session/${quizCode}/leaderboard`, (msg) => {
            const data = safeJsonParse(msg.body)
            if (data) {
              console.log("🏆 Leaderboard update received:", data)

              let entries: LeaderboardEntry[] = []
              if (data.leaderboard?.entries) {
                entries = data.leaderboard.entries
              } else if (data.entries) {
                entries = data.entries
              } else if (Array.isArray(data)) {
                entries = data
              }

              if (Array.isArray(entries)) {
                onLeaderboardUpdateRef.current(entries)
              }
            }
          }),

          // Score celebrations
          stomp.subscribe(`/topic/session/${quizCode}/celebration`, (msg) => {
            const celebration = safeJsonParse(msg.body)
            if (celebration && celebration.participantId) {
              console.log("🎉 Score celebration received:", celebration)
              onScoreCelebrationRef.current(celebration)
            }
          }),

          // Personal rank updates
          stomp.subscribe(`/user/queue/session/${quizCode}/ranking`, (msg) => {
            const rankUpdate = safeJsonParse(msg.body)
            if (rankUpdate && rankUpdate.participantId) {
              console.log("📈 Rank update received:", rankUpdate)
              onRankUpdateRef.current(rankUpdate)
            }
          }),

          // Question statistics
          stomp.subscribe(`/topic/session/${quizCode}/live-stats`, (msg) => {
            const stats = safeJsonParse(msg.body)
            if (stats) {
              console.log("📊 Question stats received:", stats)
              onQuestionStatsRef.current(stats)
            }
          }),

          // Personal score updates
          stomp.subscribe(`/user/queue/session/${quizCode}/score`, (msg) => {
            const scoreUpdate = safeJsonParse(msg.body)
            if (scoreUpdate && scoreUpdate.participantId) {
              console.log("💰 Personal score update received:", scoreUpdate)
              onPersonalScoreUpdateRef.current(scoreUpdate)
            }
          }),

          // Enhanced answer feedback - FIXED INTEGRATION
          stomp.subscribe(`/user/queue/session/${quizCode}/feedback`, (msg) => {
            const feedback = safeJsonParse(msg.body)
            if (feedback && feedback.participantId) {
              console.log("📝 Answer feedback received:", feedback)
              onAnswerFeedbackRef.current(feedback)
            }
          }),
        ]

        console.log("✅ WebSocket connected - all subscriptions ready")
      }

      stomp.onStompError = (frame) => {
        console.error("❌ STOMP error:", frame.headers?.message || frame.body)
        setConnectionStatus("Error")

        // Retry connection if not exceeded max attempts
        if (reconnectAttempts < WEBSOCKET_CONFIG.maxReconnectAttempts) {
          setTimeout(() => {
            setReconnectAttempts((prev) => prev + 1)
            connect()
          }, WEBSOCKET_CONFIG.reconnectDelay)
        }
      }

      stomp.onDisconnect = () => {
        console.warn("⚠️ WebSocket disconnected")
        setConnectionStatus("Disconnected")
      }

      stomp.activate()
      stompRef.current = stomp
    } catch (error) {
      console.error("❌ WebSocket setup error:", error)
      setConnectionStatus("Error")
    }
  }, [quizCode, participantId, nickname, avatarId, reconnectAttempts])

  useEffect(() => {
    connect()

    return () => {
      console.log("🔌 Disconnecting WebSocket")
      stompRef.current?.deactivate()
    }
  }, [connect])

  const sendAnswer = useCallback(
    (optionId: string, questionId: string) => {
      if (!stompRef.current?.connected) {
        console.error("⚠️ WebSocket not connected")
        return false
      }

      const responseTime = Math.floor((Date.now() - questionStartTimeRef.current) / 1000)

      const answerPayload = {
        participantId,
        questionId,
        selectedOptionId: optionId,
        responseTime,
      }

      console.log("📤 Sending answer:", answerPayload)

      try {
        stompRef.current.publish({
          destination: `/app/session/${quizCode}/answer`,
          headers: { "content-type": "application/json" },
          body: JSON.stringify(answerPayload),
        })
        return true
      } catch (error) {
        console.error("❌ Failed to send answer:", error)
        return false
      }
    },
    [quizCode, participantId],
  )

  return { sendAnswer, connectionStatus }
}


// ===== MAIN COMPONENT =====
export default function ParticipantQuizFixed() {
  const params = useParams()
  const sessionCode = params?.sessionCode as string

  // Join form state
  const [joined, setJoined] = useState(false)
  const [nickname, setNickname] = useState("")
  const [avatarId, setAvatarId] = useState("")
  const [participantId, setParticipantId] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  // Game state
  const [gameState, setGameState] = useState<any>(null)
  const [status, setStatus] = useState<
    "LOBBY" | "COUNTDOWN" | "PLAY" | "ANSWER_REVEAL" | "RESULTS" | "COMPLETED" | "END"
  >("LOBBY")
  const [currentQuestion, setCurrentQuestion] = useState<any>(null)
  const [questionNumber, setQuestionNumber] = useState<number>(0)
  const [totalQuestions, setTotalQuestions] = useState<number>(0)
  const [timeLeft, setTimeLeft] = useState<number>(30)
  const [answerSelected, setAnswerSelected] = useState<string | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [feedback, setFeedback] = useState<any>(null)

  // Enhanced real-time state
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [celebrations, setCelebrations] = useState<ScoreCelebration[]>([])
  const [currentCelebration, setCurrentCelebration] = useState<ScoreCelebration | null>(null)
  const [rankUpdate, setRankUpdate] = useState<ParticipantRankUpdate | null>(null)
  const [questionStats, setQuestionStats] = useState<QuestionStats | null>(null)

  // Enhanced personal stats
  const [personalScore, setPersonalScore] = useState<number>(0)
  const [personalRank, setPersonalRank] = useState<number>(0)
  const [scoreChange, setScoreChange] = useState<number | undefined>(undefined)
  const [answerFeedback, setAnswerFeedback] = useState<AnswerFeedback | null>(null)
  const [streak, setStreak] = useState<number>(0)
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false)
  const [questionAnalytics, setQuestionAnalytics] = useState<QuestionAnalyticsData | null>(null)
  const [showAnalytics, setShowAnalytics] = useState(false)

  // Fetch question analytics
  async function fetchQuestionAnalytics() {
    try {
      console.log("📊 Fetching question analytics for session:", sessionCode)
      const response = await axios.get(
        `https://stackquiz-api.stackquiz.me/api/v1/participants/session/${sessionCode}/question-analytics`
      )
      console.log("✅ Analytics fetched:", response.data)
      setQuestionAnalytics(response.data)
      setShowAnalytics(true)
    } catch (err: any) {
      console.error("❌ Failed to fetch analytics:", err)
      // If analytics fail, just continue to next question
      setShowAnalytics(false)
    }
  }

  // Handle join submission
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (!nickname.trim()) {
      return setError("Nickname is required")
    }
    if (!avatarId.trim()) {
      return setError("Avatar ID is required")
    }

    setIsSubmitting(true)
    try {
      const res = await axios.post("https://stackquiz-api.stackquiz.me/api/v1/participants/join", {
        quizCode: sessionCode,
        nickname: nickname.trim(),
        avatarId: avatarId.trim(),
      })

      console.log("✅ Successfully joined:", res.data)
      setParticipantId(res.data.id)
      setPersonalScore(res.data.totalScore || 0)
      setJoined(true)
    } catch (err: any) {
      console.error("❌ Join failed:", err)
      setError(err.response?.data?.message || "Failed to join session. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Enhanced WebSocket connection with all callbacks
  const { sendAnswer, connectionStatus } = useParticipantWebSocket(
    joined ? (sessionCode as string) : "",
    joined ? participantId : "",
    joined ? nickname : "",
    joined ? avatarId : "",
    (msg) => {
      console.log("📢 Game state update:", msg)
      setGameState(msg)
    },
    (qmsg) => {
      console.log("❓ New question received:", qmsg)

      const question = qmsg.question || qmsg
      const qNumber = qmsg.questionNumber || qmsg.currentQuestion || 0
      const total = qmsg.totalQuestions || 0
      const timeLimit = qmsg.timeLimit || 30

      setCurrentQuestion(question)
      setQuestionNumber(qNumber)
      setTotalQuestions(total)
      setTimeLeft(timeLimit)
      setAnswerSelected(null)
      setFeedback(null)
      setShowFeedback(false)
      setAnswerFeedback(null)
      setIsSubmittingAnswer(false) // FIXED: Reset submitting state for new question
      setShowAnalytics(false) // Reset analytics state for new question
      setQuestionAnalytics(null)
      setStatus("PLAY")
    },
    (cmsg) => {
      console.log("🎉 Completion message received:", cmsg)
      setStatus("COMPLETED")
    },
    // Leaderboard update callback
    (leaderboardEntries) => {
      console.log("🏆 Updating leaderboard:", leaderboardEntries)
      setLeaderboard(leaderboardEntries)

      // Update personal rank from leaderboard
      const currentParticipant = leaderboardEntries.find((entry) => entry.participantId === participantId)
      if (currentParticipant) {
        setPersonalRank(currentParticipant.position)
        setPersonalScore(currentParticipant.totalScore)
        if (currentParticipant.streak) {
          setStreak(currentParticipant.streak)
        }
      }
    },
    // Score celebration callback
    (celebration) => {
      console.log("🎉 Score celebration:", celebration)
      setCelebrations((prev) => [...prev, celebration])

      if (celebration.participantId === participantId) {
        setCurrentCelebration(celebration)
        setPersonalScore(celebration.newTotalScore)
        setPersonalRank(celebration.newRank)
      }

      setTimeout(() => {
        setCelebrations((prev) => prev.filter((c) => c.participantId !== celebration.participantId))
      }, 3000)
    },
    // Rank update callback
    (rankUpdate) => {
      console.log("📈 Rank update:", rankUpdate)
      if (rankUpdate.participantId === participantId) {
        setRankUpdate(rankUpdate)
        setPersonalRank(rankUpdate.currentRank)
        setPersonalScore(rankUpdate.currentScore)
        setTimeout(() => setRankUpdate(null), 3000)
      }
    },
    // Question stats callback
    (stats) => {
      console.log("📊 Question stats:", stats)
      setQuestionStats(stats)
    },
    // Personal score update callback
    (scoreUpdate) => {
      console.log("💰 Personal score update:", scoreUpdate)
      if (scoreUpdate.participantId === participantId) {
        setPersonalScore(scoreUpdate.newScore)
        setPersonalRank(scoreUpdate.currentRank)

        if (scoreUpdate.pointsEarned !== 0) {
          setScoreChange(scoreUpdate.pointsEarned)
          setTimeout(() => setScoreChange(undefined), 2000)
        }

        if (scoreUpdate.streak) {
          setStreak(scoreUpdate.streak)
        }
      }
    },
    // FIXED: Answer feedback callback - now properly integrated
    (feedback) => {
      console.log("📝 Answer feedback received:", feedback)
      if (feedback.participantId === participantId) {
        setAnswerFeedback(feedback)
        setPersonalScore(feedback.newTotalScore)
        setPersonalRank(feedback.currentRank)

        if (feedback.streak) {
          setStreak(feedback.streak)
        }

        // Transition to answer reveal phase
        setStatus("ANSWER_REVEAL")
        setIsSubmittingAnswer(false)

        // Note: Analytics are already fetched in handleAnswer as a workaround
        // This callback is kept for future backend compatibility when feedback is sent properly
      }
    },
  )

  // Handle game state changes
  useEffect(() => {
    if (!gameState) return

    console.log("Processing game state:", gameState.action, gameState.status)

    if (gameState.action === "SESSION_STARTED" || gameState.status === "IN_PROGRESS") {
      if (!currentQuestion && status !== "ANSWER_REVEAL") {
        setStatus("PLAY")
      }
    } else if (gameState.action === "SESSION_ENDED" || gameState.status === "ENDED") {
      setStatus("END")
    } else if (gameState.action === "SESSION_LOBBY" || gameState.status === "WAITING") {
      setStatus("LOBBY")
    }
  }, [gameState, currentQuestion, status])

  // Enhanced timer countdown with server sync
  useEffect(() => {
    if (
      timeLeft > 0 &&
      status === "PLAY" &&
      currentQuestion &&
      !answerSelected &&
      !showFeedback &&
      !isSubmittingAnswer
    ) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && status === "PLAY" && !answerSelected && !isSubmittingAnswer) {
      handleTimeUp()
    }
  }, [timeLeft, status, currentQuestion, answerSelected, showFeedback, isSubmittingAnswer])

  // Handle time up
  function handleTimeUp() {
    console.log("⏰ Time's up! Participant can still answer for base points.")

    setFeedback({ timeUp: true, canStillAnswer: true })
  }

  // Enhanced answer handling
  function handleAnswer(optionId: string) {
    // Only check if already answered or currently submitting
    if (!currentQuestion || answerSelected || isSubmittingAnswer) {
      console.warn("⚠️ Cannot answer: already answered or submitting")
      return
    }

    console.log("✅ Answering question:", currentQuestion.id, "with option:", optionId)
    setAnswerSelected(optionId)
    setIsSubmittingAnswer(true)

    const success = sendAnswer(optionId, currentQuestion.id)
    if (success) {
      setShowFeedback(true)
      setFeedback({ submitted: true })
      
      // ✅ WORKAROUND: Since backend doesn't send feedback reliably, fetch analytics after delay
      setTimeout(() => {
        console.log("⏰ Timeout reached, fetching analytics...")
        setIsSubmittingAnswer(false)
        fetchQuestionAnalytics()
      }, 2000) // Wait 2 seconds to show "Answer submitted" message
    } else {
      setAnswerSelected(null)
      setIsSubmittingAnswer(false)
      setError("Failed to submit answer. Please try again.")
    }
  }
  // Handle continue from answer reveal
  function handleContinueFromReveal() {
    setStatus("PLAY")
    setAnswerFeedback(null)
    setAnswerSelected(null)
    setShowFeedback(false)
    setFeedback(null)
  }

  // Handle continue from analytics
  function handleContinueFromAnalytics() {
    setShowAnalytics(false)
    setQuestionAnalytics(null)
    setStatus("PLAY")
    setAnswerFeedback(null)
    setAnswerSelected(null)
    setShowFeedback(false)
    setFeedback(null)
  }

  // Join form UI
  if (!joined) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        {/* Session code in top right */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-6 right-6 bg-white rounded-full px-6 py-3 shadow-lg"
        >
          <span className="text-gray-800 font-bold text-lg">{sessionCode}</span>
        </motion.div>

        {/* Close button top left */}
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-6 left-6 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors"
        >
          <span className="text-2xl">✕</span>
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-700/80 backdrop-blur-md rounded-3xl shadow-2xl p-8 w-full max-w-md"
        >
          <div className="text-center mb-6">
            <h2 className="text-white text-2xl font-semibold mb-2">Your nickname is ...</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-6 py-4 bg-white text-gray-800 rounded-2xl focus:outline-none focus:ring-4 focus:ring-white/30 transition-all text-center text-lg"
              maxLength={20}
              required
            />

            <input
              value={avatarId}
              onChange={(e) => setAvatarId(e.target.value)}
              placeholder="Avatar ID"
              className="w-full px-6 py-4 bg-white text-gray-800 rounded-2xl focus:outline-none focus:ring-4 focus:ring-white/30 transition-all text-center text-sm font-mono"
              required
            />

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-500/20 border border-red-400 rounded-xl text-center"
              >
                <p className="text-red-200 text-sm">{error}</p>
              </motion.div>
            )}

            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 rounded-2xl font-bold text-xl text-blue-900 shadow-lg transition-all duration-200 disabled:opacity-50"
              style={{
                background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
              }}
            >
              {isSubmitting ? "Joining..." : "Start"}
            </motion.button>
          </form>
        </motion.div>
      </div>
    )
  }

  // Connection status indicator
  const connectionIndicator = connectionStatus !== "Connected" && (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 p-3 text-center text-white font-semibold ${
        connectionStatus === "Connecting..."
          ? "bg-yellow-600"
          : connectionStatus === "Disconnected"
            ? "bg-red-600"
            : "bg-red-700"
      }`}
    >
      {connectionStatus === "Connecting..." && "🔄 Connecting..."}
      {connectionStatus === "Disconnected" && "⚠️ Connection lost - Reconnecting..."}
      {connectionStatus === "Error" && "❌ Connection error - Please refresh"}
    </motion.div>
  )

  // Quiz ended
  if (status === "END") {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        {connectionIndicator}
        <div className="w-full max-w-6xl">
          <Rank leaderboard={leaderboard} />
        </div>
      </div>
    )
  }

  // Participant completed
  if (status === "COMPLETED") {
    return (
      <div
        className="min-h-screen flex items-center justify-center relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        {connectionIndicator}

        {/* Close button */}
        <button className="absolute top-6 left-6 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors">
          <span className="text-2xl">✕</span>
        </button>

        {/* STACKQUIZZ logo */}
        <div className="absolute top-6 right-6 flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-500 rounded-lg"></div>
          <span className="text-white font-bold text-xl">STACKQUIZZ</span>
        </div>

        <div className="text-center max-w-2xl px-6 z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white text-5xl font-bold mb-6"
          >
            Summary
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <div className="inline-flex items-center gap-2 bg-purple-800/50 border-2 border-purple-400 rounded-full px-6 py-2">
              <span className="text-white">👤</span>
              <span className="text-white font-semibold">Solo review</span>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-white text-xl mb-8"
          >
            Congratulations, you finished the quiz.
          </motion.p>

          {/* Stats cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4 mb-8"
          >
            {/* Accuracy bar */}
            <div className="bg-black/40 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white font-semibold">Accuracy</span>
                <span className="text-white font-bold">85%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-green-400 to-red-400 h-3 rounded-full"
                  style={{ width: "85%" }}
                ></div>
              </div>
            </div>

            {/* Rank and Score */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-black/40 rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-sm mb-1">Rank</p>
                    <p className="text-white text-3xl font-bold">
                      {personalRank}/{leaderboard.length}
                    </p>
                  </div>
                  <span className="text-4xl">🏆</span>
                </div>
              </div>
              <div className="bg-black/40 rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-sm mb-1">Score</p>
                    <p className="text-white text-3xl font-bold">{personalScore}</p>
                  </div>
                  <span className="text-4xl">🪙</span>
                </div>
              </div>
            </div>

            {/* Find new quiz button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 rounded-2xl font-bold text-xl text-blue-900 shadow-lg"
              style={{
                background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
              }}
            >
              Find new quiz
            </motion.button>

            {/* Performance stats */}
            <div className="text-white text-lg font-semibold mb-4">Performance stats</div>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-black/40 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-white mb-1">{totalQuestions - 1}</p>
                <p className="text-white/70 text-sm">Correct</p>
              </div>
              <div className="bg-black/40 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-white mb-1">0</p>
                <p className="text-white/70 text-sm">partially correct</p>
              </div>
              <div className="bg-black/40 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-red-400 mb-1">1</p>
                <p className="text-white/70 text-sm">InCorrect</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-3">
              <div className="bg-black/40 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-white mb-1">{streak}</p>
                <p className="text-white/70 text-sm">Streak</p>
              </div>
              <div className="bg-black/40 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-white mb-1">4s</p>
                <p className="text-white/70 text-sm">Time/ques</p>
              </div>
            </div>

            {/* Feedback and Report buttons */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <button className="py-3 bg-purple-700/50 border-2 border-purple-400 rounded-xl text-white font-semibold hover:bg-purple-700/70 transition-colors flex items-center justify-center gap-2">
                <span>💬</span> Feedback
              </button>
              <button className="py-3 bg-purple-700/50 border-2 border-purple-400 rounded-xl text-white font-semibold hover:bg-purple-700/70 transition-colors flex items-center justify-center gap-2">
                <span>📊</span> Report
              </button>
            </div>
          </motion.div>
        </div>

        <LiveRankingPanel
          personalScore={personalScore}
          personalRank={personalRank}
          nickname={nickname}
          leaderboard={leaderboard}
          currentParticipantId={participantId}
          isMinimized={false}
          streak={streak}
        />
      </div>
    )
  }

  // Waiting in lobby
  if (status === "LOBBY") {
    return (
      <div
        className="min-h-screen flex items-center justify-center relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        {connectionIndicator}

        <div className="text-center max-w-2xl px-6 z-10">
          {/* Rocket icon */}
          <motion.div
            initial={{ scale: 0, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="text-9xl mb-8"
          >
            🚀
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white text-4xl font-bold mb-4"
          >
            Waiting for the Host
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-white/90 text-xl mb-12"
          >
            Hang tight, the quiz will start soon
          </motion.p>

          {/* Participant avatar */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
            className="inline-block relative"
          >
            <div className="w-32 h-32 bg-gray-700/80 backdrop-blur-sm rounded-2xl flex items-center justify-center border-4 border-white/20 shadow-2xl">
              <span className="text-6xl">👤</span>
            </div>
            {/* Edit icon */}
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
              <span className="text-sm">✏️</span>
            </div>
            {/* Nickname label */}
            <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-gray-800 border-2 border-white/30 px-4 py-1 rounded-full whitespace-nowrap">
              <span className="text-white font-bold">{nickname}</span>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  // Playing - waiting for question
  if (status === "PLAY" && !currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-purple-800 to-indigo-900 text-white relative">
        {connectionIndicator}
        <div className="text-center max-w-2xl px-6 z-10">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
            className="text-6xl mb-6"
          >
            🕐
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold mb-4">
            Get Ready!
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl"
          >
            Your next question is loading...
          </motion.p>
        </div>

        <LiveRankingPanel
          personalScore={personalScore}
          personalRank={personalRank}
          nickname={nickname}
          leaderboard={leaderboard}
          currentParticipantId={participantId}
          isMinimized={true}
          streak={streak}
        />
      </div>
    )
  }

  // ENHANCED: Answer reveal phase - NEW KAHOOT-STYLE FEATURE
  if (status === "ANSWER_REVEAL" && answerFeedback) {
    const isCorrect = answerFeedback.isCorrect

    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        {connectionIndicator}

        {/* Question number indicator */}
        <div className="absolute top-6 left-6 w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg">
          <span className="text-gray-800 font-bold text-xl">{questionNumber}</span>
        </div>

        <div className="text-center max-w-2xl px-6 z-10">
          {/* Large icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="mb-8"
          >
            <div
              className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center ${
                isCorrect ? "bg-green-500" : "bg-red-400"
              } shadow-2xl`}
            >
              <span className="text-white text-6xl">{isCorrect ? "✓" : "✕"}</span>
            </div>
          </motion.div>

          {/* Result text */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-white text-5xl font-bold mb-6"
          >
            {isCorrect ? "Correct" : "Incorrect"}
          </motion.h1>

          {/* Points earned */}
          {answerFeedback.pointsEarned > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, type: "spring", stiffness: 300 }}
              className="mb-6"
            >
              <div className="inline-block bg-gray-700/80 backdrop-blur-sm rounded-2xl px-8 py-4 shadow-xl">
                <span className="text-white text-4xl font-bold">+{answerFeedback.pointsEarned}</span>
              </div>
            </motion.div>
          )}

          {/* Podium message */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="text-white text-xl mb-8"
          >
            you are on the podium!
          </motion.p>

          {/* Continue button (auto-advance after delay) */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}>
            <button
              onClick={handleContinueFromReveal}
              className="px-8 py-4 bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white rounded-2xl font-semibold text-lg hover:bg-white/30 transition-all"
            >
              Continue →
            </button>
          </motion.div>
        </div>

        <LiveRankingPanel
          personalScore={personalScore}
          personalRank={personalRank}
          nickname={nickname}
          leaderboard={leaderboard}
          currentParticipantId={participantId}
          isMinimized={true}
          streak={streak}
        />
      </div>
    )
  }

  // Show analytics after answer reveal
  if (showAnalytics && questionAnalytics) {
    return (
      <ParticipantQuestionAnalytics
        analytics={questionAnalytics}
        participantId={participantId}
      />
    )
  }

  // Playing - showing question
  if (status === "PLAY" && currentQuestion) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center py-8 px-4 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        {connectionIndicator}

        <LiveRankingPanel
          personalScore={personalScore}
          personalRank={personalRank}
          nickname={nickname}
          leaderboard={leaderboard}
          currentParticipantId={participantId}
          isMinimized={true}
          streak={streak}
        />

        {/* Question number indicator */}
        <div className="absolute top-6 left-6 w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg">
          <span className="text-gray-800 font-bold text-xl">{questionNumber}</span>
        </div>

        <div className="max-w-4xl w-full space-y-6 z-10">
          {/* Timer */}
          <QuestionTimer
            timeRemaining={timeLeft}
            timeLimit={30}
            isActive={!answerSelected && !showFeedback && !isSubmittingAnswer}
            onTimeUp={handleTimeUp}
          />

          {/* Question Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-white bg-gray-700/60 backdrop-blur-sm rounded-3xl p-8 shadow-xl"
          >
            <h1 className="text-2xl md:text-3xl font-bold leading-tight">
              {currentQuestion.text || currentQuestion.questionText}
            </h1>
          </motion.div>

          {/* Answer Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(currentQuestion.options || []).map((option: any, index: number) => {
              const isSelected = answerSelected === option.id
              const isDisabled =
                answerSelected !== null || (showFeedback && !feedback?.canStillAnswer) || isSubmittingAnswer

              return (
                <motion.button
                  key={option.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={!isDisabled ? { scale: 1.02 } : {}}
                  whileTap={!isDisabled ? { scale: 0.98 } : {}}
                  onClick={() => handleAnswer(option.id)}
                  disabled={isDisabled}
                  className={`p-6 rounded-2xl text-left font-semibold text-lg transition-all duration-200 ${
                    isSelected
                      ? "bg-white text-gray-800 shadow-2xl transform scale-105"
                      : isDisabled
                        ? "bg-gray-600/40 text-gray-400 cursor-not-allowed"
                        : "bg-gray-700/60 backdrop-blur-sm text-white hover:bg-gray-600/60 shadow-lg"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xl ${
                        isSelected ? "bg-gray-800 text-white" : "bg-white/20 text-white"
                      }`}
                    >
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="flex-1">{option.text || option.optionText}</span>
                  </div>
                </motion.button>
              )
            })}
          </div>

          {/* Feedback messages */}
          {showFeedback && feedback?.submitted && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded-2xl text-center"
            >
              <p className="text-white font-semibold">
                {isSubmittingAnswer ? "📤 Submitting answer..." : "✅ Answer submitted! Loading results..."}
              </p>
            </motion.div>
          )}

          {feedback?.timeUp && !answerSelected && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-yellow-500/20 backdrop-blur-sm border-2 border-yellow-400/50 rounded-2xl text-center"
            >
              <p className="text-white font-semibold">⏰ Time is up!</p>
              <p className="text-white/80 text-sm mt-1">You can still answer for base points</p>
            </motion.div>
          )}
        </div>

        {/* Score change animation */}
        <AnimatePresence>
          {scoreChange && scoreChange !== 0 && (
            <motion.div
              initial={{ opacity: 0, y: -50, scale: 0.5 }}
              animate={{ opacity: 1, y: -100, scale: 1 }}
              exit={{ opacity: 0, y: -150, scale: 0.5 }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
            >
              <div
                className={`text-6xl font-bold ${
                  scoreChange > 0 ? "text-green-400" : "text-red-400"
                } drop-shadow-[0_0_20px_rgba(0,0,0,0.9)]`}
              >
                {scoreChange > 0 ? "+" : ""}
                {scoreChange}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  return null
} 

function setFeedback(arg0: { timeUp: boolean; canStillAnswer: boolean }) {
  throw new Error("Function not implemented.")
}
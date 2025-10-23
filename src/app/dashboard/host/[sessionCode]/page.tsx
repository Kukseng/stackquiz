"use client"
import type React from "react"
import { useCallback, useState, useEffect, useRef } from "react"
import { useParams } from "next/navigation"
import { Client } from "@stomp/stompjs"
import SockJS from "sockjs-client"
import { QRCodeCanvas } from "qrcode.react"
import { motion, AnimatePresence } from "framer-motion"
import { getSession } from "next-auth/react"
import { Link } from "lucide-react"

// Enhanced interfaces for better type safety - Updated to match backend DTOs
interface LeaderboardEntry {
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

interface EnhancedLeaderboard {
  sessionId: string
  entries: LeaderboardEntry[]
  totalParticipants: number
  lastUpdated: number
  status: string
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
}

// NEW: Host Dashboard Response interface matching backend
interface HostDashboardData {
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

// Participant Progress Interfaces
interface ParticipantAnswer {
  questionNumber: number
  isCorrect: boolean
  answered: boolean
  pointsEarned: number
  timeSpent?: number
}

interface DetailedParticipantProgress {
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

// FIXED: NextAuth authentication helper functions
const getAuthHeaders = async () => {
  try {
    const session = await getSession()
    const token = (session as any)?.apiAccessToken

    if (!token) {
      console.warn("⚠️ No authentication token found in session. Please login first.")
      return {}
    }

    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    }
  } catch (error) {
    console.error("❌ Error getting session:", error)
    return {}
  }
}

const checkAuthToken = async () => {
  try {
    const session = await getSession()
    const token = (session as any)?.apiAccessToken
    return !!token
  } catch (error) {
    console.error("❌ Error checking auth token:", error)
    return false
  }
}

// FIXED: WebSocket URL helper function
const getWebSocketUrl = () => {
  // For local development
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname

    // Local development URLs
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return "https://stackquiz-api.stackquiz.me/ws"
    }
  }

  // Use environment variable or fallback to production
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  if (apiUrl) {
    // Remove /api/v1 or /api and replace with /ws
    // Ensure we use https:// not wss://
    const wsUrl = apiUrl
      .replace(/\/api\/v1\/?$/, "") // Remove /api/v1 or /api/v1/
      .replace(/\/api\/?$/, "") // Remove /api or /api/
      .replace(/\/v1\/?$/, "") // Remove any trailing /v1 or /v1/

    // Append /ws (not /ws/v1)
    return `${wsUrl}/ws`
  }

  // Production fallback - use https:// not wss://
  return "https://stackquiz-api.stackquiz.me/ws"
}

// FIXED: API Base URL helper function
const getApiBaseUrl = () => {
  // For local development
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname

    // Local development URLs
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return "https://stackquiz-api.stackquiz.me/api"
    }
  }

  const envUrl = process.env.NEXT_PUBLIC_API_URL || "https://stackquiz-api.stackquiz.me/api"
  // Remove trailing /v1 if present since all endpoints already include /v1/
  return envUrl.replace(/\/v1\/?$/, "")
}

// Session Code Input Component
function SessionCodeInput({
  sessionCode,
  setSessionCode,
  onConnect,
}: {
  sessionCode: string
  setSessionCode: (code: string) => void
  onConnect: () => void
}) {
  const [inputCode, setInputCode] = useState(sessionCode)
  const [isConnecting, setIsConnecting] = useState(false)
  const [authWarning, setAuthWarning] = useState(false)

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      const hasToken = await checkAuthToken()
      if (!hasToken) {
        setAuthWarning(true)
      }
    }
    checkAuth()
  }, [])

  const handleConnect = async () => {
    if (!inputCode.trim()) {
      alert("Please enter a session code")
      return
    }

    const hasToken = await checkAuthToken()
    if (!hasToken) {
      alert("Please login first to access the host dashboard")
      return
    }

    setIsConnecting(true)
    setSessionCode(inputCode.trim().toUpperCase())

    // Simulate connection delay
    setTimeout(() => {
      setIsConnecting(false)
      onConnect()
    }, 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleConnect()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-8 shadow-2xl max-w-md mx-auto"
    >
      <div className="text-center mb-6">
        <div className="text-6xl mb-4">🎮</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Host Quiz Dashboard</h2>
        <p className="text-gray-600">Enter your session code from the database</p>
      </div>

      {/* Authentication Warning */}
      {authWarning && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <span className="text-yellow-600">⚠️</span>
            <span className="text-sm text-yellow-800">Please make sure you&apos;re logged in before connecting</span>
          </div>
        </div>
      )}

      {/* Connection Info */}
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="text-sm text-blue-800">
          <div className="font-medium mb-1">🔗 Connection Info:</div>
          <div className="text-xs space-y-1">
            <div>WebSocket: {getWebSocketUrl()}</div>
            <div>API: {getApiBaseUrl()}</div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Session Code</label>
          <input
            type="text"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value.toUpperCase())}
            onKeyPress={handleKeyPress}
            placeholder="Enter session code (e.g., E20E84)"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-lg text-center tracking-wider"
            maxLength={10}
            disabled={isConnecting}
          />
          <p className="text-xs text-gray-500 mt-1">Copy the session code from your database</p>
        </div>

        <motion.button
          onClick={handleConnect}
          disabled={isConnecting || !inputCode.trim()}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg font-semibold text-lg hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
        >
          {isConnecting ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Connecting...</span>
            </div>
          ) : (
            "🚀 Connect to Session"
          )}
        </motion.button>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            Make sure the session exists in your database and you&apos;re logged in
          </p>
        </div>
      </div>
    </motion.div>
  )
}

// Enhanced Quiz Settings Modal - Updated to use backend SessionTimingRequest
function QuizSettingsModal({ isOpen, onClose, onStart }: any) {
  const [settings, setSettings] = useState({
    mode: "SYNC",
    scheduledStartTime: "",
    scheduledEndTime: "",
    defaultQuestionTimeLimit: 30,
    autoAdvanceQuestions: false,
    allowLateJoining: true,
    shuffleQuestions: false,
    showCorrectAnswers: true,
    showTimer: true,
    maxParticipants: 100,
  })

  if (!isOpen) return null

  const handleStart = () => {
  const timingRequest = {
  scheduledStartTime: settings.scheduledStartTime ? new Date(settings.scheduledStartTime).toISOString() : null,
  scheduledEndTime: settings.scheduledEndTime ? new Date(settings.scheduledEndTime).toISOString() : null,
  defaultQuestionTimeLimit: settings.defaultQuestionTimeLimit,
  autoAdvanceQuestions: settings.autoAdvanceQuestions,
  allowLateJoining: settings.allowLateJoining,
  showTimer: settings.showTimer,
  
  // ✅ ADD THESE:
  mode: settings.mode,  // ← REQUIRED!
  maxParticipants: settings.maxParticipants,
  shuffleQuestions: settings.shuffleQuestions,
  showCorrectAnswers: settings.showCorrectAnswers,
}


  onStart(timingRequest)
  onClose()
}


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-800">🎮 Quiz Settings</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Quiz Mode */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Quiz Mode</label>
            <select
              value={settings.mode}
              onChange={(e) => setSettings({ ...settings, mode: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="SYNC">🎯 Synchronous (Real-time)</option>
              <option value="ASYNC">⏱️ Asynchronous (Self-paced)</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              {settings.mode === "SYNC"
                ? "Host controls question progression - best for real-time engagement"
                : "Participants progress at their own pace"}
            </p>
          </div>

          {/* Time Settings */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Question Time Limit (seconds)</label>
            <input
              type="number"
              min="5"
              max="300"
              value={settings.defaultQuestionTimeLimit}
              onChange={(e) => setSettings({ ...settings, defaultQuestionTimeLimit: Number.parseInt(e.target.value) })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Recommended: 30s for multiple choice, 60s for complex questions
            </p>
          </div>

          {/* Scheduled Start Time */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Scheduled Start Time (Optional)</label>
            <input
              type="datetime-local"
              value={settings.scheduledStartTime}
              onChange={(e) => setSettings({ ...settings, scheduledStartTime: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Scheduled End Time */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Scheduled End Time (Optional)</label>
            <input
              type="datetime-local"
              value={settings.scheduledEndTime}
              onChange={(e) => setSettings({ ...settings, scheduledEndTime: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Enhanced Checkboxes */}
        <div className="mt-6 space-y-3">
          <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer">
            <input
              type="checkbox"
              checked={settings.allowLateJoining}
              onChange={(e) => setSettings({ ...settings, allowLateJoining: e.target.checked })}
              className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
            />
            <div>
              <span className="text-sm font-medium text-gray-700">Allow late joins</span>
              <p className="text-xs text-gray-500">Participants can join after the quiz starts</p>
            </div>
          </label>

          <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer">
            <input
              type="checkbox"
              checked={settings.autoAdvanceQuestions}
              onChange={(e) => setSettings({ ...settings, autoAdvanceQuestions: e.target.checked })}
              className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
            />
            <div>
              <span className="text-sm font-medium text-gray-700">Auto-advance questions</span>
              <p className="text-xs text-gray-500">Automatically move to next question when time expires</p>
            </div>
          </label>

          <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer">
            <input
              type="checkbox"
              checked={settings.showTimer}
              onChange={(e) => setSettings({ ...settings, showTimer: e.target.checked })}
              className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
            />
            <div>
              <span className="text-sm font-medium text-gray-700">Show timer</span>
              <p className="text-xs text-gray-500">Display countdown timer to participants</p>
            </div>
          </label>

          <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer">
            <input
              type="checkbox"
              checked={settings.showCorrectAnswers}
              onChange={(e) => setSettings({ ...settings, showCorrectAnswers: e.target.checked })}
              className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
            />
            <div>
              <span className="text-sm font-medium text-gray-700">Show correct answers</span>
              <p className="text-xs text-gray-500">Display correct answers after each question</p>
            </div>
          </label>
        </div>

        {/* Buttons */}
        <div className="mt-8 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleStart}
            className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition shadow-lg"
          >
            🚀 Start Quiz
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// Enhanced Leaderboard Component with Real-time Animations
function EnhancedLeaderboard({
  leaderboard,
  celebrations,
  questionStats,
}: {
  leaderboard: LeaderboardEntry[]
  celebrations: ScoreCelebration[]
  questionStats: QuestionStats | null
}) {
  const [previousPositions, setPreviousPositions] = useState<Map<string, number>>(new Map())

  useEffect(() => {
    // Track position changes for animations
    const newPositions = new Map()
    leaderboard.forEach((entry, index) => {
      newPositions.set(entry.participantId, index + 1)
    })
    setPreviousPositions(newPositions)
  }, [leaderboard])

  const getPositionChange = (participantId: string, currentPosition: number) => {
    const previousPosition = previousPositions.get(participantId)
    if (!previousPosition) return 0
    return previousPosition - currentPosition
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <span className="mr-2">🏆</span>
          Live Leaderboard
        </h2>
        <div className="text-right">
          <div className="text-sm text-gray-500">
            {leaderboard.length} participant{leaderboard.length !== 1 ? "s" : ""}
          </div>
          {questionStats && (
            <div className="text-xs text-purple-600">
              Q{questionStats.questionNumber}: {questionStats.participantsAnswered}/{questionStats.totalParticipants}{" "}
              answered
            </div>
          )}
        </div>
      </div>

      {/* Question Progress Bar */}
      {questionStats && (
        <div className="mb-4 p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-purple-800">
              Question {questionStats.questionNumber} Progress
            </span>
            <span className="text-sm text-purple-600">
              {questionStats.participantsAnswered}/{questionStats.totalParticipants}
            </span>
          </div>
          <div className="w-full bg-purple-200 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{
                width: `${(questionStats.participantsAnswered / questionStats.totalParticipants) * 100}%`,
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
          <div className="flex justify-between text-xs text-purple-600 mt-1">
            <span>Accuracy: {questionStats.accuracyRate.toFixed(1)}%</span>
            <span>Avg Time: {questionStats.averageResponseTime.toFixed(1)}s</span>
          </div>
        </div>
      )}

      {/* Leaderboard Entries */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        <AnimatePresence>
          {leaderboard.length > 0 ? (
            leaderboard.map((entry, index) => {
              const positionChange = getPositionChange(entry.participantId, index + 1)
              const isTop3 = index < 3
              const celebration = celebrations.find((c) => c.participantId === entry.participantId)

              return (
                <motion.div
                  key={entry.participantId}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className={`relative p-4 rounded-lg transition-all duration-300 ${
                    isTop3
                      ? "bg-gradient-to-r from-purple-100 via-indigo-100 to-purple-100 border-2 border-purple-300 shadow-md"
                      : "bg-gray-50 hover:bg-gray-100"
                  } ${celebration ? "ring-2 ring-yellow-400 ring-opacity-75" : ""}`}
                >
                  {/* Celebration Effect */}
                  {celebration && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute inset-0 bg-gradient-to-r from-yellow-200 to-orange-200 rounded-lg opacity-30 pointer-events-none"
                    />
                  )}

                  <div className="flex justify-between items-center relative z-10">
                    <div className="flex items-center space-x-4">
                      {/* Position with Medal */}
                      <div className="flex items-center space-x-2">
                        <span
                          className={`text-xl font-bold ${
                            index === 0
                              ? "text-yellow-600"
                              : index === 1
                                ? "text-gray-600"
                                : index === 2
                                  ? "text-orange-600"
                                  : "text-gray-500"
                          }`}
                        >
                          {index + 1}
                        </span>
                        {index === 0 && <span className="text-xl">🥇</span>}
                        {index === 1 && <span className="text-xl">🥈</span>}
                        {index === 2 && <span className="text-xl">🥉</span>}
                      </div>

                      {/* Participant Info */}
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-gray-800">{entry.nickname}</span>
                          {entry.streak && entry.streak > 2 && (
                            <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">
                              🔥 {entry.streak}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">
                          {entry.questionsAnswered || 0} answered • {entry.correctAnswers || 0} correct
                        </div>
                      </div>
                    </div>

                    {/* Score and Position Change */}
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl font-bold text-purple-600">{entry.totalScore}</span>
                        {positionChange > 0 && (
                          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-green-500 text-sm">
                            ↗️ +{positionChange}
                          </motion.span>
                        )}
                        {positionChange < 0 && (
                          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-red-500 text-sm">
                            ↘️ {positionChange}
                          </motion.span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Activity Indicator */}
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          entry.status === "ACTIVE"
                            ? "bg-green-500"
                            : entry.status === "ANSWERING"
                              ? "bg-blue-500"
                              : entry.status === "WAITING"
                                ? "bg-yellow-500"
                                : "bg-gray-400"
                        }`}
                      />
                      <span className="text-xs text-gray-500">
                        {entry.status === "ACTIVE"
                          ? "🟢 Active"
                          : entry.status === "ANSWERING"
                            ? "🔵 Answering"
                            : entry.status === "WAITING"
                              ? "🟡 Waiting"
                              : "⚪ Idle"}
                      </span>
                    </div>
                    {entry.averageResponseTime && (
                      <span className="text-xs text-gray-500">Avg: {entry.averageResponseTime.toFixed(1)}s</span>
                    )}
                  </div>
                </motion.div>
              )
            })
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">👋</div>
              <p className="text-gray-400 text-lg">Waiting for participants...</p>
              <p className="text-gray-400 text-sm mt-2">Share the session code or QR code to get started</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// Enhanced Participant Progress Component with Visual Indicators
function ParticipantProgress({
  participants,
  detailedProgress,
  totalQuestions,
}: {
  participants: any[]
  detailedProgress: DetailedParticipantProgress[]
  totalQuestions: number
}) {
  const [sortBy, setSortBy] = useState<"score" | "progress" | "accuracy">("score")

  // Merge basic participants with detailed progress
  const enrichedParticipants = participants.map((p) => {
    const details = detailedProgress.find((d) => d.participantId === p.id)
    return {
      ...p,
      ...details,
    }
  })

  // Sort participants
  const sortedParticipants = [...enrichedParticipants].sort((a, b) => {
    switch (sortBy) {
      case "score":
        return (b.totalScore || 0) - (a.totalScore || 0)
      case "progress":
        return (b.answeredCount || 0) - (a.answeredCount || 0)
      case "accuracy":
        return (b.accuracy || 0) - (a.accuracy || 0)
      default:
        return 0
    }
  })

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "completed":
        return "bg-blue-500"
      default:
        return "bg-gray-400"
    }
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800 flex items-center">
          <span className="mr-2">👥</span>
          Participants ({participants.length})
        </h3>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="text-xs px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="score">Score</option>
          <option value="progress">Progress</option>
          <option value="accuracy">Accuracy</option>
        </select>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3 mb-3 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span>Correct</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-red-500 rounded"></div>
          <span>Wrong</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-gray-300 rounded"></div>
          <span>Pending</span>
        </div>
      </div>

      <div className="space-y-3 max-h-[500px] overflow-y-auto">
        {sortedParticipants.length > 0 ? (
          sortedParticipants.map((participant, index) => (
            <motion.div
              key={participant.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="border border-gray-200 rounded-lg p-3"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-sm ${
                      index === 0
                        ? "bg-yellow-500"
                        : index === 1
                          ? "bg-gray-400"
                          : index === 2
                            ? "bg-orange-600"
                            : "bg-indigo-500"
                    }`}
                  >
                    {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : index + 1}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-800 text-sm">{participant.nickname}</span>
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(participant.status)}`}></div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {participant.answeredCount || 0}/{totalQuestions} •{participant.correctCount || 0} correct •
                      {Math.round(participant.accuracy || 0)}% accuracy
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-lg font-bold text-indigo-600">{participant.totalScore || 0}</div>
                  <div className="text-xs text-gray-500">points</div>
                </div>
              </div>

              {/* Progress Bar */}
              {participant.answers && participant.answers.length > 0 && (
                <div className="flex gap-0.5">
                  {Array.from({ length: totalQuestions }, (_, i) => {
                    const questionNum = i + 1
                    const answer = participant.answers.find((a: ParticipantAnswer) => a.questionNumber === questionNum)

                    let bgColor = "bg-gray-300"
                    let tooltip = `Q${questionNum}: Not attempted`

                    if (answer && answer.answered) {
                      if (answer.isCorrect) {
                        bgColor = "bg-green-500"
                        tooltip = `Q${questionNum}: Correct (+${answer.pointsEarned})`
                      } else {
                        bgColor = "bg-red-500"
                        tooltip = `Q${questionNum}: Incorrect`
                      }
                    }

                    const isCurrent = questionNum === participant.currentQuestionNumber

                    return (
                      <div
                        key={questionNum}
                        title={tooltip}
                        className={`flex-1 h-6 rounded ${bgColor} ${
                          isCurrent ? "ring-2 ring-blue-500" : ""
                        } transition-all cursor-pointer hover:scale-105`}
                      >
                        {isCurrent && (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </motion.div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p className="text-lg">No participants yet</p>
            <p className="text-sm">Share the session code to get started!</p>
          </div>
        )}
      </div>
    </div>
  )
}

// NEW: Host Controls Component
function HostControls({
  hostDashboard,
  sessionCode,
  onStartSession,
  onPauseSession,
  onResumeSession,
  onEndSession,
  onNextQuestion,
  onSetQuestionTimeLimit,
}: {
  hostDashboard: HostDashboardData | null
  sessionCode: string
  onStartSession: () => void
  onPauseSession: () => void
  onResumeSession: () => void
  onEndSession: () => void
  onNextQuestion: () => void
  onSetQuestionTimeLimit: (timeLimit: number) => void
}) {
  const [customTimeLimit, setCustomTimeLimit] = useState(30)

  if (!hostDashboard) return null

  return (
    <div className="bg-white rounded-2xl p-6 shadow-xl">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
        <span className="mr-2">🎮</span>
        Host Controls
      </h3>

      <div className="space-y-3">
        {/* Session Controls */}
        <div className="grid grid-cols-2 gap-2">
          {hostDashboard.canStart && (
            <button
              onClick={onStartSession}
              className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition text-sm"
            >
              🚀 Start
            </button>
          )}

          {hostDashboard.canPause && (
            <button
              onClick={onPauseSession}
              className="px-4 py-2 bg-gradient-to-r from-yellow-600 to-yellow-700 text-white rounded-lg hover:from-yellow-700 hover:to-yellow-800 transition text-sm"
            >
              ⏸️ Pause
            </button>
          )}

          {hostDashboard.canResume && (
            <button
              onClick={onResumeSession}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition text-sm"
            >
              ▶️ Resume
            </button>
          )}

          {hostDashboard.canAdvanceQuestion && (
            <button
              onClick={onNextQuestion}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition text-sm"
            >
              ➡️ Next Q
            </button>
          )}

          {hostDashboard.canEnd && (
            <button
              onClick={onEndSession}
              className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition text-sm col-span-2"
            >
              🛑 End Session
            </button>
          )}

          {/* veiw report */}
{hostDashboard?.sessionStatus === "COMPLETED" && (
  <div className="text-center mt-6">
    <Link href={`/host/${sessionCode}/report`}>
      <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold text-lg hover:from-purple-700 hover:to-indigo-700 shadow-lg">
        📊 View Session Report
      </button>
    </Link>
  </div>
)}
          
        </div>

        {/* Timer Controls */}
        {hostDashboard.currentTimer && (
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="text-sm font-medium text-gray-700 mb-2">
              Current Timer: {hostDashboard.currentTimer.timerType}
            </div>
            <div className="text-lg font-bold text-purple-600">
              {Math.floor(hostDashboard.currentTimer.remainingSeconds / 60)}:
              {(hostDashboard.currentTimer.remainingSeconds % 60).toString().padStart(2, "0")}
            </div>
            <div className="text-xs text-gray-500">Status: {hostDashboard.currentTimer.timerStatus}</div>
          </div>
        )}

        {/* Custom Time Limit */}
        <div className="p-3 bg-gray-50 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 mb-2">Set Question Time Limit</label>
          <div className="flex space-x-2">
            <input
              type="number"
              min="5"
              max="300"
              value={customTimeLimit}
              onChange={(e) => setCustomTimeLimit(Number.parseInt(e.target.value))}
              className="flex-1 px-3 py-1 border rounded text-sm"
            />
            <button
              onClick={() => onSetQuestionTimeLimit(customTimeLimit)}
              className="px-3 py-1 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700"
            >
              Set
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Main Enhanced Host Dashboard
export default function LocalhostHostUI() {
  // Extract session code from URL
  const params = useParams()
  const urlSessionCode = params?.sessionCode as string

  console.log("🔍 URL params:", params)
  console.log("🔍 Session code from URL:", urlSessionCode)
// Connection state
  const [isConnected, setIsConnected] = useState(false)
  const [sessionCode, setSessionCode] = useState(urlSessionCode || "")
  const [sessionId, setSessionId] = useState<string>("")
  const [connectionStatus, setConnectionStatus] = useState("Disconnected")

  // Dashboard state
  const [hostDashboard, setHostDashboard] = useState<HostDashboardData | null>(null)
  const [participants, setParticipants] = useState<any[]>([])
  const [participantProgress, setParticipantProgress] = useState<Map<string, any>>(new Map())
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [celebrations, setCelebrations] = useState<ScoreCelebration[]>([])
  const [questionStats, setQuestionStats] = useState<QuestionStats | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState<any>(null)
  const [joinUrl, setJoinUrl] = useState<string>("")
  const [detailedProgress, setDetailedProgress] = useState<DetailedParticipantProgress[]>([])

  // UI state
  const [showSettings, setShowSettings] = useState(false)
  const [authError, setAuthError] = useState<string>("")

  const stompRef = useRef<Client | null>(null)

  // Handle connection to session
  const handleConnect = useCallback(async () => {
    const hasToken = await checkAuthToken()
    if (!hasToken) {
      setAuthError("Please login first to access the host dashboard")
      return
    }
    setIsConnected(true)
    setConnectionStatus("Connecting...")
    setAuthError("")
  }, [])

  // Auto-connect if session code is available (from URL or prop)
  useEffect(() => {
    if (urlSessionCode && !isConnected && sessionCode) {
      console.log("🔌 Auto-connecting to session:", sessionCode)
      // Small delay to ensure component is mounted
      const timer = setTimeout(() => {
        handleConnect()
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [urlSessionCode, sessionCode, isConnected, handleConnect])

  // Set join URL only on client side
  useEffect(() => {
    if (typeof window !== "undefined" && isConnected) {
      setJoinUrl(`${window.location.origin}/${sessionCode}/join`)
    }
  }, [sessionCode, isConnected])

  // Handle disconnect
  const handleDisconnect = useCallback(() => {
    if (stompRef.current) {
      stompRef.current.deactivate()
    }
    setIsConnected(false)
    setConnectionStatus("Disconnected")
    setHostDashboard(null)
    setParticipants([])
    setLeaderboard([])
    setCelebrations([])
    setQuestionStats(null)
    setCurrentQuestion(null)
    setAuthError("")
  }, [])

  // FIXED: Fetch host dashboard using correct API URL
  const fetchHostDashboardByCode = useCallback(async () => {
    if (!sessionCode) return

    try {
      const headers = await getAuthHeaders()
      if (!headers.Authorization) {
        setAuthError("No authentication token found. Please login first.")
        return
      }

      const baseUrl = getApiBaseUrl()
      console.log("📊 Fetching host dashboard for session:", sessionCode)

      // Use the correct host dashboard endpoint directly
      const response = await fetch(`${baseUrl}/v1/host/dashboard/${sessionCode}`, {
        headers,
      })

      if (response.ok) {
        const dashboardData = await response.json()
        console.log("📊 Host dashboard data:", dashboardData)
        setHostDashboard(dashboardData)

        // Update session ID if available
        if (dashboardData.sessionId) {
          setSessionId(dashboardData.sessionId)
        }
      } else if (response.status === 404) {
        console.error("❌ Session not found:", sessionCode)
        setAuthError(`Session ${sessionCode} not found`)
      } else {
        console.error("❌ Failed to fetch host dashboard:", response.statusText)
        const errorDetails = await response.text().catch(() => "No details available")
        setAuthError(`Failed to load dashboard: ${response.status} ${response.statusText} - ${errorDetails}`)
      }
    } catch (error) {
      console.error("❌ Failed to fetch host dashboard:", error)
      setAuthError(`An error occurred: ${error instanceof Error ? error.message : String(error)}`)
    }
  }, [sessionCode])

  // FIXED: Enhanced WebSocket setup with correct localhost URL
  useEffect(() => {
    if (!isConnected || !sessionCode) return

    const setupWebSocket = async () => {
      const hasToken = await checkAuthToken()
      if (!hasToken) {
        setAuthError("Authentication token not found. Please login first.")
        setConnectionStatus("Authentication Error")
        return
      }

      try {
        const session = await getSession()
        const token = (session as any)?.apiAccessToken

        // FIXED: Use the correct WebSocket URL
        const wsUrl = getWebSocketUrl()
        console.log("🔌 Connecting to WebSocket:", wsUrl)

        const sock = new SockJS(wsUrl)
        const stomp = new Client({
          webSocketFactory: () => sock,
          reconnectDelay: 3000,
          heartbeatIncoming: 4000,
          heartbeatOutgoing: 4000,
          connectHeaders: {
            nickname: "__HOST__",
            // Add auth token to WebSocket connection if your backend supports it
            Authorization: `Bearer ${token}`,
          },
          debug: (str) => console.log("[STOMP]", str),
        })

        stomp.onConnect = () => {
          console.log("🔌 WebSocket connected to session:", sessionCode)
          setConnectionStatus("Connected")

          // CORRECTED: Subscribe to proper backend WebSocket topics

          // Enhanced leaderboard subscription - matches EnhancedLeaderboardService
          stomp.subscribe(`/topic/session/${sessionCode}/enhanced-leaderboard`, (msg) => {
            const data = JSON.parse(msg.body)
            console.log("📊 Enhanced leaderboard update:", data)

            if (data.entries) {
              setLeaderboard(data.entries)
            }
          })

          // FIXED: Use existing leaderboard topic since enhanced one might not be implemented yet
          stomp.subscribe(`/topic/session/${sessionCode}/leaderboard`, (msg) => {
            const data = JSON.parse(msg.body)
            console.log("📊 Leaderboard update:", data)

            // Handle both possible data structures
            let entries: LeaderboardEntry[] = []
            if (data.leaderboard?.entries) {
              entries = data.leaderboard.entries
            } else if (data.entries) {
              entries = data.entries
            } else if (Array.isArray(data)) {
              entries = data
            }

            setLeaderboard(entries)
          })

          // Host dashboard updates - matches HostDashboardService
          stomp.subscribe(`/topic/session/${sessionCode}/host/dashboard`, (msg) => {
            const data = JSON.parse(msg.body)
            console.log("🎯 Host dashboard update:", data)
            setHostDashboard(data)
          })

          // Host progress updates - matches HostProgressMessage
          stomp.subscribe(`/topic/session/${sessionCode}/host/progress`, (msg) => {
            const data = JSON.parse(msg.body)
            console.log("📈 Host progress update:", data)

            if (data.participantProgress) {
              setParticipants(data.participantProgress)
            }
          })

          // Live statistics - matches LiveStatsMessage
          stomp.subscribe(`/topic/session/${sessionCode}/live-stats`, (msg) => {
            const data = JSON.parse(msg.body)
            console.log("📊 Live stats update:", data)

            // Convert to QuestionStats format
            setQuestionStats({
              sessionId: data.sessionId || sessionCode,
              questionNumber: data.currentQuestion || 1,
              totalQuestions: data.totalQuestions || 10,
              totalParticipants: data.totalParticipants || 0,
              participantsAnswered: data.participantsAnswered || 0,
              participantsRemaining: data.participantsRemaining || 0,
              averageResponseTime: data.averageResponseTime || 0,
              correctAnswers: data.correctAnswers || 0,
              incorrectAnswers: data.incorrectAnswers || 0,
              accuracyRate: data.accuracyRate || 0,
              isQuestionComplete: data.isQuestionComplete || false,
            })
          })

          // Score celebrations - matches ScoreUpdateMessage/AnswerFeedbackMessage
          stomp.subscribe(`/topic/session/${sessionCode}/score-updates`, (msg) => {
            const data = JSON.parse(msg.body)
            console.log("🎉 Score update:", data)

            if (data.isCorrect && data.pointsEarned > 0) {
              const celebration: ScoreCelebration = {
                participantId: data.participantId,
                nickname: data.participantNickname,
                pointsEarned: data.pointsEarned,
                newTotalScore: data.newScore,
                newRank: data.currentRank || 0,
                isCorrect: data.isCorrect,
                celebrationType: "SCORE_GAIN",
                animationType: "BOUNCE",
              }

              setCelebrations((prev) => [...prev, celebration])

              // Remove celebration after animation
              setTimeout(() => {
                setCelebrations((prev) => prev.filter((c) => c.participantId !== celebration.participantId))
              }, 3000)
            }
          })

          // Session timer updates - matches SessionTimerMessage
          stomp.subscribe(`/topic/session/${sessionCode}/timer`, (msg) => {
            const data = JSON.parse(msg.body)
            console.log("⏰ Timer update:", data)

            setHostDashboard((prev) =>
              prev
                ? {
                    ...prev,
                    currentTimer: {
                      timerType: data.timerType,
                      timerStatus: data.timerStatus,
                      remainingSeconds: data.remainingSeconds,
                      totalSeconds: data.totalSeconds,
                    },
                  }
                : null,
            )
          })

          // Participant updates - matches ParticipantMessage
          stomp.subscribe(`/topic/session/${sessionCode}/participants`, (msg) => {
            const data = JSON.parse(msg.body)
            console.log("👥 Participants update:", data)
            setParticipants(data.participants || [])
          })

          // Question updates
          stomp.subscribe(`/topic/session/${sessionCode}/question`, (msg) => {
            const data = JSON.parse(msg.body)
            console.log("❓ Question update:", data)
            setCurrentQuestion(data.question || data)
          })

          // FIXED: Fetch initial host dashboard data using session code lookup
          fetchHostDashboardByCode()
        }

        stomp.onDisconnect = () => {
          console.warn("⚠️ WebSocket disconnected")
          setConnectionStatus("Disconnected")
        }

        stomp.onStompError = (frame) => {
          console.error("❌ STOMP error:", frame)
          setConnectionStatus("Error")

          // Check if it's an auth error
          if (frame.headers && frame.headers.message && frame.headers.message.includes("401")) {
            setAuthError("Authentication failed. Please login again.")
          }
        }

        stomp.activate()
        stompRef.current = stomp

        return () => {
          console.log("🔌 Disconnecting WebSocket")
          stompRef.current?.deactivate()
        }
      } catch (error) {
        console.error("❌ WebSocket setup error:", error)
        setConnectionStatus("Error")
      }
    }

    setupWebSocket()
  }, [isConnected, sessionCode, fetchHostDashboardByCode])

  // Fetch detailed participant progress
  const fetchDetailedProgress = useCallback(async () => {
    if (!sessionCode) return

    try {
      const headers = await getAuthHeaders()
      if (!headers.Authorization) return

      const baseUrl = getApiBaseUrl()
      const response = await fetch(`${baseUrl}/v1/host/session/${sessionCode}/participant-progress`, { headers })

      if (response.ok) {
        const data = await response.json()
        setDetailedProgress(data)
        console.log("📊 Detailed progress updated:", data)
      } else {
        console.error("❌ Failed to fetch detailed progress:", response.statusText)
      }
    } catch (error) {
      console.error("❌ Failed to fetch detailed progress:", error)
    }
  }, [sessionCode])

  // Auto-refresh detailed progress during quiz
  useEffect(() => {
    if (hostDashboard?.sessionStatus === "IN_PROGRESS" && sessionCode) {
      // Fetch immediately
      fetchDetailedProgress()

      // Then refresh every 3 seconds
      const interval = setInterval(fetchDetailedProgress, 3000)
      return () => clearInterval(interval)
    }
  }, [hostDashboard?.sessionStatus, sessionCode, fetchDetailedProgress])

  // FIXED: Enhanced host command sender with correct API URL
  const handleSendHostCommand = useCallback(
    async (command: string, data?: any) => {
      // FIXED: Always use sessionCode, not sessionId
      if (!sessionCode) {
        console.error("❌ Cannot send command: No session code")
        return
      }

      const headers = await getAuthHeaders()
      if (!headers.Authorization) {
        setAuthError("No authentication token found. Please login first.")
        return
      }

      const baseUrl = getApiBaseUrl()

      try {
        let endpoint = ""
        let method = "POST"
        let body = null

        switch (command) {
          case "START_SESSION":
  // First, update session timing settings if provided
  if (data) {
    const timingEndpoint = `/v1/host/session/${sessionCode}/timing`
    const timingResponse = await fetch(`${baseUrl}${timingEndpoint}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(data),
    })
    if (!timingResponse.ok) {
      console.error("❌ Failed to update session timing:", timingResponse.statusText)
      return
    }
    console.log("✅ Session timing updated successfully")
  }

  endpoint = `/v1/quiz-sessions/${sessionCode}/start`
  method = "PUT"
  body = JSON.stringify(data)  // ← ADD THIS LINE!
  break
          case "PAUSE_SESSION":
            // FIXED: Use sessionCode
            endpoint = `/v1/host/session/${sessionCode}/timer/pause`
            break
          case "RESUME_SESSION":
            // FIXED: Use sessionCode
            endpoint = `/v1/host/session/${sessionCode}/timer/resume`
            break
          case "END_SESSION":
            // FIXED: Use correct session end endpoint
            endpoint = `/v1/quiz-sessions/${sessionCode}/end`
            method = "PUT"
            break
          case "NEXT_QUESTION":
            // FIXED: Use sessionCode
            endpoint = `/v1/host/session/${sessionCode}/force-advance`
            break
          case "SET_QUESTION_TIME_LIMIT":
            // FIXED: Use sessionCode
            endpoint = `/v1/host/session/${sessionCode}/question-time-limit?timeLimit=${data}`
            break
          default:
            console.warn("Unknown command:", command)
            return
        }

        const response = await fetch(`${baseUrl}${endpoint}`, {
          method,
          headers,
          body,
        })

        if (response.ok) {
          console.log(`✅ Command ${command} executed successfully`)

          // REMOVED: Redundant timer start - backend handles this automatically
          // The startSession endpoint should start the timer internally

          // Refresh dashboard data
          fetchHostDashboardByCode()
        } else if (response.status === 401) {
          setAuthError("Authentication failed. Please login again.")
          console.error(`❌ Command ${command} failed: Authentication error`)
        } else {
          const errorText = await response.text().catch(() => response.statusText)
          console.error(`❌ Command ${command} failed:`, errorText)
          setAuthError(`Failed to execute command ${command}: ${response.status} ${response.statusText} - ${errorText}`)
        }
      } catch (error) {
        console.error(`❌ Error executing command ${command}:`, error)
        setAuthError(
          `An error occurred while executing ${command}: ${error instanceof Error ? error.message : String(error)}`,
        )
      }
    },
    [sessionCode, fetchHostDashboardByCode],
  )

  // Host control handlers
  const handleStartSession = useCallback(
    (settings: any) => {
      console.log("🚀 Starting session with settings:", settings)
      handleSendHostCommand("START_SESSION", settings)
    },
    [handleSendHostCommand],
  )

  const handlePauseSession = useCallback(() => {
    handleSendHostCommand("PAUSE_SESSION")
  }, [handleSendHostCommand])

  const handleResumeSession = useCallback(() => {
    handleSendHostCommand("RESUME_SESSION")
  }, [handleSendHostCommand])

  const handleEndSession = useCallback(() => {
    handleSendHostCommand("END_SESSION")
  }, [handleSendHostCommand])

  const handleNextQuestion = useCallback(() => {
    handleSendHostCommand("NEXT_QUESTION")
  }, [handleSendHostCommand])

  const handleSetQuestionTimeLimit = useCallback(
    (timeLimit: number) => {
      handleSendHostCommand("SET_QUESTION_TIME_LIMIT", timeLimit)
    },
    [handleSendHostCommand],
  )

  // Show session code input if not connected
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-700 to-indigo-900 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-8 shadow-2xl max-w-md mx-auto text-center"
        >
          <div className="text-6xl mb-4">🎮</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Host Quiz Dashboard</h2>
          <p className="text-gray-600 mb-6">Connecting to session...</p>

          <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="text-sm text-purple-800">
              <div className="font-medium mb-2">📋 Session Code:</div>
              <div className="text-2xl font-mono font-bold text-purple-900 tracking-wider">
                {sessionCode || "Loading..."}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-2 text-gray-600">
            <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            <span>Connecting to WebSocket...</span>
          </div>

          {authError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="text-sm text-red-800">
                <div className="font-medium mb-1">⚠️ Authentication Error</div>
                <div>{authError}</div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-700 to-indigo-900">
      {/* Enhanced Header */}
      <div className="bg-white shadow-lg p-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <span className="mr-2">🎮</span>
              Quiz Host Dashboard
            </h1>
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center space-x-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    connectionStatus === "Connected"
                      ? "bg-green-500 animate-pulse"
                      : connectionStatus === "Connecting..."
                        ? "bg-yellow-500 animate-pulse"
                        : connectionStatus === "Authentication Error"
                          ? "bg-red-500"
                          : "bg-red-500"
                  }`}
                />
                <span className="text-sm text-gray-600 font-medium">{connectionStatus}</span>
              </div>

              {hostDashboard && (
                <div className="text-sm text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                  Q{hostDashboard.currentQuestion}/{hostDashboard.totalQuestions} •{hostDashboard.participantsAnswered}/
                  {hostDashboard.totalParticipants} answered
                </div>
              )}
            </div>

            {/* Authentication Error Display */}
            {authError && (
              <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">⚠️ {authError}</div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-purple-100 to-indigo-100 px-6 py-4 rounded-xl border border-purple-200">
              <p className="text-xs text-gray-600 mb-1">Session Code</p>
              <p className="text-2xl font-bold text-purple-800">{sessionCode}</p>
            </div>

            <div className="flex flex-col space-y-2">
              <button
                onClick={() => setShowSettings(true)}
                className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition shadow-lg"
                disabled={!!authError}
              >
                🚀 Start Quiz
              </button>

              <button
                onClick={handleNextQuestion}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition"
                disabled={connectionStatus !== "Connected" || !!authError}
              >
                ➡️ Next Question
              </button>

              <button
                onClick={handleDisconnect}
                className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition text-sm"
              >
                🔌 Disconnect
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Session Info & Controls */}
        <div className="space-y-6">
          {/* QR Code */}
          <div className="bg-white rounded-2xl p-6 shadow-xl text-center">
            <h3 className="text-lg font-bold text-gray-800 mb-4">📱 Join Quiz</h3>
            {joinUrl && (
              <div className="bg-white p-4 rounded-lg inline-block border-2 border-gray-200">
                <QRCodeCanvas value={joinUrl} size={150} />
              </div>
            )}
            <p className="text-sm text-gray-600 mt-4">
              Scan QR code or visit: <br />
              <span className="font-mono text-purple-600">{joinUrl}</span>
            </p>
          </div>
          <HostControls
            hostDashboard={hostDashboard}
            sessionCode={sessionCode}
            onStartSession={() => setShowSettings(true)}
            onPauseSession={handlePauseSession}
            onResumeSession={handleResumeSession}
            onEndSession={handleEndSession}
            onNextQuestion={handleNextQuestion}
            onSetQuestionTimeLimit={handleSetQuestionTimeLimit}
         
            // onSetQuestionTimeLimit={handleSetQuestionTimeLimit}
          />

          {/* Participant Progress */}
          <ParticipantProgress
            participants={participants}
            detailedProgress={detailedProgress}
            totalQuestions={hostDashboard?.totalQuestions || 10}
          />
        </div>

        {/* Right Columns - Leaderboard */}
        <div className="lg:col-span-2">
          <EnhancedLeaderboard leaderboard={leaderboard} celebrations={celebrations} questionStats={questionStats} />
        </div>
      </div>

      {/* Quiz Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <QuizSettingsModal
            isOpen={showSettings}
            onClose={() => setShowSettings(false)}
            onStart={handleStartSession}
          />
        )}
      </AnimatePresence>
    </div>
  )
}


// // ui from grok

// "use client"
// import type React from "react"
// import { useCallback, useState, useEffect, useRef } from "react"
// import { useParams } from "next/navigation"
// import { Client } from "@stomp/stompjs"
// import SockJS from "sockjs-client"
// import { QRCodeCanvas } from "qrcode.react"
// import { motion, AnimatePresence } from "framer-motion"
// import { getSession } from "next-auth/react"
// import { Link, Play, Pause, SkipForward, StopCircle, Settings, Users, Trophy, Clock, Zap } from "lucide-react"

// // Enhanced interfaces for better type safety - Updated to match backend DTOs
// interface LeaderboardEntry {
//   participantId: string
//   nickname: string
//   totalScore: number
//   position: number
//   rank: number
//   currentRank?: number
//   isCurrentUser?: boolean
//   avatarId?: string
//   questionsAnswered?: number
//   averageResponseTime?: number
//   correctAnswers?: number
//   streak?: number
//   isOnline?: boolean
//   lastActivity?: string
//   status?: string
//   positionChange?: number
// }

// interface EnhancedLeaderboard {
//   sessionId: string
//   entries: LeaderboardEntry[]
//   totalParticipants: number
//   lastUpdated: number
//   status: string
// }

// interface ScoreCelebration {
//   participantId: string
//   nickname: string
//   pointsEarned: number
//   newTotalScore: number
//   newRank: number
//   isCorrect: boolean
//   celebrationType: string
//   animationType: string
// }

// interface QuestionStats {
//   sessionId: string
//   questionNumber: number
//   totalQuestions: number
//   totalParticipants: number
//   participantsAnswered: number
//   participantsRemaining: number
//   averageResponseTime: number
//   correctAnswers: number
//   incorrectAnswers: number
//   accuracyRate: number
//   isQuestionComplete: boolean
// }

// // NEW: Host Dashboard Response interface matching backend
// interface HostDashboardData {
//   sessionId: string
//   sessionCode: string
//   sessionName: string
//   sessionStatus: string
//   currentQuestion: number
//   totalQuestions: number
//   totalParticipants: number
//   activeParticipants: number
//   participantsAnswered: number
//   participantsPending: number
//   currentTimer?: {
//     timerType: string
//     timerStatus: string
//     remainingSeconds: number
//     totalSeconds: number
//   }
//   canStart: boolean
//   canPause: boolean
//   canResume: boolean
//   canEnd: boolean
//   canAdvanceQuestion: boolean
// }

// // Participant Progress Interfaces
// interface ParticipantAnswer {
//   questionNumber: number
//   isCorrect: boolean
//   answered: boolean
//   pointsEarned: number
//   timeSpent?: number
// }

// interface DetailedParticipantProgress {
//   participantId: string
//   nickname: string
//   avatarId: string
//   totalScore: number
//   currentQuestionNumber: number
//   answeredCount: number
//   correctCount: number
//   accuracy: number
//   answers: ParticipantAnswer[]
//   status: "active" | "idle" | "completed"
//   lastActivityTime?: string
// }

// // FIXED: NextAuth authentication helper functions
// const getAuthHeaders = async () => {
//   try {
//     const session = await getSession()
//     const token = (session as any)?.apiAccessToken

//     if (!token) {
//       console.warn("⚠️ No authentication token found in session. Please login first.")
//       return {}
//     }

//     return {
//       Authorization: `Bearer ${token}`,
//       "Content-Type": "application/json",
//     }
//   } catch (error) {
//     console.error("❌ Error getting session:", error)
//     return {}
//   }
// }

// const checkAuthToken = async () => {
//   try {
//     const session = await getSession()
//     const token = (session as any)?.apiAccessToken
//     return !!token
//   } catch (error) {
//     console.error("❌ Error checking auth token:", error)
//     return false
//   }
// }

// // FIXED: WebSocket URL helper function
// const getWebSocketUrl = () => {
//   // For local development
//   if (typeof window !== "undefined") {
//     const hostname = window.location.hostname

//     // Local development URLs
//     if (hostname === "localhost" || hostname === "127.0.0.1") {
//       return "https://stackquiz-api.stackquiz.me/ws"
//     }
//   }

//   // Use environment variable or fallback to production
//   const apiUrl = process.env.NEXT_PUBLIC_API_URL
//   if (apiUrl) {
//     // Remove /api/v1 or /api and replace with /ws
//     // Ensure we use https:// not wss://
//     const wsUrl = apiUrl
//       .replace(/\/api\/v1\/?$/, "") // Remove /api/v1 or /api/v1/
//       .replace(/\/api\/?$/, "") // Remove /api or /api/
//       .replace(/\/v1\/?$/, "") // Remove any trailing /v1 or /v1/

//     // Append /ws (not /ws/v1)
//     return `${wsUrl}/ws`
//   }

//   // Production fallback - use https:// not wss://
//   return "https://stackquiz-api.stackquiz.me/ws"
// }

// // FIXED: API Base URL helper function
// const getApiBaseUrl = () => {
//   // For local development
//   if (typeof window !== "undefined") {
//     const hostname = window.location.hostname

//     // Local development URLs
//     if (hostname === "localhost" || hostname === "127.0.0.1") {
//       return "https://stackquiz-api.stackquiz.me/api"
//     }
//   }

//   const envUrl = process.env.NEXT_PUBLIC_API_URL || "https://stackquiz-api.stackquiz.me/api"
//   // Remove trailing /v1 if present since all endpoints already include /v1/
//   return envUrl.replace(/\/v1\/?$/, "")
// }

// // Quiz Mode Selection Modal (Like Quizizz)
// function QuizModeSelectionModal({ isOpen, onClose, onModeSelect }: {
//   isOpen: boolean
//   onClose: () => void
//   onModeSelect: (mode: "ASYNC" | "SYNC") => void
// }) {
//   if (!isOpen) return null

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
//     >
//       <motion.div
//         initial={{ scale: 0.95, opacity: 0, y: 20 }}
//         animate={{ scale: 1, opacity: 1, y: 0 }}
//         exit={{ scale: 0.95, opacity: 0, y: 20 }}
//         className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
//       >
//         <div className="text-center mb-8">
//           <div className="text-6xl mb-4">🎯</div>
//           <h2 className="text-3xl font-bold text-gray-800 mb-2">How would you like to host the session?</h2>
//           <p className="text-gray-600">Choose your preferred quiz mode</p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {/* Student-paced (Async) */}
//           <motion.button
//             whileHover={{ scale: 1.02 }}
//             whileTap={{ scale: 0.98 }}
//             onClick={() => onModeSelect("ASYNC")}
//             className="group relative bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6 hover:border-blue-300 transition-all duration-300 shadow-lg hover:shadow-xl"
//           >
//             <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
//             <div className="relative z-10">
//               <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4 mx-auto group-hover:bg-blue-200 transition-colors">
//                 <div className="text-2xl">👤</div>
//               </div>
//               <h3 className="text-xl font-bold text-gray-800 mb-2 text-center">Student-paced</h3>
//               <p className="text-gray-600 mb-4 text-center leading-relaxed">
//                 Students work at their own pace. You can monitor progress and see results in real-time as they complete questions.
//               </p>
//               <div className="flex items-center justify-center text-sm text-blue-600 font-medium">
//                 <Zap className="w-4 h-4 mr-1" /> Self-paced learning
//               </div>
//             </div>
//           </motion.button>

//           {/* Teacher-led (Sync) */}
//           <motion.button
//             whileHover={{ scale: 1.02 }}
//             whileTap={{ scale: 0.98 }}
//             onClick={() => onModeSelect("SYNC")}
//             className="group relative bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-6 hover:border-purple-300 transition-all duration-300 shadow-lg hover:shadow-xl"
//           >
//             <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
//             <div className="relative z-10">
//               <div className="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4 mx-auto group-hover:bg-purple-200 transition-colors">
//                 <div className="text-2xl">👨‍🏫</div>
//               </div>
//               <h3 className="text-xl font-bold text-gray-800 mb-2 text-center">Teacher-led</h3>
//               <p className="text-gray-600 mb-4 text-center leading-relaxed">
//                 You lead the session, students answer on their devices. Perfect for classroom discussions and real-time engagement.
//               </p>
//               <div className="flex items-center justify-center text-sm text-purple-600 font-medium">
//                 <Users className="w-4 h-4 mr-1" /> Live classroom experience
//               </div>
//             </div>
//           </motion.button>
//         </div>

//         <div className="mt-8 flex justify-center">
//           <button
//             onClick={onClose}
//             className="px-6 py-2 text-gray-500 hover:text-gray-700 transition text-sm"
//           >
//             Cancel
//           </button>
//         </div>
//       </motion.div>
//     </motion.div>
//   )
// }

// // Enhanced Quiz Settings Modal - Updated to use backend SessionTimingRequest
// function QuizSettingsModal({ isOpen, onClose, onStart, selectedMode }: {
//   isOpen: boolean
//   onClose: () => void
//   onStart: (settings: any) => void
//   selectedMode: "ASYNC" | "SYNC"
// }) {
//   const [settings, setSettings] = useState({
//     mode: selectedMode,
//     scheduledStartTime: "",
//     scheduledEndTime: "",
//     defaultQuestionTimeLimit: 30,
//     autoAdvanceQuestions: selectedMode === "SYNC",
//     allowLateJoining: true,
//     shuffleQuestions: false,
//     showCorrectAnswers: true,
//     showTimer: selectedMode === "SYNC",
//     maxParticipants: 100,
//   })

//   if (!isOpen) return null

// const handleStart = () => {
//   // ✅ FIX: Include mode in the request
//   const timingRequest = {
//     mode: settings.mode,  // ← ADD THIS LINE!
//     scheduledStartTime: settings.scheduledStartTime ? new Date(settings.scheduledStartTime).toISOString() : null,
//     scheduledEndTime: settings.scheduledEndTime ? new Date(settings.scheduledEndTime).toISOString() : null,
//     defaultQuestionTimeLimit: settings.defaultQuestionTimeLimit,
//     autoAdvanceQuestions: settings.autoAdvanceQuestions,
//     allowLateJoining: settings.allowLateJoining,
//     showTimer: settings.showTimer,
//   }

//   console.log("✅ Starting session with mode:", settings.mode, "and settings:", timingRequest)
//   onStart(timingRequest)
//   onClose()
// }

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
//     >
//       <motion.div
//         initial={{ scale: 0.9, opacity: 0 }}
//         animate={{ scale: 1, opacity: 1 }}
//         exit={{ scale: 0.9, opacity: 0 }}
//         className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl"
//       >
//         <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
//           <Settings className="w-6 h-6 mr-2" />
//           {selectedMode === "ASYNC" ? "Student-paced" : "Teacher-led"} Settings
//         </h2>

//         <div className="space-y-6">
//           {/* Time Settings */}
//           <div>
//             <label className="block text-sm font-medium text-gray-600 mb-2">Question Time Limit (seconds)</label>
//             <input
//               type="number"
//               min="5"
//               max="300"
//               value={settings.defaultQuestionTimeLimit}
//               onChange={(e) => setSettings({ ...settings, defaultQuestionTimeLimit: Number.parseInt(e.target.value) })}
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//             />
//             <p className="text-xs text-gray-500 mt-2">
//               {selectedMode === "SYNC" ? "Students see a countdown timer" : "Suggested time per question"}
//             </p>
//           </div>

//           {/* Scheduled Times */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-600 mb-2">Start Time (Optional)</label>
//               <input
//                 type="datetime-local"
//                 value={settings.scheduledStartTime}
//                 onChange={(e) => setSettings({ ...settings, scheduledStartTime: e.target.value })}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-600 mb-2">End Time (Optional)</label>
//               <input
//                 type="datetime-local"
//                 value={settings.scheduledEndTime}
//                 onChange={(e) => setSettings({ ...settings, scheduledEndTime: e.target.value })}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
//               />
//             </div>
//           </div>

//           {/* Mode-Specific Settings */}
//           {selectedMode === "SYNC" && (
//             <div className="space-y-4">
//               <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
//                 <input
//                   type="checkbox"
//                   checked={settings.autoAdvanceQuestions}
//                   onChange={(e) => setSettings({ ...settings, autoAdvanceQuestions: e.target.checked })}
//                   className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
//                 />
//                 <div>
//                   <span className="font-medium text-gray-700">Auto-advance questions</span>
//                   <p className="text-sm text-gray-500">Move to next question when time expires</p>
//                 </div>
//               </label>

//               <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
//                 <input
//                   type="checkbox"
//                   checked={settings.showTimer}
//                   onChange={(e) => setSettings({ ...settings, showTimer: e.target.checked })}
//                   className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
//                 />
//                 <div>
//                   <span className="font-medium text-gray-700">Show live timer</span>
//                   <p className="text-sm text-gray-500">Display countdown to all students</p>
//                 </div>
//               </label>
//             </div>
//           )}

//           {selectedMode === "ASYNC" && (
//             <div className="space-y-4">
//               <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
//                 <input
//                   type="checkbox"
//                   checked={settings.allowLateJoining}
//                   onChange={(e) => setSettings({ ...settings, allowLateJoining: e.target.checked })}
//                   className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
//                 />
//                 <div>
//                   <span className="font-medium text-gray-700">Allow late joining</span>
//                   <p className="text-sm text-gray-500">Students can join anytime during the quiz</p>
//                 </div>
//               </label>

//               <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
//                 <input
//                   type="checkbox"
//                   checked={settings.shuffleQuestions}
//                   onChange={(e) => setSettings({ ...settings, shuffleQuestions: e.target.checked })}
//                   className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
//                 />
//                 <div>
//                   <span className="font-medium text-gray-700">Shuffle questions</span>
//                   <p className="text-sm text-gray-500">Randomize question order for each student</p>
//                 </div>
//               </label>
//             </div>
//           )}

//           {/* Common Settings */}
//           <div className="space-y-4">
//             <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
//               <input
//                 type="checkbox"
//                 checked={settings.showCorrectAnswers}
//                 onChange={(e) => setSettings({ ...settings, showCorrectAnswers: e.target.checked })}
//                 className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
//               />
//               <div>
//                 <span className="font-medium text-gray-700">Show correct answers immediately</span>
//                 <p className="text-sm text-gray-500">Display answers right after submission</p>
//               </div>
//             </label>
//           </div>
//         </div>

//         {/* Buttons */}
//         <div className="mt-8 flex justify-end space-x-4 pt-4 border-t border-gray-200">
//           <button
//             onClick={onClose}
//             className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleStart}
//             className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition shadow-lg flex items-center space-x-2"
//           >
//             <Play className="w-4 h-4" />
//             <span>Start {selectedMode === "ASYNC" ? "Student-paced" : "Teacher-led"} Quiz</span>
//           </button>
//         </div>
//       </motion.div>
//     </motion.div>
//   )
// }

// // Session Code Input Component
// function SessionCodeInput({
//   sessionCode,
//   setSessionCode,
//   onConnect,
// }: {
//   sessionCode: string
//   setSessionCode: (code: string) => void
//   onConnect: () => void
// }) {
//   const [inputCode, setInputCode] = useState(sessionCode)
//   const [isConnecting, setIsConnecting] = useState(false)
//   const [authWarning, setAuthWarning] = useState(false)

//   useEffect(() => {
//     // Check if user is authenticated
//     const checkAuth = async () => {
//       const hasToken = await checkAuthToken()
//       if (!hasToken) {
//         setAuthWarning(true)
//       }
//     }
//     checkAuth()
//   }, [])

//   const handleConnect = async () => {
//     if (!inputCode.trim()) {
//       alert("Please enter a session code")
//       return
//     }

//     const hasToken = await checkAuthToken()
//     if (!hasToken) {
//       alert("Please login first to access the host dashboard")
//       return
//     }

//     setIsConnecting(true)
//     setSessionCode(inputCode.trim().toUpperCase())

//     // Simulate connection delay
//     setTimeout(() => {
//       setIsConnecting(false)
//       onConnect()
//     }, 1000)
//   }

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === "Enter") {
//       handleConnect()
//     }
//   }

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-8 shadow-2xl max-w-md mx-auto border border-purple-200"
//     >
//       <div className="text-center mb-6">
//         <div className="text-6xl mb-4">🎮</div>
//         <h2 className="text-2xl font-bold text-gray-800 mb-2">Host Quiz Dashboard</h2>
//         <p className="text-gray-600">Enter your session code from the database</p>
//       </div>

//       {/* Authentication Warning */}
//       {authWarning && (
//         <motion.div
//           initial={{ opacity: 0, y: -10 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
//         >
//           <div className="flex items-center space-x-2">
//             <span className="text-yellow-600">⚠️</span>
//             <span className="text-sm text-yellow-800">Please make sure you're logged in before connecting</span>
//           </div>
//         </motion.div>
//       )}

//       {/* Connection Info */}
//       <motion.div
//         initial={{ opacity: 0, y: -10 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg"
//       >
//         <div className="text-sm text-blue-800">
//           <div className="font-medium mb-1">🔗 Connection Info:</div>
//           <div className="text-xs space-y-1">
//             <div>WebSocket: {getWebSocketUrl()}</div>
//             <div>API: {getApiBaseUrl()}</div>
//           </div>
//         </div>
//       </motion.div>

//       <div className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">Session Code</label>
//           <input
//             type="text"
//             value={inputCode}
//             onChange={(e) => setInputCode(e.target.value.toUpperCase())}
//             onKeyPress={handleKeyPress}
//             placeholder="Enter session code (e.g., E20E84)"
//             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-lg text-center tracking-wider bg-white"
//             maxLength={10}
//             disabled={isConnecting}
//           />
//           <p className="text-xs text-gray-500 mt-1">Copy the session code from your database</p>
//         </div>

//         <motion.button
//           onClick={handleConnect}
//           disabled={isConnecting || !inputCode.trim()}
//           whileHover={{ scale: 1.02 }}
//           whileTap={{ scale: 0.98 }}
//           className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg font-semibold text-lg hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg flex items-center justify-center space-x-2"
//         >
//           {isConnecting ? (
//             <>
//               <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//               <span>Connecting...</span>
//             </>
//           ) : (
//             <>
//               <Zap className="w-5 h-5" />
//               <span>🚀 Connect to Session</span>
//             </>
//           )}
//         </motion.button>

//         <div className="text-center">
//           <p className="text-xs text-gray-500">
//             Make sure the session exists in your database and you're logged in
//           </p>
//         </div>
//       </div>
//     </motion.div>
//   )
// }

// // Enhanced Leaderboard Component with Real-time Animations
// function EnhancedLeaderboard({
//   leaderboard,
//   celebrations,
//   questionStats,
// }: {
//   leaderboard: LeaderboardEntry[]
//   celebrations: ScoreCelebration[]
//   questionStats: QuestionStats | null
// }) {
//   const [previousPositions, setPreviousPositions] = useState<Map<string, number>>(new Map())

//   useEffect(() => {
//     // Track position changes for animations
//     const newPositions = new Map()
//     leaderboard.forEach((entry, index) => {
//       newPositions.set(entry.participantId, index + 1)
//     })
//     setPreviousPositions(newPositions)
//   }, [leaderboard])

//   const getPositionChange = (participantId: string, currentPosition: number) => {
//     const previousPosition = previousPositions.get(participantId)
//     if (!previousPosition) return 0
//     return previousPosition - currentPosition
//   }

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       className="bg-white rounded-2xl p-6 shadow-2xl border border-gray-200"
//     >
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-bold text-gray-800 flex items-center">
//           <Trophy className="w-6 h-6 mr-2 text-yellow-500" />
//           Live Leaderboard
//         </h2>
//         <div className="text-right">
//           <div className="text-sm text-gray-500">
//             {leaderboard.length} participant{leaderboard.length !== 1 ? "s" : ""}
//           </div>
//           {questionStats && (
//             <div className="text-xs text-purple-600 font-medium">
//               Q{questionStats.questionNumber}: {questionStats.participantsAnswered}/{questionStats.totalParticipants}{" "}
//               answered
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Question Progress Bar */}
//       {questionStats && (
//         <motion.div
//           initial={{ opacity: 0, y: -10 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-200"
//         >
//           <div className="flex justify-between items-center mb-3">
//             <span className="text-sm font-semibold text-purple-800">
//               Question {questionStats.questionNumber} Progress
//             </span>
//             <span className="text-sm text-purple-600 font-medium">
//               {questionStats.participantsAnswered}/{questionStats.totalParticipants}
//             </span>
//           </div>
//           <div className="w-full bg-purple-200 rounded-full h-3 overflow-hidden">
//             <motion.div
//               className="bg-gradient-to-r from-purple-500 to-indigo-500 h-3 rounded-full shadow-inner"
//               initial={{ width: 0 }}
//               animate={{
//                 width: `${(questionStats.participantsAnswered / questionStats.totalParticipants) * 100}%`,
//               }}
//               transition={{ duration: 0.8, ease: "easeOut" }}
//             />
//           </div>
//           <div className="flex justify-between text-xs text-purple-600 mt-2 font-medium">
//             <span>Accuracy: {questionStats.accuracyRate.toFixed(1)}%</span>
//             <span>Avg Time: {questionStats.averageResponseTime.toFixed(1)}s</span>
//           </div>
//         </motion.div>
//       )}

//       {/* Leaderboard Entries */}
//       <div className="space-y-3 max-h-96 overflow-y-auto">
//         <AnimatePresence>
//           {leaderboard.length > 0 ? (
//             leaderboard.map((entry, index) => {
//               const positionChange = getPositionChange(entry.participantId, index + 1)
//               const isTop3 = index < 3
//               const celebration = celebrations.find((c) => c.participantId === entry.participantId)

//               return (
//                 <motion.div
//                   key={entry.participantId}
//                   layout
//                   initial={{ opacity: 0, y: 20, scale: 0.95 }}
//                   animate={{ opacity: 1, y: 0, scale: 1 }}
//                   exit={{ opacity: 0, y: -20, scale: 0.95 }}
//                   transition={{ duration: 0.4, type: "spring", stiffness: 300 }}
//                   className={`relative p-4 rounded-xl transition-all duration-300 overflow-hidden ${
//                     isTop3
//                       ? `bg-gradient-to-r ${
//                           index === 0
//                             ? "from-yellow-50 to-orange-50 border-yellow-300"
//                             : index === 1
//                               ? "from-gray-50 to-gray-100 border-gray-300"
//                               : "from-orange-50 to-red-50 border-orange-300"
//                         } shadow-lg border-2`
//                       : "bg-gray-50 hover:bg-gray-100 border border-gray-200"
//                   } ${celebration ? "ring-4 ring-yellow-400 ring-opacity-50" : ""}`}
//                 >
//                   {/* Celebration Effect */}
//                   {celebration && (
//                     <motion.div
//                       initial={{ scale: 0, opacity: 0 }}
//                       animate={{ scale: 1.1, opacity: 0.8 }}
//                       exit={{ scale: 0, opacity: 0 }}
//                       transition={{ duration: 0.5, type: "spring" }}
//                       className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl pointer-events-none"
//                     />
//                   )}

//                   <div className="flex justify-between items-center relative z-10">
//                     <div className="flex items-center space-x-4 flex-1">
//                       {/* Position with Medal */}
//                       <div className="flex flex-col items-center space-y-1">
//                         <div
//                           className={`text-2xl font-black ${
//                             index === 0
//                               ? "text-yellow-600 drop-shadow-lg"
//                               : index === 1
//                                 ? "text-gray-600"
//                                 : index === 2
//                                   ? "text-orange-600"
//                                   : "text-gray-500"
//                           }`}
//                         >
//                           {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : index + 1}
//                         </div>
//                         {positionChange !== 0 && (
//                           <motion.span
//                             initial={{ scale: 0 }}
//                             animate={{ scale: 1 }}
//                             className={`text-xs font-bold ${
//                               positionChange > 0 ? "text-green-500" : "text-red-500"
//                             }`}
//                           >
//                             {positionChange > 0 ? "↗️" : "↘️"}
//                           </motion.span>
//                         )}
//                       </div>

//                       {/* Participant Info */}
//                       <div className="flex-1 min-w-0">
//                         <div className="flex items-center space-x-2 mb-1">
//                           <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center">
//                             <span className="text-white font-bold text-sm">
//                               {entry.nickname.charAt(0).toUpperCase()}
//                             </span>
//                           </div>
//                           <span className="font-bold text-gray-800 truncate">{entry.nickname}</span>
//                           {entry.streak && entry.streak > 2 && (
//                             <span className="text-xs bg-gradient-to-r from-orange-400 to-red-400 text-white px-2 py-1 rounded-full font-bold flex items-center space-x-1">
//                               <span>🔥</span>
//                               <span>{entry.streak}</span>
//                             </span>
//                           )}
//                         </div>
//                         <div className="flex items-center space-x-4 text-xs text-gray-500">
//                           <span>{entry.questionsAnswered || 0} Q</span>
//                           <span>•</span>
//                           <span>{entry.correctAnswers || 0} ✓</span>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Score */}
//                     <div className="text-right">
//                       <div className="text-2xl font-black text-purple-600 bg-gradient-to-r from-purple-100 to-indigo-100 px-3 py-1 rounded-full">
//                         {entry.totalScore}
//                       </div>
//                       {entry.averageResponseTime && (
//                         <div className="text-xs text-gray-400 mt-1 flex items-center justify-end">
//                           <Clock className="w-3 h-3 mr-1" />
//                           {entry.averageResponseTime.toFixed(1)}s
//                         </div>
//                       )}
//                     </div>
//                   </div>

//                   {/* Activity Indicator */}
//                   <div className="absolute bottom-2 right-2 flex items-center space-x-1 opacity-80">
//                     <div
//                       className={`w-2 h-2 rounded-full ${
//                         entry.status === "ACTIVE"
//                           ? "bg-green-500 animate-pulse"
//                           : entry.status === "ANSWERING"
//                             ? "bg-blue-500"
//                             : entry.status === "WAITING"
//                               ? "bg-yellow-500"
//                               : "bg-gray-400"
//                       }`}
//                     />
//                     <span className="text-xs text-gray-500 capitalize">{entry.status?.toLowerCase()}</span>
//                   </div>
//                 </motion.div>
//               )
//             })
//           ) : (
//             <motion.div
//               initial={{ opacity: 0, scale: 0.9 }}
//               animate={{ opacity: 1, scale: 1 }}
//               className="text-center py-12 bg-gray-50 rounded-xl"
//             >
//               <div className="text-6xl mb-4 opacity-40">👋</div>
//               <p className="text-gray-400 text-lg font-medium">Waiting for participants...</p>
//               <p className="text-gray-400 text-sm mt-2">Share the session code or QR code to get started</p>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     </motion.div>
//   )
// }

// // Enhanced Participant Progress Component with Visual Indicators
// function ParticipantProgress({
//   participants,
//   detailedProgress,
//   totalQuestions,
// }: {
//   participants: any[]
//   detailedProgress: DetailedParticipantProgress[]
//   totalQuestions: number
// }) {
//   const [sortBy, setSortBy] = useState<"score" | "progress" | "accuracy">("score")

//   // Merge basic participants with detailed progress
//   const enrichedParticipants = participants.map((p) => {
//     const details = detailedProgress.find((d) => d.participantId === p.id)
//     return {
//       ...p,
//       ...details,
//     }
//   })

//   // Sort participants
//   const sortedParticipants = [...enrichedParticipants].sort((a, b) => {
//     switch (sortBy) {
//       case "score":
//         return (b.totalScore || 0) - (a.totalScore || 0)
//       case "progress":
//         return (b.answeredCount || 0) - (a.answeredCount || 0)
//       case "accuracy":
//         return (b.accuracy || 0) - (a.accuracy || 0)
//       default:
//         return 0
//     }
//   })

//   const getStatusColor = (status?: string) => {
//     switch (status) {
//       case "active":
//         return "bg-green-500"
//       case "completed":
//         return "bg-blue-500"
//       default:
//         return "bg-gray-400"
//     }
//   }

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       className="bg-white rounded-2xl p-6 shadow-2xl border border-gray-200 overflow-hidden"
//     >
//       <div className="flex items-center justify-between mb-4">
//         <h3 className="text-lg font-bold text-gray-800 flex items-center">
//           <Users className="w-5 h-5 mr-2" />
//           Participants ({participants.length})
//         </h3>

//         <select
//           value={sortBy}
//           onChange={(e) => setSortBy(e.target.value as any)}
//           className="text-sm px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
//         >
//           <option value="score">Score</option>
//           <option value="progress">Progress</option>
//           <option value="accuracy">Accuracy</option>
//         </select>
//       </div>

//       {/* Legend */}
//       <div className="flex items-center gap-4 mb-4 text-xs bg-gray-50 p-2 rounded-lg">
//         <div className="flex items-center gap-1">
//           <div className="w-3 h-3 bg-green-500 rounded"></div>
//           <span>Correct</span>
//         </div>
//         <div className="flex items-center gap-1">
//           <div className="w-3 h-3 bg-red-500 rounded"></div>
//           <span>Incorrect</span>
//         </div>
//         <div className="flex items-center gap-1">
//           <div className="w-3 h-3 bg-gray-300 rounded"></div>
//           <span>Pending</span>
//         </div>
//       </div>

//       <div className="space-y-3 max-h-[400px] overflow-y-auto">
//         {sortedParticipants.length > 0 ? (
//           sortedParticipants.map((participant, index) => (
//             <motion.div
//               key={participant.id}
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ delay: index * 0.05 }}
//               className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-gradient-to-r from-gray-50 to-white"
//             >
//               {/* Header */}
//               <div className="flex items-center justify-between mb-3">
//                 <div className="flex items-center space-x-3">
//                   <div
//                     className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm shadow-md ${
//                       index === 0
//                         ? "bg-gradient-to-br from-yellow-500 to-orange-500"
//                         : index === 1
//                           ? "bg-gradient-to-br from-gray-500 to-gray-600"
//                           : index === 2
//                             ? "bg-gradient-to-br from-orange-500 to-red-500"
//                             : "bg-gradient-to-br from-indigo-500 to-purple-500"
//                     }`}
//                   >
//                     {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : index + 1}
//                   </div>

//                   <div className="flex-1 min-w-0">
//                     <div className="flex items-center gap-2 mb-1">
//                       <span className="font-semibold text-gray-800 text-sm truncate">{participant.nickname}</span>
//                       <div className={`w-2 h-2 rounded-full ${getStatusColor(participant.status)} animate-pulse`}></div>
//                     </div>
//                     <div className="text-xs text-gray-500 flex items-center space-x-2">
//                       <span>{participant.answeredCount || 0}/{totalQuestions}</span>
//                       <span>•</span>
//                       <span>{Math.round(participant.accuracy || 0)}% accuracy</span>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="text-right">
//                   <div className="text-lg font-bold text-indigo-600 bg-indigo-100 px-2 py-1 rounded-full">
//                     {participant.totalScore || 0}
//                   </div>
//                   <div className="text-xs text-gray-500 mt-1">points</div>
//                 </div>
//               </div>

//               {/* Progress Bar */}
//               {participant.answers && participant.answers.length > 0 && (
//                 <div className="flex gap-0.5 bg-gray-200 p-0.5 rounded-full">
//                   {Array.from({ length: totalQuestions }, (_, i) => {
//                     const questionNum = i + 1
//                     const answer = participant.answers.find((a: ParticipantAnswer) => a.questionNumber === questionNum)

//                     let bgColor = "bg-gray-300"
//                     let tooltip = `Q${questionNum}: Not attempted`

//                     if (answer && answer.answered) {
//                       if (answer.isCorrect) {
//                         bgColor = "bg-green-500"
//                         tooltip = `Q${questionNum}: Correct (+${answer.pointsEarned})`
//                       } else {
//                         bgColor = "bg-red-500"
//                         tooltip = `Q${questionNum}: Incorrect`
//                       }
//                     }

//                     const isCurrent = questionNum === participant.currentQuestionNumber

//                     return (
//                       <div
//                         key={questionNum}
//                         title={tooltip}
//                         className={`flex-1 h-4 rounded-lg relative ${bgColor} transition-all hover:scale-105 cursor-pointer ${
//                           isCurrent ? "ring-2 ring-blue-400" : ""
//                         }`}
//                       >
//                         {isCurrent && (
//                           <div className="absolute inset-0 flex items-center justify-center">
//                             <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse shadow"></div>
//                           </div>
//                         )}
//                       </div>
//                     )
//                   })}
//                 </div>
//               )}
//             </motion.div>
//           ))
//         ) : (
//           <motion.div
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl"
//           >
//             <p className="text-lg font-medium">No participants yet</p>
//             <p className="text-sm mt-2">Share the session code to get started!</p>
//           </motion.div>
//         )}
//       </div>
//     </motion.div>
//   )
// }

// // NEW: Host Controls Component
// function HostControls({
//   hostDashboard,
//   sessionCode,
//   onStartSession,
//   onPauseSession,
//   onResumeSession,
//   onEndSession,
//   onNextQuestion,
//   onSetQuestionTimeLimit,
// }: {
//   hostDashboard: HostDashboardData | null
//   sessionCode: string
//   onStartSession: () => void
//   onPauseSession: () => void
//   onResumeSession: () => void
//   onEndSession: () => void
//   onNextQuestion: () => void
//   onSetQuestionTimeLimit: (timeLimit: number) => void
// }) {
//   const [customTimeLimit, setCustomTimeLimit] = useState(30)

//   if (!hostDashboard) return null

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       className="bg-white rounded-2xl p-6 shadow-2xl border border-gray-200"
//     >
//       <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
//         <Zap className="w-5 h-5 mr-2" />
//         Host Controls
//       </h3>

//       <div className="space-y-4">
//         {/* Session Controls */}
//         <div className="grid grid-cols-2 gap-3">
//           {hostDashboard.canStart && (
//             <motion.button
//               whileHover={{ scale: 1.02 }}
//               whileTap={{ scale: 0.98 }}
//               onClick={onStartSession}
//               className="col-span-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition shadow-lg flex items-center justify-center space-x-2"
//             >
//               <Play className="w-5 h-5" />
//               <span>🚀 Start Quiz</span>
//             </motion.button>
//           )}

//           {hostDashboard.canPause && (
//             <motion.button
//               whileHover={{ scale: 1.02 }}
//               whileTap={{ scale: 0.98 }}
//               onClick={onPauseSession}
//               className="bg-gradient-to-r from-yellow-600 to-amber-600 text-white py-3 rounded-xl font-semibold hover:from-yellow-700 hover:to-amber-700 transition shadow-lg flex items-center justify-center space-x-2"
//             >
//               <Pause className="w-5 h-5" />
//               <span>⏸️ Pause</span>
//             </motion.button>
//           )}

//           {hostDashboard.canResume && (
//             <motion.button
//               whileHover={{ scale: 1.02 }}
//               whileTap={{ scale: 0.98 }}
//               onClick={onResumeSession}
//               className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-700 transition shadow-lg flex items-center justify-center space-x-2"
//             >
//               <Play className="w-5 h-5" />
//               <span>▶️ Resume</span>
//             </motion.button>
//           )}

//           {hostDashboard.canAdvanceQuestion && (
//             <motion.button
//               whileHover={{ scale: 1.02 }}
//               whileTap={{ scale: 0.98 }}
//               onClick={onNextQuestion}
//               className="bg-gradient-to-r from-purple-600 to-violet-600 text-white py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-violet-700 transition shadow-lg flex items-center justify-center space-x-2"
//             >
//               <SkipForward className="w-5 h-5" />
//               <span>➡️ Next</span>
//             </motion.button>
//           )}

//           {hostDashboard.canEnd && (
//             <motion.button
//               whileHover={{ scale: 1.02 }}
//               whileTap={{ scale: 0.98 }}
//               onClick={onEndSession}
//               className="col-span-2 bg-gradient-to-r from-red-600 to-rose-600 text-white py-3 rounded-xl font-semibold hover:from-red-700 hover:to-rose-700 transition shadow-lg flex items-center justify-center space-x-2"
//             >
//               <StopCircle className="w-5 h-5" />
//               <span>🛑 End Session</span>
//             </motion.button>
//           )}
//         </div>

//         {/* View Report */}
//         {hostDashboard?.sessionStatus === "COMPLETED" && (
//           <motion.div
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="text-center mt-6 pt-4 border-t border-gray-200"
//           >
//             <Link href={`/host/${sessionCode}/report`}>
//               <motion.button
//                 whileHover={{ scale: 1.02 }}
//                 className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold text-lg hover:from-purple-700 hover:to-indigo-700 shadow-lg flex items-center justify-center space-x-2 mx-auto"
//               >
//                 <Trophy className="w-5 h-5" />
//                 <span>📊 View Session Report</span>
//               </motion.button>
//             </Link>
//           </motion.div>
//         )}

//         {/* Timer Controls */}
//         {hostDashboard.currentTimer && (
//           <motion.div
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200"
//           >
//             <div className="text-sm font-semibold text-indigo-800 mb-2 flex items-center">
//               <Clock className="w-4 h-4 mr-2" />
//               Current Timer: {hostDashboard.currentTimer.timerType}
//             </div>
//             <div className="text-2xl font-bold text-purple-600 text-center mb-1">
//               {Math.floor(hostDashboard.currentTimer.remainingSeconds / 60)}:
//               {(hostDashboard.currentTimer.remainingSeconds % 60).toString().padStart(2, "0")}
//             </div>
//             <div className="text-xs text-purple-600 text-center font-medium">
//               Status: {hostDashboard.currentTimer.timerStatus}
//             </div>
//           </motion.div>
//         )}

//         {/* Custom Time Limit */}
//         <motion.div
//           initial={{ opacity: 0, y: 10 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="p-4 bg-gray-50 rounded-xl border border-gray-200"
//         >
//           <label className="block text-sm font-semibold text-gray-700 mb-3">Set Question Time Limit</label>
//           <div className="flex space-x-3">
//             <input
//               type="number"
//               min="5"
//               max="300"
//               value={customTimeLimit}
//               onChange={(e) => setCustomTimeLimit(Number.parseInt(e.target.value))}
//               className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             />
//             <motion.button
//               whileHover={{ scale: 1.02 }}
//               whileTap={{ scale: 0.98 }}
//               onClick={() => onSetQuestionTimeLimit(customTimeLimit)}
//               className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition flex items-center space-x-1"
//             >
//               <Clock className="w-4 h-4" />
//               <span>Set</span>
//             </motion.button>
//           </div>
//         </motion.div>
//       </div>
//     </motion.div>
//   )
// }

// // Main Enhanced Host Dashboard
// export default function LocalhostHostUI() {
//   // Extract session code from URL
//   const params = useParams()
//   const urlSessionCode = params?.sessionCode as string

//   console.log("🔍 URL params:", params)
//   console.log("🔍 Session code from URL:", urlSessionCode)

//   // Connection state
//   const [isConnected, setIsConnected] = useState(false)
//   const [sessionCode, setSessionCode] = useState(urlSessionCode || "")
//   const [sessionId, setSessionId] = useState<string>("")
//   const [connectionStatus, setConnectionStatus] = useState("Disconnected")

//   // Dashboard state
//   const [hostDashboard, setHostDashboard] = useState<HostDashboardData | null>(null)
//   const [participants, setParticipants] = useState<any[]>([])
//   const [participantProgress, setParticipantProgress] = useState<Map<string, any>>(new Map())
//   const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
//   const [celebrations, setCelebrations] = useState<ScoreCelebration[]>([])
//   const [questionStats, setQuestionStats] = useState<QuestionStats | null>(null)
//   const [currentQuestion, setCurrentQuestion] = useState<any>(null)
//   const [joinUrl, setJoinUrl] = useState<string>("")
//   const [detailedProgress, setDetailedProgress] = useState<DetailedParticipantProgress[]>([])

//   // UI state
//   const [showModeSelection, setShowModeSelection] = useState(false)
//   const [showSettings, setShowSettings] = useState(false)
//   const [selectedMode, setSelectedMode] = useState<"ASYNC" | "SYNC">("SYNC")
//   const [authError, setAuthError] = useState<string>("")

//   const stompRef = useRef<Client | null>(null)

//   // Handle connection to session
//   const handleConnect = useCallback(async () => {
//     const hasToken = await checkAuthToken()
//     if (!hasToken) {
//       setAuthError("Please login first to access the host dashboard")
//       return
//     }
//     setIsConnected(true)
//     setConnectionStatus("Connecting...")
//     setAuthError("")
//   }, [])

//   // Auto-connect if session code is available (from URL or prop)
//   useEffect(() => {
//     if (urlSessionCode && !isConnected && sessionCode) {
//       console.log("🔌 Auto-connecting to session:", sessionCode)
//       // Small delay to ensure component is mounted
//       const timer = setTimeout(() => {
//         handleConnect()
//       }, 500)
//       return () => clearTimeout(timer)
//     }
//   }, [urlSessionCode, sessionCode, isConnected, handleConnect])

//   // Set join URL only on client side
//   useEffect(() => {
//     if (typeof window !== "undefined" && isConnected) {
//       setJoinUrl(`${window.location.origin}/${sessionCode}/join`)
//     }
//   }, [sessionCode, isConnected])

//   // Handle disconnect
//   const handleDisconnect = useCallback(() => {
//     if (stompRef.current) {
//       stompRef.current.deactivate()
//     }
//     setIsConnected(false)
//     setConnectionStatus("Disconnected")
//     setHostDashboard(null)
//     setParticipants([])
//     setLeaderboard([])
//     setCelebrations([])
//     setQuestionStats(null)
//     setCurrentQuestion(null)
//     setAuthError("")
//   }, [])

//   // FIXED: Fetch host dashboard using correct API URL
//   const fetchHostDashboardByCode = useCallback(async () => {
//     if (!sessionCode) return

//     try {
//       const headers = await getAuthHeaders()
//       if (!headers.Authorization) {
//         setAuthError("No authentication token found. Please login first.")
//         return
//       }

//       const baseUrl = getApiBaseUrl()
//       console.log("📊 Fetching host dashboard for session:", sessionCode)

//       // Use the correct host dashboard endpoint directly
//       // Filter out undefined header values to satisfy fetch type requirements
//       const filteredHeaders: Record<string, string> = Object.fromEntries(
//         Object.entries(headers).filter(([_, v]) => typeof v === "string")
//       )
//       const response = await fetch(`${baseUrl}/v1/host/dashboard/${sessionCode}`, {
//         headers: filteredHeaders,
//       })

//       if (response.ok) {
//         const dashboardData = await response.json()
//         console.log("📊 Host dashboard data:", dashboardData)
//         setHostDashboard(dashboardData)

//         // Update session ID if available
//         if (dashboardData.sessionId) {
//           setSessionId(dashboardData.sessionId)
//         }
//       } else if (response.status === 404) {
//         console.error("❌ Session not found:", sessionCode)
//         setAuthError(`Session ${sessionCode} not found`)
//       } else {
//         console.error("❌ Failed to fetch host dashboard:", response.statusText)
//         const errorDetails = await response.text().catch(() => "No details available")
//         setAuthError(`Failed to load dashboard: ${response.status} ${response.statusText} - ${errorDetails}`)
//       }
//     } catch (error) {
//       console.error("❌ Failed to fetch host dashboard:", error)
//       setAuthError(`An error occurred: ${error instanceof Error ? error.message : String(error)}`)
//     }
//   }, [sessionCode])

//   // FIXED: Enhanced WebSocket setup with correct localhost URL
//   useEffect(() => {
//     if (!isConnected || !sessionCode) return

//     const setupWebSocket = async () => {
//       const hasToken = await checkAuthToken()
//       if (!hasToken) {
//         setAuthError("Authentication token not found. Please login first.")
//         setConnectionStatus("Authentication Error")
//         return
//       }

//       try {
//         const session = await getSession()
//         const token = (session as any)?.apiAccessToken

//         // FIXED: Use the correct WebSocket URL
//         const wsUrl = getWebSocketUrl()
//         console.log("🔌 Connecting to WebSocket:", wsUrl)

//         const sock = new SockJS(wsUrl)
//         const stomp = new Client({
//           webSocketFactory: () => sock,
//           reconnectDelay: 3000,
//           heartbeatIncoming: 4000,
//           heartbeatOutgoing: 4000,
//           connectHeaders: {
//             nickname: "__HOST__",
//             // Add auth token to WebSocket connection if your backend supports it
//             Authorization: `Bearer ${token}`,
//           },
//           debug: (str) => console.log("[STOMP]", str),
//         })

//         stomp.onConnect = () => {
//           console.log("🔌 WebSocket connected to session:", sessionCode)
//           setConnectionStatus("Connected")

//           // CORRECTED: Subscribe to proper backend WebSocket topics

//           // Enhanced leaderboard subscription - matches EnhancedLeaderboardService
//           stomp.subscribe(`/topic/session/${sessionCode}/enhanced-leaderboard`, (msg) => {
//             const data = JSON.parse(msg.body)
//             console.log("📊 Enhanced leaderboard update:", data)

//             if (data.entries) {
//               setLeaderboard(data.entries)
//             }
//           })

//           // FIXED: Use existing leaderboard topic since enhanced one might not be implemented yet
//           stomp.subscribe(`/topic/session/${sessionCode}/leaderboard`, (msg) => {
//             const data = JSON.parse(msg.body)
//             console.log("📊 Leaderboard update:", data)

//             // Handle both possible data structures
//             let entries: LeaderboardEntry[] = []
//             if (data.leaderboard?.entries) {
//               entries = data.leaderboard.entries
//             } else if (data.entries) {
//               entries = data.entries
//             } else if (Array.isArray(data)) {
//               entries = data
//             }

//             setLeaderboard(entries)
//           })

//           // Host dashboard updates - matches HostDashboardService
//           stomp.subscribe(`/topic/session/${sessionCode}/host/dashboard`, (msg) => {
//             const data = JSON.parse(msg.body)
//             console.log("🎯 Host dashboard update:", data)
//             setHostDashboard(data)
//           })

//           // Host progress updates - matches HostProgressMessage
//           stomp.subscribe(`/topic/session/${sessionCode}/host/progress`, (msg) => {
//             const data = JSON.parse(msg.body)
//             console.log("📈 Host progress update:", data)

//             if (data.participantProgress) {
//               setParticipants(data.participantProgress)
//             }
//           })

//           // Live statistics - matches LiveStatsMessage
//           stomp.subscribe(`/topic/session/${sessionCode}/live-stats`, (msg) => {
//             const data = JSON.parse(msg.body)
//             console.log("📊 Live stats update:", data)

//             // Convert to QuestionStats format
//             setQuestionStats({
//               sessionId: data.sessionId || sessionCode,
//               questionNumber: data.currentQuestion || 1,
//               totalQuestions: data.totalQuestions || 10,
//               totalParticipants: data.totalParticipants || 0,
//               participantsAnswered: data.participantsAnswered || 0,
//               participantsRemaining: data.participantsRemaining || 0,
//               averageResponseTime: data.averageResponseTime || 0,
//               correctAnswers: data.correctAnswers || 0,
//               incorrectAnswers: data.incorrectAnswers || 0,
//               accuracyRate: data.accuracyRate || 0,
//               isQuestionComplete: data.isQuestionComplete || false,
//             })
//           })

//           // Score celebrations - matches ScoreUpdateMessage/AnswerFeedbackMessage
//           stomp.subscribe(`/topic/session/${sessionCode}/score-updates`, (msg) => {
//             const data = JSON.parse(msg.body)
//             console.log("🎉 Score update:", data)

//             if (data.isCorrect && data.pointsEarned > 0) {
//               const celebration: ScoreCelebration = {
//                 participantId: data.participantId,
//                 nickname: data.participantNickname,
//                 pointsEarned: data.pointsEarned,
//                 newTotalScore: data.newScore,
//                 newRank: data.currentRank || 0,
//                 isCorrect: data.isCorrect,
//                 celebrationType: "SCORE_GAIN",
//                 animationType: "BOUNCE",
//               }

//               setCelebrations((prev) => [...prev, celebration])

//               // Remove celebration after animation
//               setTimeout(() => {
//                 setCelebrations((prev) => prev.filter((c) => c.participantId !== celebration.participantId))
//               }, 3000)
//             }
//           })

//           // Session timer updates - matches SessionTimerMessage
//           stomp.subscribe(`/topic/session/${sessionCode}/timer`, (msg) => {
//             const data = JSON.parse(msg.body)
//             console.log("⏰ Timer update:", data)

//             setHostDashboard((prev) =>
//               prev
//                 ? {
//                     ...prev,
//                     currentTimer: {
//                       timerType: data.timerType,
//                       timerStatus: data.timerStatus,
//                       remainingSeconds: data.remainingSeconds,
//                       totalSeconds: data.totalSeconds,
//                     },
//                   }
//                 : null,
//             )
//           })

//           // Participant updates - matches ParticipantMessage
//           stomp.subscribe(`/topic/session/${sessionCode}/participants`, (msg) => {
//             const data = JSON.parse(msg.body)
//             console.log("👥 Participants update:", data)
//             setParticipants(data.participants || [])
//           })

//           // Question updates
//           stomp.subscribe(`/topic/session/${sessionCode}/question`, (msg) => {
//             const data = JSON.parse(msg.body)
//             console.log("❓ Question update:", data)
//             setCurrentQuestion(data.question || data)
//           })

//           // FIXED: Fetch initial host dashboard data using session code lookup
//           fetchHostDashboardByCode()
//         }

//         stomp.onDisconnect = () => {
//           console.warn("⚠️ WebSocket disconnected")
//           setConnectionStatus("Disconnected")
//         }

//         stomp.onStompError = (frame) => {
//           console.error("❌ STOMP error:", frame)
//           setConnectionStatus("Error")

//           // Check if it's an auth error
//           if (frame.headers && frame.headers.message && frame.headers.message.includes("401")) {
//             setAuthError("Authentication failed. Please login again.")
//           }
//         }

//         stomp.activate()
//         stompRef.current = stomp

//         return () => {
//           console.log("🔌 Disconnecting WebSocket")
//           stompRef.current?.deactivate()
//         }
//       } catch (error) {
//         console.error("❌ WebSocket setup error:", error)
//         setConnectionStatus("Error")
//       }
//     }

//     setupWebSocket()
//   }, [isConnected, sessionCode, fetchHostDashboardByCode])

//   // Fetch detailed participant progress
//   const fetchDetailedProgress = useCallback(async () => {
//     if (!sessionCode) return

//     try {
//       const headers = await getAuthHeaders()
//       if (!headers.Authorization) return

//       const baseUrl = getApiBaseUrl()
//       const response = await fetch(`${baseUrl}/v1/host/session/${sessionCode}/participant-progress`, { headers })

//       if (response.ok) {
//         const data = await response.json()
//         setDetailedProgress(data)
//         console.log("📊 Detailed progress updated:", data)
//       } else {
//         console.error("❌ Failed to fetch detailed progress:", response.statusText)
//       }
//     } catch (error) {
//       console.error("❌ Failed to fetch detailed progress:", error)
//     }
//   }, [sessionCode])

//   // Auto-refresh detailed progress during quiz
//   useEffect(() => {
//     if (hostDashboard?.sessionStatus === "IN_PROGRESS" && sessionCode) {
//       // Fetch immediately
//       fetchDetailedProgress()

//       // Then refresh every 3 seconds
//       const interval = setInterval(fetchDetailedProgress, 3000)
//       return () => clearInterval(interval)
//     }
//   }, [hostDashboard?.sessionStatus, sessionCode, fetchDetailedProgress])

//   const handleSendHostCommand = useCallback(
//   async (command: string, data?: any) => {
//     if (!sessionCode) {
//       console.error("❌ No session code available")
//       return
//     }

//     try {
//       const baseUrl = getApiBaseUrl()
//       const headers = await getAuthHeaders()

//       let endpoint = ""
//       let method = "POST"
//       let body = null  // ← Initialize body variable

//       switch (command) {
//         case "START_SESSION":
//           // ✅ FIX: Send mode and settings together
//           endpoint = `/v1/quiz-sessions/${sessionCode}/start`
//           method = "PUT"
          
//           // Include all settings in request body
//           if (data) {
//             console.log("✅ Starting session with settings:", data)
//             body = JSON.stringify({
//               mode: data.mode,  // ← Include mode!
//               scheduledStartTime: data.scheduledStartTime,
//               scheduledEndTime: data.scheduledEndTime,
//               defaultQuestionTimeLimit: data.defaultQuestionTimeLimit,
//               autoAdvanceQuestions: data.autoAdvanceQuestions,
//               allowLateJoining: data.allowLateJoining,
//               showTimer: data.showTimer,
//             })
//           }
//           break

//         case "PAUSE_SESSION":
//           endpoint = `/v1/host/session/${sessionCode}/timer/pause`
//           break

//         case "RESUME_SESSION":
//           endpoint = `/v1/host/session/${sessionCode}/timer/resume`
//           break

//         case "END_SESSION":
//           endpoint = `/v1/quiz-sessions/${sessionCode}/end`
//           method = "PUT"
//           break

//         case "NEXT_QUESTION":
//           endpoint = `/v1/host/session/${sessionCode}/force-advance`
//           break

//         case "SET_QUESTION_TIME_LIMIT":
//           endpoint = `/v1/host/session/${sessionCode}/question-time-limit?timeLimit=${data}`
//           break

//         default:
//           console.warn("Unknown command:", command)
//           return
//       }

//       const response = await fetch(`${baseUrl}${endpoint}`, {
//         method,
//         // Filter out undefined header values to satisfy fetch type requirements
//         headers: Object.fromEntries(Object.entries(headers).filter(([_, v]) => typeof v === "string")),
//         body,  // ← Include body in request
//       })

//       if (response.ok) {
//         console.log(`✅ Command ${command} executed successfully`)
//         fetchHostDashboardByCode()
//       } else if (response.status === 401) {
//         setAuthError("Authentication failed. Please login again.")
//         console.error(`❌ Command ${command} failed: Authentication error`)
//       } else {
//         const errorText = await response.text().catch(() => response.statusText)
//         console.error(`❌ Command ${command} failed:`, errorText)
//         setAuthError(`Failed to execute command ${command}: ${response.status} ${response.statusText} - ${errorText}`)
//       }
//     } catch (error) {
//       console.error(`❌ Error executing command ${command}:`, error)
//       setAuthError(`Error executing command ${command}: ${error}`)
//     }
//   },
//   [sessionCode, fetchHostDashboardByCode]
// )

//   // Host control handlers
//   const handleStartSession = useCallback(
//     (settings: any) => {
//       console.log("🚀 Starting session with settings:", settings)
//       handleSendHostCommand("START_SESSION", settings)
//     },
//     [handleSendHostCommand],
//   )

//   const handlePauseSession = useCallback(() => {
//     handleSendHostCommand("PAUSE_SESSION")
//   }, [handleSendHostCommand])

//   const handleResumeSession = useCallback(() => {
//     handleSendHostCommand("RESUME_SESSION")
//   }, [handleSendHostCommand])

//   const handleEndSession = useCallback(() => {
//     handleSendHostCommand("END_SESSION")
//   }, [handleSendHostCommand])

//   const handleNextQuestion = useCallback(() => {
//     handleSendHostCommand("NEXT_QUESTION")
//   }, [handleSendHostCommand])

//   const handleSetQuestionTimeLimit = useCallback(
//     (timeLimit: number) => {
//       handleSendHostCommand("SET_QUESTION_TIME_LIMIT", timeLimit)
//     },
//     [handleSendHostCommand],
//   )

//   const handleModeSelect = useCallback((mode: "ASYNC" | "SYNC") => {
//     setSelectedMode(mode)
//     setShowModeSelection(false)
//     setShowSettings(true)
//   }, [])

//   // Show session code input if not connected
//   if (!isConnected) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-700 to-purple-800 flex items-center justify-center p-6">
//         <SessionCodeInput
//           sessionCode={sessionCode}
//           setSessionCode={setSessionCode}
//           onConnect={handleConnect}
//         />
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-700 to-purple-800">
//       {/* Enhanced Header */}
//       <motion.div
//         initial={{ y: -20, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         className="bg-white/80 backdrop-blur-md shadow-2xl border-b border-white/20"
//       >
//         <div className="max-w-7xl mx-auto px-6 py-4">
//           <div className="flex justify-between items-center">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-800 flex items-center">
//                 <Trophy className="w-8 h-8 mr-3 text-yellow-500 drop-shadow-lg" />
//                 Quiz Host Dashboard
//               </h1>
//               <div className="flex items-center space-x-6 mt-2">
//                 <div className="flex items-center space-x-2">
//                   <div
//                     className={`w-3 h-3 rounded-full ${
//                       connectionStatus === "Connected"
//                         ? "bg-green-500 animate-pulse"
//                         : connectionStatus === "Connecting..."
//                           ? "bg-yellow-500 animate-pulse"
//                           : "bg-red-500"
//                     }`}
//                   />
//                   <span className="text-sm text-gray-600 font-medium capitalize">{connectionStatus}</span>
//                 </div>

//                 {hostDashboard && (
//                   <motion.div
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     className="text-sm bg-gradient-to-r from-purple-100 to-indigo-100 px-4 py-2 rounded-full text-purple-800 font-semibold"
//                   >
//                     <span>Q{hostDashboard.currentQuestion}/{hostDashboard.totalQuestions}</span>
//                     <span className="ml-2">•</span>
//                     <span>{hostDashboard.participantsAnswered}/{hostDashboard.totalParticipants} answered</span>
//                   </motion.div>
//                 )}
//               </div>

//               {/* Authentication Error Display */}
//               {authError && (
//                 <motion.div
//                   initial={{ opacity: 0, y: -10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex items-center space-x-2"
//                 >
//                   <span>⚠️</span>
//                   <span>{authError}</span>
//                 </motion.div>
//               )}
//             </div>

//             <div className="flex items-center space-x-4">
//               <motion.div
//                 initial={{ opacity: 0, y: -10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 className="bg-gradient-to-r from-purple-100 to-indigo-100 px-6 py-4 rounded-xl border border-purple-200 shadow-lg"
//               >
//                 <p className="text-xs text-gray-600 mb-1 font-medium">Session Code</p>
//                 <p className="text-2xl font-bold text-purple-800 tracking-wider">{sessionCode}</p>
//               </motion.div>

//               <div className="flex space-x-3">
//                 <motion.button
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                   onClick={() => setShowModeSelection(true)}
//                   className="bg-gradient-to-r from-emerald-600 to-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-emerald-700 hover:to-green-700 transition shadow-lg flex items-center space-x-2"
//                   disabled={!!authError}
//                 >
//                   <Play className="w-5 h-5" />
//                   <span>🚀 Start Quiz</span>
//                 </motion.button>

//                 <motion.button
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                   onClick={handleNextQuestion}
//                   className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-700 transition shadow-lg flex items-center space-x-2"
//                   disabled={connectionStatus !== "Connected" || !!authError}
//                 >
//                   <SkipForward className="w-5 h-5" />
//                   <span>Next Question</span>
//                 </motion.button>

//                 <motion.button
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                   onClick={handleDisconnect}
//                   className="bg-gradient-to-r from-red-600 to-rose-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-red-700 hover:to-rose-700 transition shadow-lg text-sm flex items-center space-x-2"
//                 >
//                   <StopCircle className="w-5 h-5" />
//                   <span>Disconnect</span>
//                 </motion.button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </motion.div>

//       {/* Main Content */}
//       <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
//         {/* Left Column - Session Info & Controls */}
//         <div className="space-y-8 lg:col-span-1">
//           {/* QR Code */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="bg-white rounded-2xl p-6 shadow-2xl text-center border border-gray-200"
//           >
//             <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center justify-center">
//               <Users className="w-5 h-5 mr-2" />
//               Invite Students
//             </h3>
//             {joinUrl && (
//               <motion.div
//                 initial={{ scale: 0.8, opacity: 0 }}
//                 animate={{ scale: 1, opacity: 1 }}
//                 className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-xl border-2 border-purple-200 mb-4"
//               >
//                 <QRCodeCanvas value={joinUrl} size={180} />
//               </motion.div>
//             )}
//             <div className="space-y-2">
//               <p className="text-sm text-gray-600">Scan QR code or visit:</p>
//               <div className="bg-gray-100 p-2 rounded-lg">
//                 <p className="text-xs font-mono text-purple-800 break-all">{joinUrl}</p>
//               </div>
//             </div>
//           </motion.div>

//           <HostControls
//             hostDashboard={hostDashboard}
//             sessionCode={sessionCode}
//             onStartSession={() => setShowModeSelection(true)}
//             onPauseSession={handlePauseSession}
//             onResumeSession={handleResumeSession}
//             onEndSession={handleEndSession}
//             onNextQuestion={handleNextQuestion}
//             onSetQuestionTimeLimit={handleSetQuestionTimeLimit}
//           />

//           {/* Participant Progress */}
//           <ParticipantProgress
//             participants={participants}
//             detailedProgress={detailedProgress}
//             totalQuestions={hostDashboard?.totalQuestions || 10}
//           />
//         </div>

//         {/* Right Column - Leaderboard */}
//         <div className="lg:col-span-2">
//           <EnhancedLeaderboard leaderboard={leaderboard} celebrations={celebrations} questionStats={questionStats} />
//         </div>
//       </div>

//       {/* Quiz Mode Selection Modal */}
//       <AnimatePresence>
//         {showModeSelection && (
//           <QuizModeSelectionModal
//             isOpen={showModeSelection}
//             onClose={() => setShowModeSelection(false)}
//             onModeSelect={handleModeSelect}
//           />
//         )}
//       </AnimatePresence>

//       {/* Quiz Settings Modal */}
//       <AnimatePresence>
//         {showSettings && (
//           <QuizSettingsModal
//             isOpen={showSettings}
//             onClose={() => setShowSettings(false)}
//             onStart={handleStartSession}
//             selectedMode={selectedMode}
//           />
//         )}
//       </AnimatePresence>
//     </div>
//   )
// }

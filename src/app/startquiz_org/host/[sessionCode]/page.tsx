// ============================================================================
// FILE: components/host-dashboard/index.tsx
// Host Dashboard with Kahoot-style flow
// ============================================================================

"use client"
import React, { useState, useEffect, useCallback } from "react"
import { useParams } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"

// Components
import { SessionCodeInput } from "@/components/host-dashboard/components/SessionCodeInput"
import { QuizSettingsModal } from "@/components/host-dashboard/components/QuizSettingsModal"
import { QRCodeSection } from "@/components/host-dashboard/components/QRCodeSection"
import { EnhancedLeaderboard } from "@/components/host-dashboard/components/EnhancedLeaderboard"

// Hooks
import { useAuth } from "@/components/host-dashboard/hooks/useAuth"
import { useWebSocket } from "@/components/host-dashboard/hooks/useWebSocket"
import { useHostCommands } from "@/components/host-dashboard/hooks/useHostCommands"
import { useParticipantProgress } from "@/components/host-dashboard/hooks/useParticipantProgress"
import { useDashboardData } from "@/components/host-dashboard/hooks/useDashboardData"

// Types
import type {
  HostDashboardData,
  LeaderboardEntry,
  ScoreCelebration,
  QuestionStats,
} from "./types"

// View types for the flow
type HostView = "lobby" | "question" | "leaderboard" | "final-results"

export default function LocalhostHostUI() {
  const params = useParams()
  const urlSessionCode = params?.sessionCode as string

  // Connection state
  const [isConnected, setIsConnected] = useState(false)
  const [sessionCode, setSessionCode] = useState(urlSessionCode || "")
  const [sessionId, setSessionId] = useState<string>("")
  const [connectionStatus, setConnectionStatus] = useState("Disconnected")

  // Dashboard state
  const [hostDashboard, setHostDashboard] = useState<HostDashboardData | null>(null)
  const [participants, setParticipants] = useState<any[]>([])
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [celebrations, setCelebrations] = useState<ScoreCelebration[]>([])
  const [questionStats, setQuestionStats] = useState<QuestionStats | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState<any>(null)
  const [joinUrl, setJoinUrl] = useState<string>("")

  // UI state - Kahoot flow
  const [currentView, setCurrentView] = useState<HostView>("lobby")
  const [showSettings, setShowSettings] = useState(false)

  // Auth hook
  const { authError, setAuthError, validateAuth } = useAuth()

  // Dashboard data hook
  const { fetchHostDashboard } = useDashboardData(
    sessionCode,
    setHostDashboard,
    setAuthError,
    setSessionId,
  )

  // Participant progress hook
  const { detailedProgress } = useParticipantProgress(sessionCode, hostDashboard?.sessionStatus)

  // Handle connection
  const handleConnect = useCallback(async () => {
    const isValid = await validateAuth()
    if (!isValid) {
      setAuthError("Please login first to access the host dashboard")
      return
    }
    setIsConnected(true)
    setConnectionStatus("Connecting...")
    setAuthError("")
  }, [validateAuth, setAuthError])

  // Auto-connect if session code is available
  useEffect(() => {
    if (urlSessionCode && !isConnected && sessionCode) {
      console.log("🔌 Auto-connecting to session:", sessionCode)
      const timer = setTimeout(() => {
        handleConnect()
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [urlSessionCode, sessionCode, isConnected, handleConnect])

  // Set join URL
  useEffect(() => {
    if (typeof window !== "undefined" && isConnected) {
      setJoinUrl(`${window.location.origin}/${sessionCode}/join`)
    }
  }, [sessionCode, isConnected])

  // Update view based on session status (but don't override manual changes immediately)
  useEffect(() => {
    if (!hostDashboard) return

    const status = hostDashboard.sessionStatus

    // Only update view based on status after a small delay to allow manual transitions
    const timer = setTimeout(() => {
      if (status === "waiting" || status === "not_started") {
        setCurrentView("lobby")
      } else if (status === "in_progress" || status === "question_active") {
        setCurrentView("question")
      } else if (status === "showing_leaderboard") {
        setCurrentView("leaderboard")
      } else if (status === "completed") {
        setCurrentView("final-results")
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [hostDashboard?.sessionStatus])

  // Handle disconnect
  const handleDisconnect = useCallback(() => {
    setIsConnected(false)
    setConnectionStatus("Disconnected")
    setHostDashboard(null)
    setParticipants([])
    setLeaderboard([])
    setCelebrations([])
    setQuestionStats(null)
    setCurrentQuestion(null)
    setAuthError("")
    setCurrentView("lobby")
  }, [setAuthError])

  // WebSocket callbacks
  const handleDashboardUpdate = useCallback((data: HostDashboardData) => {
    setHostDashboard(data)
  }, [])

  const handleLeaderboardUpdate = useCallback((entries: LeaderboardEntry[]) => {
    setLeaderboard(entries)
  }, [])

  const handleStatsUpdate = useCallback((stats: QuestionStats) => {
    setQuestionStats(stats)
  }, [])

  const handleParticipantsUpdate = useCallback((participants: any[]) => {
    setParticipants(participants)
  }, [])

  const handleScoreUpdate = useCallback((celebration: ScoreCelebration) => {
    setCelebrations((prev) => [...prev, celebration])
    setTimeout(() => {
      setCelebrations((prev) => prev.filter((c) => c.participantId !== celebration.participantId))
    }, 3000)
  }, [])

  const handleTimerUpdate = useCallback((timer: any) => {
    setHostDashboard((prev) =>
      prev
        ? {
            ...prev,
            currentTimer: {
              timerType: timer.timerType,
              timerStatus: timer.timerStatus,
              remainingSeconds: timer.remainingSeconds,
              totalSeconds: timer.totalSeconds,
            },
          }
        : null,
    )
  }, [])

  const handleQuestionUpdate = useCallback((question: any) => {
    setCurrentQuestion(question)
  }, [])

  // WebSocket hook
  useWebSocket({
    sessionCode,
    isConnected,
    onDashboardUpdate: handleDashboardUpdate,
    onLeaderboardUpdate: handleLeaderboardUpdate,
    onStatsUpdate: handleStatsUpdate,
    onParticipantsUpdate: handleParticipantsUpdate,
    onScoreUpdate: handleScoreUpdate,
    onTimerUpdate: handleTimerUpdate,
    onQuestionUpdate: handleQuestionUpdate,
    setConnectionStatus,
    setAuthError,
  })

  // Host commands hook
  const {
    startSession,
    pauseSession,
    resumeSession,
    endSession,
    nextQuestion,
    setQuestionTimeLimit,
  } = useHostCommands({
    sessionCode,
    onRefresh: fetchHostDashboard,
    setAuthError,
  })

  // Show session code input if not connected
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-700 to-indigo-900 flex items-center justify-center p-6">
        <SessionCodeInput sessionCode={sessionCode} setSessionCode={setSessionCode} onConnect={handleConnect} />
      </div>
    )
  }

  // ========================================================================
  // LOBBY VIEW - QR Code, Session Code, Participants
  // ========================================================================
  const renderLobbyView = () => (
    <motion.div
      key="lobby"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-700 to-indigo-900 flex flex-col items-center justify-center p-6"
    >
      <div className="max-w-4xl w-full space-y-8">
        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            {hostDashboard?.quizTitle || "Quiz Session"}
          </h1>
          
          {/* Session Code */}
          <div className="mb-8">
            <p className="text-gray-600 text-lg mb-2">Join at:</p>
            <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-2xl p-6 mb-4">
              <p className="text-sm mb-2">{joinUrl}</p>
              <p className="text-5xl font-black tracking-wider">{sessionCode}</p>
            </div>
          </div>

          {/* QR Code */}
          <div className="mb-8">
            <QRCodeSection joinUrl={joinUrl} />
          </div>

          {/* Participant Count */}
          <div className="mb-6">
            <div className="inline-block bg-green-100 text-green-700 px-8 py-4 rounded-full">
              <span className="text-3xl font-bold">{participants.length}</span>
              <span className="text-xl ml-2">participants joined</span>
            </div>
          </div>

          {/* Participant List */}
          {participants.length > 0 && (
            <div className="mb-8 max-h-64 overflow-y-auto">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {participants.map((p) => (
                  <motion.div
                    key={p.id}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="bg-gray-100 rounded-lg p-3 text-gray-800 font-semibold"
                  >
                    {p.nickname || p.name}
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Start Button */}
          <button
            onClick={() => setShowSettings(true)}
            disabled={participants.length === 0}
            className={`px-12 py-5 rounded-2xl font-bold text-2xl transition-all shadow-lg ${
              participants.length === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 hover:scale-105 active:scale-95"
            }`}
          >
            Start Quiz
          </button>
        </div>
      </div>
    </motion.div>
  )

  // ========================================================================
  // QUESTION VIEW - Full Kahoot-style Display
  // ========================================================================
  const renderQuestionView = () => {
    const timerSeconds = hostDashboard?.currentTimer?.remainingSeconds || 0
    const totalSeconds = hostDashboard?.currentTimer?.totalSeconds || 30
    const timerPercentage = (timerSeconds / totalSeconds) * 100

    return (
      <motion.div
        key="question"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 flex flex-col"
      >
        {/* Top Bar - Question Number & Timer */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg">
              <span className="text-gray-800 font-bold text-2xl">
                {hostDashboard?.currentQuestionNumber || 1}
              </span>
            </div>
            <div className="text-white">
              <p className="text-sm opacity-80">Question</p>
              <p className="font-bold text-lg">
                {hostDashboard?.currentQuestionNumber || 1} of {hostDashboard?.totalQuestions || 10}
              </p>
            </div>
          </div>

          {/* Timer Circle */}
          <div className="relative w-24 h-24">
            <svg className="transform -rotate-90 w-24 h-24">
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke={timerSeconds <= 5 ? "#EF4444" : "#10B981"}
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${2 * Math.PI * 40 * (1 - timerPercentage / 100)}`}
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-3xl font-bold ${timerSeconds <= 5 ? 'text-red-400 animate-pulse' : 'text-white'}`}>
                {timerSeconds}
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleDisconnect}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-all"
            >
              End Quiz
            </button>
          </div>
        </div>

        {/* Main Question Display */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="max-w-6xl w-full">
            {/* Question Text */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white/95 backdrop-blur-sm rounded-3xl p-12 mb-8 shadow-2xl"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 text-center leading-tight">
                {currentQuestion?.text?.replace(/_/g, ' ') || 
                 currentQuestion?.questionText?.replace(/_/g, ' ') || 
                 'Loading question...'}
              </h1>
            </motion.div>

            {/* Answer Options Display */}
            {currentQuestion?.options && (
              <div className="grid grid-cols-2 gap-6 mb-8">
                {currentQuestion.options.map((option: any, index: number) => {
                  const colors = [
                    'bg-red-500',
                    'bg-blue-500',
                    'bg-yellow-500',
                    'bg-green-500'
                  ]
                  const icons = ['△', '◆', '○', '□']
                  
                  return (
                    <motion.div
                      key={option.id || index}
                      initial={{ scale: 0, rotate: -10 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`${colors[index % 4]} rounded-2xl p-6 shadow-xl`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-white/20 rounded-lg flex items-center justify-center">
                          <span className="text-white text-3xl font-bold">{icons[index % 4]}</span>
                        </div>
                        <span className="text-white font-bold text-xl flex-1">
                          {option.text?.replace(/_/g, ' ') || option.optionText?.replace(/_/g, ' ')}
                        </span>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}

            {/* Stats Bar */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/90 rounded-2xl p-6 text-center shadow-lg">
                <p className="text-gray-600 text-sm mb-1">Answered</p>
                <p className="text-3xl font-bold text-gray-800">
                  {questionStats?.answeredCount || 0}/{participants.length}
                </p>
              </div>
              <div className="bg-white/90 rounded-2xl p-6 text-center shadow-lg">
                <p className="text-gray-600 text-sm mb-1">Correct</p>
                <p className="text-3xl font-bold text-green-600">
                  {questionStats?.correctCount || 0}
                </p>
              </div>
              <div className="bg-white/90 rounded-2xl p-6 text-center shadow-lg">
                <p className="text-gray-600 text-sm mb-1">Incorrect</p>
                <p className="text-3xl font-bold text-red-600">
                  {(questionStats?.answeredCount || 0) - (questionStats?.correctCount || 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Control Bar */}
        <div className="p-6 bg-black/20 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex gap-3">
              {hostDashboard?.currentTimer?.timerStatus === 'running' ? (
                <button
                  onClick={pauseSession}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg"
                >
                  ⏸ Pause
                </button>
              ) : (
                <button
                  onClick={resumeSession}
                  className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg"
                >
                  ▶ Resume
                </button>
              )}
            </div>

            <button
              onClick={nextQuestion}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-12 py-4 rounded-xl font-bold text-xl transition-all shadow-lg hover:scale-105"
            >
              Next Question →
            </button>
          </div>
        </div>
      </motion.div>
    )
  }

  // ========================================================================
  // LEADERBOARD VIEW - After Each Question
  // ========================================================================
  const renderLeaderboardView = () => (
    <motion.div
      key="leaderboard"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-700 to-indigo-900 p-6"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4">Leaderboard</h1>
          <p className="text-white/80 text-xl">
            Question {hostDashboard?.currentQuestionNumber || 1} of {hostDashboard?.totalQuestions || 10}
          </p>
        </div>

        <EnhancedLeaderboard 
          leaderboard={leaderboard} 
          celebrations={celebrations} 
          questionStats={questionStats} 
        />

        <div className="text-center mt-8">
          <button
            onClick={nextQuestion}
            className="px-12 py-5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl font-bold text-2xl hover:from-green-600 hover:to-green-700 hover:scale-105 active:scale-95 transition-all shadow-lg"
          >
            Next Question →
          </button>
        </div>
      </div>
    </motion.div>
  )

  // ========================================================================
  // FINAL RESULTS VIEW
  // ========================================================================
  const renderFinalResultsView = () => (
    <motion.div
      key="final-results"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-700 to-indigo-900 p-6"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold text-white mb-4">🏆 Final Results 🏆</h1>
          <p className="text-white/80 text-2xl">Quiz Complete!</p>
        </div>

        <EnhancedLeaderboard 
          leaderboard={leaderboard} 
          celebrations={celebrations} 
          questionStats={questionStats} 
        />

        <div className="text-center mt-8 space-x-4">
          <button
            onClick={handleDisconnect}
            className="px-12 py-5 bg-white text-purple-600 rounded-2xl font-bold text-2xl hover:bg-gray-100 transition-all shadow-lg"
          >
            End Session
          </button>
        </div>
      </div>
    </motion.div>
  )

  return (
    <>
      <AnimatePresence mode="wait">
        {currentView === "lobby" && renderLobbyView()}
        {currentView === "question" && renderQuestionView()}
        {currentView === "leaderboard" && renderLeaderboardView()}
        {currentView === "final-results" && renderFinalResultsView()}
      </AnimatePresence>

      {/* Quiz Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <QuizSettingsModal
            isOpen={showSettings}
            onClose={() => setShowSettings(false)}
            onStart={async (settings) => {
              setShowSettings(false)
              // Start the session
              await startSession(settings)
              // Manually trigger view change to question view
              setCurrentView("question")
              // Refresh dashboard data
              setTimeout(() => {
                fetchHostDashboard()
              }, 1000)
            }}
          />
        )}
      </AnimatePresence>
    </>
  )
}
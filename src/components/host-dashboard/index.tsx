// ============================================================================
// FILE: components/host-dashboard/index.tsx
// Main component - Much cleaner now!
// ============================================================================

"use client"
import React, { useState, useEffect, useCallback } from "react"
import { useParams } from "next/navigation"
import { AnimatePresence } from "framer-motion"

// Components
import { SessionCodeInput } from "./components/SessionCodeInput"
import { QuizSettingsModal } from "./components/QuizSettingsModal"
import { DashboardHeader } from "./components/DashboardHeader"
import { QRCodeSection } from "./components/QRCodeSection"
import { HostControls } from "./components/HostControls"
import { EnhancedLeaderboard } from "./components/EnhancedLeaderboard"
import { ParticipantProgress } from "./components/ParticipantProgress"

// Hooks
import { useAuth } from "./hooks/useAuth"
import { useWebSocket } from "./hooks/useWebSocket"
import { useHostCommands } from "./hooks/useHostCommands"
import { useParticipantProgress } from "./hooks/useParticipantProgress"
import { useDashboardData } from "./hooks/useDashboardData"

// Types
import type {
  HostDashboardData,
  LeaderboardEntry,
  ScoreCelebration,
  QuestionStats,
} from "./types"

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

  // UI state
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-700 to-indigo-900">
      <DashboardHeader
        connectionStatus={connectionStatus}
        hostDashboard={hostDashboard}
        authError={authError}
        sessionCode={sessionCode}
        onStartQuiz={() => setShowSettings(true)}
        onNextQuestion={nextQuestion}
        onDisconnect={handleDisconnect}
      />

      <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <QRCodeSection joinUrl={joinUrl} />

          <HostControls
            hostDashboard={hostDashboard}
            sessionCode={sessionCode}
            onStartSession={() => setShowSettings(true)}
            onPauseSession={pauseSession}
            onResumeSession={resumeSession}
            onEndSession={endSession}
            onNextQuestion={nextQuestion}
            onSetQuestionTimeLimit={setQuestionTimeLimit}
          />

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
            onStart={(settings) => {
              startSession(settings)
              setShowSettings(false)
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
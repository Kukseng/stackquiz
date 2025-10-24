// ============================================================================
// FILE: components/host-dashboard/hooks/useWebSocket.ts
// ============================================================================

import { useEffect, useRef, useState, useCallback } from "react"
import { Client } from "@stomp/stompjs"
import SockJS from "sockjs-client"
import { getSession } from "next-auth/react"
import { getWebSocketUrl } from "../utils/api"
import type {
  LeaderboardEntry,
  HostDashboardData,
  QuestionStats,
  ScoreCelebration,
  DetailedParticipantProgress,
} from "../types"

interface UseWebSocketProps {
  sessionCode: string
  isConnected: boolean
  onDashboardUpdate: (data: HostDashboardData) => void
  onLeaderboardUpdate: (entries: LeaderboardEntry[]) => void
  onStatsUpdate: (stats: QuestionStats) => void
  onParticipantsUpdate: (participants: any[]) => void
  onScoreUpdate: (celebration: ScoreCelebration) => void
  onTimerUpdate: (timer: any) => void
  onQuestionUpdate: (question: any) => void
  setConnectionStatus: (status: string) => void
  setAuthError: (error: string) => void
}

export const useWebSocket = ({
  sessionCode,
  isConnected,
  onDashboardUpdate,
  onLeaderboardUpdate,
  onStatsUpdate,
  onParticipantsUpdate,
  onScoreUpdate,
  onTimerUpdate,
  onQuestionUpdate,
  setConnectionStatus,
  setAuthError,
}: UseWebSocketProps) => {
  const stompRef = useRef<Client | null>(null)

  useEffect(() => {
    if (!isConnected || !sessionCode) return

    const setupWebSocket = async () => {
      try {
        const session = await getSession()
        const token = (session as any)?.apiAccessToken

        if (!token) {
          setAuthError("Authentication token not found. Please login first.")
          setConnectionStatus("Authentication Error")
          return
        }

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
            Authorization: `Bearer ${token}`,
          },
          debug: (str) => console.log("[STOMP]", str),
        })

        stomp.onConnect = () => {
          console.log("🔌 WebSocket connected to session:", sessionCode)
          setConnectionStatus("Connected")

          // Subscribe to topics
          stomp.subscribe(`/topic/session/${sessionCode}/enhanced-leaderboard`, (msg) => {
            const data = JSON.parse(msg.body)
            console.log("📊 Enhanced leaderboard update:", data)
            if (data.entries) {
              onLeaderboardUpdate(data.entries)
            }
          })

          stomp.subscribe(`/topic/session/${sessionCode}/leaderboard`, (msg) => {
            const data = JSON.parse(msg.body)
            console.log("📊 Leaderboard update:", data)
            let entries: LeaderboardEntry[] = []
            if (data.leaderboard?.entries) {
              entries = data.leaderboard.entries
            } else if (data.entries) {
              entries = data.entries
            } else if (Array.isArray(data)) {
              entries = data
            }
            onLeaderboardUpdate(entries)
          })

          stomp.subscribe(`/topic/session/${sessionCode}/host/dashboard`, (msg) => {
            const data = JSON.parse(msg.body)
            console.log("🎯 Host dashboard update:", data)
            onDashboardUpdate(data)
          })

          stomp.subscribe(`/topic/session/${sessionCode}/host/progress`, (msg) => {
            const data = JSON.parse(msg.body)
            console.log("📈 Host progress update:", data)
            if (data.participantProgress) {
              onParticipantsUpdate(data.participantProgress)
            }
          })

          stomp.subscribe(`/topic/session/${sessionCode}/live-stats`, (msg) => {
            const data = JSON.parse(msg.body)
            console.log("📊 Live stats update:", data)
            onStatsUpdate({
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

          stomp.subscribe(`/topic/session/${sessionCode}/score-updates`, (msg) => {
            const data = JSON.parse(msg.body)
            console.log("🎉 Score update:", data)
            if (data.isCorrect && data.pointsEarned > 0) {
              onScoreUpdate({
                participantId: data.participantId,
                nickname: data.participantNickname,
                pointsEarned: data.pointsEarned,
                newTotalScore: data.newScore,
                newRank: data.currentRank || 0,
                isCorrect: data.isCorrect,
                celebrationType: "SCORE_GAIN",
                animationType: "BOUNCE",
              })
            }
          })

          stomp.subscribe(`/topic/session/${sessionCode}/timer`, (msg) => {
            const data = JSON.parse(msg.body)
            console.log("⏰ Timer update:", data)
            onTimerUpdate(data)
          })

          stomp.subscribe(`/topic/session/${sessionCode}/participants`, (msg) => {
            const data = JSON.parse(msg.body)
            console.log("👥 Participants update:", data)
            onParticipantsUpdate(data.participants || [])
          })

          stomp.subscribe(`/topic/session/${sessionCode}/question`, (msg) => {
            const data = JSON.parse(msg.body)
            console.log("❓ Question update:", data)
            onQuestionUpdate(data.question || data)
          })
        }

        stomp.onDisconnect = () => {
          console.warn("⚠️ WebSocket disconnected")
          setConnectionStatus("Disconnected")
        }

        stomp.onStompError = (frame) => {
          console.error("❌ STOMP error:", frame)
          setConnectionStatus("Error")
          if (frame.headers && frame.headers.message && frame.headers.message.includes("401")) {
            setAuthError("Authentication failed. Please login again.")
          }
        }

        stomp.activate()
        stompRef.current = stomp
      } catch (error) {
        console.error("❌ WebSocket setup error:", error)
        setConnectionStatus("Error")
      }
    }

    setupWebSocket()

    return () => {
      console.log("🔌 Disconnecting WebSocket")
      stompRef.current?.deactivate()
    }
  }, [
    isConnected,
    sessionCode,
    onDashboardUpdate,
    onLeaderboardUpdate,
    onStatsUpdate,
    onParticipantsUpdate,
    onScoreUpdate,
    onTimerUpdate,
    onQuestionUpdate,
    setConnectionStatus,
    setAuthError,
  ])

  return stompRef
}
"use client"

import { useState, useCallback, useEffect } from "react"
import { useWebSocket, type WebSocketMessage } from "./use-websocket"

export interface QuizSession {
  id: string
  sessionName: string
  sessionCode: string
  status: "WAITING" | "ACTIVE" | "PAUSED" | "ENDED"
  currentQuestion: number
  totalQuestions: number
  hostName: string
  participantCount: number
  startTime?: string
  endTime?: string
}

export interface Participant {
  id: string
  nickname: string
  totalScore: number
  isActive: boolean
  isConnected: boolean
  joinedAt: string
  avatar?: {
    id: number
    name: string
  }
}

export interface QuestionData {
  id: string
  text: string
  type: "TF" | "MULTIPLE_CHOICE"
  timeLimit: number
  points: number
  imageUrl?: string
  options: Array<{
    id: string
    optionText: string
    optionOrder: number
    isCorrected: boolean
  }>
}

export interface LeaderboardEntry {
  participantId: string
  nickname: string
  totalScore: number
  rank: number
  avatar?: {
    id: number
    name: string
  }
}

export const useQuizSession = (sessionCode: string, participantId?: string, isHost = false) => {
  const [session, setSession] = useState<QuizSession | null>(null)
  const [participants, setParticipants] = useState<Participant[]>([])
  const [currentQuestion, setCurrentQuestion] = useState<QuestionData | null>(null)
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [timeRemaining, setTimeRemaining] = useState<number>(0)
  const [showResults, setShowResults] = useState(false)
  const [lastAnswerResult, setLastAnswerResult] = useState<{
    isCorrect: boolean
    correctAnswer: string
    pointsEarned: number
  } | null>(null)

  const handleWebSocketMessage = useCallback((message: WebSocketMessage) => {
    switch (message.type) {
      case "SESSION_UPDATED":
        setSession(message.payload)
        break

      case "PARTICIPANTS_UPDATED":
        setParticipants(message.payload)
        break

      case "QUESTION_STARTED":
        setCurrentQuestion(message.payload.question)
        setTimeRemaining(message.payload.timeLimit)
        setShowResults(false)
        setLastAnswerResult(null)
        break

      case "QUESTION_ENDED":
        setShowResults(true)
        setCurrentQuestion(null)
        break

      case "ANSWER_RESULT":
        setLastAnswerResult(message.payload)
        break

      case "LEADERBOARD_UPDATED":
        setLeaderboard(message.payload)
        break

      case "TIMER_UPDATE":
        setTimeRemaining(message.payload.timeRemaining)
        break

      case "SESSION_ENDED":
        setSession((prev) => (prev ? { ...prev, status: "ENDED" } : null))
        break

      default:
        console.log("Unhandled message type:", message.type)
    }
  }, [])

  const { isConnected, connectionStatus, sendMessage } = useWebSocket({
    url: process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:9999/ws",
    sessionCode,
    participantId,
    onMessage: handleWebSocketMessage,
  })

  // Host actions
  const startSession = useCallback(() => {
    if (isHost) {
      sendMessage({
        type: "START_SESSION",
        payload: { sessionCode },
      })
    }
  }, [isHost, sendMessage, sessionCode])

  const nextQuestion = useCallback(() => {
    if (isHost) {
      sendMessage({
        type: "NEXT_QUESTION",
        payload: { sessionCode },
      })
    }
  }, [isHost, sendMessage, sessionCode])

  const endSession = useCallback(() => {
    if (isHost) {
      sendMessage({
        type: "END_SESSION",
        payload: { sessionCode },
      })
    }
  }, [isHost, sendMessage, sessionCode])

  const removeParticipant = useCallback(
    (participantId: string) => {
      if (isHost) {
        sendMessage({
          type: "REMOVE_PARTICIPANT",
          payload: { sessionCode, participantId },
        })
      }
    },
    [isHost, sendMessage, sessionCode],
  )

  // Participant actions
  const submitAnswer = useCallback(
    (optionId: string) => {
      if (!isHost && participantId) {
        sendMessage({
          type: "SUBMIT_ANSWER",
          payload: {
            sessionCode,
            participantId,
            optionId,
            submittedAt: new Date().toISOString(),
          },
        })
      }
    },
    [isHost, participantId, sendMessage, sessionCode],
  )

  const sendFeedback = useCallback(
    (rating: number, comment?: string) => {
      if (!isHost && participantId) {
        sendMessage({
          type: "SUBMIT_FEEDBACK",
          payload: {
            sessionCode,
            participantId,
            rating,
            comment,
          },
        })
      }
    },
    [isHost, participantId, sendMessage, sessionCode],
  )

  // Timer countdown effect
  useEffect(() => {
    if (timeRemaining > 0 && currentQuestion) {
      const timer = setTimeout(() => {
        setTimeRemaining((prev) => prev - 1)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [timeRemaining, currentQuestion])

  return {
    // State
    session,
    participants,
    currentQuestion,
    leaderboard,
    timeRemaining,
    showResults,
    lastAnswerResult,
    isConnected,
    connectionStatus,

    // Host actions
    startSession,
    nextQuestion,
    endSession,
    removeParticipant,

    // Participant actions
    submitAnswer,
    sendFeedback,
  }
}

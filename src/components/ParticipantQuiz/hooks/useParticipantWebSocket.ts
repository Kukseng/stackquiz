// hooks/useParticipantWebSocket.ts
import { useEffect, useRef, useState, useCallback } from "react"
import { Client } from "@stomp/stompjs"
import SockJS from "sockjs-client"
import { WEBSOCKET_CONFIG } from "@/components/ParticipantQuiz/constants/config"
import { safeJsonParse } from "@/components/ParticipantQuiz/utils/helpers"
import type { ConnectionStatus } from "@/components/ParticipantQuiz/types/participant.types"

interface WebSocketCallbacks {
  onGameState: (msg: any) => void
  onQuestion: (msg: any) => void
  onCompletion: (msg: any) => void
  onLeaderboardUpdate: (leaderboard: any[]) => void
  onAnswerFeedback: (feedback: any) => void
  onScoreCelebration?: (celebration: any) => void
  onRankUpdate?: (rankUpdate: any) => void
  onQuestionStats?: (stats: any) => void
  onPersonalScoreUpdate?: (scoreUpdate: any) => void
}

export function useParticipantWebSocket(
  quizCode: string,
  participantId: string,
  nickname: string,
  avatarId: string,
  callbacks: WebSocketCallbacks
) {
  const stompRef = useRef<Client | null>(null)
  const questionStartTimeRef = useRef<number>(0)
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("Connecting...")
  const [reconnectAttempts, setReconnectAttempts] = useState(0)

  // Store callbacks in refs to prevent reconnection
  const callbacksRef = useRef(callbacks)

  useEffect(() => {
    callbacksRef.current = callbacks
  }, [callbacks])

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

        // Game state subscription
        stomp.subscribe(`/topic/session/${quizCode}/game-state`, (msg) => {
          const data = safeJsonParse(msg.body)
          if (data) {
            console.log("📢 Game state received:", data)
            callbacksRef.current.onGameState(data)
          }
        })

        // Participant-specific question queue
        stomp.subscribe(`/user/queue/session/${quizCode}/question`, (msg) => {
          const message = safeJsonParse(msg.body)
          if (message) {
            console.log("❓ Question received:", message)
            if (message.action === "NEXT_QUESTION" || message.question) {
              questionStartTimeRef.current = Date.now()
              callbacksRef.current.onQuestion(message)
            } else if (message.action === "PARTICIPANT_COMPLETED") {
              callbacksRef.current.onCompletion(message)
            }
          }
        })

        // Broadcast questions for SYNC mode
        stomp.subscribe(`/topic/session/${quizCode}/questions`, (msg) => {
          const message = safeJsonParse(msg.body)
          if (message) {
            console.log("❓ Broadcast question received:", message)
            questionStartTimeRef.current = Date.now()
            callbacksRef.current.onQuestion(message)
          }
        })

        // Leaderboard updates
        stomp.subscribe(`/topic/session/${quizCode}/leaderboard`, (msg) => {
          const data = safeJsonParse(msg.body)
          if (data) {
            console.log("🏆 Leaderboard update:", data)
            let entries = []
            if (data.leaderboard?.entries) {
              entries = data.leaderboard.entries
            } else if (data.entries) {
              entries = data.entries
            } else if (Array.isArray(data)) {
              entries = data
            }
            if (Array.isArray(entries)) {
              callbacksRef.current.onLeaderboardUpdate(entries)
            }
          }
        })

        // Answer feedback
        stomp.subscribe(`/user/queue/session/${quizCode}/feedback`, (msg) => {
          const feedback = safeJsonParse(msg.body)
          if (feedback && feedback.participantId) {
            console.log("📝 Answer feedback:", feedback)
            callbacksRef.current.onAnswerFeedback(feedback)
          }
        })

        // Optional: Score celebrations
        if (callbacksRef.current.onScoreCelebration) {
          stomp.subscribe(`/topic/session/${quizCode}/celebration`, (msg) => {
            const celebration = safeJsonParse(msg.body)
            if (celebration && celebration.participantId) {
              callbacksRef.current.onScoreCelebration?.(celebration)
            }
          })
        }

        // Optional: Rank updates
        if (callbacksRef.current.onRankUpdate) {
          stomp.subscribe(`/user/queue/session/${quizCode}/ranking`, (msg) => {
            const rankUpdate = safeJsonParse(msg.body)
            if (rankUpdate && rankUpdate.participantId) {
              callbacksRef.current.onRankUpdate?.(rankUpdate)
            }
          })
        }

        // Optional: Question stats
        if (callbacksRef.current.onQuestionStats) {
          stomp.subscribe(`/topic/session/${quizCode}/live-stats`, (msg) => {
            const stats = safeJsonParse(msg.body)
            if (stats) {
              callbacksRef.current.onQuestionStats?.(stats)
            }
          })
        }

        // Optional: Personal score updates
        if (callbacksRef.current.onPersonalScoreUpdate) {
          stomp.subscribe(`/user/queue/session/${quizCode}/score`, (msg) => {
            const scoreUpdate = safeJsonParse(msg.body)
            if (scoreUpdate && scoreUpdate.participantId) {
              callbacksRef.current.onPersonalScoreUpdate?.(scoreUpdate)
            }
          })
        }

        console.log("✅ All WebSocket subscriptions ready")
      }

      stomp.onStompError = (frame) => {
        console.error("❌ STOMP error:", frame.headers?.message || frame.body)
        setConnectionStatus("Error")

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
    [quizCode, participantId]
  )

  return { sendAnswer, connectionStatus }
}
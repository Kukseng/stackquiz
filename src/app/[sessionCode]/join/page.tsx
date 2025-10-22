"use client"
import type React from "react"
import { useEffect, useState, useCallback, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import axios from "axios"
import { Client } from "@stomp/stompjs"
import SockJS from "sockjs-client"
import { motion, AnimatePresence } from "framer-motion"
import { FaCircle, FaSquare, FaDiamond } from "react-icons/fa6"
import { IoTriangle } from "react-icons/io5"

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

interface Option {
  id: string
  text: string
  correct: boolean
  color?: string
  icon?: string
}

interface Question {
  id: string
  text: string
  questionText?: string
  options: Option[]
}

// Configuration
const WEBSOCKET_CONFIG = {
  url: process.env.NEXT_PUBLIC_WEBSOCKET_URL || "https://stackquiz-api.stackquiz.me/ws",
  reconnectDelay: 3000,
  heartbeatIncoming: 4000,
  heartbeatOutgoing: 4000,
  maxReconnectAttempts: 5,
}

// Icon colors for options
const OPTION_COLORS = [
  "#D4A03F", // Gold/Yellow
  "#E74C3C", // Red
  "#3498DB", // Blue
  "#2ECC71", // Green
]

const OPTION_ICONS = ["circle", "triangle", "square", "diamond"]

// Utility function
const safeJsonParse = (jsonString: string, fallback: any = null) => {
  try {
    return JSON.parse(jsonString)
  } catch (error) {
    console.error("JSON parse error:", error)
    return fallback
  }
}

const renderIcon = (icon?: string, size = 24) => {
  const iconProps = { size, className: "text-white" }
  switch (icon) {
    case "circle":
      return <FaCircle {...iconProps} />
    case "triangle":
      return <IoTriangle {...iconProps} />
    case "square":
      return <FaSquare {...iconProps} />
    case "diamond":
      return <FaDiamond {...iconProps} />
    default:
      return <FaCircle {...iconProps} />
  }
}

function getRankSuffix(rank: number): string {
  if (rank === 1) return "st"
  if (rank === 2) return "nd"
  if (rank === 3) return "rd"
  return "th"
}

// ===== LEADERBOARD COMPONENT =====
function Rank({ leaderboard }: { leaderboard: LeaderboardEntry[] }) {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800/80 backdrop-blur-md rounded-3xl p-8 shadow-2xl"
      >
        <h2 className="text-white text-3xl font-bold mb-6 text-center">Final Leaderboard</h2>
        <div className="space-y-3">
          {leaderboard.map((entry, index) => (
            <motion.div
              key={entry.participantId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center justify-between p-4 rounded-xl ${
                index < 3 ? "bg-gradient-to-r from-yellow-500/20 to-orange-500/20" : "bg-white/10"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    index === 0
                      ? "bg-yellow-400 text-yellow-900"
                      : index === 1
                        ? "bg-gray-300 text-gray-800"
                        : index === 2
                          ? "bg-orange-400 text-orange-900"
                          : "bg-white/20 text-white"
                  }`}
                >
                  {entry.position}
                </div>
                <span className="text-white font-semibold text-lg">{entry.nickname}</span>
              </div>
              <span className="text-white font-bold text-xl">{entry.totalScore.toLocaleString()}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

// ===== LIVE RANKING COMPONENT =====
function LiveRankingPanel({
  personalScore,
  personalRank,
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
      <div className="fixed top-4 left-4 z-50 flex items-center gap-2">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="bg-gradient-to-br from-gray-900 to-black backdrop-blur-md border-4 border-yellow-400 rounded-2xl px-4 py-3 shadow-2xl flex items-center gap-3"
        >
          <span className="text-3xl">🏆</span>
          <span className="text-white font-black text-2xl">
            {personalRank > 0 ? `${personalRank}${getRankSuffix(personalRank)}` : "-"}
          </span>
        </motion.div>

        {streak > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="bg-gradient-to-br from-orange-500 to-red-600 backdrop-blur-md border-4 border-orange-300 rounded-2xl px-4 py-3 shadow-2xl flex items-center gap-2"
          >
            <span className="text-2xl">🔥</span>
            <span className="text-white font-black text-2xl">{streak}</span>
          </motion.div>
        )}
      </div>

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed top-4 right-4 z-50 bg-gradient-to-br from-purple-600 to-indigo-700 backdrop-blur-md border-4 border-purple-300 rounded-2xl px-6 py-3 shadow-2xl"
      >
        <div className="text-white/80 text-sm font-bold mb-1">Score</div>
        <div className="text-white font-black text-3xl">{personalScore.toLocaleString()}</div>
      </motion.div>
    </>
  )
}

// ===== QUESTION TIMER COMPONENT =====
function QuestionTimer({
  timeRemaining,
  timeLimit,
  isActive,
  onTimeUp,
}: {
  timeRemaining: number
  timeLimit: number
  isActive: boolean
  onTimeUp: () => void
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
    <motion.div
      animate={{
        scale: isCritical ? [1, 1.05, 1] : 1,
      }}
      transition={{
        scale: { duration: 0.5, repeat: isCritical ? Infinity : 0 },
      }}
      className="relative w-24 h-24 mx-auto mb-4"
    >
      <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" stroke="rgba(255,255,255,0.2)" strokeWidth="8" fill="transparent" />
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
          animate={{ strokeDashoffset: 2 * Math.PI * 45 * (1 - percentage / 100) }}
          transition={{ duration: 0.5 }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.span
          key={timeRemaining}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          className={`text-3xl font-black ${
            isCritical ? "text-red-400" : isWarning ? "text-yellow-400" : "text-white"
          }`}
        >
          {timeRemaining}
        </motion.span>
      </div>
    </motion.div>
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

  const onGameStateRef = useRef(onGameState)
  const onQuestionRef = useRef(onQuestion)
  const onCompletionRef = useRef(onCompletion)
  const onLeaderboardUpdateRef = useRef(onLeaderboardUpdate)
  const onScoreCelebrationRef = useRef(onScoreCelebration)
  const onRankUpdateRef = useRef(onRankUpdate)
  const onQuestionStatsRef = useRef(onQuestionStats)
  const onPersonalScoreUpdateRef = useRef(onPersonalScoreUpdate)
  const onAnswerFeedbackRef = useRef(onAnswerFeedback)

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
        console.log("✅ WebSocket connected")
        setConnectionStatus("Connected")
        setReconnectAttempts(0)

        const subscriptions = [
          stomp.subscribe(`/topic/session/${quizCode}/game-state`, (msg) => {
            const data = safeJsonParse(msg.body)
            if (data) onGameStateRef.current(data)
          }),

          stomp.subscribe(`/user/queue/session/${quizCode}/question`, (msg) => {
            const message = safeJsonParse(msg.body)
            if (message) {
              if (message.action === "NEXT_QUESTION" || message.question) {
                questionStartTimeRef.current = Date.now()
                onQuestionRef.current(message)
              } else if (message.action === "PARTICIPANT_COMPLETED") {
                onCompletionRef.current(message)
              }
            }
          }),

          stomp.subscribe(`/topic/session/${quizCode}/question`, (msg) => {
            const message = safeJsonParse(msg.body)
            if (message) {
              questionStartTimeRef.current = Date.now()
              onQuestionRef.current(message)
            }
          }),

          stomp.subscribe(`/topic/session/${quizCode}/leaderboard`, (msg) => {
            const data = safeJsonParse(msg.body)
            if (data) {
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

          stomp.subscribe(`/topic/session/${quizCode}/celebration`, (msg) => {
            const celebration = safeJsonParse(msg.body)
            if (celebration && celebration.participantId) {
              onScoreCelebrationRef.current(celebration)
            }
          }),

          stomp.subscribe(`/user/queue/session/${quizCode}/ranking`, (msg) => {
            const rankUpdate = safeJsonParse(msg.body)
            if (rankUpdate && rankUpdate.participantId) {
              onRankUpdateRef.current(rankUpdate)
            }
          }),

          stomp.subscribe(`/topic/session/${quizCode}/live-stats`, (msg) => {
            const stats = safeJsonParse(msg.body)
            if (stats) {
              onQuestionStatsRef.current(stats)
            }
          }),

          stomp.subscribe(`/user/queue/session/${quizCode}/score`, (msg) => {
            const scoreUpdate = safeJsonParse(msg.body)
            if (scoreUpdate && scoreUpdate.participantId) {
              onPersonalScoreUpdateRef.current(scoreUpdate)
            }
          }),

          stomp.subscribe(`/user/queue/session/${quizCode}/feedback`, (msg) => {
            const feedback = safeJsonParse(msg.body)
            if (feedback && feedback.participantId) {
              onAnswerFeedbackRef.current(feedback)
            }
          }),
        ]
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
  const router = useRouter()
  const sessionCode = params?.sessionCode as string

  const [joined, setJoined] = useState(false)
  const [nickname, setNickname] = useState("")
  const [avatarId, setAvatarId] = useState("")
  const [participantId, setParticipantId] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const [gameState, setGameState] = useState<any>(null)
  const [status, setStatus] = useState<
    "LOBBY" | "COUNTDOWN" | "PLAY" | "ANSWER_REVEAL" | "RESULTS" | "COMPLETED" | "END"
  >("LOBBY")
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [questionNumber, setQuestionNumber] = useState<number>(0)
  const [totalQuestions, setTotalQuestions] = useState<number>(0)
  const [timeLeft, setTimeLeft] = useState<number>(30)
  const [answerSelected, setAnswerSelected] = useState<string | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [feedback, setFeedback] = useState<any>(null)

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [celebrations, setCelebrations] = useState<ScoreCelebration[]>([])
  const [currentCelebration, setCurrentCelebration] = useState<ScoreCelebration | null>(null)
  const [rankUpdate, setRankUpdate] = useState<ParticipantRankUpdate | null>(null)
  const [questionStats, setQuestionStats] = useState<QuestionStats | null>(null)

  const [personalScore, setPersonalScore] = useState<number>(0)
  const [personalRank, setPersonalRank] = useState<number>(0)
  const [scoreChange, setScoreChange] = useState<number | undefined>(undefined)
  const [answerFeedback, setAnswerFeedback] = useState<AnswerFeedback | null>(null)
  const [streak, setStreak] = useState<number>(0)
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false)

  // Feedback modal states
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)
  const [feedbackText, setFeedbackText] = useState("")
  const [satisfactionLevel, setSatisfactionLevel] = useState<string>("")
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false)
  const [feedbackSuccess, setFeedbackSuccess] = useState(false)
  const [quizId, setQuizId] = useState<string>("")

  const handleNavigateToJoinRoom = () => {
    router.push("/explore")
  }

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

      setParticipantId(res.data.id)
      setPersonalScore(res.data.totalScore || 0)

      // Try to get quizId from the join response first
      if (res.data.quizId) {
        setQuizId(res.data.quizId)
      } else if (res.data.sessionId) {
        // If not in join response, try to fetch from session details
        try {
          const sessionRes = await axios.get(
            `https://stackquiz-api.stackquiz.me/api/v1/sessions/${res.data.sessionId}`
          )
          if (sessionRes.data.quizId) {
            setQuizId(sessionRes.data.quizId)
          }
        } catch (err) {
          console.error("Failed to fetch quiz ID from session:", err)
        }
      }

      setJoined(true)
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to join session. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleSubmitFeedback() {
    if (!satisfactionLevel) {
      setError("Please select a satisfaction level")
      return
    }

    if (!quizId) {
      setError("Unable to identify the quiz. Please contact the organizer.")
      return
    }

    setIsSubmittingFeedback(true)
    setError("")

    try {
      const response = await axios.post(
        `https://stackquiz-api.stackquiz.me/api/v1/quizzes/${quizId}/feedback`,
        {
          text: feedbackText.trim() || undefined,
          satisfactionLevel: satisfactionLevel,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )

      console.log("Feedback submitted successfully:", response.data)
      setFeedbackSuccess(true)
      setTimeout(() => {
        setShowFeedbackModal(false)
        setFeedbackSuccess(false)
        setFeedbackText("")
        setSatisfactionLevel("")
      }, 2000)
    } catch (err: any) {
      console.error("Feedback submission error:", err)
      const errorMessage = err.response?.data?.message || err.message || "Failed to submit feedback. Please try again."
      setError(errorMessage)
    } finally {
      setIsSubmittingFeedback(false)
    }
  }

  const { sendAnswer, connectionStatus } = useParticipantWebSocket(
    joined ? (sessionCode as string) : "",
    joined ? participantId : "",
    joined ? nickname : "",
    joined ? avatarId : "",
    (msg) => setGameState(msg),
    (qmsg) => {
      const question = qmsg.question || qmsg
      const qNumber = qmsg.questionNumber || qmsg.currentQuestion || 0
      const total = qmsg.totalQuestions || 0
      const timeLimit = qmsg.timeLimit || 30

      // Assign colors and icons to options
      const optionsWithStyle = (question.options || []).map((opt: any, idx: number) => ({
        ...opt,
        color: OPTION_COLORS[idx % OPTION_COLORS.length],
        icon: OPTION_ICONS[idx % OPTION_ICONS.length],
      }))

      setCurrentQuestion({ ...question, options: optionsWithStyle })
      setQuestionNumber(qNumber)
      setTotalQuestions(total)
      setTimeLeft(timeLimit)
      setAnswerSelected(null)
      setFeedback(null)
      setShowFeedback(false)
      setAnswerFeedback(null)
      setIsSubmittingAnswer(false)
      setStatus("PLAY")
    },
    (cmsg) => setStatus("COMPLETED"),
    (leaderboardEntries) => {
      setLeaderboard(leaderboardEntries)

      const currentParticipant = leaderboardEntries.find((entry) => entry.participantId === participantId)
      if (currentParticipant) {
        setPersonalRank(currentParticipant.position)
        setPersonalScore(currentParticipant.totalScore)
        if (currentParticipant.streak) {
          setStreak(currentParticipant.streak)
        }
      }
    },
    (celebration) => {
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
    (rankUpdate) => {
      if (rankUpdate.participantId === participantId) {
        setRankUpdate(rankUpdate)
        setPersonalRank(rankUpdate.currentRank)
        setPersonalScore(rankUpdate.currentScore)
        setTimeout(() => setRankUpdate(null), 3000)
      }
    },
    (stats) => setQuestionStats(stats),
    (scoreUpdate) => {
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
    (feedback) => {
      if (feedback.participantId === participantId) {
        setAnswerFeedback(feedback)
        setPersonalScore(feedback.newTotalScore)
        setPersonalRank(feedback.currentRank)

        if (feedback.streak) {
          setStreak(feedback.streak)
        }

        setStatus("ANSWER_REVEAL")
        setIsSubmittingAnswer(false)
      }
    },
  )

  useEffect(() => {
    if (!gameState) return

    // Try to extract quizId from gameState if we don't have it yet
    if (!quizId && gameState.quizId) {
      setQuizId(gameState.quizId)
    }

    if (gameState.action === "SESSION_STARTED" || gameState.status === "IN_PROGRESS") {
      if (!currentQuestion && status !== "ANSWER_REVEAL") {
        setStatus("PLAY")
      }
    } else if (gameState.action === "SESSION_ENDED" || gameState.status === "ENDED") {
      setStatus("END")
    } else if (gameState.action === "SESSION_LOBBY" || gameState.status === "WAITING") {
      setStatus("LOBBY")
    }
  }, [gameState, currentQuestion, status, quizId])

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

  function handleTimeUp() {
    setFeedback({ timeUp: true, canStillAnswer: true })
  }

  function handleAnswer(optionId: string) {
    if (!currentQuestion || answerSelected || isSubmittingAnswer) {
      return
    }

    setAnswerSelected(optionId)
    setIsSubmittingAnswer(true)

    const success = sendAnswer(optionId, currentQuestion.id)
    if (success) {
      setShowFeedback(true)
      setFeedback({ submitted: true })
    } else {
      setAnswerSelected(null)
      setIsSubmittingAnswer(false)
      setError("Failed to submit answer. Please try again.")
    }
  }

  function handleContinueFromReveal() {
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
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-6 right-6 bg-white rounded-full px-6 py-3 shadow-lg"
        >
          <span className="text-gray-800 font-bold text-lg">{sessionCode}</span>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={handleNavigateToJoinRoom}
          className="absolute top-6 left-6 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors cursor-pointer"
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
        <button
          onClick={handleNavigateToJoinRoom}
          className="absolute top-6 left-6 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors cursor-pointer"
        >
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
              onClick={handleNavigateToJoinRoom}
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
              <button
                onClick={() => setShowFeedbackModal(true)}
                className="py-3 bg-purple-700/50 border-2 border-purple-400 rounded-xl text-white font-semibold hover:bg-purple-700/70 transition-colors flex items-center justify-center gap-2"
              >
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

        {/* Feedback Modal */}
        <AnimatePresence>
          {showFeedbackModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => !isSubmittingFeedback && !feedbackSuccess && setShowFeedbackModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gray-800 rounded-3xl p-8 max-w-md w-full shadow-2xl border-2 border-purple-400"
              >
                {feedbackSuccess ? (
                  <div className="text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
                    >
                      <span className="text-4xl text-white">✓</span>
                    </motion.div>
                    <h3 className="text-white text-2xl font-bold mb-2">Thank You!</h3>
                    <p className="text-white/80">Your feedback has been submitted successfully.</p>
                    <p className="text-white/60 text-sm mt-2">The organizer will be notified.</p>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-white text-2xl font-bold">Share Your Feedback</h3>
                      <button
                        onClick={() => setShowFeedbackModal(false)}
                        className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
                        disabled={isSubmittingFeedback}
                      >
                        <span className="text-white text-xl">✕</span>
                      </button>
                    </div>

                    <div className="mb-6">
                      <p className="text-white/90 text-sm mb-4">How satisfied are you with this quiz?</p>
                      
                      {/* Debug info - only show if quizId is missing */}
                      {!quizId && (
                        <div className="mb-3 p-2 bg-yellow-500/20 border border-yellow-400/50 rounded-lg">
                          <p className="text-yellow-200 text-xs">⚠️ Quiz ID not available. Feedback may not work.</p>
                        </div>
                      )}
                      
                      <div className="grid grid-cols-5 gap-2">
                        {[
                          { value: "VERY_DISSATISFIED", emoji: "😞", label: "Very Bad" },
                          { value: "DISSATISFIED", emoji: "😕", label: "Bad" },
                          { value: "NEUTRAL", emoji: "😐", label: "Okay" },
                          { value: "SATISFIED", emoji: "😊", label: "Good" },
                          { value: "VERY_SATISFIED", emoji: "😍", label: "Excellent" },
                        ].map((option) => (
                          <button
                            key={option.value}
                            onClick={() => setSatisfactionLevel(option.value)}
                            className={`flex flex-col items-center p-3 rounded-xl transition-all ${
                              satisfactionLevel === option.value
                                ? "bg-purple-600 border-2 border-purple-300 scale-110"
                                : "bg-white/10 border-2 border-transparent hover:bg-white/20"
                            }`}
                            disabled={isSubmittingFeedback}
                          >
                            <span className="text-3xl mb-1">{option.emoji}</span>
                            <span className="text-white text-xs">{option.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="text-white/90 text-sm mb-2 block">
                        Additional Comments (Optional)
                      </label>
                      <textarea
                        value={feedbackText}
                        onChange={(e) => setFeedbackText(e.target.value)}
                        placeholder="Tell us more about your experience..."
                        className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-purple-400 transition-colors resize-none"
                        rows={4}
                        maxLength={500}
                        disabled={isSubmittingFeedback}
                      />
                      <p className="text-white/50 text-xs mt-1 text-right">
                        {feedbackText.length}/500
                      </p>
                    </div>

                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-4 p-3 bg-red-500/20 border border-red-400 rounded-xl"
                      >
                        <p className="text-red-200 text-sm text-center">{error}</p>
                      </motion.div>
                    )}

                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowFeedbackModal(false)}
                        className="flex-1 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white font-semibold hover:bg-white/20 transition-colors"
                        disabled={isSubmittingFeedback}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSubmitFeedback}
                        disabled={!satisfactionLevel || isSubmittingFeedback}
                        className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 border-2 border-purple-400 rounded-xl text-white font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmittingFeedback ? "Submitting..." : "Submit"}
                      </button>
                    </div>
                  </>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
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
            transition={{ duration: 1.5, repeat: Infinity }}
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

  // Answer reveal phase
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
            you're on the podium!
          </motion.p>

          {/* Continue button */}
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
                {isSubmittingAnswer ? "📤 Submitting answer..." : "✅ Answer submitted!"}
              </p>
            </motion.div>
          )}

          {feedback?.timeUp && !answerSelected && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-yellow-500/20 backdrop-blur-sm border-2 border-yellow-400/50 rounded-2xl text-center"
            >
              <p className="text-white font-semibold">⏰ Time's up!</p>
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
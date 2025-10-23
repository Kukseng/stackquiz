// "use client"

import React, { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import axios from "axios"

// ===== INTERFACES =====
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

interface QuestionAnalyticsProps {
  sessionCode: string
  accessToken: string
  onClose: () => void
  onNextQuestion: () => void
  autoAdvanceDelay?: number // milliseconds, default 10000 (10 seconds)
}

// ===== COMPONENT =====
export default function QuestionAnalytics({
  sessionCode,
  accessToken,
  onClose,
  onNextQuestion,
  autoAdvanceDelay = 10000
}: QuestionAnalyticsProps) {
  const [analytics, setAnalytics] = useState<QuestionAnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [countdown, setCountdown] = useState(Math.floor(autoAdvanceDelay / 1000))

  // Fetch analytics data
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true)
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/host/session/${sessionCode}/question-analytics`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        setAnalytics(response.data)
        setError(null)
      } catch (err: any) {
        console.error("Error fetching analytics:", err)
        setError(err.response?.data?.message || "Failed to load analytics")
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [sessionCode, accessToken])

  // Countdown timer
  useEffect(() => {
    if (!analytics || countdown <= 0) return

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          onNextQuestion()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [analytics, countdown, onNextQuestion])

  // Loading state
  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white text-xl font-semibold">Loading Analytics...</p>
        </motion.div>
      </div>
    )
  }

  // Error state
  if (error || !analytics) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-red-900 via-pink-900 to-purple-900">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl p-8 max-w-md text-center shadow-2xl"
        >
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error || "Failed to load analytics"}</p>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors"
          >
            Close
          </button>
        </motion.div>
      </div>
    )
  }

  // Get sorted options for display
  const sortedOptions = Object.values(analytics.optionStatistics).sort((a, b) => b.count - a.count)

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">
              Question {analytics.currentQuestionNumber} of {analytics.totalQuestions}
            </h1>
            <p className="text-xl md:text-2xl text-blue-200">{analytics.questionText}</p>
          </motion.div>

          {/* Main Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Participation Card */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-2xl"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4">📊 Participation</h3>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-4xl font-bold text-blue-600">
                    {analytics.participantsAnswered}/{analytics.totalParticipants}
                  </p>
                  <p className="text-gray-600">Participants Answered</p>
                </div>
                <div className="relative w-24 h-24">
                  <svg className="transform -rotate-90 w-24 h-24">
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="#e5e7eb"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="#3b82f6"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 40}`}
                      strokeDashoffset={`${2 * Math.PI * 40 * (1 - analytics.participationRate / 100)}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold text-gray-800">
                      {analytics.participationRate.toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Accuracy Card */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-6 shadow-2xl"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4">🎯 Accuracy</h3>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-4xl font-bold text-green-600">
                    {analytics.accuracyRate.toFixed(1)}%
                  </p>
                  <p className="text-gray-600">Correct Answers</p>
                </div>
                <div className="relative w-24 h-24">
                  <svg className="transform -rotate-90 w-24 h-24">
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="#e5e7eb"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="#10b981"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 40}`}
                      strokeDashoffset={`${2 * Math.PI * 40 * (1 - analytics.accuracyRate / 100)}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold text-gray-800">
                      {analytics.correctAnswers}/{analytics.participantsAnswered}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Answer Distribution */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-2xl mb-8"
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-6">📈 Answer Distribution</h3>
            <div className="space-y-4">
              {sortedOptions.map((option, index) => (
                <motion.div
                  key={option.optionId}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="relative"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">
                        {option.isCorrect ? "✅" : "❌"}
                      </span>
                      <span className={`font-semibold ${option.isCorrect ? "text-green-600" : "text-gray-700"}`}>
                        {option.optionText}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-gray-800">{option.count}</span>
                      <span className="text-gray-600 ml-2">({option.percentage.toFixed(1)}%)</span>
                    </div>
                  </div>
                  <div className="h-8 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${option.percentage}%` }}
                      transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                      className={`h-full ${
                        option.isCorrect
                          ? "bg-gradient-to-r from-green-400 to-green-600"
                          : "bg-gradient-to-r from-red-400 to-red-600"
                      }`}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Top 3 Leaderboard */}
          {analytics.top3.length > 0 && (
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-2xl p-6 shadow-2xl mb-8"
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">🏆 Top 3 Leaderboard</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {analytics.top3.map((entry, index) => (
                  <motion.div
                    key={entry.participantId}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.7 + index * 0.1, type: "spring" }}
                    className={`relative p-6 rounded-xl text-center ${
                      index === 0
                        ? "bg-gradient-to-br from-yellow-400 to-yellow-600 md:order-2"
                        : index === 1
                        ? "bg-gradient-to-br from-gray-300 to-gray-500 md:order-1"
                        : "bg-gradient-to-br from-orange-400 to-orange-600 md:order-3"
                    }`}
                  >
                    <div className="text-5xl mb-2">
                      {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                    </div>
                    {entry.avatarId && (
                      <img
                        src={`/avatars/${entry.avatarId}.png`}
                        alt={entry.nickname}
                        className="w-16 h-16 rounded-full mx-auto mb-2 border-4 border-white"
                        onError={(e) => {
                          e.currentTarget.src = "/avatars/default.png"
                        }}
                      />
                    )}
                    <p className="font-bold text-white text-lg mb-1">{entry.nickname}</p>
                    <p className="text-white text-2xl font-bold mb-1">{entry.totalScore} pts</p>
                    <p className="text-white text-sm">{entry.correctAnswers} correct</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Timing Stats */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="bg-white rounded-2xl p-6 shadow-2xl mb-8"
          >
            <div className="flex items-center justify-center gap-8 text-center">
              <div>
                <p className="text-gray-600 mb-1">⏱️ Average Time</p>
                <p className="text-3xl font-bold text-blue-600">{analytics.averageResponseTime.toFixed(1)}s</p>
              </div>
              <div className="w-px h-12 bg-gray-300" />
              <div>
                <p className="text-gray-600 mb-1">⚡ Fastest Time</p>
                <p className="text-3xl font-bold text-green-600">{analytics.fastestResponseTime.toFixed(1)}s</p>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex flex-col md:flex-row gap-4 justify-center items-center"
          >
            <button
              onClick={onNextQuestion}
              className="px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold text-lg hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Next Question →
            </button>
            <button
              onClick={onClose}
              className="px-8 py-4 bg-gray-500 text-white rounded-xl font-bold text-lg hover:bg-gray-600 transition-all shadow-lg"
            >
              Close
            </button>
            <div className="text-white text-lg">
              Auto-advancing in <span className="font-bold text-2xl">{countdown}</span>s
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}


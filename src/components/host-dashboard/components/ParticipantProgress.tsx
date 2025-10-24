// ============================================================================
// FILE: components/host-dashboard/components/ParticipantProgress.tsx
// ============================================================================

import React, { useState } from "react"
import { motion } from "framer-motion"
import type { DetailedParticipantProgress, ParticipantAnswer } from "../types"

interface ParticipantProgressProps {
  participants: any[]
  detailedProgress: DetailedParticipantProgress[]
  totalQuestions: number
}

export function ParticipantProgress({ participants, detailedProgress, totalQuestions }: ParticipantProgressProps) {
  const [sortBy, setSortBy] = useState<"score" | "progress" | "accuracy">("score")

  const enrichedParticipants = participants.map((p) => {
    const details = detailedProgress.find((d) => d.participantId === p.id)
    return {
      ...p,
      ...details,
    }
  })

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
                      {participant.answeredCount || 0}/{totalQuestions} • {participant.correctCount || 0} correct •
                      {Math.round(participant.accuracy || 0)}% accuracy
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-lg font-bold text-indigo-600">{participant.totalScore || 0}</div>
                  <div className="text-xs text-gray-500">points</div>
                </div>
              </div>

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
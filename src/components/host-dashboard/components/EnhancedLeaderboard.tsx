// ============================================================================
// FILE: components/host-dashboard/components/EnhancedLeaderboard.tsx
// ============================================================================

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import  LeaderboardEntry  from "./LeaderboardEntry"
import type { LeaderboardEntry as LeaderboardEntryType, ScoreCelebration, QuestionStats } from "../types"

interface EnhancedLeaderboardProps {
  leaderboard: LeaderboardEntryType[]
  celebrations: ScoreCelebration[]
  questionStats: QuestionStats | null
}

export function EnhancedLeaderboard({ leaderboard, celebrations, questionStats }: EnhancedLeaderboardProps) {
  const [previousPositions, setPreviousPositions] = useState<Map<string, number>>(new Map())

  useEffect(() => {
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

      {questionStats && (
        <div className="mb-4 p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-purple-800">Question {questionStats.questionNumber} Progress</span>
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

      <div className="space-y-2 max-h-96 overflow-y-auto">
        <AnimatePresence>
          {leaderboard.length > 0 ? (
            leaderboard.map((entry, index) => {
              const positionChange = getPositionChange(entry.participantId, index + 1)
              const celebration = celebrations.find((c) => c.participantId === entry.participantId)

              return (
                <LeaderboardEntry
                  key={entry.participantId}
                  entry={entry}
                  index={index}
                  positionChange={positionChange}
                  celebration={celebration}
                />
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
// components/ParticipantQuiz/LiveRankingPanel.tsx
"use client"
import React from "react"
import { getRankSuffix } from "@/components/ParticipantQuiz/utils/helpers"

interface LiveRankingPanelProps {
  personalScore: number
  personalRank: number
  nickname: string
  isMinimized?: boolean
  streak?: number
}

export function LiveRankingPanel({
  personalScore,
  personalRank,
  isMinimized = false,
  streak = 0,
}: LiveRankingPanelProps) {
  return (
    <>
      {/* Top Left: Rank and Streak */}
      <div className="fixed top-4 left-4 z-50 flex items-center gap-3">
        <div className="bg-gray-900/90 backdrop-blur-sm border-2 border-yellow-500 rounded-lg px-3 py-2 flex items-center gap-2">
          <span className="text-2xl">🏆</span>
          <span className="text-white font-bold text-lg">
            {personalRank > 0 ? `${personalRank}${getRankSuffix(personalRank)}` : "-"}
          </span>
        </div>

        {streak > 0 && (
          <div className="bg-gray-900/90 backdrop-blur-sm border-2 border-orange-500 rounded-lg px-3 py-2 flex items-center gap-2">
            <span className="text-2xl">🔥</span>
            <span className="text-white font-bold text-lg">{streak}</span>
          </div>
        )}
      </div>

      {/* Top Right: Score */}
      <div className="fixed top-4 right-4 z-50">
        <div className="bg-gray-900/90 backdrop-blur-sm border-2 border-blue-500 rounded-lg px-4 py-2">
          <span className="text-white font-bold text-2xl">{personalScore.toLocaleString()}</span>
        </div>
      </div>
    </>
  )
}
// ============================================================================
// FILE: components/host-dashboard/components/DashboardHeader.tsx
// ============================================================================

import React from "react"
import type { HostDashboardData } from "../types"

interface DashboardHeaderProps {
  connectionStatus: string
  hostDashboard: HostDashboardData | null
  authError: string
  sessionCode: string
  onStartQuiz: () => void
  onNextQuestion: () => void
  onDisconnect: () => void
}

export function DashboardHeader({
  connectionStatus,
  hostDashboard,
  authError,
  sessionCode,
  onStartQuiz,
  onNextQuestion,
  onDisconnect,
}: DashboardHeaderProps) {
  return (
    <div className="bg-white shadow-lg p-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <span className="mr-2">🎮</span>
            Quiz Host Dashboard
          </h1>
          <div className="flex items-center space-x-4 mt-2">
            <div className="flex items-center space-x-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  connectionStatus === "Connected"
                    ? "bg-green-500 animate-pulse"
                    : connectionStatus === "Connecting..."
                      ? "bg-yellow-500 animate-pulse"
                      : connectionStatus === "Authentication Error"
                        ? "bg-red-500"
                        : "bg-red-500"
                }`}
              />
              <span className="text-sm text-gray-600 font-medium">{connectionStatus}</span>
            </div>

            {hostDashboard && (
              <div className="text-sm text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                Q{hostDashboard.currentQuestion}/{hostDashboard.totalQuestions} •{hostDashboard.participantsAnswered}/
                {hostDashboard.totalParticipants} answered
              </div>
            )}
          </div>

          {authError && (
            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">⚠️ {authError}</div>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <div className="bg-gradient-to-r from-purple-100 to-indigo-100 px-6 py-4 rounded-xl border border-purple-200">
            <p className="text-xs text-gray-600 mb-1">Session Code</p>
            <p className="text-2xl font-bold text-purple-800">{sessionCode}</p>
          </div>

          <div className="flex flex-col space-y-2">
            <button
              onClick={onStartQuiz}
              className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition shadow-lg"
              disabled={!!authError}
            >
              🚀 Start Quiz
            </button>

            <button
              onClick={onNextQuestion}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition"
              disabled={connectionStatus !== "Connected" || !!authError}
            >
              ➡️ Next Question
            </button>

            <button
              onClick={onDisconnect}
              className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition text-sm"
            >
              🔌 Disconnect
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
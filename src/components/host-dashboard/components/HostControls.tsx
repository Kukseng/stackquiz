// ============================================================================
// FILE: components/host-dashboard/components/HostControls.tsx
// ============================================================================

import React, { useState } from "react"
import Link from "next/link"
import type { HostDashboardData } from "../types"

interface HostControlsProps {
  hostDashboard: HostDashboardData | null
  sessionCode: string
  onStartSession: () => void
  onPauseSession: () => void
  onResumeSession: () => void
  onEndSession: () => void
  onNextQuestion: () => void
  onSetQuestionTimeLimit: (timeLimit: number) => void
}

export function HostControls({
  hostDashboard,
  sessionCode,
  onStartSession,
  onPauseSession,
  onResumeSession,
  onEndSession,
  onNextQuestion,
  onSetQuestionTimeLimit,
}: HostControlsProps) {
  const [customTimeLimit, setCustomTimeLimit] = useState(30)

  if (!hostDashboard) return null

  return (
    <div className="bg-white rounded-2xl p-6 shadow-xl">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
        <span className="mr-2">🎮</span>
        Host Controls
      </h3>

      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          {hostDashboard.canStart && (
            <button
              onClick={onStartSession}
              className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition text-sm"
            >
              🚀 Start
            </button>
          )}

          {hostDashboard.canPause && (
            <button
              onClick={onPauseSession}
              className="px-4 py-2 bg-gradient-to-r from-yellow-600 to-yellow-700 text-white rounded-lg hover:from-yellow-700 hover:to-yellow-800 transition text-sm"
            >
              ⏸️ Pause
            </button>
          )}

          {hostDashboard.canResume && (
            <button
              onClick={onResumeSession}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition text-sm"
            >
              ▶️ Resume
            </button>
          )}

          {hostDashboard.canAdvanceQuestion && (
            <button
              onClick={onNextQuestion}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition text-sm"
            >
              ➡️ Next Q
            </button>
          )}

          {hostDashboard.canEnd && (
            <button
              onClick={onEndSession}
              className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition text-sm col-span-2"
            >
              🛑 End Session
            </button>
          )}

          {hostDashboard?.sessionStatus === "COMPLETED" && (
            <div className="col-span-2 text-center mt-2">
              <Link href={`/host/${sessionCode}/report`}>
                <button className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-bold hover:from-purple-700 hover:to-indigo-700 shadow-lg">
                  📊 View Session Report
                </button>
              </Link>
            </div>
          )}
        </div>

        {hostDashboard.currentTimer && (
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="text-sm font-medium text-gray-700 mb-2">
              Current Timer: {hostDashboard.currentTimer.timerType}
            </div>
            <div className="text-lg font-bold text-purple-600">
              {Math.floor(hostDashboard.currentTimer.remainingSeconds / 60)}:
              {(hostDashboard.currentTimer.remainingSeconds % 60).toString().padStart(2, "0")}
            </div>
            <div className="text-xs text-gray-500">Status: {hostDashboard.currentTimer.timerStatus}</div>
          </div>
        )}

        <div className="p-3 bg-gray-50 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 mb-2">Set Question Time Limit</label>
          <div className="flex space-x-2">
            <input
              type="number"
              min="5"
              max="300"
              value={customTimeLimit}
              onChange={(e) => setCustomTimeLimit(Number.parseInt(e.target.value))}
              className="flex-1 px-3 py-1 border rounded text-sm"
            />
            <button
              onClick={() => onSetQuestionTimeLimit(customTimeLimit)}
              className="px-3 py-1 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700"
            >
              Set
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
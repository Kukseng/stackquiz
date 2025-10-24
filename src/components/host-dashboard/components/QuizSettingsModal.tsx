// ============================================================================
// FILE: components/host-dashboard/components/QuizSettingsModal.tsx
// ============================================================================

import React, { useState } from "react"
import { motion } from "framer-motion"
import type { QuizSettings } from "../types"

interface QuizSettingsModalProps {
  isOpen: boolean
  onClose: () => void
  onStart: (settings: any) => void
}

export function QuizSettingsModal({ isOpen, onClose, onStart }: QuizSettingsModalProps) {
  const [settings, setSettings] = useState<QuizSettings>({
    mode: "SYNC",
    scheduledStartTime: "",
    scheduledEndTime: "",
    defaultQuestionTimeLimit: 30,
    autoAdvanceQuestions: false,
    allowLateJoining: true,
    shuffleQuestions: false,
    showCorrectAnswers: true,
    showTimer: true,
    maxParticipants: 100,
  })

  if (!isOpen) return null

  const handleStart = () => {
    const timingRequest = {
      // Only send scheduled times for ASYNC mode
      scheduledStartTime: settings.mode === "ASYNC" && settings.scheduledStartTime
        ? new Date(settings.scheduledStartTime).toISOString()
        : null,
      scheduledEndTime: settings.mode === "ASYNC" && settings.scheduledEndTime 
        ? new Date(settings.scheduledEndTime).toISOString() 
        : null,
      defaultQuestionTimeLimit: settings.defaultQuestionTimeLimit,
      autoAdvanceQuestions: settings.autoAdvanceQuestions,
      allowLateJoining: settings.allowLateJoining,
      showTimer: settings.showTimer,
      mode: settings.mode,
      maxParticipants: settings.maxParticipants,
      shuffleQuestions: settings.shuffleQuestions,
      showCorrectAnswers: settings.showCorrectAnswers,
    }

    onStart(timingRequest)
    onClose()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-800">🎮 Quiz Settings</h2>

        <div className="space-y-6">
          {/* Quiz Mode Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Quiz Mode</label>
            <select
              value={settings.mode}
              onChange={(e) => setSettings({ ...settings, mode: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="SYNC">🎯 Synchronous (Real-time)</option>
              <option value="ASYNC">⏱️ Asynchronous (Self-paced)</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              {settings.mode === "SYNC"
                ? "🎮 Host controls the quiz - all participants see the same question together"
                : "⏱️ Participants progress at their own pace within scheduled times"}
            </p>
          </div>

          {/* Time Settings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Question Time Limit (seconds)
              </label>
              <input
                type="number"
                min="5"
                max="300"
                value={settings.defaultQuestionTimeLimit}
                onChange={(e) => setSettings({ ...settings, defaultQuestionTimeLimit: Number.parseInt(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Recommended: 30s for multiple choice
              </p>
            </div>

            {/* Only show scheduled times for ASYNC mode */}
            {settings.mode === "ASYNC" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Scheduled Start Time
                  </label>
                  <input
                    type="datetime-local"
                    value={settings.scheduledStartTime}
                    onChange={(e) => setSettings({ ...settings, scheduledStartTime: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">When participants can start</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Scheduled End Time
                  </label>
                  <input
                    type="datetime-local"
                    value={settings.scheduledEndTime}
                    onChange={(e) => setSettings({ ...settings, scheduledEndTime: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Deadline for completion</p>
                </div>
              </>
            )}
          </div>

          {/* SYNC Mode Info */}
          {settings.mode === "SYNC" && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="text-blue-600 text-2xl">ℹ️</div>
                <div>
                  <h3 className="text-sm font-semibold text-blue-800 mb-1">
                    Real-time Mode
                  </h3>
                  <p className="text-xs text-blue-700">
                    In synchronous mode, the quiz starts immediately when you click "Start Quiz". 
                    You control when each question appears, and all participants see the same question at the same time - just like Kahoot!
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Additional Settings */}
        <div className="mt-6 space-y-3">
          {[
            {
              key: "allowLateJoining",
              label: "Allow late joins",
              description: "Participants can join after the quiz starts",
            },
            {
              key: "autoAdvanceQuestions",
              label: "Auto-advance questions",
              description: "Automatically move to next question when time expires",
              showOnlyFor: "SYNC", // Only show in SYNC mode
            },
            {
              key: "showTimer",
              label: "Show timer",
              description: "Display countdown timer to participants",
            },
            {
              key: "showCorrectAnswers",
              label: "Show correct answers",
              description: "Display correct answers after each question",
            },
          ]
            .filter((option) => !option.showOnlyFor || option.showOnlyFor === settings.mode)
            .map(({ key, label, description }) => (
              <label
                key={key}
                className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={settings[key as keyof QuizSettings] as boolean}
                  onChange={(e) => setSettings({ ...settings, [key]: e.target.checked })}
                  className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                />
                <div>
                  <span className="text-sm font-medium text-gray-700">{label}</span>
                  <p className="text-xs text-gray-500">{description}</p>
                </div>
              </label>
            ))}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleStart}
            className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition shadow-lg font-bold"
          >
            {settings.mode === "SYNC" ? "🚀 Start Quiz Now" : "📅 Schedule Quiz"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
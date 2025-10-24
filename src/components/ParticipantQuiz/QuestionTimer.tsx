// components/ParticipantQuiz/QuestionTimer.tsx
"use client"
import React, { useEffect } from "react"
import { motion } from "framer-motion"
import { TIMER_CONFIG } from "@/components/ParticipantQuiz/constants/config"

interface QuestionTimerProps {
  timeRemaining: number
  timeLimit: number
  isActive: boolean
  onTimeUp: () => void
  showWarning?: boolean
}

export function QuestionTimer({
  timeRemaining,
  timeLimit,
  isActive,
  onTimeUp,
  showWarning = true,
}: QuestionTimerProps) {
  const percentage = (timeRemaining / timeLimit) * 100
  const isWarning = timeRemaining <= TIMER_CONFIG.WARNING_THRESHOLD
  const isCritical = timeRemaining <= TIMER_CONFIG.CRITICAL_THRESHOLD

  useEffect(() => {
    if (timeRemaining === 0 && isActive) {
      onTimeUp()
    }
  }, [timeRemaining, isActive, onTimeUp])

  return (
    <div className="relative">
      {/* Main Timer Display */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{
          scale: isCritical ? [1, 1.1, 1] : 1,
          opacity: 1,
        }}
        transition={{
          scale: { duration: 0.5, repeat: isCritical ? Number.POSITIVE_INFINITY : 0 },
          opacity: { duration: 0.3 },
        }}
        className={`relative w-24 h-24 mx-auto mb-4 ${isCritical ? "animate-pulse" : ""}`}
      >
        {/* Background Circle */}
        <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" stroke="rgba(255,255,255,0.2)" strokeWidth="8" fill="transparent" />
          {/* Progress Circle */}
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
            initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
            animate={{ strokeDashoffset: 2 * Math.PI * 45 * (1 - percentage / 100) }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </svg>

        {/* Timer Text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            key={timeRemaining}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            className={`text-2xl font-bold ${
              isCritical ? "text-red-500" : isWarning ? "text-yellow-500" : "text-white"
            }`}
          >
            {timeRemaining}
          </motion.span>
        </div>
      </motion.div>

      {/* Warning Messages */}
      {showWarning && isWarning && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <p className={`text-sm font-semibold ${isCritical ? "text-red-400" : "text-yellow-400"}`}>
            {isCritical ? "⚠️ Time's almost up!" : "⏰ Hurry up!"}
          </p>
        </motion.div>
      )}
    </div>
  )
}
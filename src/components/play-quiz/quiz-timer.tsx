"use client"
import { useState, useEffect } from "react"

interface QuizTimerProps {
  initialTime: number
  onTimeUp: () => void
  isActive?: boolean
}

export function QuizTimer({ initialTime, onTimeUp, isActive = true }: QuizTimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialTime)

  // Reset timer whenever initialTime changes
  useEffect(() => {
    setTimeLeft(initialTime)
  }, [initialTime])

  // Main timer logic
  useEffect(() => {
    if (!isActive) return

    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0) {
      // Wait 1 second before triggering onTimeUp
      const delay = setTimeout(() => onTimeUp(), 1000)
      return () => clearTimeout(delay)
    }
  }, [timeLeft, onTimeUp, isActive])

  const progressPercentage = ((initialTime - timeLeft) / initialTime) * 100
  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-20 py-6 sm:py-8 lg:py-12">
      <div className="flex items-center justify-between mb-3 mx-6 sm:mx-10">
        <span
          className={`text-3xl font-bold ${
            timeLeft <= 10 ? "text-red-500 animate-pulse" : "text-purple-600"
          }`}
        >
          {timeLeft}
        </span>
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Progress } from "@/components/ui/progress"
import { Clock } from "lucide-react"

interface QuizTimerProps {
  initialTime: number
  onTimeUp: () => void
  isActive?: boolean
}

export function QuizTimer({ initialTime, onTimeUp, isActive = true }: QuizTimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialTime)

  useEffect(() => {
    setTimeLeft(initialTime)
  }, [initialTime])

  useEffect(() => {
    if (!isActive) return

    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0) {
      onTimeUp()
    }
  }, [timeLeft, onTimeUp, isActive])

  const progressPercentage = ((initialTime - timeLeft) / initialTime) * 100

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-purple-600" />
          <span className="font-bold text-gray-700 text-lg">Time Remaining</span>
        </div>
        <span className={`text-3xl font-bold ${timeLeft <= 10 ? "text-red-500 animate-pulse" : "text-purple-600"}`}>
          {timeLeft}s
        </span>
      </div>
      <Progress value={progressPercentage} className={`h-3 ${timeLeft <= 10 ? "animate-pulse" : ""}`} />
    </div>
  )
}

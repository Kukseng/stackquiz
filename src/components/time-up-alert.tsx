"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle, Clock } from "lucide-react"

interface TimeUpAlertProps {
  show: boolean
  onClose: () => void
}

export function TimeUpAlert({ show, onClose }: TimeUpAlertProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (show) {
      setIsVisible(true)
      // Auto-close after 2 seconds
      const timer = setTimeout(() => {
        setIsVisible(false)
        onClose()
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [show, onClose])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-300">
      <Card className="w-full max-w-md mx-4 animate-in zoom-in duration-300 border-red-500 bg-red-50">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-red-600 mb-2">Time is Up!</h2>
          <div className="flex items-center justify-center gap-2 text-red-500">
            <Clock className="w-5 h-5" />
            <span className="text-lg">Moving to next question...</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

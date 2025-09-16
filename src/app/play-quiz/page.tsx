"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function Page() {
  const [participantId, setParticipantId] = useState("")
  const [sessionId, setSessionId] = useState("")
  const router = useRouter()

  const handleJoinQuiz = () => {
    if (participantId.trim() && sessionId.trim()) {
      localStorage.setItem("participantId", participantId)
      localStorage.setItem("sessionId", sessionId)
      router.push("/play-quiz/waiting")
    }
  }

  return (
    <div className="min-h-screen quiz-background flex items-center justify-center p-4 relative">
      <div className="kahoot-shape kahoot-triangle" style={{ top: "10%", left: "15%", animationDelay: "0s" }}></div>
      <div className="kahoot-shape kahoot-circle" style={{ top: "20%", right: "20%", animationDelay: "2s" }}></div>
      <div className="kahoot-shape kahoot-square" style={{ bottom: "25%", left: "10%", animationDelay: "4s" }}></div>
      <div className="kahoot-shape kahoot-diamond" style={{ bottom: "15%", right: "15%", animationDelay: "6s" }}></div>

      <Card className="w-full max-w-md quiz-card relative z-10">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
            Stack Quiz!
          </CardTitle>
          <CardDescription className="text-gray-700 text-lg font-semibold">
            Join a quiz and play with friends!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="participantId" className="text-gray-800 font-bold text-lg">
                Your Name
              </Label>
              <Input
                id="participantId"
                placeholder="Enter your name"
                value={participantId}
                onChange={(e) => setParticipantId(e.target.value)}
                className="border-4 border-purple-200 focus:border-purple-400 focus:ring-purple-400 h-14 text-lg font-semibold rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sessionId" className="text-gray-800 font-bold text-lg">
                Game PIN
              </Label>
              <Input
                id="sessionId"
                placeholder="Enter game PIN"
                value={sessionId}
                onChange={(e) => setSessionId(e.target.value)}
                className="border-4 border-purple-200 focus:border-purple-400 focus:ring-purple-400 h-14 text-lg font-semibold rounded-xl"
              />
            </div>
          </div>
          <Button
            onClick={handleJoinQuiz}
            className="w-full kahoot-primary-button h-16 text-xl"
            disabled={!participantId.trim() || !sessionId.trim()}
          >
            Enter Game
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

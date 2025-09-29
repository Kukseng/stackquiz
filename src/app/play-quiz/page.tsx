"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function Page() {
  const [participantId, setParticipantId] = useState("")
  const router = useRouter()

  const handleJoin = () => {
    if (participantId.trim()) {
      localStorage.setItem("participantId", participantId)
      router.push("/play-quiz/waiting")
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center relative">
      {/* Close (X) button in corner */}
      <button
        className="absolute top-6 left-6 w-8 h-8 rounded-full flex items-center justify-center text-xl font-bold z-20"
        aria-label="Close"
      >×</button>
      {/* Game PIN Box */}
      <div className="absolute top-6 right-8 bg-white rounded-lg px-5 py-2 font-bold text-lg shadow-lg z-20">
        989 249
      </div>
      <Card className="w-full max-w-sm p-8 items-center flex flex-col justify-center rounded-2xl z-10" style={{ boxShadow: "0 6px 32px rgba(80,63,169,0.15)" }}>
        <CardContent className="w-full">
          <div className="text-center mb-7">
            <p className="text-lg mb-4 text-gray-900">Your nickname is ...</p>
            <Input
              placeholder="Enter your name"
              value={participantId}
              onChange={(e) => setParticipantId(e.target.value)}
              className="h-12 w-full text-lg font-medium text-center border border-gray-300 rounded-lg mb-6 focus:ring-2 focus:ring-purple-400"
            />
            {/* Circular pink marker under input */}
            <div className="flex justify-center mb-4">
              <span className="inline-block w-7 h-7 border-4 border-pink-400 rounded-full"></span>
            </div>
            <Button
              onClick={handleJoin}
              className="w-full h-12 text-lg font-extrabold bg-gradient-to-b from-yellow-400 to-orange-400"
              disabled={!participantId.trim()}
            >
              Start
            </Button>
          </div>
        </CardContent>
      </Card>
      {/* Decorative border at the bottom */}
      <div className="absolute bottom-0 left-0 w-full h-6 bg-[url('/waves.svg')] bg-repeat-x"></div>
    </div>
  )
}

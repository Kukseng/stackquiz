"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { QrCode, Link, Hash } from "lucide-react"

interface JoinQuizProps {
  sessionCode?: string
}

export function JoinQuiz({ sessionCode: initialSessionCode }: JoinQuizProps) {
  const [sessionCode, setSessionCode] = useState(initialSessionCode || "")
  const [nickname, setNickname] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleJoin = async () => {
    if (!sessionCode.trim() || !nickname.trim()) {
      setError("Please enter both session code and nickname")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // Check if session exists and nickname is available
      const checkResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/participants/session/${sessionCode}/nickname-available?nickname=${encodeURIComponent(nickname)}`,
      )

      if (!checkResponse.ok) {
        throw new Error("Session not found or nickname unavailable")
      }

      // Join the session
      const joinResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/participants/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionCode: sessionCode.toUpperCase(),
          nickname: nickname.trim(),
        }),
      })

      if (!joinResponse.ok) {
        throw new Error("Failed to join session")
      }

      const participant = await joinResponse.json()

      // Redirect to participant interface
      router.push(
        `/quiz/participate/${sessionCode}?participantId=${participant.id}&nickname=${encodeURIComponent(nickname)}`,
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to join quiz")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-md">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Join Quiz</CardTitle>
          <p className="text-muted-foreground">Enter the session code to participate</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sessionCode">Session Code</Label>
            <div className="relative">
              <Hash className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="sessionCode"
                placeholder="Enter session code"
                value={sessionCode}
                onChange={(e) => setSessionCode(e.target.value.toUpperCase())}
                className="pl-10"
                maxLength={6}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nickname">Your Nickname</Label>
            <Input
              id="nickname"
              placeholder="Enter your nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              maxLength={20}
            />
          </div>

          {error && <div className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">{error}</div>}

          <Button
            onClick={handleJoin}
            className="w-full"
            disabled={isLoading || !sessionCode.trim() || !nickname.trim()}
          >
            {isLoading ? "Joining..." : "Join Quiz"}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            <p>You can also join by:</p>
            <div className="flex items-center justify-center gap-4 mt-2">
              <div className="flex items-center gap-1">
                <Link className="h-4 w-4" />
                <span>Link</span>
              </div>
              <div className="flex items-center gap-1">
                <QrCode className="h-4 w-4" />
                <span>QR Code</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

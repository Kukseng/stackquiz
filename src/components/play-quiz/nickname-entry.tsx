"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Users, Play } from "lucide-react"
import { useWebSocket } from "@/context/websocket-context"

interface NicknameEntryProps {
  onNicknameSet: (nickname: string) => void
}

export function NicknameEntry({ onNicknameSet }: NicknameEntryProps) {
  const [nickname, setNickname] = useState("")
  const [roomId] = useState("quiz-room-1") // In a real app, this could be dynamic
  const { joinRoom, participants, isConnected } = useWebSocket()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (nickname.trim()) {
      joinRoom(roomId, nickname.trim())
      onNicknameSet(nickname.trim())
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/30 shadow-lg border border-gray-200">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary">Join Quiz Room</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                id="nickname"
                type="text"
                placeholder="Enter your nickname..."
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                maxLength={20}
                required
              />
            </div>
            <Button type="submit" className="w-full btn-secondary text[--font-dm-sans] text-[--card-foreground]" disabled={!nickname.trim()}>
              Join Quiz
            </Button>
          </form>

          {isConnected && participants.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>{participants.length} participants online</span>
              </div>
              <div className="space-y-2">
                {participants.slice(0, 5).map((participant) => (
                  <div key={participant.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                    <span className="font-medium">{participant.nickname}</span>
                    {/* <span className="text-sm text-muted-foreground">{participant.score} pts</span> */}
                  </div>
                ))}
                {participants.length > 5 && (
                  <p className="text-sm text-muted-foreground text-center">+{participants.length - 5} more players</p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

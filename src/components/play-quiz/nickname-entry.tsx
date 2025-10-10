"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Users } from "lucide-react"
import { useWebSocket } from "@/context/websocket-context"
import { useParams } from "next/navigation"
import { Play } from "lucide-react"

interface NicknameEntryProps {
  onNicknameSet: (nickname: string) => void
}

export function NicknameEntry({ onNicknameSet }: NicknameEntryProps) {
  const {id} = useParams() as {id: string}
  const [nickname, setNickname] = useState("")
  // const [roomId] = useState("quiz-room")
  const { joinRoom } = useWebSocket()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (nickname.trim()) {
      joinRoom(id)
      onNicknameSet(nickname.trim())
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 ">
      <Card className="w-full max-w-md bg-gradient-to-br from-white/10 to-white/30 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 pointer-events-none"></div>
        
        <CardHeader className="text-center relative z-10 pb-4">
          <div className="mx-auto w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 shadow-lg">
            <Play className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold text-white drop-shadow-md">Join Quiz Play</CardTitle>
          <p className="text-white/80 mt-2">Test your knowledge</p>
        </CardHeader>
        
        <CardContent className="space-y-6 relative z-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <label htmlFor="nickname" className="text-white font-medium text-sm ml-1">Your Nickname</label>
              <Input
                id="nickname"
                type="text"
                placeholder="Enter your nickname..."
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                maxLength={20}
                required
                className="bg-white/90 border-white/30 focus:bg-white transition-all duration-300 rounded-xl py-6 px-4 text-lg placeholder:text-gray-500 focus:ring-2 focus:border-transparent"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full btn-secondary text-pramary font-bold py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:transform-none disabled:hover:shadow-lg text-lg border-0" 
              disabled={!nickname.trim()} 
              onClick={handleSubmit}
            >
              <Play className="w-5 h-5 mr-0" />
              Start Quiz
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

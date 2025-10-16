"use client"
import Rank from "@/components/Poduim/rank"

interface LeaderboardEntry {
  participantId: string
  nickname: string
  totalScore: number
  position: number
  rank: number
  isCurrentUser?: boolean
  avatarId?: string
  questionsAnswered?: number
  correctAnswers?: number
  streak?: number
  positionChange?: number
  isOnline?: boolean
  lastActivity?: string
  status?: string
}

export default function LeaderboardPage() {
  // Example leaderboard data, replace with real data as needed
  const leaderboard: LeaderboardEntry[] = [
    {
      participantId: "1",
      nickname: "Alice",
      totalScore: 100,
      position: 1,
      rank: 1,
    },
    {
      participantId: "2",
      nickname: "Bob",
      totalScore: 90,
      position: 2,
      rank: 2,
    },
  ];

  return (
    <div>
      <Rank leaderboard={leaderboard} />
    </div>
  )
}
"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Users, Clock, Target, TrendingUp, Award, Activity } from "lucide-react"
import { apiClient } from "@/lib/api"

interface SessionStatsProps {
  sessionId: string
  sessionCode: string
  participants: any[]
  currentQuestion: number
  totalQuestions: number
}

interface SessionStats {
  totalQuestions: number
  averageScore: number
  completionRate: number
  duration: string
  totalParticipants: number
  highestScore: number
  lowestScore: number
}

export function SessionStats({
  sessionId,
  sessionCode,
  participants,
  currentQuestion,
  totalQuestions,
}: SessionStatsProps) {
  const [stats, setStats] = useState<SessionStats | null>(null)
  const [questionStats, setQuestionStats] = useState<any[]>([])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const sessionStats = await apiClient.getLeaderboardStats(sessionId)
        setStats(sessionStats)
      } catch (error) {
        console.error("Failed to fetch session stats:", error)
      }
    }

    if (sessionId) {
      fetchStats()
      // Refresh stats every 10 seconds during active session
      const interval = setInterval(fetchStats, 10000)
      return () => clearInterval(interval)
    }
  }, [sessionId])

  // Calculate real-time stats from participants
  const activeParticipants = participants.filter((p) => p.isConnected).length
  const totalScore = participants.reduce((sum, p) => sum + p.totalScore, 0)
  const averageScore = participants.length > 0 ? totalScore / participants.length : 0
  const progressPercentage = totalQuestions > 0 ? (currentQuestion / totalQuestions) * 100 : 0

  // Generate question performance data for chart
  useEffect(() => {
    const generateQuestionStats = () => {
      const questionData = []
      for (let i = 1; i <= Math.min(currentQuestion, 10); i++) {
        questionData.push({
          question: `Q${i}`,
          correct: Math.floor(Math.random() * participants.length * 0.8), // Mock data
          incorrect: Math.floor(Math.random() * participants.length * 0.2),
        })
      }
      setQuestionStats(questionData)
    }

    if (currentQuestion > 0) {
      generateQuestionStats()
    }
  }, [currentQuestion, participants.length])

  return (
    <div className="space-y-6">
      {/* Real-time Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{activeParticipants}</p>
                <p className="text-xs text-muted-foreground">Active Now</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{averageScore.toFixed(1)}</p>
                <p className="text-xs text-muted-foreground">Avg Score</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{currentQuestion}</p>
                <p className="text-xs text-muted-foreground">of {totalQuestions}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{progressPercentage.toFixed(0)}%</p>
                <p className="text-xs text-muted-foreground">Complete</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Quiz Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>
                Question {currentQuestion} of {totalQuestions}
              </span>
              <span>{progressPercentage.toFixed(1)}%</span>
            </div>
            <Progress value={progressPercentage} className="w-full" />
          </div>
        </CardContent>
      </Card>

      {/* Question Performance Chart */}
      {questionStats.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Question Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={questionStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="question" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="correct" stackId="a" fill="#22c55e" name="Correct" />
                  <Bar dataKey="incorrect" stackId="a" fill="#ef4444" name="Incorrect" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detailed Stats */}
      {stats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Session Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{stats.highestScore}</p>
                <p className="text-sm text-muted-foreground">Highest Score</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">{stats.lowestScore}</p>
                <p className="text-sm text-muted-foreground">Lowest Score</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{stats.completionRate.toFixed(1)}%</p>
                <p className="text-sm text-muted-foreground">Completion Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Participant Status */}
      <Card>
        <CardHeader>
          <CardTitle>Participant Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {participants.slice(0, 5).map((participant) => (
              <div key={participant.id} className="flex items-center justify-between p-2 rounded border">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs">
                    {participant.nickname.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium">{participant.nickname}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono">{participant.totalScore}</span>
                  <Badge variant={participant.isConnected ? "default" : "secondary"}>
                    {participant.isConnected ? "Online" : "Offline"}
                  </Badge>
                </div>
              </div>
            ))}
            {participants.length > 5 && (
              <p className="text-sm text-muted-foreground text-center">+{participants.length - 5} more participants</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

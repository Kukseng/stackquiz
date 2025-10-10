"use client"
import { useQuizSession } from "@/hooks/use-quiz-sesstion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Users, Play, SkipForward, Square, Trash2, Trophy, Clock } from "lucide-react"

interface OrganizerDashboardProps {
  sessionCode: string
  hostId: string
}

export function OrganizerDashboard({ sessionCode, hostId }: OrganizerDashboardProps) {
  const {
    session,
    participants,
    currentQuestion,
    leaderboard,
    timeRemaining,
    isConnected,
    connectionStatus,
    startSession,
    nextQuestion,
    endSession,
    removeParticipant,
  } = useQuizSession(sessionCode, undefined, true)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "WAITING":
        return "bg-yellow-500"
      case "ACTIVE":
        return "bg-green-500"
      case "PAUSED":
        return "bg-orange-500"
      case "ENDED":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading session...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{session.sessionName}</h1>
          <p className="text-muted-foreground">
            Session Code: <span className="font-mono font-semibold">{sessionCode}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={isConnected ? "default" : "destructive"}>{connectionStatus}</Badge>
          <Badge className={getStatusColor(session.status)}>{session.status}</Badge>
        </div>
      </div>

      {/* Session Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Session Controls
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            {session.status === "WAITING" && (
              <Button onClick={startSession} className="flex items-center gap-2">
                <Play className="h-4 w-4" />
                Start Quiz
              </Button>
            )}

            {session.status === "ACTIVE" && (
              <>
                <Button onClick={nextQuestion} className="flex items-center gap-2">
                  <SkipForward className="h-4 w-4" />
                  Next Question
                </Button>
                <Button variant="destructive" onClick={endSession} className="flex items-center gap-2">
                  <Square className="h-4 w-4" />
                  End Session
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Current Question */}
      {currentQuestion && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>
                Question {session.currentQuestion + 1} of {session.totalQuestions}
              </span>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span className="font-mono">{formatTime(timeRemaining)}</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-lg">{currentQuestion.text}</p>
              {currentQuestion.imageUrl && (
                <img
                  src={currentQuestion.imageUrl || "/placeholder.svg"}
                  alt="Question"
                  className="max-w-md rounded-lg"
                />
              )}
              <Progress
                value={((currentQuestion.timeLimit - timeRemaining) / currentQuestion.timeLimit) * 100}
                className="w-full"
              />
              <div className="grid grid-cols-2 gap-2">
                {currentQuestion.options.map((option, index) => (
                  <div
                    key={option.id}
                    className={`p-3 rounded-lg border ${
                      option.isCorrected
                        ? "bg-green-100 border-green-300 dark:bg-green-900 dark:border-green-700"
                        : "bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700"
                    }`}
                  >
                    <span className="font-semibold">{String.fromCharCode(65 + index)}.</span> {option.optionText}
                    {option.isCorrected && (
                      <Badge className="ml-2" variant="secondary">
                        Correct
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Participants */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Participants ({participants.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {participants.map((participant) => (
                <div key={participant.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      {participant.avatar?.name || participant.nickname.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium">{participant.nickname}</p>
                      <p className="text-sm text-muted-foreground">Score: {participant.totalScore}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={participant.isConnected ? "default" : "secondary"}>
                      {participant.isConnected ? "Online" : "Offline"}
                    </Badge>
                    <Button variant="ghost" size="sm" onClick={() => removeParticipant(participant.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Live Leaderboard */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Live Leaderboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {leaderboard.slice(0, 10).map((entry, index) => (
                <div key={entry.participantId} className="flex items-center gap-3 p-3 rounded-lg border">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      index === 0
                        ? "bg-yellow-500 text-white"
                        : index === 1
                          ? "bg-gray-400 text-white"
                          : index === 2
                            ? "bg-orange-600 text-white"
                            : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{entry.nickname}</p>
                    <p className="text-sm text-muted-foreground">{entry.totalScore} points</p>
                  </div>
                  {index < 3 && (
                    <Trophy
                      className={`h-5 w-5 ${
                        index === 0 ? "text-yellow-500" : index === 1 ? "text-gray-400" : "text-orange-600"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

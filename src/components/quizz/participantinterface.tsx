"use client"

import { useState } from "react"
import { useQuizSession } from "@/hooks/use-quiz-sesstion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Clock, CheckCircle, XCircle, Trophy, Star } from "lucide-react"

interface ParticipantInterfaceProps {
  sessionCode: string
  participantId: string
  nickname: string
}

export function ParticipantInterface({ sessionCode, participantId, nickname }: ParticipantInterfaceProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [hasAnswered, setHasAnswered] = useState(false)
  const [feedback, setFeedback] = useState({ rating: 0, comment: "" })
  const [showFeedback, setShowFeedback] = useState(false)

  const {
    session,
    currentQuestion,
    leaderboard,
    timeRemaining,
    showResults,
    lastAnswerResult,
    isConnected,
    connectionStatus,
    submitAnswer,
    sendFeedback,
  } = useQuizSession(sessionCode, participantId, false)

  const handleAnswerSubmit = (optionId: string) => {
    if (!hasAnswered && currentQuestion) {
      setSelectedOption(optionId)
      setHasAnswered(true)
      submitAnswer(optionId)
    }
  }

  const handleFeedbackSubmit = () => {
    if (feedback.rating > 0) {
      sendFeedback(feedback.rating, feedback.comment)
      setShowFeedback(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const myRank = leaderboard.find((entry) => entry.participantId === participantId)?.rank || 0
  const myScore = leaderboard.find((entry) => entry.participantId === participantId)?.totalScore || 0

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Connecting to quiz...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold">{session.sessionName}</h1>
        <p className="text-muted-foreground">Welcome, {nickname}!</p>
        <div className="flex items-center justify-center gap-2 mt-2">
          <Badge variant={isConnected ? "default" : "destructive"}>{connectionStatus}</Badge>
          <Badge>{session.status}</Badge>
        </div>
      </div>

      {/* Waiting Screen */}
      {session.status === "WAITING" && (
        <Card>
          <CardContent className="text-center py-12">
            <div className="animate-pulse">
              <div className="w-16 h-16 bg-primary/20 rounded-full mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold mb-2">Waiting for quiz to start...</h2>
              <p className="text-muted-foreground">The organizer will start the quiz soon.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current Question */}
      {currentQuestion && session.status === "ACTIVE" && (
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
                  className="max-w-full rounded-lg mx-auto"
                />
              )}
              <Progress
                value={((currentQuestion.timeLimit - timeRemaining) / currentQuestion.timeLimit) * 100}
                className="w-full"
              />

              {!hasAnswered ? (
                <div className="grid gap-3">
                  {currentQuestion.options.map((option, index) => (
                    <Button
                      key={option.id}
                      variant="outline"
                      className="p-4 h-auto text-left justify-start bg-transparent"
                      onClick={() => handleAnswerSubmit(option.id)}
                      disabled={timeRemaining === 0}
                    >
                      <span className="font-semibold mr-3">{String.fromCharCode(65 + index)}.</span>
                      {option.optionText}
                    </Button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold">Answer Submitted!</h3>
                  <p className="text-muted-foreground">Waiting for other participants...</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Answer Results */}
      {showResults && lastAnswerResult && (
        <Card>
          <CardContent className="text-center py-8">
            {lastAnswerResult.isCorrect ? (
              <>
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-green-600 mb-2">Correct!</h2>
                <p className="text-lg">+{lastAnswerResult.pointsEarned} points</p>
              </>
            ) : (
              <>
                <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-red-600 mb-2">Incorrect</h2>
                <p className="text-lg">Correct answer: {lastAnswerResult.correctAnswer}</p>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Personal Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Your Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold">{myScore}</p>
              <p className="text-sm text-muted-foreground">Total Score</p>
            </div>
            <div>
              <p className="text-2xl font-bold">#{myRank || "-"}</p>
              <p className="text-sm text-muted-foreground">Current Rank</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Final Leaderboard */}
      {session.status === "ENDED" && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Final Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {leaderboard.slice(0, 10).map((entry, index) => (
                  <div
                    key={entry.participantId}
                    className={`flex items-center gap-3 p-3 rounded-lg border ${
                      entry.participantId === participantId ? "bg-primary/10 border-primary" : ""
                    }`}
                  >
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

          {/* Feedback Form */}
          {!showFeedback ? (
            <Card>
              <CardContent className="text-center py-6">
                <Button onClick={() => setShowFeedback(true)}>Give Feedback</Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Rate this Quiz</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="mb-2">How would you rate this quiz?</p>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Button
                        key={star}
                        variant="ghost"
                        size="sm"
                        onClick={() => setFeedback((prev) => ({ ...prev, rating: star }))}
                      >
                        <Star
                          className={`h-6 w-6 ${
                            star <= feedback.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                          }`}
                        />
                      </Button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-2">Any comments? (Optional)</p>
                  <Textarea
                    placeholder="Share your thoughts about this quiz..."
                    value={feedback.comment}
                    onChange={(e) => setFeedback((prev) => ({ ...prev, comment: e.target.value }))}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleFeedbackSubmit} disabled={feedback.rating === 0}>
                    Submit Feedback
                  </Button>
                  <Button variant="outline" onClick={() => setShowFeedback(false)}>
                    Skip
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}

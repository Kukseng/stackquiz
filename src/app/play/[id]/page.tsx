"use client"

import { useState } from "react"
import { QuizSelection } from "@/components/play-quiz/quiz_section"
import { GameEngine } from "@/components/play-quiz/game-engine"
import { ResultsSystem } from "../../../components/play-quiz/result_system"
import { NicknameEntry } from "@/components/play-quiz/nickname_entry"
import { WebSocketProvider } from "../../../context/websocket-context"
import { useParams } from "next/navigation"

export type Quiz = {
  id: string
  title: string
  description: string
  thumbnailUrl: string
  visibility: string
  difficulty: string
  createdAt: string
  updatedAt: string
  questions: Question[]
}

export type Question = {
  id: string
  text: string
  type: "MCQ" | "TF" | "FILL_THE_BLANK" 
  questionOrder: number
  timeLimit: number
  points: number
  imageUrl: string
  createdAt: string
  updatedAt: string
  options: Option[]
}

export type Option = {
  id: string
  optionText: string
  optionOrder: number
  isCorrected: boolean
  createdAt: string
  participantAnswers: unknown[]
}

export type GameResults = {
  score: number
  totalQuestions: number
  timeSpent: number
  answers: Array<{
    questionId: string
    userAnswer: string | number
    correct: boolean
    timeSpent: number
  }>
}

export type GameState = "selection" | "playing" | "results" | "nickname"

export default function QuizApp() {
  const { id } = useParams() as { id: string } // Quiz room ID from URL
  const [gameState, setGameState] = useState<GameState>("nickname")
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null)
  const [gameResults, setGameResults] = useState<GameResults | null>(null)
  const [playerNickname, setPlayerNickname] = useState<string>("")

 const handleNicknameSet = async (nickname: string) => {
  setPlayerNickname(nickname)

  try {
    console.log("Fetching quiz for id:", id)

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/quizzes/${id}`
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch quiz: ${response.status}`)
    }

    const quizData: Quiz = await response.json()
    setSelectedQuiz(quizData)
    setGameState("playing")
  } catch (error) {
    console.error("Error loading quiz:", error)
    alert("Could not load the quiz. Please try again.")
  }
}


  const handleQuizSelect = (quiz: Quiz) => {
    setSelectedQuiz(quiz)
    setGameState("playing")
  }

  const handleGameComplete = (results: GameResults) => {
    setGameResults(results)
    setGameState("results")
  }

  const handlePlayAgain = () => {
    setGameState("selection")
    setSelectedQuiz(null)
    setGameResults(null)
  }

  return (
    // Pass the quiz room ID to the WebSocketProvider
    <WebSocketProvider roomId={id}>
      <div className="min-h-screen">
        {gameState === "nickname" && <NicknameEntry onNicknameSet={handleNicknameSet} />}

        {gameState === "selection" && <QuizSelection onQuizSelect={handleQuizSelect} />}

        {gameState === "playing" && selectedQuiz && (
          <GameEngine
            quiz={selectedQuiz}
            onGameComplete={handleGameComplete}
            playerNickname={playerNickname}
          />
        )}

        {gameState === "results" && gameResults && selectedQuiz && (
          <ResultsSystem
            results={gameResults}
            quiz={selectedQuiz}
            onPlayAgain={handlePlayAgain}
            playerNickname={playerNickname}
          />
        )}
      </div>
    </WebSocketProvider>
  )
}


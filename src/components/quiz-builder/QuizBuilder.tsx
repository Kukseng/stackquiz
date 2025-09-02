"use client"

import { useState } from "react"
import SidebarRight from "./SidebarRight"
import QuestionForm from "./QuestionForm"
import SidebarLeft from "./SidebarLeft"

import { Button } from "@/components/ui/button"
import Link from "next/link"

export interface Question {
  id: string
  type: "multiple-choice" | "true-false" | "fill-blank"
  question: string
  answers?: string[]
  correctAnswers?: number[]
  timeLimit: number
}

export default function QuizBuilder() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [showQuestionForm, setShowQuestionForm] = useState(false)
  const [selectedQuestionType, setSelectedQuestionType] = useState<string>("")
  const [currentQuestion, setCurrentQuestion] = useState<Partial<Question>>({ timeLimit: 5 })

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600 flex">
      {/* Left Sidebar */}
      <SidebarLeft 
        questions={questions} 
        setQuestions={setQuestions} 
        setShowQuestionForm={setShowQuestionForm} 
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="flex justify-between items-center p-6 bg-white/10 backdrop-blur-sm border-b border-white/20">
          <div className="flex gap-3">
            <Button variant="ghost" className="text-white hover:bg-white/20">Public</Button>
            <Button variant="ghost" className="text-white hover:bg-white/20">Exit</Button>
            <Link href="/save">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">Save</Button>
            </Link>
          </div>
        </div>

        {/* Question Form */}
        <div className="flex-1 p-8">
          {showQuestionForm ? (
            <QuestionForm
              selectedType={selectedQuestionType}
              setSelectedType={setSelectedQuestionType}
              currentQuestion={currentQuestion}
              setCurrentQuestion={setCurrentQuestion}
              setQuestions={setQuestions}
              setShowQuestionForm={setShowQuestionForm}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-white/80">
                <h2 className="text-2xl font-semibold mb-4">Create Your Quiz</h2>
                <p className="text-lg">Click "Add question" to get started</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Sidebar */}
      <SidebarRight 
        questions={questions} 
        currentQuestion={currentQuestion} 
        setCurrentQuestion={setCurrentQuestion} 
      />
    </div>
  )
}

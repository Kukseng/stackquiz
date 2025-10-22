"use client"
import Image from "next/image"
import { useState } from "react"

interface Option {
  id: number | string
  text: string
  correct: boolean
  color?: string
}

interface Question {
  id: number | string
  type: string
  question: string
  options: Option[]
  imageUrl?: string
  timeLimit?: number
}

interface QuizSidebarProps {
  questions: Question[]
  activeQuestionId: number | string | null
  onQuestionSelect: (id: number | string) => void
  onAddQuestion: () => void
}

export function QuizSidebar({
  questions,
  activeQuestionId,
  onQuestionSelect,
  onAddQuestion,
}: QuizSidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({})

  const getQuestionTypeIcon = (type: string) => {
    switch (type) {
      case "mcq":
        return "🎯"
      case "tf":
        return "✓✗"
      case "fill_the_blank":
        return "✏️"
      default:
        return "❓"
    }
  }

  const truncateText = (text: string, maxLength: number = 50) => {
    if (!text || text.length <= maxLength) return text || "Untitled Question"
    return text.substring(0, maxLength) + "..."
  }

  const handleImageError = (questionId: string | number) => {
    setImageErrors(prev => ({ ...prev, [questionId]: true }))
  }

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-40 p-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-800">Quiz ({questions.length})</h2>
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-30 top-16"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:relative md:w-72 w-72 h-screen bg-white overflow-y-auto border-r border-gray-200 z-40 transition-transform duration-300 md:translate-x-0 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        } md:top-0 top-16 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100`}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
          <h2 className="text-lg font-bold text-gray-800">Quiz</h2>
          <p className="text-sm text-gray-600">
            {questions.length} question{questions.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Questions List */}
        <div className="p-3 space-y-3">
          {questions.map((question, index) => (
            <div
              key={question.id}
              onClick={() => {
                onQuestionSelect(question.id)
                setIsMobileOpen(false)
              }}
              className={`group relative rounded-lg md:rounded-xl cursor-pointer transition-all duration-200 overflow-hidden ${
                activeQuestionId === question.id
                  ? "ring-2 ring-blue-500 shadow-lg"
                  : "hover:shadow-md hover:ring-1 hover:ring-gray-300"
              }`}
            >
              {/* Question Number */}
              <div className="absolute top-2 left-2 z-10 bg-white px-2 py-1 rounded-full shadow-sm">
                <span className="text-xs font-bold text-gray-700">{index + 1}</span>
              </div>

              {/* Type Icon */}
              <div className="absolute top-2 right-2 z-10 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full shadow-sm">
                <span className="text-xs font-medium text-gray-600">
                  {getQuestionTypeIcon(question.type)}
                </span>
              </div>

              {/* Question Preview Image */}
              <div className="h-24 md:h-32 relative bg-gradient-to-br from-purple-100 to-blue-100">
                {question.imageUrl && !imageErrors[question.id] ? (
                  <>
                    {/* Using regular img tag for blob URLs */}
                    <Image
                      src={question.imageUrl}
                      alt="Question preview"
                      width={200}
                      height={100}
                      className="w-full h-full object-cover absolute inset-0"
                      onError={() => handleImageError(question.id)}
                      unoptimized
                    />
                  </>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-3xl opacity-20">
                      {getQuestionTypeIcon(question.type)}
                    </div>
                  </div>
                )}

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                {/* Question Text */}
                <div className="absolute bottom-0 left-0 right-0 p-2 md:p-3">
                  <p className="text-white text-xs md:text-sm font-medium line-clamp-2 drop-shadow-md">
                    {truncateText(question.question)}
                  </p>
                </div>
              </div>

              {/* Answer Options Preview */}
              <div className="bg-white p-2 md:p-3 border-t border-gray-100">
                <div className="grid grid-cols-2 gap-1.5 md:gap-2">
                  {question.options?.slice(0, 4).map((option, optIndex) => (
                    <div
                      key={option.id}
                      className={`text-xs py-1.5 md:py-2 px-2 rounded font-medium text-center truncate ${
                        option.correct
                          ? "bg-green-600 text-white"
                          : option.color
                          ? "text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}
                      style={
                        option.color && !option.correct
                          ? { backgroundColor: option.color }
                          : {}
                      }
                    >
                      {option.text || `Opt ${optIndex + 1}`}
                    </div>
                  ))}
                </div>

                {/* Question Info */}
                <div className="flex items-center justify-between text-xs text-gray-500 mt-2 pt-2 border-t border-gray-100">
                  <span className="flex items-center gap-1">
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {question.timeLimit || 20}s
                  </span>
                  <span>
                    {index + 1}/{questions.length}
                  </span>
                </div>
              </div>

              {/* Blue Left Border for Active Question */}
              {activeQuestionId === question.id && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
              )}
            </div>
          ))}

          {/* Add Question Button */}
          <button
            onClick={() => {
              onAddQuestion()
              setIsMobileOpen(false)
            }}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 md:py-4 px-4 rounded-lg md:rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm md:text-base"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Question
          </button>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="text-xs text-gray-500 text-center">
            Click any question to edit
          </div>
        </div>
      </div>
    </>
  )
}
"use client"
import Image from "next/image"
interface Option {
  id: number
  text: string
  correct: boolean
  color?: string
}

interface Question {
  id: number
  type: string
  question: string
  options: Option[]
  imageUrl?: string
  timeLimit?: number
}

interface QuizSidebarProps {
  questions: Question[]
  activeQuestionId: number | null
  onQuestionSelect: (id: number) => void
  onAddQuestion: () => void
}

export function QuizSidebar({ questions, activeQuestionId, onQuestionSelect, onAddQuestion }: QuizSidebarProps) {
  // Get question type label
  const getQuestionTypeLabel = (type: string) => {
    switch (type) {
      case "multiple":
        return "Quiz"
      case "truefalse":
        return "True or False"
      case "fillblank":
        return "Type Answer"
      default:
        return "Quiz"
    }
  }

  // Get question type icon
  const getQuestionTypeIcon = (type: string) => {
    switch (type) {
      case "multiple":
        return "🎯"
      case "truefalse":
        return "✓✗"
      case "fillblank":
        return "✏️"
      default:
        return "❓"
    }
  }

  // Truncate question text
  const truncateText = (text: string, maxLength: number = 50) => {
    if (!text || text.length <= maxLength) return text || "Untitled Question"
    return text.substring(0, maxLength) + "..."
  }

  return (
    <div className="w-72 bg-white  overflow-y-auto border-r border-gray-200 ">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
        <h2 className="text-lg font-bold text-gray-800">Quiz</h2>
        <p className="text-sm text-gray-600">{questions.length} question{questions.length !== 1 ? 's' : ''}</p>
      </div>

      {/* Questions List */}
      <div className="p-3 space-y-3">
        {questions.map((question, index) => (
          <div
            key={question.id}
            onClick={() => onQuestionSelect(question.id)}
            className={`group relative rounded-xl cursor-pointer transition-all duration-200 overflow-hidden ${
              activeQuestionId === question.id
                ? "ring-2 ring-blue-500 shadow-lg"
                : "hover:shadow-md hover:ring-1 hover:ring-gray-300"
            }`}
          >
            {/* Question Number Badge */}
            <div className="absolute top-2 left-2 z-10 bg-white px-2.5 py-1 rounded-full shadow-sm">
              <span className="text-xs font-bold text-gray-700">{index + 1}</span>
            </div>

            {/* Question Type Badge */}
            <div className="absolute top-2 right-2 z-10 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full shadow-sm">
              <span className="text-xs font-medium text-gray-600">
                {getQuestionTypeIcon(question.type)}
              </span>
            </div>

            {/* Question Preview Image or Color Background */}
            <div className={`h-32 relative ${
              question.imageUrl 
                ? "bg-gray-100" 
                : "bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400"
            }`}>
              {question.imageUrl ? (
                <Image
                  src={question.imageUrl} 
                  alt="Question preview" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-4xl opacity-20">
                    {getQuestionTypeIcon(question.type)}
                  </div>
                </div>
              )}
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              
              {/* Question Text Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="text-white text-sm font-medium line-clamp-2 drop-shadow-md">
                  {truncateText(question.question)}
                </p>
              </div>
            </div>

            {/* Question Info Footer */}
            <div className="bg-white p-2.5 border-t border-gray-100">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {question.timeLimit || 20}s
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {question.options?.length || 0} options
                </span>
              </div>
            </div>

            {/* Active Indicator */}
            {activeQuestionId === question.id && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
            )}
          </div>
        ))}

        {/* Add Question Button */}
        <button
          onClick={onAddQuestion}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-4 px-4 rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
        >
          <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Question
        </button>
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-xs text-gray-500 text-center">
          Click any question to edit
        </div>
      </div>
    </div>
  )
}
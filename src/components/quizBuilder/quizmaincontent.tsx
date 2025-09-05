"use client"

import { useState } from "react"
import { Plus, Clock, ChevronDown, Check } from "lucide-react"

interface Option {
  id: number
  text: string
  correct: boolean
  color: string
  icon?: string
}

interface Question {
  id: number
  type: string
  question: string
  options: Option[]
}

interface QuizMainContentProps {
  questions: Question[]
  activeQuestionId: number | null
  onUpdateQuestionText: (questionId: number, text: string) => void
  onUpdateOptionText: (questionId: number, optionId: number, text: string) => void
  onToggleCorrectAnswer: (questionId: number, optionId: number) => void
  onDeleteQuestion: (id: number) => void
  onDuplicateQuestion: (question: Question) => void
  onAddQuestion: () => void
  setActiveQuestionId: (id: number | null) => void
}

export function QuizMainContent({
  questions,
  activeQuestionId,
  onUpdateQuestionText,
  onUpdateOptionText,
  onToggleCorrectAnswer,
  onDeleteQuestion,
  onDuplicateQuestion,
  onAddQuestion,
  setActiveQuestionId,
}: QuizMainContentProps) {
  const [timeLimit, setTimeLimit] = useState("5 seconds")

  // ប្រសិនគ្មាន activeQuestionId តែមាន questions → បង្ហាញ question first
  if (!activeQuestionId && questions.length > 0) {
    setActiveQuestionId(questions[0].id)
  }

  const activeQuestion = questions.find((q) => q.id === activeQuestionId)

  // ប្រសិនគ្មាន questions ទេ
  if (questions.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-pink-100 to-purple-100">
        <div className="text-center">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus size={32} className="text-indigo-600" />
          </div>
          <h3 className="text-xl font-medium text-gray-700 mb-2">No questions yet</h3>
          <p className="text-gray-500 mb-6">Click Add question to create your first quiz question</p>
          <button
            onClick={onAddQuestion}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
          >
            Add your first question
          </button>
        </div>
      </div>
    )
  }

  // បង្ហាញ question active
  return (
    <div className="flex-1 bg-gradient-to-br from-pink-100 to-purple-100 p-8 relative">
      {/* Time Limit */}
      <div className="absolute top-6 right-6 flex items-center space-x-2 bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-200">
        <Clock size={18} className="text-gray-500" />
        <span className="text-sm font-medium text-gray-700">Time limit</span>
        <select
          value={timeLimit}
          onChange={(e) => setTimeLimit(e.target.value)}
          className="bg-transparent border-none outline-none text-sm font-medium cursor-pointer"
        >
          <option>5 seconds</option>
          <option>10 seconds</option>
          <option>30 seconds</option>
        </select>
        <ChevronDown size={16} className="text-gray-400" />
      </div>

      {/* Main Question Card */}
      <div className="max-w-4xl mx-auto mt-16">
        {activeQuestion && (
          <div className="bg-gradient-to-br from-indigo-700 via-purple-700 to-blue-800 rounded-2xl p-8 text-white relative overflow-hidden shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 to-transparent"></div>
            <div className="relative z-10">
              {/* Question Input */}
              <div className="mb-8">
                <input
                  type="text"
                  value={activeQuestion.question}
                  onChange={(e) => onUpdateQuestionText(activeQuestion.id, e.target.value)}
                  placeholder="Enter your question here..."
                  className="w-full bg-transparent text-white text-xl placeholder-purple-200 border-2 border-yellow-400 rounded-lg p-4 outline-none text-center font-medium"
                />
              </div>

              {/* Answer Options */}
              <div className="space-y-4 mb-8">
                {activeQuestion.options.map((option) => (
                  <div key={option.id} className="flex items-center">
                    <div
                      className={`${option.color} rounded-xl px-6 py-4 flex-1 flex items-center justify-between shadow-lg`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-white text-lg font-bold">{option.icon || "●"}</span>
                        {activeQuestion.type === "truefalse" ? (
                          <span className="font-semibold text-lg">{option.text}</span>
                        ) : (
                          <input
                            type="text"
                            value={option.text}
                            onChange={(e) => onUpdateOptionText(activeQuestion.id, option.id, e.target.value)}
                            placeholder={`Option ${option.id}`}
                            className="bg-transparent text-white placeholder-white/70 border-none outline-none w-full font-semibold text-lg"
                          />
                        )}
                      </div>
                      <div
                        className="w-8 h-8 rounded-full bg-white flex items-center justify-center cursor-pointer hover:scale-110 transition-transform shadow-md"
                        onClick={() => onToggleCorrectAnswer(activeQuestion.id, option.id)}
                      >
                        {option.correct && <Check className="w-5 h-5 text-green-500" strokeWidth={3} />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => {
                    onDeleteQuestion(activeQuestion.id)
                    // បន្ទាប់ពី delete → set question active ថ្មី
                    const remaining = questions.filter((q) => q.id !== activeQuestion.id)
                    setActiveQuestionId(remaining.length ? remaining[0].id : null)
                  }}
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-md"
                >
                  Delete
                </button>
                <button
                  onClick={() => onDuplicateQuestion(activeQuestion)}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-md"
                >
                  Duplicate
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

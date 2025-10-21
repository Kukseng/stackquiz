
"use client"

import { FaCircle, FaSquare, FaDiamond } from "react-icons/fa6"
import { IoTriangle } from "react-icons/io5"
import { ImCheckmark2 } from "react-icons/im"
import Image from "next/image"

interface Option {
  id: string
  text: string
  correct: boolean
  color?: string
  icon?: string
}

interface Question {
  id: string
  type: string
  question: string
  options: Option[]
  image?: string
  isNew?: boolean
}

interface QuizMainContentProps {
  questions: Question[]
  activeQuestionId: string | null
  onUpdateQuestionText: (questionId: string, text: string) => void
  onUpdateQuestionImage: (questionId: string, image: string) => void
  onUpdateOptionText: (questionId: string, optionId: string, text: string) => void
  onToggleCorrectAnswer: (questionId: string, optionId: string) => void
  onDeleteQuestion: (id: string) => void
  onDuplicateQuestion: (question: Question) => void
  theme: string
}

const themeCardImages: Record<string, string> = {
  blue: "/background/10.png",
  pink: "/background/8.png",
  purple: "/background/3.png",
  green: "/background/5.png",
  gray: "/background/6.png",
}

const renderIcon = (icon?: string) => {
  switch (icon) {
    case "circle":
      return <FaCircle size={32} className="text-white mr-3 flex-shrink-0" />
    case "triangle":
      return <IoTriangle size={32} className="text-white mr-3 flex-shrink-0" />
    case "square":
      return <FaSquare size={32} className="text-white mr-3 flex-shrink-0" />
    case "diamond":
      return <FaDiamond size={32} className="text-white mr-3 flex-shrink-0" />
    default:
      return null
  }
}

export default function QuizMainContent({
  questions,
  activeQuestionId,
  onUpdateQuestionText,
  onUpdateQuestionImage,
  onUpdateOptionText,
  onToggleCorrectAnswer,
  onDeleteQuestion,
  onDuplicateQuestion,
  theme,
}: QuizMainContentProps) {
  const activeQuestion = questions?.find((q) => q.id === activeQuestionId)

  const handleQuestionImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !activeQuestion) return
    const file = e.target.files[0]
    const previewUrl = URL.createObjectURL(file)
    onUpdateQuestionImage(activeQuestion.id, previewUrl)
  }

  return (
    <div className="w-full flex-1 flex items-center justify-center bg-gray-50 p-3 min-h-screen">
      <div
        className="w-full max-w-5xl rounded-2xl p-8 flex flex-col justify-center shadow-2xl bg-cover bg-center min-h-96"
        style={{ backgroundImage: `url(${themeCardImages[theme]})` }}
      >
        {!activeQuestion ? (
          <div className="flex flex-col items-center justify-center text-center text-white py-20">
            <h2 className="text-3xl font-bold mb-3">No question selected</h2>
            <p className="text-lg text-white/90">
              Please select a question from the sidebar or add a new one.
            </p>
          </div>
        ) : (
          <>
            {/* Question Text Input */}
            <input
              type="text"
              value={activeQuestion.question}
              onChange={(e) => onUpdateQuestionText(activeQuestion.id, e.target.value)}
              placeholder="Enter your question..."
              className="w-full text-center text-2xl font-semibold p-4 mb-6 rounded-xl border-2 text-gray-900 bg-white border-yellow-400 placeholder-black/40 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />

            {/* Question Image Section */}
            <div className="mb-8 flex flex-col items-center">
              {activeQuestion.image && (
                <div className="relative w-80 h-48 mb-4 rounded-xl border-2 border-white/30 overflow-hidden shadow-lg">
                  <Image
                    src={activeQuestion.image}
                    alt="Question"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <label className="cursor-pointer bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg text-lg font-semibold transition-colors">
                📸 Upload Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleQuestionImageUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Options */}
            <div className="space-y-4 mb-8">
              {activeQuestion.options.map((option) => (
                <div
                  key={option.id}
                  className="flex items-center justify-between p-5 rounded-xl shadow-lg cursor-pointer hover:shadow-xl transition-all hover:scale-102"
                  style={{ backgroundColor: option.color || "#3B82F6" }}
                >
                  <div className="flex items-center w-full gap-3">
                    {renderIcon(option.icon)}
                    <input
                      placeholder="Option"
                      type="text"
                      value={option.text}
                      onChange={(e) =>
                        onUpdateOptionText(activeQuestion.id, option.id, e.target.value)
                      }
                      className="bg-transparent w-full text-white text-lg font-semibold placeholder-white/70 border-none outline-none"
                    />
                  </div>
                  <div
                    className={`w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center border-3 transition-all hover:scale-110 ${
                      option.correct ? "bg-green-500 border-green-600 shadow-lg" : "bg-white/30 border-white"
                    } cursor-pointer`}
                    onClick={() => onToggleCorrectAnswer(activeQuestion.id, option.id)}
                  >
                    {option.correct && <ImCheckmark2 className="text-white w-6 h-6" />}
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 mt-8">
              <button
                onClick={() => onDeleteQuestion(activeQuestion.id)}
                className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-lg font-semibold shadow-lg text-lg transition-all hover:shadow-xl active:scale-95"
              >
                Delete
              </button>
              <button
                onClick={() => onDuplicateQuestion(activeQuestion)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-3 rounded-lg font-semibold shadow-lg text-lg transition-all hover:shadow-xl active:scale-95"
              >
                Duplicate
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

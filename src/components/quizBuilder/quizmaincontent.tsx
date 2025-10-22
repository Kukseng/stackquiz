"use client"

import { useState } from "react"
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
  imageUrl?: string 
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
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  const handleQuestionImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !activeQuestion) return
    const file = e.target.files[0]
    const previewUrl = URL.createObjectURL(file)
    setPreviewImage(previewUrl)
    onUpdateQuestionImage(activeQuestion.id, previewUrl) 
  }

  const handleRemoveImage = () => {
    if (!activeQuestion) return
    setPreviewImage(null)
    onUpdateQuestionImage(activeQuestion.id, "")
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

            {/* Image Upload + Preview */}
            <div className="mb-8 flex flex-col items-center">
              {previewImage || activeQuestion.imageUrl ? (
                <div className="relative w-full max-w-2xl rounded-2xl overflow-hidden group">
                  <div className="relative w-full h-64 rounded-2xl overflow-hidden shadow-xl border-4 border-white/40">
                    <Image
                      src={previewImage || activeQuestion.imageUrl || ""}
                      alt="Question"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <button
                    onClick={handleRemoveImage}
                    className="absolute top-4 right-4 bg-black/70 hover:bg-black text-white w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-lg"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer w-full max-w-2xl">
                  <div className="border-4 border-dashed border-white/50 hover:border-white/80 rounded-2xl p-12 bg-white/10 hover:bg-white/20 transition-all flex flex-col items-center justify-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-semibold text-white mb-1">Add cover image</p>
                      <p className="text-white/70 text-sm">JPG, PNG up to 5MB</p>
                    </div>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleQuestionImageUpload}
                    className="hidden"
                  />
                </label>
              )}
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

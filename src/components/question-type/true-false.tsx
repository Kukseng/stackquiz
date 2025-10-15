"use client"

import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"

interface QuizOption {
  id: string
  optionText: string
  isCorrected: boolean
}

interface Question {
  id: string
  text: string
  options: QuizOption[]
}

interface TrueFalseQuestionProps {
  question: Question
  onAnswer: (answer: string | number) => void
  timeLeft: number
}

export function TrueFalseQuestion({ question, onAnswer, timeLeft }: TrueFalseQuestionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {question.options?.map((option, index) => (
        <Button
          key={option.id}
          onClick={() => onAnswer(option.optionText)}
          className={`${index === 0 ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"} text-white font-semibold py-8 px-6 text-xl transition-all duration-200 hover:scale-105 active:scale-95`}
          disabled={timeLeft === 0}
        >
          <div className="flex items-center gap-4">
            {option.optionText.toLowerCase().includes("true") ? (
              <Check className="w-8 h-8" />
            ) : (
              <X className="w-8 h-8" />
            )}
            <span>{option.optionText}</span>
          </div>
        </Button>
      ))}
    </div>
  )
}
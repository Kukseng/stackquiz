"use client"

import { Button } from "@/components/ui/button"
import type { Question } from "@/app/play/page"

interface MultipleChoiceQuestionProps {
  question: Question
  onAnswer: (answer: string | number) => void
  timeLeft: number
}

export function MultipleChoiceQuestion({ question, onAnswer, timeLeft }: MultipleChoiceQuestionProps) {
  const colors = ["bg-red-500", "bg-blue-500", "bg-yellow-500", "bg-green-500"]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {question.options?.map((option, index) => (
        <Button
          key={option.id}
          onClick={() => onAnswer(index)}
          className={`${colors[index % colors.length]} hover:opacity-90 text-white font-semibold py-6 px-4 text-left h-auto min-h-[80px] transition-all duration-200 hover:scale-105 active:scale-95`}
          disabled={timeLeft === 0}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold">
              {String.fromCharCode(65 + index)}
            </div>
            <span className="text-pretty">{option.optionText}</span>
          </div>
        </Button>
      ))}
    </div>
  )
}

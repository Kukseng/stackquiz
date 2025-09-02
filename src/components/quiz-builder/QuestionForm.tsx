"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import MultipleChoiceEditor from "./editors/MultipleChoiceEditor"
import TrueFalseEditor from "./editors/TrueFalseEditor"
import FillBlankEditor from "./editors/FillBlankEditor"
import { Question } from "./QuizBuilder"

export default function QuestionForm({
  selectedType,
  setSelectedType,
  currentQuestion,
  setCurrentQuestion,
  setQuestions,
  setShowQuestionForm,
}: {
  selectedType: string
  setSelectedType: (v: string) => void
  currentQuestion: Partial<Question>
  setCurrentQuestion: (q: Partial<Question>) => void
  setQuestions: (fn: (q: Question[]) => Question[]) => void
  setShowQuestionForm: (v: boolean) => void
}) {
  const saveQuestion = () => {
    if (currentQuestion.question && selectedType) {
      const newQuestion: Question = {
        id: Date.now().toString(),
        type: selectedType as Question["type"],
        question: currentQuestion.question,
        answers: currentQuestion.answers || [],
        correctAnswers: currentQuestion.correctAnswers || [],
        timeLimit: currentQuestion.timeLimit || 5,
      }
      setQuestions((prev) => [...prev, newQuestion])
      setShowQuestionForm(false)
      setSelectedType("")
      setCurrentQuestion({ timeLimit: 5 })
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="p-8 bg-white/95 backdrop-blur-sm">
        <div className="space-y-6">
          {!selectedType && (
            <div className="space-y-4">
              <Label className="text-lg font-semibold">Type of quiz</Label>
              <div className="grid gap-3">
                <Button variant="outline" className="justify-start h-12 text-left" onClick={() => setSelectedType("multiple-choice")}>
                  multiple choice
                </Button>
                <Button variant="outline" className="justify-start h-12 text-left" onClick={() => setSelectedType("true-false")}>
                  true/false
                </Button>
                <Button variant="outline" className="justify-start h-12 text-left" onClick={() => setSelectedType("fill-blank")}>
                  fill in the blank
                </Button>
              </div>
            </div>
          )}

          
        </div>
      </Card>
      
    </div>
  )
}

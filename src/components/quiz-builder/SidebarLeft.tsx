
"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Trash2, Copy } from "lucide-react"
import Link from "next/link"
import { Question } from "./QuizBuilder"

export default function SidebarLeft({
  questions,
  setQuestions,
  setShowQuestionForm,
}: {
  questions: Question[]
  setQuestions: (q: Question[]) => void
  setShowQuestionForm: (v: boolean) => void
}) {
  const addQuestion = () => {
    setShowQuestionForm(true)
  }

  const deleteQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id))
  }

  const duplicateQuestion = (question: Question) => {
    const duplicated = { ...question, id: Date.now().toString() }
    setQuestions([...questions, duplicated])
  }

  return (
    <div className="w-[280px] bg-white/10 backdrop-blur-sm border-r border-white/20 flex flex-col">
      <div className="p-6">
        <Button
          onClick={addQuestion}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-3 px-6 font-medium"
        >
          Add question
        </Button>
      </div>

      <div className="flex-1 px-6 space-y-3">
        {questions.map((question, index) => (
          <Card
            key={question.id}
            className="p-4 bg-white/20 backdrop-blur-sm border-white/30 hover:bg-white/30 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="text-sm text-white/80 mb-1">Question {index + 1}</div>
                <div className="text-white font-medium text-sm truncate">
                  {question.question || "Untitled Question"}
                </div>
              </div>
              <div className="flex gap-2 ml-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => duplicateQuestion(question)}
                  className="text-white/70 hover:text-white hover:bg-white/20 p-1"
                >
                  <Copy className="w-4 h-4" />
                </Button>
                <Link href={`/delete/${question.id}`}>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteQuestion(question.id)}
                    className="text-white/70 hover:text-white hover:bg-white/20 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
